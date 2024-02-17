//react redux
import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ChatContext, ChatProvider } from "./ResponsiveChat/ChatContext";
//css
import "./css/index.css";
import "./css/custom.scss";
import "./ActiveUsers/ActiveUsers.css";
//React bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
//custom components
import Chat from "./ResponsiveChat/ResponsiveChat";
import "./ResponsiveChat/ResponsiveChat.scss";
import ContactsPage from "./Contacts/ContactsPage";
import AddContactsForm from "./AddContacts/AddContactsForm";
import MessagesScreen from "./Messages/MessagesScreen";
import { ImageProvider } from "./ImageHandling/ImageContext";
import ActiveUsers from "./ActiveUsers/ActiveUsers";
import Tools from "./Tools/Tools";
import LoginSignupModal from "./LoginSignUpModal/LoginSignUpModal";
//redux actions
import { setActiveScreen } from "./redux/active";
import useActiveScreen from "./CustomHooks/useActiveScreen";
import axios from "axios";
import { setLoggedIn, setUsername } from "./redux/auth";
import { logoutUser } from "./redux/actions";
import { ConfigProvider } from "antd";
import GroupChat from "./Contacts/GroupChat/GroupChatContactScreen";
import Footer from "./GeneralComponents/Footer/Footer";
import ContactPage from "./GeneralComponents/ContactMe/ContactMePage";
import HomePage from "./GeneralComponents/HomePage/HomePage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import InfoPage from "./Info";
const apiUrl = "https://fancreate-backend.onrender.com";

export function NavBar() {
  const [isOpen, setOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 560);
  const isGlobalLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const username = useSelector((state) => state.auth.username);
  const handleClick = () => {
    setOpen(!isOpen);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logoutUser());
    dispatch(setUsername(""));
  };
  const dispatch = useDispatch();
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.post(
            `${apiUrl}/api/v1/auth/validate-token`,
            {
              token,
            },
            {
              withCredentials: true,
            }
          );
          if (response.data.valid) {
            dispatch(setLoggedIn(true));
            dispatch(setUsername(response.data.userData.username));
          } else {
            localStorage.removeItem("token");
            dispatch(logoutUser());
          }
        } catch (error) {
          console.error("Error validating token:", error);
          // localStorage.removeItem("token");
          dispatch(logoutUser());
        }
      }
    };
    validateToken();
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 560);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <Container fluid>
      <Row>
        <Col>
          {!isGlobalLoggedIn ? (
            <button
              className={`btn btn-dark user-banner ${
                isLargeScreen ? `position-absolute` : "mt-2"
              }`}
              onClick={() => handleClick()}
            >
              <span
                style={{
                  color: "white",
                }}
              ></span>
              Login/Signup
            </button>
          ) : (
            <div
              className={`user-banner welcome ${
                isLargeScreen ? `position-absolute` : "mt-2"
              }`}
            >
              <span>Welcome, {username}! </span>

              <button
                className="btn btn-primary "
                onClick={handleLogout}
                style={{ color: "white" }}
              >
                Logout
              </button>
            </div>
          )}
          <h1
            className="text-center text-dark p-3 main-title"
            style={{ fontSize: "4rem" }}
          >
            FanCreate{" "}
            <i
              className="text-center text-warning"
              style={{ fontSize: "1rem" }}
            >
              Open Beta
            </i>
            <div className="info-div" onClick={() => setInfoOpen(!infoOpen)}>
              i
            </div>
            <div
              className="info-card"
              style={{ opacity: `${infoOpen ? "1" : "0"}` }}
            >
              This site is still constantly being worked on but I am just one
              developer :) If you find any bugs, please don't hesitate to use
              the contact page or email at morseylane@gmail.com. I still plan on
              adding the social media and home/lock screens/notification
              generators. Eventually I want to make a standalone downloadable
              mobile app but that's a long term goal as it's a completely
              separate skillset.{" "}
              <Link to="/info" id="known-issues">
                Known Issues as of 2/17/24
              </Link>
            </div>
          </h1>

          <LoginSignupModal isOpen={isOpen} setOpen={setOpen} />
        </Col>
      </Row>
    </Container>
  );
}

function ChatWrapper() {
  const { chatRef } = useContext(ChatContext);
  return (
    <div
      className="chat-wrapper col-lg-8 justify-content-center col-md-8 col-xxl-6"
      style={{ height: "100%" }}
      ref={chatRef}
    >
      <AddContactsForm />
      <GroupChat />
      <ContactsPage />
      <Chat />
      <MessagesScreen />
    </div>
  );
}

function RightSidebar() {
  const dispatch = useDispatch();
  const { triggerCapture, imgsDownloading } = useContext(ChatContext);
  const activeScreen = useActiveScreen();
  const toggleScreen = (screenName) => {
    if (activeScreen !== screenName) {
      dispatch(setActiveScreen(screenName));
    } else {
      dispatch(setActiveScreen(null));
    }
  };

  return (
    <Col
      lg={2}
      md={2}
      xxl={3}
      className="d-grid align-items-end mb-5 texters-col"
      style={{ paddingLeft: "0.5rem", justifyItems: "center" }}
    >
      <i
        className={`fa-solid fa-download mb-2 ${
          imgsDownloading ? "bounce" : ""
        }`}
        role="button"
        onClick={triggerCapture}
      ></i>
      <div
        className={`right-side-div texters bg-dark d-flex justify-content-center align-items-center mb-2
        ${activeScreen === "messages" ? "indicator" : ""}
        `}
        style={{ width: "2vw", height: "2vw", borderRadius: "50%" }}
        onClick={() => {
          toggleScreen("messages");
        }}
      >
        <i
          className="fa-solid fa-inbox text-light"
          style={{ fontSize: "1.25vw" }}
        ></i>
      </div>
      <div
        className={`right-side-div texters bg-dark d-flex justify-content-center align-items-center
        ${activeScreen === "contacts" ? "indicator" : ""}
        `}
        style={{ width: "2vw", height: "2vw", borderRadius: "50%" }}
        onClick={() => {
          toggleScreen("contacts");
        }}
      >
        <i
          className="fa-solid fa-address-book text-light"
          style={{ fontSize: "1.25vw" }}
        ></i>
      </div>
    </Col>
  );
}

export function BodySection({ uploadedImage, uploadedImages }) {
  // const { chatRef } = useContext(ChatContext);

  return (
    <Container
      fluid
      className="bodysec bg-info mx-0"
      style={{ width: "80%" }}
      // onKeyDown={(e) => handleKeyDown(e)}
      // tabIndex={0}
    >
      <Row className="tools-chat-row">
        <Tools />
        <Col
          className="p-2 d-flex align-items-center justify-content-center chatwrap-wrapper"
          md={7}
          lg={6}
          sm={12}
        >
          <Col
            style={{ width: "100%", height: "90%" }}
            className="d-flex chat-align-wrapper"
            sm={12}
            md={12}
          >
            <ActiveUsers
              uploadedImages={
                uploadedImage
                  ? [uploadedImage, ...uploadedImages]
                  : uploadedImages
              }
            />

            <ChatWrapper />
            <RightSidebar />
          </Col>
        </Col>
      </Row>
    </Container>
  );
}

function App() {
  return (
    <Router>
      <ConfigProvider
        theme={{
          components: {
            Slider: {
              dotActiveBorderColor: "#6d21c4",
              dotBorderColor: "#d14ea5",
              dotSize: 6,
              handleActiveColor: "#3204a3",
              handleColor: "#d14ea5",
              trackBg: "#d14ea5",
              trackHoverBg: "#3204a3",
            },
          },
        }}
      >
        <Provider store={store}>
          <ImageProvider>
            <ChatProvider>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/info" element={<InfoPage />} />
              </Routes>
              <Footer />
            </ChatProvider>
          </ImageProvider>
        </Provider>
      </ConfigProvider>
    </Router>
  );
}

export default App;
