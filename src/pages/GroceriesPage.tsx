import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import {
  doc,
  onSnapshot,
  updateDoc,
  setDoc,
  arrayUnion,
} from "firebase/firestore";
import { Button, Form, Row, Col, ListGroup } from "react-bootstrap";
import { RiDeleteBin2Fill, RiShoppingBag4Line } from "react-icons/ri";
import BackArrow from "../components/BackArrow";

interface GroceryItem {
  id: number;
  item: string;
  checked: boolean;
}

const GroceriesPage: React.FC = () => {
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);
  const [newItem, setNewItem] = useState<string>("");

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const groceryDoc = doc(db, "groceryLists", user.uid);

    const unsubscribe = onSnapshot(groceryDoc, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setGroceryList(docSnapshot.data()?.items || []);
      } else {
        setDoc(groceryDoc, { items: [] })
          .then(() => {
            setGroceryList([]);
          })
          .catch((error) => {
            console.error("Error creating grocery list: ", error);
          });
      }
    });

    return () => unsubscribe();
  }, [user]);

  const addNewItem = async () => {
    if (!newItem.trim()) return;

    const newGroceryItem = {
      id: Date.now(),
      item: newItem,
      checked: false,
    };

    const updatedList = [...groceryList, newGroceryItem];
    setGroceryList(updatedList);

    if (user) {
      const groceryDoc = doc(db, "groceryLists", user.uid);
      await updateDoc(groceryDoc, {
        items: arrayUnion(newGroceryItem),
      });
    }

    setNewItem("");
  };

  const toggleItemCheck = (id: number) => {
    const updatedList = groceryList.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );

    setGroceryList(updatedList);

    if (user) {
      const groceryDoc = doc(db, "groceryLists", user.uid);
      updateDoc(groceryDoc, { items: updatedList });
    }
  };

  const clearAllItems = async () => {
    if (!user) return;

    const groceryDoc = doc(db, "groceryLists", user.uid);
    await updateDoc(groceryDoc, { items: [] });
    setGroceryList([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addNewItem();
    }
  };

  return (
    <div
      className="groceries-page container mt-5"
      style={{ maxWidth: "900px", margin: "0 auto" }}
    >
      <BackArrow />
      <h2 className="text-center" style={{ fontSize: "2rem" }}>
        <RiShoppingBag4Line
          size={30}
          style={{ marginTop: -15, marginRight: "5px" }}
        />
        Groceries
      </h2>
      <Row className="mb-3">
        <Col xs={9} sm={10}>
          <Form.Control
            type="text"
            placeholder="Add a new item"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyPress}
            className="mb-3"
          />
        </Col>
        <Col xs={3} sm={2}>
          <Button variant="primary" className="w-100" onClick={addNewItem}>
            Add
          </Button>
        </Col>
      </Row>

      {groceryList.length > 0 && (
        <ListGroup className="grocery-list">
          {groceryList.map((item) => (
            <ListGroup.Item
              key={item.id}
              className={`grocery-item d-flex align-items-center mb-3 ${
                item.checked ? "checked" : ""
              }`}
              style={{ padding: "10px" }}
            >
              <div className="d-flex align-items-center w-100">
                <input
                  type="checkbox"
                  checked={item.checked || false}
                  onChange={() => toggleItemCheck(item.id)}
                  className="custom-checkbox me-3"
                  style={{ flexShrink: 0 }}
                />
                <span className="grocery-item-text text-wrap w-100">
                  {item.item}
                </span>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {groceryList.length > 0 && (
        <div className="clear-all-container mt-3 mb-4">
          <Button
            variant="danger"
            onClick={clearAllItems}
            className="w-100 d-flex align-items-center justify-content-center"
          >
            <RiDeleteBin2Fill className="mr-2" size={20} />
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

export default GroceriesPage;
