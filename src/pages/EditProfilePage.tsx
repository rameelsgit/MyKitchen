import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Container, Button, Form, Alert, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { FaUserEdit } from "react-icons/fa";

const EditProfile: React.FC = () => {
  const { user, setDisplayName, updateUserPassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [displayName, setDisplayNameState] = useState<string>(
    user?.displayName || ""
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!currentPassword || !newPassword) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      if (user) {
        const credential = EmailAuthProvider.credential(
          user.email!,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);
        await updateUserPassword(newPassword);
        setSuccess("Password has been successfully updated!");
        toast.success("Password has been updated!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      if (
        error instanceof Error &&
        error.message.includes("auth/invalid-credential")
      ) {
        setError("The current password is incorrect. Please try again.");
        toast.error("The current password is incorrect.");
      } else {
        setError("Failed to update password.");
        toast.error("Failed to update password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDisplayNameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await setDisplayName(displayName);
      setSuccess("Display name has been successfully updated!");
      toast.success("Display name has been updated!");
    } catch {
      setError("Failed to update name.");
      toast.error("Failed to update name.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5 text-center">
      <h2>
        <FaUserEdit size={30} style={{ marginRight: "15px" }} />
        Edit Profile
      </h2>

      {success && <Alert variant="success">{success}</Alert>}

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-3">
        <Col md={6}>
          <Form onSubmit={handleDisplayNameChange}>
            <Form.Group className="mb-3" controlId="formDisplayName">
              <Form.Label>Display Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a new display name"
                value={displayName}
                onChange={(e) => setDisplayNameState(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              variant="success"
              type="submit"
              className="generate-btn w-100"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Display Name"}
            </Button>
          </Form>
        </Col>

        <Col md={1}>
          <div
            style={{
              borderLeft: "2px solid #ddd",
              height: "100%",
              margin: "0 15px",
            }}
          ></div>
        </Col>

        <Col md={5}>
          <Form onSubmit={handlePasswordUpdate}>
            <Form.Group className="mb-3" controlId="formCurrentPassword">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formNewPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              variant="success"
              type="submit"
              className="w-100 generate-btn"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProfile;
