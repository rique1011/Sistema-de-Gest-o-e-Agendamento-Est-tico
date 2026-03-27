import { createContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { api } from '../services/api'; // Importamos nossa API

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('@BioSchedule:token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  async function login(email: string, senha: string) {
    try {
      // ⚠️ IMPORTANTE: Ajuste '/auth/login' para a rota exata do seu backend
      const response = await api.post('/auth/login', { 
        email, 
        senha 
      });

      // ⚠️ IMPORTANTE: Ajuste 'access_token' para o nome exato que seu backend devolve (ex: 'token')
      const { access_token } = response.data; 

      if (access_token) {
        localStorage.setItem('@BioSchedule:token', access_token);
        setIsAuthenticated(true);
        navigate('/dashboard');
      }

    } catch (error: any) {
      console.error(error.response?.data);
      Swal.fire({
        icon: 'error',
        title: 'Acesso Negado',
        text: error.response?.data?.message || 'E-mail ou senha incorretos.',
        customClass: { popup: 'rounded-[2rem]' }
      });
    }
  }

  function logout() {
    localStorage.removeItem('@BioSchedule:token');
    setIsAuthenticated(false);
    navigate('/');
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}