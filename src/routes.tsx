import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, type ReactNode } from 'react'; 
import { Configuracoes } from './pages/Configuracoes';

// Importação do nosso novo sistema de autenticação
import { AuthProvider, AuthContext } from './contexts/AuthContext';

import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Pacientes } from './pages/Pacientes';
import { Agenda } from './pages/Agenda';
import { Servicos } from './pages/Servicos';

// COMPONENTE DE TRAVA: Agora usando ReactNode no lugar de JSX.Element
function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useContext(AuthContext);
  
  // Se estiver logado, renderiza a tela. Se não, manda pro Login (/)
  return isAuthenticated ? children : <Navigate to="/" />;
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      {/* O AuthProvider envolve o sistema para gerenciar o login globalmente */}
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Rotas Privadas trancadas pelo <PrivateRoute> */}
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pacientes" element={<Pacientes />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/servicos" element={<Servicos />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}