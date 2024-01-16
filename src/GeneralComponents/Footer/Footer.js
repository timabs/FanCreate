import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="footer-container">
      <div className="d-flex align-items-center">
        <Link to="/contact" className="mt-3 footer-labels">
          Contact/Report a bug
        </Link>
      </div>
      <p></p>
      <p></p>
    </div>
  );
}
