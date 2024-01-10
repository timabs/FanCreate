import React, { useState, useEffect } from "react";
import "./ResponsiveChat"; // Import your stylesheet

export default function ChatStartupScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    // Clear the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={
        isVisible
          ? "on-open-screen d-flex justify-content-center align-items-center show"
          : "on-open-screen d-flex justify-content-center align-items-center"
      }
    >
      <h4 className="msg-title">Hello</h4>
    </div>
  );
}
