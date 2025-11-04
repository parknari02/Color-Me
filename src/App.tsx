import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { MainPage } from './pages/MainPage';

function App() {
  return (
    <AppProvider children={undefined}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
