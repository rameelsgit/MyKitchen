import React, { useState, useEffect } from "react";
import { Modal, ListGroup, Button } from "react-bootstrap";
import { BsCheck } from "react-icons/bs";
import { PiBowlFoodDuotone } from "react-icons/pi";

interface AddMealModalProps {
  show: boolean;
  onHide: () => void;
  onAddMeal: (meal: string) => void;
  favorites: { id: number; title: string }[];
}

const AddMealModal: React.FC<AddMealModalProps> = ({
  show,
  onHide,
  onAddMeal,
  favorites,
}) => {
  const [addedMeals, setAddedMeals] = useState<Set<string>>(new Set());

  const handleAddMeal = (mealTitle: string) => {
    onAddMeal(mealTitle);
    setAddedMeals((prev) => new Set(prev).add(mealTitle));
  };

  useEffect(() => {
    if (!show) {
      setAddedMeals(new Set());
    }
  }, [show]);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          <PiBowlFoodDuotone
            style={{ marginRight: "20px", color: "#dc5d4d" }}
          />
          Select a Meal
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {favorites.map((meal) => (
            <ListGroup.Item
              key={meal.id}
              className={addedMeals.has(meal.title) ? "added-meal" : ""}
              style={{
                backgroundColor: addedMeals.has(meal.title) ? "#d4edda" : "",
              }}
            >
              <div
                onClick={() => handleAddMeal(meal.title)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                {meal.title}
                <Button
                  variant="outline-danger"
                  size="sm"
                  style={{
                    borderColor: "#dc5d4d",
                    color: addedMeals.has(meal.title) ? "#fff" : "#dc5d4d",
                    backgroundColor: addedMeals.has(meal.title)
                      ? "#dc5d4d"
                      : "",
                    transition: "all 0.3s",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddMeal(meal.title);
                  }}
                >
                  {addedMeals.has(meal.title) ? <BsCheck /> : "Add"}
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="generate-btn"
          onClick={onHide}
          variant="outline-success"
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddMealModal;
