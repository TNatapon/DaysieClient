import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({
  auth: null,
  setAuth: () => {},
  user: null,
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");

    if (storedToken) {
      const isAuth = async () => {
        try {
          await axios
            .get("http://localhost:10002/user/profile", {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            })
            .then((res) => {
              console.log("Token is valid:", storedToken);
              setUser(res.data);
            })
            .catch((err) => {
              console.error(
                "Token verification failed. Redirecting to login..."
              );
              setUser(null);
              window.location.href = "/login";
            });
        } catch (error) {
          setUser(null);
        }
      };

      isAuth();
    } else {
      console.log("Token not found. Redirecting to login...");

      window.location.href = "/login";
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
