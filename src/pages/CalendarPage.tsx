import React, { useState, useEffect } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { Container, Button, Row, Col } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import { useFavorites } from "../context/FavoritesContext";
import AddMealModal from "../components/AddMealModal";
import { TbTrashX } from "react-icons/tb";

interface MealPlan {
  [key: string]: string[];
}

const CalendarPage: React.FC = () => {
  const [dates, setDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [mealPlan, setMealPlan] = useState<MealPlan>({});

  const { favorites } = useFavorites();

  useEffect(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    setDates(days);
  }, []);

  useEffect(() => {
    const savedMealPlan = localStorage.getItem("mealPlan");
    if (savedMealPlan) {
      try {
        const parsedMealPlan: MealPlan = JSON.parse(savedMealPlan);
        setMealPlan(parsedMealPlan);
      } catch (error) {
        console.error("Error parsing meal plaan from localStorage:", error);
      }
    } else {
      setMealPlan({});
    }
  }, []);

  useEffect(() => {
    if (Object.keys(mealPlan).length === 0) {
      return;
    }
    try {
      localStorage.setItem("mealPlan", JSON.stringify(mealPlan));
    } catch (error) {
      console.error("Error saving meal plan to localStorage:", error);
    }
  }, [mealPlan]);

  const handleAddMeal = (date: Date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDate(null);
  };

  const handleSelectMeal = (mealTitle: string) => {
    if (!selectedDate) return;

    const dateKey = format(selectedDate, "yyyy-MM-dd");

    setMealPlan((prev) => {
      const updatedMealPlan = { ...prev };
      if (!updatedMealPlan[dateKey]) {
        updatedMealPlan[dateKey] = [mealTitle];
      } else if (!updatedMealPlan[dateKey].includes(mealTitle)) {
        updatedMealPlan[dateKey].push(mealTitle);
      }
      return updatedMealPlan;
    });
  };

  const handleRemoveMeal = (date: Date, mealTitle: string) => {
    const dateKey = format(date, "yyyy-MM-dd");
    setMealPlan((prev) => {
      const updatedMealPlan = { ...prev };
      updatedMealPlan[dateKey] = updatedMealPlan[dateKey]?.filter(
        (meal) => meal !== mealTitle
      );
      return updatedMealPlan;
    });
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Calendar</h2>
      <div className="mt-4">
        {dates.map((date) => {
          const dateKey = format(date, "yyyy-MM-dd");
          return (
            <Row
              key={dateKey}
              className="align-items-center py-2 border-bottom"
            >
              <Col xs={2} className="text-center">
                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    backgroundColor:
                      dateKey === format(new Date(), "yyyy-MM-dd")
                        ? "#dc5d4d"
                        : "#ddd",
                    color: "#fff",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {format(date, "EEE")}
                </div>
              </Col>
              <Col xs={8}>
                <div>
                  <strong>{format(date, "dd MMM yyyy")}</strong>
                  <ul className="mt-2">
                    {mealPlan[dateKey]?.map((meal, index) => (
                      <li
                        key={index}
                        className="d-flex justify-content-between mb-2 meal-item"
                      >
                        <span>{meal}</span>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveMeal(date, meal)}
                        >
                          <TbTrashX />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
              <Col xs={2} className="text-center">
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleAddMeal(date)}
                >
                  <BsPlus />
                </Button>
              </Col>
            </Row>
          );
        })}
      </div>

      <AddMealModal
        show={showModal}
        onHide={handleCloseModal}
        onAddMeal={handleSelectMeal}
        favorites={favorites}
      />
    </Container>
  );
};

export default CalendarPage;
