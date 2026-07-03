import { createContext, useContext, useEffect, useState } from "react";
import { getUserProfile } from "../services/userService";

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(localStorage.getItem("patientToken"));

  useEffect(() => {
    if (token) {
      loadProfile();
    }
  }, [token]);

  const loadProfile = async () => {
    try {
      const data = await getUserProfile(token);

      setUser(data.user);
    } catch {
      logout();
    }
  };

  const login = (jwt) => {
    localStorage.setItem("patientToken", jwt);

    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("patientToken");

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
