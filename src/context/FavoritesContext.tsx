import React, { createContext, useState, useEffect, ReactNode } from "react";
import { toast } from "react-toastify";
import { Recipe, FavoritesContextType } from "../types/FavoritesTypes";
import { useAuth } from "../context/useAuth";
import { db } from "../firebase/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

interface FavoritesProviderProps {
  children: ReactNode;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  const { user, logout: authLogout } = useAuth();
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!user);

  useEffect(() => {
    if (user) {
      const fetchFavoritesFromFirestore = async () => {
        const favoritesRef = doc(db, "users", user.uid, "favorites", "list");
        const snapshot = await getDoc(favoritesRef);
        if (snapshot.exists()) {
          setFavorites(snapshot.data().favorites);
        } else {
          setFavorites([]);
        }
      };
      fetchFavoritesFromFirestore();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const addFavorite = async (recipe: Recipe) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!favorites.some((fav) => fav.id === recipe.id)) {
      const updatedFavorites = [...favorites, recipe];
      setFavorites(updatedFavorites);
      const favoritesRef = doc(db, "users", user.uid, "favorites", "list");
      await setDoc(favoritesRef, { favorites: updatedFavorites });

      localStorage.setItem(
        `favorites_${user.uid}`,
        JSON.stringify(updatedFavorites)
      );

      toast.success(
        <>
          <span style={{ fontWeight: "bold" }}>{recipe.title}</span> added to{" "}
          <Link
            to="/favorites"
            style={{
              color: "#dc5d4d",
              textDecoration: "underline",
              fontWeight: "bold",
            }}
          >
            Favorites
          </Link>
          !
        </>
      );
    }
  };

  const removeFavorite = async (id: number) => {
    const updatedFavorites = favorites.filter((recipe) => recipe.id !== id);
    setFavorites(updatedFavorites);

    if (user) {
      const favoritesRef = doc(db, "users", user.uid, "favorites", "list");
      await setDoc(favoritesRef, { favorites: updatedFavorites });
    }

    if (user) {
      localStorage.setItem(
        `favorites_${user.uid}`,
        JSON.stringify(updatedFavorites)
      );
    }

    toast.info("Recipe removed from favorites.");
  };

  const logout = async () => {
    if (authLogout) {
      authLogout();
      setIsLoggedIn(false);
      setFavorites([]);
      localStorage.removeItem(`favorites_${user?.uid}`);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        showLoginModal,
        setShowLoginModal,
        isLoggedIn,
        logout,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export { FavoritesContext };
