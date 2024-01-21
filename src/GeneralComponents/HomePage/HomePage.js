import React from "react";
import { Container } from "react-bootstrap";
import { BodySection, NavBar } from "../../App";

export default function HomePage() {
  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center whole-page-container"
      style={{ flexDirection: "column", width: "100vw" }}
    >
      <NavBar />
      <BodySection />
    </Container>
  );
}
