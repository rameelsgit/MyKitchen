import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Recipe, FavoritesContextType } from "../types/FavoritesTypes";
import { useAuth } from "./AuthContext";
interface FavoritesProviderProps {
  children: ReactNode;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false); 

  useEffect(() => {
    if (user) {
      const storedFavorites = localStorage.getItem(`favorites_${user.uid}`);
      setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
    } else {
      setFavorites([]);
    }
  }, [user]);

  const addFavorite = (recipe: Recipe) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (!favorites.some((fav) => fav.id === recipe.id)) {
      const updatedFavorites = [...favorites, recipe];
      setFavorites(updatedFavorites);
      if (user) {
        localStorage.setItem(
          `favorites_${user.uid}`,
          JSON.stringify(updatedFavorites)
        );
      }
      toast.success(`${recipe.title} added to favorites!`);
    }
  };

  const removeFavorite = (id: number) => {
    const updatedFavorites = favorites.filter((recipe) => recipe.id !== id);
    setFavorites(updatedFavorites);
    if (user) {
      localStorage.setItem(
        `favorites_${user.uid}`,
        JSON.stringify(updatedFavorites)
      );
    }
    toast.info("Recipe removed from favorites.");
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        showLoginModal,
        setShowLoginModal,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
