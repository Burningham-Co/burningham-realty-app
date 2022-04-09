import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";

const CreateAccount = () => {
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);
  const [password, setPassWord] = useState(null);
  const [confPassWord, setConfPassword] = useState(null);
  const navigate = useNavigate();

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (confPassWord === password) {
      setError(null);
      setLoading(true);
      createUserWithEmailAndPassword();
      createUserWithEmailAndPassword(auth, formData.email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          await updateProfile(auth.currentUser, {
            displayName: formData.firstName,
          }).catch((err) => console.error(err));
          setDoc(doc(db, "users", user.uid), formData).then(() => {
            setLoading(false);
            setSuccess("Account has been created");
            document.createAccountForm.reset();
            setTimeout(() => {
              setSuccess(null);
              navigate("/login");
            }, 3000);
          });
        })
        .catch((err) => {
          console.error(err.message);
          setLoading(false);
          setError(err.message.split(": ")[1]);
          setTimeout(() => {
            setError(null);
          }, 10000);
        });
    } else {
      setError("Passwords do not match");
    }
  };

  const checkPasswordMatch = (e) => {
    setConfPassword(e.target.value);
    if (confPassWord && password) {
      if (confPassWord !== password) {
        setError("Password does not match");
      }
    }
  };

  return (
    <div className="min-h-[80vh] mx-auto flex min-w-screen justify-center items-center columns-1">
      <div className="font-conf max-w-full sm:max-w-2xl w-full bg-white px-7 py-6 rounded my-5 sm:my-0 mx-2 sm:mx-0">
        <div className="text-2xl relative font-semibold before:absolute before:h-1 before:left-0 before:bottom-0 before:content-[''] before:w-7 before:bg-red-900">
          Create Account
        </div>
        <form
          id="createAccountForm"
          name="createAccountForm"
          onSubmit={handleFormSubmit}
        >
          <div className="flex max-h-[300px] overflow-y-scroll sm:overflow-visible sm:max-h-full flex-wrap justify-between mx-0 mt-5 mb-3">
            <div className="input-box">
              <span className="details">Dotloop Member ID</span>
              <input
                name="dotloopNumber"
                type="text"
                placeholder="Enter your dotloop number"
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="input-box">
              <span className="details">Agent License Number</span>
              <input
                name="brokerageLicense"
                type="text"
                placeholder="Enter your Agent license"
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="input-box">
              <span className="details">First Name</span>
              <input
                name="firstName"
                type="text"
                placeholder="Enter your First Name"
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="input-box">
              <span className="details">Last Name</span>
              <input
                name="lastName"
                type="text"
                placeholder="Enter your Last Name"
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="input-box">
              <span className="details">Email</span>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="input-box">
              <span className="details">Phone</span>
              <input
                name="phone"
                type="tel"
                placeholder="Enter your phone"
                // pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="input-box">
              <span className="details">Password</span>
              <input
                name="password"
                type="password"
                placeholder="Enter new password"
                onChange={(e) => setPassWord(e.target.value)}
                required
              />
            </div>
            <div className="input-box">
              <span className="details">Confirm Password</span>
              <input
                type="password"
                placeholder="Confirm new password"
                onChange={checkPasswordMatch}
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
              Sign Up
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
