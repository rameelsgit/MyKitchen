import React, { useState, useEffect } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { Container, Button, Row, Col } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import { useFavorites } from "../context/hooks/useFavorites";
import AddMealModal from "../components/AddMealModal";
import { TbTrashX } from "react-icons/tb";
import { BsCalendar3 } from "react-icons/bs";
import BackArrow from "../components/BackArrow";
import { Link } from "react-router-dom";
import { scale } from "../utils/scalingUtils";

interface MealPlan {
  [key: string]: { id: string; title: string }[];
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
        console.error("Error parsing meal plan from localStorage:", error);
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

  const handleSelectMeal = (mealTitle: string, mealId: string) => {
    if (!selectedDate) return;

    const dateKey = format(selectedDate, "yyyy-MM-dd");

    setMealPlan((prev) => {
      const updatedMealPlan = { ...prev };
      if (!updatedMealPlan[dateKey]) {
        updatedMealPlan[dateKey] = [{ title: mealTitle, id: mealId }];
      } else if (!updatedMealPlan[dateKey].some((meal) => meal.id === mealId)) {
        updatedMealPlan[dateKey].push({ title: mealTitle, id: mealId });
      }
      return updatedMealPlan;
    });
  };

  const handleRemoveMeal = (date: Date, mealId: string) => {
    const dateKey = format(date, "yyyy-MM-dd");
    setMealPlan((prev) => {
      const updatedMealPlan = { ...prev };
      updatedMealPlan[dateKey] = updatedMealPlan[dateKey]?.filter(
        (meal) => meal.id !== mealId
      );
      return updatedMealPlan;
    });
  };

  return (
    <Container
      className="mt-5 calendar-page"
      style={{ maxWidth: "900px", margin: "0 auto" }}
    >
      <BackArrow />
      <h2
        className="text-center"
        style={{
          fontSize: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BsCalendar3
          size={parseFloat(scale(25))}
          style={{ marginRight: scale(10), margin: scale(13) }}
        />
        Calendar
      </h2>

      <div className="mt-4">
        {dates.map((date) => {
          const dateKey = format(date, "yyyy-MM-dd");
          return (
            <Row
              key={dateKey}
              className="align-items-center py-3 border-bottom"
              style={{
                marginBottom: scale(13),
                fontSize: scale(19),
                padding: scale(15),
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: scale(8),
              }}
            >
              <Col xs={2} className="text-center">
                <div
                  style={{
                    width: scale(50),
                    height: scale(50),
                    backgroundColor:
                      dateKey === format(new Date(), "yyyy-MM-dd")
                        ? "#dc5d4d"
                        : "#ddd",
                    color: "#fff",
                    borderRadius: "25%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: scale(19),
                  }}
                >
                  {format(date, "EEE")}
                </div>
              </Col>
              <Col xs={8}>
                <div>
                  <strong style={{ fontSize: scale(19) }}>
                    {format(date, "dd MMM yyyy")}
                  </strong>
                  <ul className="mt-2">
                    {mealPlan[dateKey]?.map((meal) => (
                      <li
                        key={meal.id}
                        className="d-flex justify-content-between mb-2 meal-item"
                        style={{
                          fontSize: scale(17),
                        }}
                      >
                        <span>
                          <Link
                            to={`/recipe/${meal.id}`}
                            style={{
                              textDecoration: "none",
                              color: "inherit",
                            }}
                          >
                            {meal.title}
                          </Link>
                        </span>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveMeal(date, meal.id)}
                          style={{
                            flexShrink: 0,
                            minWidth: scale(35),
                            height: scale(35),
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginLeft: scale(10),
                          }}
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
                  style={{
                    minWidth: scale(35),
                    height: scale(35),
                    fontSize: scale(19),
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
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
        onAddMeal={(mealTitle, mealId) => handleSelectMeal(mealTitle, mealId)}
        favorites={favorites.map((meal) => ({
          id: meal.id.toString(),
          title: meal.title,
        }))}
      />
    </Container>
  );
};

export default CalendarPage;
