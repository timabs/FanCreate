import React from "react";
import "./ContactPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGithub,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import ContactForm from "./ContactForm";
export default function ContactPage() {
  return (
    <div className="contact-page-wrapper">
      <h1 class="text-center text-dark p-3 main-title-contact">Contact Me</h1>
      <div className="socials">
        <div className="socials-label">Socials: </div>
        <div className="twitter">
          <a
            href="https://twitter.com/timabsNYC"
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faTwitter} />
          </a>
        </div>
        <div className="github">
          <a href="https://github.com/timabs/" target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faGithub} />
          </a>
        </div>
        <div className="youtube">
          <a
            href="https://www.youtube.com/channel/UCk6gaELACwZZQQlWjdUBJxw"
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faYoutube} />
          </a>
        </div>
      </div>
      <p>
        If reporting a bug, please be as specific as possible about the steps
        you took to get the bug :) Suggestions are also welcome
      </p>
      <ContactForm />
    </div>
  );
}
