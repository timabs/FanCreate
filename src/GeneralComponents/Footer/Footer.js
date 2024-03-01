import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="footer-container">
      <div className="d-flex align-items-center gap-2">
        <Link to="/" className="mt-3 footer-labels">
          Home
        </Link>{" "}
        <span className="mt-3">|</span>
        <Link to="/contact" className="mt-3 footer-labels">
          Contact/Report a bug
        </Link>{" "}
        <span className="mt-3">|</span>
        <Link to="/tos" className="mt-3 footer-labels">
          Terms of Service
        </Link>{" "}
        <span className="mt-3">|</span>
        <Link to="/accessibility" className="mt-3 footer-labels">
          Accessibility
        </Link>{" "}
        <span className="mt-3">|</span>
        <Link to="/privpolicy" className="mt-3 footer-labels">
          Privacy Policy
        </Link>{" "}
      </div>
      <p></p>
      <p></p>
    </div>
  );
}
