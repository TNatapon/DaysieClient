import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  let isAuthenticated = localStorage.getItem("isLoggedIn");
  return isAuthenticated ? children : <Navigate to={"/login"} />;
};

export default PrivateRoute;
