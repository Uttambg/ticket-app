import { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';
import { jwtDecode } from 'jwt-decode'; // Ensure this is installed: npm install jwt-decode

interface AuthContextType {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isValidToken: boolean;
  role: string | null;
  userId: number | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem('authToken');
    return token !== null;
  });

  const [isValidToken, setIsValidToken] = useState<boolean>(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken?.exp ? decodedToken.exp * 1000 > Date.now() : false;
    }
    return false;
  });

  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  // Decode the token and set role and userId
  const decodeTokenAndSetData = (token: string) => {
    const decodedToken: any = jwtDecode(token);
    const { role, userId } = decodedToken; // Extract role and userId from token
    setRole(role);
    setUserId(userId);
  };

  useEffect(() => {
    if (token) {
      apiClient.setToken(token);
      decodeTokenAndSetData(token); // Decode the token and set role, userId
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const token = await apiClient.login(email, password); // Get the token from login response
      localStorage.setItem('authToken', token);
      setToken(token);
      setIsAuthenticated(true);
      decodeTokenAndSetData(token); // Decode the token and set role, userId
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setRole(null);
    setUserId(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const handlePopstate = () => {
      const currentPath = window.location.pathname;
      if (currentPath === '/') {
        logout();
      }
    };

    window.addEventListener('popstate', handlePopstate);
    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, isAuthenticated, isValidToken, role, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
