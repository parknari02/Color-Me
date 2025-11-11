// @ts-ignore - Vite 환경 변수
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';

export interface Product {
    id: string;
    brand: string;
    name: string;
    option_name: string;
    price: number | null;
    price_str: string;
    img_url: string;
    shade_hex: string | null;
    product_url: string;
    reason?: string;
}

export interface SearchResponse {
    products: Product[];
    total_found: number;
    personal_color: string;
    query: string;
    note?: string;
}

/**
 * 퍼스널 컬러 형식을 API 형식으로 변환
 * spring-light -> spring_light
 */
export function convertPersonalColorToAPI(color: string): string {
    return color.replace('-', '_');
}

/**
 * 화장품 추천 API 호출
 */
export async function recommendCosmetics(
    personalColor: string,
    query: string = '',
    budget?: number,
    skinType?: string,
    limit: number = 10
): Promise<SearchResponse> {
    const apiPersonalColor = convertPersonalColorToAPI(personalColor);

    // FastAPI의 /recommend는 query parameter로 받음
    const params = new URLSearchParams({
        personal_color: apiPersonalColor,
        query: query || '추천해주세요',
        limit: limit.toString(),
    });

    if (budget) {
        params.append('budget', budget.toString());
    }

    if (skinType) {
        params.append('skin_type', skinType);
    }

    const response = await fetch(`${BASE_URL}/recommend?${params.toString()}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API 호출 실패 (${response.status}): ${errorText}`);
    }

    return response.json();
}

