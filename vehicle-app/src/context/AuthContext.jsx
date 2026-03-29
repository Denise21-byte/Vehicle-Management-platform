import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const VALID_EMAIL    = 'test@gmail.com';
const VALID_PASSWORD = 'Password!234';

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = localStorage.getItem('vr_session');
    if (session === 'active') {
      setIsAuthenticated(true);
      setUser({ email: VALID_EMAIL, name: 'Admin User' });
    }
  }, []);

  const login = (email, password) => {
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      localStorage.setItem('vr_session', 'active');
      setIsAuthenticated(true);
      setUser({ email, name: 'Admin User' });
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials. Please try again.' };
  };

  const logout = () => {
    localStorage.removeItem('vr_session');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);