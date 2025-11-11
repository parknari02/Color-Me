
  # Beauty Guide Platform

  This is a code bundle for Beauty Guide Platform. The original project is available at https://www.figma.com/design/oLkrgBrUuHuKNM5CsyrnnL/Beauty-Guide-Platform.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  # Color-Me


# cosmetics_rag_api.py
# ------------------------------------------------------------
# RAG 기반 화장품 추천 API
# - 사용자의 퍼스널 컬러와 추가 질의를 받아서 화장품을 추천
# - Gemini API를 사용한 자연어 처리 및 추천
# ------------------------------------------------------------

import os
import json
import re
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
from PIL import Image
from io import BytesIO

# 환경설정 로드
load_dotenv()

# FastAPI 앱 초기화
app = FastAPI(
    title="화장품 RAG 추천 API",
    description="퍼스널 컬러와 추가 질의를 기반으로 한 화장품 추천 시스템",
    version="1.0.0"
)

# Gemini API를 사용한 퍼스널 컬러 분석
print("💡 퍼스널 컬러 예측은 Gemini API를 사용합니다.")

# ─────────────────────────────────────────────────────────────
# 데이터 모델 정의
# ─────────────────────────────────────────────────────────────

class SearchRequest(BaseModel):
    personal_color: str  # 예: "summer_mute", "spring_light" 등
    query: str  # 예: "10000원 이하, 촉촉한 립"
    budget: Optional[int] = None  # 예산 (원)
    skin_type: Optional[str] = None  # 피부타입
    limit: Optional[int] = 10  # 추천 개수

class Product(BaseModel):
    id: str
    brand: str
    name: str
    option_name: str
    price: Optional[int]
    price_str: str
    img_url: str
    shade_hex: Optional[str]
    product_url: str
    reason: Optional[str] = None

class SearchResponse(BaseModel):
    products: List[Product]
    total_found: int
    personal_color: str
    query: str
    note: Optional[str] = None

class PersonalColorResponse(BaseModel):
    predicted_class: str
    confidence: float
    class_probabilities: Dict[str, float]
    all_probs: Optional[List[float]] = None
    note: Optional[str] = None

# ─────────────────────────────────────────────────────────────
# 데이터 로드 및 정규화
# ─────────────────────────────────────────────────────────────

def load_cosmetics_data(file_path: str = "cosmetics_data_single.json") -> List[Dict[str, Any]]:
    """화장품 데이터를 JSON 파일에서 로드"""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"데이터 파일 '{file_path}'을 찾을 수 없습니다.")
    
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    print(f"✅ {len(data)}개 제품 데이터 로드 완료")
    return data

def parse_price_to_int(price_str: str) -> Optional[int]:
    """가격 문자열을 정수로 변환"""
    if not price_str:
        return None
    
    # 숫자만 추출
    digits = re.findall(r'\d+', str(price_str))
    if digits:
        return int(''.join(digits))
    return None

def normalize_product_data(products: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """제품 데이터 정규화"""
    for product in products:
        # 가격 정규화
        product["price_int"] = parse_price_to_int(product.get("price", ""))
        product["price_str"] = product.get("price", "")
        
        # ID 생성 (없는 경우)
        if not product.get("id"):
            product["id"] = f"{product.get('brand', '')}_{product.get('name', '')}_{product.get('option_name', '')}"
        
        # HEX 코드 정규화
        hex_code = product.get("shade_hex", "")
        if hex_code and not hex_code.startswith("#"):
            if len(hex_code) == 6:
                product["shade_hex"] = f"#{hex_code}"
        
        # 빈 문자열 처리
        for key in ["brand", "name", "option_name"]:
            product[key] = product.get(key, "")
    
    return products

# ─────────────────────────────────────────────────────────────
# RAG 검색 엔진
# ─────────────────────────────────────────────────────────────

class CosmeticsRAGEngine:
    def __init__(self, data_file: str = "cosmetics_data_single.json"):
        self.products = normalize_product_data(load_cosmetics_data(data_file))
        self.api_key = os.getenv("GEMINI_API_KEY")
        
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel("gemini-2.0-flash-exp")
        else:
            print("⚠️ GEMINI_API_KEY가 설정되지 않았습니다. 오프라인 모드로 동작합니다.")
            self.model = None
    
    def extract_budget_from_query(self, query: str) -> Optional[int]:
        """질의에서 예산 정보 추출"""
        # "10000원 이하", "1만원", "10,000원" 등의 패턴 매칭
        patterns = [
            r'(\d+(?:,\d+)*)\s*원\s*이하',
            r'(\d+(?:,\d+)*)\s*원\s*이내',
            r'(\d+(?:,\d+)*)\s*원\s*미만',
            r'(\d+(?:,\d+)*)\s*원',
            r'(\d+)\s*만원',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, query)
            if match:
                amount = match.group(1).replace(',', '')
                if '만원' in pattern:
                    return int(amount) * 10000
                return int(amount)
        
        return None
    
    def filter_by_budget(self, products: List[Dict[str, Any]], budget: int) -> List[Dict[str, Any]]:
        """예산에 따른 제품 필터링"""
        return [p for p in products if p.get("price_int") and p["price_int"] <= budget]
    
    def create_search_prompt(self, personal_color: str, query: str, products: List[Dict[str, Any]], budget: Optional[int] = None) -> str:
        """검색을 위한 프롬프트 생성"""
        
        # 제품 정보를 간소화된 형태로 변환
        product_list = []
        for p in products[:50]:  # 토큰 제한을 위해 상위 50개만 사용
            product_list.append({
                "id": p.get("id", ""),
                "brand": p.get("brand", ""),
                "name": p.get("name", ""),
                "option_name": p.get("option_name", ""),
                "price": p.get("price_int"),
                "price_str": p.get("price_str", ""),
                "hex": p.get("shade_hex", ""),
                "img_url": p.get("img_url", ""),
                "url": p.get("product_url", "")
            })
        
        prompt = f"""당신은 한국 화장품 전문가입니다. 사용자의 퍼스널 컬러와 요구사항에 맞는 화장품을 추천해주세요.

사용자 정보:
- 퍼스널 컬러: {personal_color}
- 추가 요구사항: {query}
- 예산: {budget}원 (예산이 있는 경우)

퍼스널 컬러별 추천 가이드:
- summer_mute: 차분하고 회색빛이 도는 로즈, 모브, 토프 계열
- summer_light: 밝고 시원한 핑크, 라벤더 계열
- spring_light: 따뜻하고 밝은 코랄, 피치 계열
- autumn_mute: 따뜻하고 어두운 브라운, 오렌지 계열
- winter_bright: 선명하고 시원한 레드, 핑크 계열

제품 목록 (JSON):
{json.dumps(product_list, ensure_ascii=False, indent=2)}

위 제품 목록에서 사용자의 퍼스널 컬러({personal_color})와 요구사항("{query}")에 가장 적합한 제품들을 추천해주세요.

응답 형식 (JSON만 출력):
{{
  "recommendations": [
    {{
      "id": "제품ID",
      "reason": "추천 이유 (1-2문장)",
      "match_score": 0.95
    }}
  ],
  "note": "추천 팁 (1문장)"
}}

총 10개 이하의 제품을 추천해주세요."""

        return prompt
    
    def search_with_gemini(self, personal_color: str, query: str, budget: Optional[int] = None, limit: int = 10) -> Dict[str, Any]:
        """Gemini API를 사용한 RAG 검색"""
        if not self.model:
            return self.search_offline(personal_color, query, budget, limit)
        
        # 예산 필터링 (있는 경우)
        filtered_products = self.products
        if budget:
            filtered_products = self.filter_by_budget(filtered_products, budget)
        
        # 프롬프트 생성 및 API 호출
        prompt = self.create_search_prompt(personal_color, query, filtered_products, budget)
        
        try:
            response = self.model.generate_content(prompt)
            response_text = response.text.strip()
            
            # JSON 파싱
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}')
            
            if start_idx != -1 and end_idx != -1:
                json_str = response_text[start_idx:end_idx+1]
                result = json.loads(json_str)
                
                # 추천된 제품 ID로 실제 제품 정보 조회
                recommended_products = []
                for rec in result.get("recommendations", []):
                    product_id = rec.get("id")
                    for product in filtered_products:
                        if product.get("id") == product_id:
                            product_copy = product.copy()
                            product_copy["reason"] = rec.get("reason", "")
                            recommended_products.append(product_copy)
                            break
                
                return {
                    "products": recommended_products[:limit],
                    "total_found": len(recommended_products),
                    "note": result.get("note", "")
                }
        
        except Exception as e:
            print(f"⚠️ Gemini API 호출 실패: {e}")
            return self.search_offline(personal_color, query, budget, limit)
        
        return self.search_offline(personal_color, query, budget, limit)
    
    def search_offline(self, personal_color: str, query: str, budget: Optional[int] = None, limit: int = 10) -> Dict[str, Any]:
        """오프라인 키워드 기반 검색 (폴백)"""
        filtered_products = self.products
        
        # 예산 필터링
        if budget:
            filtered_products = self.filter_by_budget(filtered_products, budget)
        
        # 키워드 기반 점수 계산
        query_lower = query.lower()
        
        def calculate_score(product):
            score = 0
            text = f"{product.get('name', '')} {product.get('option_name', '')} {product.get('brand', '')}".lower()
            
            # 퍼스널 컬러 키워드 매칭
            color_keywords = {
                "summer_mute": ["모브", "mauve", "토프", "taupe", "로지", "rose", "쿨", "cool", "그레이프", "grape"],
                "summer_light": ["라이트", "light", "핑크", "pink", "라벤더", "lavender", "쿨", "cool"],
                "spring_light": ["스프링", "spring", "코랄", "coral", "피치", "peach", "웜", "warm"],
                "autumn_mute": ["오텀", "autumn", "브라운", "brown", "오렌지", "orange", "웜", "warm"],
                "winter_bright": ["윈터", "winter", "레드", "red", "브라이트", "bright", "쿨", "cool"]
            }
            
            for keyword in color_keywords.get(personal_color, []):
                if keyword in text:
                    score += 2
            
            # 질의 키워드 매칭
            query_keywords = ["립", "lip", "촉촉", "matte", "글로시", "glossy", "틴트", "tint"]
            for keyword in query_keywords:
                if keyword in query_lower and keyword in text:
                    score += 1
            
            return score
        
        # 점수순으로 정렬
        scored_products = [(p, calculate_score(p)) for p in filtered_products]
        scored_products.sort(key=lambda x: x[1], reverse=True)
        
        # 상위 제품들 선택
        top_products = [p for p, score in scored_products[:limit] if score > 0]
        
        return {
            "products": top_products,
            "total_found": len(top_products),
            "note": "오프라인 키워드 기반 검색 결과입니다."
        }

# ─────────────────────────────────────────────────────────────
# API 엔드포인트
# ─────────────────────────────────────────────────────────────

# 전역 RAG 엔진 인스턴스
rag_engine = CosmeticsRAGEngine()

@app.get("/")
async def root():
    return {
        "message": "화장품 RAG 추천 API",
        "version": "1.0.0",
        "endpoints": {
            "/predict-color": "POST - 이미지 업로드하여 퍼스널 컬러 예측",
            "/recommend": "POST - 간단한 화장품 추천 (퍼스널 컬러와 질의를 직접 입력)",
            "/search": "POST - JSON 형태의 화장품 검색 및 추천",
            "/health": "GET - API 상태 확인",
            "/products": "GET - 전체 제품 목록"
        },
        "usage_example": {
            "url": "/recommend",
            "method": "POST",
            "parameters": {
                "personal_color": "summer_mute",
                "query": "10000원 이하, 촉촉한 립",
                "budget": 10000,
                "limit": 10
            }
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "total_products": len(rag_engine.products),
        "gemini_available": rag_engine.model is not None
    }

@app.post("/recommend")
async def recommend_cosmetics(
    personal_color: str,
    query: str,
    budget: Optional[int] = None,
    skin_type: Optional[str] = None,
    limit: int = 10
):
    """간단한 화장품 추천 API - 퍼스널 컬러와 질의를 직접 입력받음"""
    try:
        # 질의에서 예산 추출 (요청에 예산이 없는 경우)
        if not budget:
            extracted_budget = rag_engine.extract_budget_from_query(query)
            if extracted_budget:
                budget = extracted_budget
        
        # RAG 검색 수행
        result = rag_engine.search_with_gemini(
            personal_color=personal_color,
            query=query,
            budget=budget,
            limit=limit
        )
        
        # 응답 형식 변환
        products = []
        for product in result["products"]:
            products.append(Product(
                id=product.get("id", ""),
                brand=product.get("brand", ""),
                name=product.get("name", ""),
                option_name=product.get("option_name", ""),
                price=product.get("price_int"),
                price_str=product.get("price_str", ""),
                img_url=product.get("img_url", ""),
                shade_hex=product.get("shade_hex"),
                product_url=product.get("product_url", ""),
                reason=product.get("reason")
            ))
        
        return SearchResponse(
            products=products,
            total_found=result["total_found"],
            personal_color=personal_color,
            query=query,
            note=result.get("note")
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"추천 중 오류가 발생했습니다: {str(e)}")

@app.post("/search", response_model=SearchResponse)
async def search_cosmetics(request: SearchRequest):
    """화장품 검색 및 추천 API"""
    try:
        # 질의에서 예산 추출 (요청에 예산이 없는 경우)
        if not request.budget:
            extracted_budget = rag_engine.extract_budget_from_query(request.query)
            if extracted_budget:
                request.budget = extracted_budget
        
        # RAG 검색 수행
        result = rag_engine.search_with_gemini(
            personal_color=request.personal_color,
            query=request.query,
            budget=request.budget,
            limit=request.limit
        )
        
        # 응답 형식 변환
        products = []
        for product in result["products"]:
            products.append(Product(
                id=product.get("id", ""),
                brand=product.get("brand", ""),
                name=product.get("name", ""),
                option_name=product.get("option_name", ""),
                price=product.get("price_int"),
                price_str=product.get("price_str", ""),
                img_url=product.get("img_url", ""),
                shade_hex=product.get("shade_hex"),
                product_url=product.get("product_url", ""),
                reason=product.get("reason")
            ))
        
        return SearchResponse(
            products=products,
            total_found=result["total_found"],
            personal_color=request.personal_color,
            query=request.query,
            note=result.get("note")
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"검색 중 오류가 발생했습니다: {str(e)}")

@app.get("/products")
async def get_all_products(limit: int = 100):
    """전체 제품 목록 조회 (개발/디버깅용)"""
    products = rag_engine.products[:limit]
    return {
        "products": products,
        "total": len(rag_engine.products),
        "showing": len(products)
    }

@app.post("/predict-color")
async def predict_personal_color(file: UploadFile = File(...)):
    """이미지 파일을 업로드하여 LLM(Gemini)으로 퍼스널 컬러를 예측하는 API"""
    try:
        # 파일 타입 검증
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="이미지 파일만 업로드 가능합니다.")
        
        # 파일 내용 읽기
        file_content = await file.read()
        
        # Gemini API를 사용하여 퍼스널 컬러 분석
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="GEMINI_API_KEY가 설정되지 않았습니다.")
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-2.0-flash-exp")
        
        # 이미지와 프롬프트 설정
        prompt = """이 사진에서 보이는 사람의 퍼스널 컬러를 분석해주세요.

퍼스널 컬러는 다음 4가지 중 하나로 분류됩니다:
- spring: 따뜻하고 밝은 톤 (웜톤)
- summer: 시원하고 밝은 톤 (쿨톤, 밝음)
- autumn: 따뜻하고 어두운 톤 (웜톤, 어두움)
- winter: 시원하고 선명한 톤 (쿨톤, 선명)

다음 JSON 형식으로 응답해주세요:
{
  "predicted_class": "spring|summer|autumn|winter",
  "confidence": 0.95,
  "reason": "분석 이유 설명",
  "suggestions": "이 톤에 잘 어울리는 화장품 팁"
}"""

        # 이미지 파일을 PIL로 변환 후 업로드
        from io import BytesIO
        img = Image.open(BytesIO(file_content))
        
        # Gemini에 이미지와 프롬프트 전송
        response = model.generate_content([
            prompt,
            img
        ])
        
        # JSON 응답 파싱
        text = response.text.strip()
        
        # JSON 부분만 추출
        start_idx = text.find('{')
        end_idx = text.rfind('}')
        
        if start_idx != -1 and end_idx != -1:
            json_str = text[start_idx:end_idx+1]
            result = json.loads(json_str)
            
            return PersonalColorResponse(
                predicted_class=result.get("predicted_class", "unknown"),
                confidence=result.get("confidence", 0.0) * 100,
                class_probabilities={
                    result.get("predicted_class", "unknown"): result.get("confidence", 0.0) * 100
                },
                all_probs=None,
                note=f"{result.get('reason', '')} | {result.get('suggestions', '')}"
            )
        else:
            # JSON 파싱 실패 시 텍스트에서 정보 추출
            predicted_class = "unknown"
            if "spring" in text.lower():
                predicted_class = "spring"
            elif "summer" in text.lower():
                predicted_class = "summer"
            elif "autumn" in text.lower():
                predicted_class = "autumn"
            elif "winter" in text.lower():
                predicted_class = "winter"
            
            return PersonalColorResponse(
                predicted_class=predicted_class,
                confidence=85.0,
                class_probabilities={predicted_class: 85.0},
                all_probs=None,
                note=text[:200]  # 처음 200자만
            )
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"퍼스널 컬러 예측 중 오류가 발생했습니다: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
