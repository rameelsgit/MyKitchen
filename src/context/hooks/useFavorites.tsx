import { useContext } from "react";
import { FavoritesContext } from "../FavoritesContext";
import { FavoritesContextType } from "../../types/FavoritesTypes";

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
