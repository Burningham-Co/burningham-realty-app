import React, { /* useContext, useEffect, */ useState } from "react";

import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../firebase/config";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../auth/AuthProvider";

const Login = () => {
  // const [authUser] = useContext(AuthContext);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(null);
  const [modalError, setModalError] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [formData, setFormData] = useState(null);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState(null);
  const [showForgotPw, setShowForgotPw] = useState(false);

  const navigate = useNavigate();

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null);
  };
  const handleForgotPwChange = (e) => {
    const { value } = e.target;
    setForgotPasswordEmail(value);
    setModalError(null);
  };

  const handleForgotPassword = () => {
    setShowForgotPw(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then(() => {
        setSuccess("Login Successful");
        setLoading(false);
        document.loginForm.reset();
        setTimeout(() => {
          setSuccess(null);
          navigate("/dashboard");
        }, 1000);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err.message);
        setError(err.message.split(": ")[1]);
        setTimeout(() => {
          setError(null);
        }, 10000);
      });
  };
  const handleForgotPwSubmit = (e) => {
    e.preventDefault();

    setModalLoading(true);
    sendPasswordResetEmail(auth, forgotPasswordEmail)
      .then(() => {
        document.forgotPasswordForm.reset();
        setModalSuccess("Password reset has been sent to your email");
        setModalLoading(false);
        setTimeout(() => {
          setModalSuccess(null);
          setShowForgotPw(false);
        }, 5000);
      })
      .catch((err) => {
        setModalLoading(false);
        console.error(err.message);
        setModalError(err.message.split(": ")[1]);
        setTimeout(() => {
          setModalError(null);
        }, 10000);
      });
  };

  return (
    <div className="min-h-[80vh] mx-auto flex min-w-screen justify-center items-center columns-1">
      <div className="font-conf max-w-full sm:max-w-2xl w-full bg-white px-7 py-6 rounded mx-2 sm:mx-0">
        <div className="text-2xl relative font-semibold before:absolute before:h-1 before:left-0 before:bottom-0 before:content-[''] before:w-7 before:bg-red-900">
          Login
        </div>
        <form
          id="loginForm"
          name="loginForm"
          onChange={handleFormChange}
          onSubmit={handleFormSubmit}
        >
          <div className="flex max-h-[300px] overflow-y-scroll sm:overflow-visible sm:max-h-full flex-wrap justify-between mx-0 mt-5 mb-3">
            <div className="input-box">
              <span className="details">Email</span>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="input-box">
              <span className="details">Password</span>
              <input
                type="password"
                name="password"
                placeholder="Enter new password"
                required
              />
            </div>
            {error && <div className="font-bold text-red-700">{error}</div>}
            {success && (
              <div className="font-bold text-lime-700">{success}</div>
            )}
          </div>
          {loading ? (
            <button className="btn h-11 w-full my-8 mx-0" disabled>
              Loading...
            </button>
          ) : (
            <button className="btn h-11 w-full my-8 mx-0" type="submit">
              Sign In
            </button>
          )}
        </form>
        <div className="flex justify-evenly">
          <button className="" onClick={handleForgotPassword}>
            Forgot Password?
          </button>
          <button className="" onClick={() => navigate("/register")}>
            Dont have an account?
          </button>
        </div>
      </div>
      {/* this is the modal that appears when forgot password button is clicked. it is hidden initially*/}
      {showForgotPw && (
        <Modal setShow={setShowForgotPw}>
          <div className="text-2xl relative font-semibold before:absolute before:h-1 before:left-0 before:bottom-0 before:content-[''] before:w-7 before:bg-red-900">
            Forgot Password
          </div>
          <form
            id="forgotPasswordForm"
            name="forgotPasswordForm"
            onChange={handleForgotPwChange}
            onSubmit={handleForgotPwSubmit}
          >
            <div className="flex max-h-[300px] overflow-y-scroll sm:overflow-visible sm:max-h-full flex-wrap justify-center mx-0 mt-5 mb-3">
              <div className="input-box ">
                <span className="details">Email</span>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {modalError && (
                <div className=" w-full bg-red-800 text-white p-2 rounded">
                  {modalError}
                </div>
              )}
              {modalSuccess && (
                <div className="w-full bg-emerald-600 text-white p-2 rounded">
                  {modalSuccess}
                </div>
              )}
            </div>
            {modalLoading ? (
              <button className="btn h-11 w-full my-8 mx-0" disabled>
                Loading...
              </button>
            ) : (
              <button className="btn h-11 w-full my-8 mx-0" type="submit">
                Send Forgot Password Email
              </button>
            )}
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Login;
