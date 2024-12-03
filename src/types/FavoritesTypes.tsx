export interface Recipe {
  id: number;
  title: string;
  image: string;
}

export interface FavoritesContextType {
  favorites: Recipe[];
  addFavorite: (recipe: Recipe) => void;
  removeFavorite: (id: number) => void;
  showLoginModal: boolean; 
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
}
