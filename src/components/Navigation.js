import { signOut } from "firebase/auth";
import React, { useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";

import { auth } from "../firebase/config";
import logo from "../images/logo.png";

const Navigation = () => {
  const [authUser] = useContext(AuthContext);
  return (
    <div className="flex container mx-auto columns-2">
      {authUser ? (
        <a href="/dashboard" className="w-full flex justify-start my-auto">
          <img width="50px" src={logo} alt="burningham realty logo" />
          <div className="my-auto font-bold ml-3">Burningham Realty App</div>
        </a>
      ) : (
        <a href="/" className="w-full flex justify-start my-auto">
          <img width="50px" src={logo} alt="burningham realty logo" />
          <div className="my-auto font-bold ml-3">Burningham Realty App</div>
        </a>
      )}

      <div className="my-auto w-full text-right">
        {authUser ? (
          <span
            onClick={() =>
              signOut(auth).then(() => (window.location.href = "/login"))
            }
            className="link"
          >
            Logout
          </span>
        ) : (
          <>
            <a href="/register" className="link">
              Create Account
            </a>
            <a href="/login" className=" ml-5 link">
              Login
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default Navigation;
