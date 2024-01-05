import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PaginaClient from '../pages/paginaClient.pages';


const AppRouter: React.FC = () => {

  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token; // Retorna true se o token existir
  };

  return (
    <Router>
      <Routes>
        {/* Outras rotas aqui, se necessário */}
        <Route path="/paginaClient" element={<PaginaClient />} />
        <Route path="/client" element={<PaginaClient />} />
      </Routes>
    </Router>
  );
};
// git dando pauuuuuuu///
export default AppRouter;
