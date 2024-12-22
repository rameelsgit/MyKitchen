import React, { createContext, useState, useEffect, ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
  sendPasswordResetEmail,
  User,
  UserCredential,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  signup: (
    email: string,
    password: string,
    name: string
  ) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  setDisplayName: (name: string) => Promise<void>;
  setPassword: (password: string) => Promise<void>;
  reloadUser: () => boolean;
  updateUserPassword: (newPassword: string) => Promise<void>;
  userEmail: string | null;
  userName: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        setUserEmail(user.email);
        setUserName(user.displayName);
      } else {
        setUserEmail(null);
        setUserName(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(userCredential.user, { displayName: name });
    return userCredential;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserEmail(null);
    setUserName(null);

    localStorage.removeItem("lastSearch");
    localStorage.removeItem("lastResults");
    window.location.reload();
  };

  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email, {
      url: window.location.origin + "/login",
    });
  };

  const setPassword = (password: string) => {
    if (!user) throw new Error("You must be logged in to update password.");
    return updatePassword(user, password);
  };

  const updateUserPassword = (newPassword: string) => {
    if (!user) throw new Error("You must be logged in to update password.");
    return updatePassword(user, newPassword);
  };

  const setDisplayName = (name: string) => {
    if (!user) throw new Error("You must be logged in to update name.");
    return updateProfile(user, { displayName: name });
  };

  const reloadUser = () => {
    if (!user) return false;
    setUserName(user.displayName);
    setUserEmail(user.email);
    return true;
  };

  const isLoggedIn = user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        signup,
        logout,
        resetPassword,
        setPassword,
        setDisplayName,
        userEmail,
        userName,
        reloadUser,
        updateUserPassword,
      }}
    >
      {loading ? (
        <div id="initial-loader">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <>{children}</>
      )}
    </AuthContext.Provider>
  );
};

export { AuthContext };
