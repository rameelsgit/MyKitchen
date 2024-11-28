import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FirebaseError } from "firebase/app";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";

interface LoginCredentials {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const onLoginSubmit: SubmitHandler<LoginCredentials> = async (data) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      toast.success("Logged in successfully!");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log("Firebase Error Code:", error.code);
        switch (error.code) {
          case "auth/wrong-password":
            toast.error("Wrong password. Please try again");
            break;
          case "auth/user-not-found":
            toast.error("The e-mail was not found!");
            break;
          case "auth/invalid-email":
            toast.error("Invalid e-mail. Please try again.");
            break;
          case "auth/too-many-requests":
            toast.error("Too many failed attempts. Try again later!");
            break;
          default:
            toast.error("Something went wrong. Try again!");
        }
      } else {
        toast.error("Unexpected error. Try again.");
      }
    }
    setIsSubmitting(false);
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Login</h2>
      <Form onSubmit={handleSubmit(onLoginSubmit)} className="w-50 mx-auto">
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            {...register("email", { required: "E-mail is required" })}
          />
          {errors.email && <p className="invalid">{errors.email.message}</p>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p className="invalid">{errors.password.message}</p>
          )}
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="w-100"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </Button>
      </Form>

      <div className="text-center mt-3">
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </Container>
  );
};

export default Login;
