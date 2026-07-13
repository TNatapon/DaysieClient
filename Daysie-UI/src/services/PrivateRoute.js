import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element, path }) => {
  // Function to check if a session cookie has expired
  const isSessionCookieExpired = () => {
    // Access cookies
    const cookies = document.cookie;

    // Split cookies string into an array
    const cookieArray = cookies.split(";");

    // Find the session cookie by name
    const sessionCookie = cookieArray.find((cookie) =>
      cookie.trim().startsWith("jwt")
    );

    if (sessionCookie) {
      // Get the expiration date from the cookie string
      const expires = new Date(sessionCookie.split("=")[1]);

      // Check if the expiration date is in the past
      return expires < new Date();
    }

    // If session cookie not found, consider it expired
    return true;
  };

  // Check if session cookie is expired
  const isExpired = isSessionCookieExpired();

  // If session cookie is expired, redirect to login page
  if (isExpired) {
    console.log("Session cookie expired. Redirecting to login...");
    return <Navigate to="/login" />;
  }

  return element;
};

export default PrivateRoute;
