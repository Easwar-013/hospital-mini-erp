import { createContext, useContext, useEffect, useState } from "react";
import { getUserProfile } from "../services/userService";

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // CHANGED: Use "token" instead of "patientToken"
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    // Only load profile if we have a token AND the role is specifically 'patient'
    if (token && storedUser && storedUser.role === "patient") {
      loadProfile();
    }
  }, [token]);

  const loadProfile = async () => {
    try {
      // CHANGED: No need to pass token manually if axios interceptor is used,
      // but keeping it as-is is fine if your backend still requires it.
      const data = await getUserProfile(token);
      setUser(data.user);
    } catch {
      logout();
    }
  };

  const login = (jwt) => {
    // CHANGED: Use "token"
    localStorage.setItem("token", jwt);
    setToken(jwt);
  };

  const logout = () => {
    // CHANGED: Use "token"
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <UserAuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(UserAuthContext);
