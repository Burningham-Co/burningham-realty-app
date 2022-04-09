// import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
// import { AuthContext } from "./AuthProvider";
import { auth } from "../firebase/config";

const RequireAuth = ({ children, redirectTo }) => {
  // const [authUser] = useContext(AuthContext);
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    navigate(redirectTo);
    console.log(error);
  }
  if (user) {
    return children;
  }
};

export default RequireAuth;
