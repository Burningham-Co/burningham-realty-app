import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
// import { useAuthState } from "react-firebase-hooks/auth";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authUser, setAuthUser] = useState();
  // const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await getDoc(doc(db, "users", user.uid)).then((userData) => {
          setCurrentUser(userData.data());
        });
      }
      setAuthUser(user);
    });
  }, []);

  return (
    <AuthContext.Provider value={[authUser, currentUser]}>
      {children}
    </AuthContext.Provider>
  );
};
