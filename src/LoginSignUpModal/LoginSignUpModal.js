import React, { useState } from "react";
import "./LoginSignUpModal.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoggedIn, setUsername } from "../redux/auth";
const apiUrl = "https://fancreate-backend.onrender.com";

const LoginSignupModal = ({ isOpen, setOpen }) => {
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const clearFormData = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };
  const userErrors = {
    noUser: "Username cannot be blank",
    userTooShort: "Username must be at least 3 characters",
    userTooLong: "Username max length is 12 characters",
    chars: "Username can only contain characters: Aa-Zz, 0-9",
    exists: "Username already exists",
  };
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = async (e) => {
    //validation logic
    const validateUsername = (username) => {
      if (username.length < 3)
        return "Username must be at least 3 characters long.";
      if (username.length > 15)
        return "Username must be no longer than 15 characters.";
      if (!/^[A-Za-z0-9_-]+$/.test(username))
        return "Username can only contain letters, numbers, underscores, and dashes.";
      if (/^\d+$/.test(username)) return "Username cannot be entirely numeric.";
      return "";
    };

    const validatePassword = (password) => {
      if (password.length < 8)
        return "Password must be at least 8 characters long.";
      if (password.length > 25)
        return "Password must be no longer than 25 characters.";
      if (!/[A-Z]/.test(password))
        return "Password must contain at least one uppercase letter.";
      if (!/[a-z]/.test(password))
        return "Password must contain at least one lowercase letter.";
      if (!/\d/.test(password))
        return "Password must contain at least one number.";
      if (!/[!@#$%^&*()-_+=]/.test(password))
        return "Password must contain at least one special character (!@#$%^&*()-_+=).";
      return "";
    };

    e.preventDefault();
    setErrorMessage("");
    if (!isLogin) {
      const usernameError = validateUsername(formData.username);
      if (usernameError) {
        setErrorMessage(usernameError);
        return;
      }

      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        setErrorMessage(passwordError);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }
      try {
        const response = await axios.post(
          `${apiUrl}/api/v1/auth/register`,
          formData,
          { withCredentials: true }
        );
        localStorage.setItem("token", response.data.token);
        setOpen(false);
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        dispatch(setLoggedIn(true));
        dispatch(setUsername(response.data.user.username));
      } catch (error) {
        console.error("Registration error:", error);
        setErrorMessage(error.response.data.msg || "Error registering");
      }
    } else {
      //login implementation
      e.preventDefault();
      try {
        const response = await axios.post(
          `${apiUrl}/api/v1/auth/login`,
          formData,
          { withCredentials: true }
        );
        localStorage.setItem("token", response.data.token);
        setOpen(false);
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        dispatch(setLoggedIn(true));
        dispatch(setUsername(response.data.user.username));
      } catch (error) {
        console.error("Login error:", error);
        setErrorMessage(error.response.data.message || "Error logging in");
      }
    }
  };
  const handleInputChange = (e) => {
    //change relevant field while maintaining data of other fields
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    isOpen && (
      <div className="modal-overlay-1">
        <div className="modal-1">
          <button onClick={onClose} className="close-button">
            &times;
          </button>
          <div className="modal-header-1">
            <h2>{isLogin ? "Login" : "Sign Up"}</h2>
            <h3 className="login-info-banner">Login to save your work</h3>
          </div>
          <div className="modal-body-1">
            {isLogin ? (
              <form className="form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Username"
                  onChange={handleInputChange}
                  name="username"
                  value={formData.username}
                />
                <input
                  type="password"
                  placeholder="Password"
                  onChange={handleInputChange}
                  name="password"
                  value={formData.password}
                />
                <button type="submit">Login</button>
              </form>
            ) : (
              <form className="form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  onChange={handleInputChange}
                  value={formData.username}
                />
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  onChange={handleInputChange}
                  value={formData.email}
                />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={handleInputChange}
                  value={formData.password}
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  onChange={handleInputChange}
                  value={formData.confirmPassword}
                />
                <button type="submit">Sign Up</button>
              </form>
            )}
            {errorMessage && (
              <p
                className="error-message"
                style={{ color: "red", alignSelf: "center" }}
              >
                {errorMessage}
              </p>
            )}
          </div>
          <div className="modal-footer-1">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                clearFormData();
              }}
            >
              {isLogin ? "Need an account? Sign Up" : "Have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default LoginSignupModal;
