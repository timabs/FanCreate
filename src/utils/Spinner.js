import React from "react";

export default function CustomSpinner({ style, loadingType }) {
  return (
    <div
      className={`spinner-border text-dark ${loadingType ? "" : "d-none"}`}
      role="status"
      style={style}
    >
      <span className="visually-hidden" style={{ borderRadius: "0.5rem" }}>
        Loading...
      </span>
    </div>
  );
}
