import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppForm from './form/app.form';
import PaginaClient from './pages/paginaClient.pages';
import PaginaAdmin from './pages/paginaAdmin';


const isAuthenticated = () => {
  const token = localStorage.getItem("DDD_101");
  return !!token;
}

function App() {
  return (
    <Router> 
      <Routes>
        <Route path="/" element={<Navigate to="/form" />} />
        <Route path="/form" element={<AppForm />} />

        
        <Route path="/client" element={isAuthenticated() ? <PaginaClient /> : <Navigate to="/form" />} />

        <Route path="/admin" element={isAuthenticated() ? <PaginaAdmin /> : <Navigate to="/form" />} />
      </Routes>
    </Router>
  )
}

export default App;
