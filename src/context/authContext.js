import { createContext, useState, useEffect } from 'react';

// Create the context
export const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);

  // Check for existing session data
  useEffect(() => {
    const storedIsLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const storedUser = sessionStorage.getItem('loggedUser');
    
    if (storedIsLoggedIn && storedUser) {
      setIsLoggedIn(true);
      setLoggedUser(JSON.parse(storedUser));
    }
    
  }, []);

  // Function to update the login state
  const login = (user) => {
    setIsLoggedIn(true);
    setLoggedUser(user);
    sessionStorage.setItem('isLoggedIn', 'true'); // Store login state in sessionStorage as a string
    sessionStorage.setItem('loggedUser', JSON.stringify(user)); // Store user details in sessionStorage
  };

  const logout = () => {
    setIsLoggedIn(false);
    setLoggedUser(null);
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('loggedUser');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, loggedUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
