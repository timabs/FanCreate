import React from "react";
import { Link } from "react-router-dom";

export default function AccessibilityPage() {
  return (
    <div className="contact-page-wrapper">
      <h1 class="text-center text-dark p-3 main-title-contact">
        Accessibility
      </h1>
      <p className="px-5 m-0" style={{ lineHeight: "2.5rem" }}>
        I strive to promote an accessible and inclusive community, both
        technologically and socially. I am actively working to make this site as
        accessible for a wide range of disabilities and needs as possible, but
        it is under construction and may still include bugs or features that
        need ironing out. I understand that no disabled person should have to
        put in extra work to access the same resources as others, but if you'd
        like to point out concerns or make requests, I'd love to hear you via
        email at timur.abd.nyc@gmail.com or using my{" "}
        <Link to="/contact">contact page</Link>. The end goal of this website is
        to reach full industry-standard accessibility requirements including
        meeting the needs of sensory, mobility and cognitive disabilities.
      </p>
    </div>
  );
}
