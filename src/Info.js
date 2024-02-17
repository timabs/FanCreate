import React from "react";
import "./Info.css";
export default function InfoPage() {
  return (
    <div className="info-p-wrap">
      <p className="info-p">
        <span className="info-headers">Known bugs:</span> <br />
        - Can't save a background image when there's no active conversation
        <br />
        - Weird cut offs when using bulk download for chats
        <br />
        <span className="info-headers">Coming soon:</span>
        <br /> - Accessibility, Privacy Policy, Terms
        <br />
        - ? for tutorial <br />
        - Change Password modal <br />
        - profile/dashboard that allows you to save images and assets
        <br />
        - Plans to make a downloadable mobile app. Really long term goal <br />
        - Social Media Generator
        <br />
        - Home/Lock Screens with notifications generator
        <br />- More emojis to choose from
      </p>
    </div>
  );
}
