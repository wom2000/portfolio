import { useState, createContext, useEffect } from 'react';

export const AuthContext = createContext();
 
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);
 
  const login = async (authData) => {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authData),
    });
 
    if (!response.ok) {
      throw new Error("Failed to authenticate");
    }
 
    const data = await response.json();
    const userData = { 
      role: data.role,
      name: data.name
    };
    
    setUser(userData);
    return true;
  };
 
  const logout = () => {
    setUser(null);
  };
 
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};