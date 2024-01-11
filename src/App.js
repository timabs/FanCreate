//react redux
import React, { useState, useEffect, useContext } from "react";
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
const apiUrl = "https://fancreate-backend.onrender.com";

function NavBar() {
  const [isOpen, setOpen] = useState(false);
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
            <div className="user-banner welcome">
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
            FanCreate
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
      //ref={chatRef}
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
  const { triggerCapture } = useContext(ChatContext);
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
        class="fa-solid fa-download mb-2"
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
          class="fa-solid fa-inbox text-light"
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

//Main section including tools and message component
// class BodySection extends React.Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {

//     const { uploadedImage, uploadedImages } = this.props;
//     return (
//       <Container
//         fluid
//         className="bodysec bg-info mx-0"
//         style={{ width: "80%" }}
//         onKeyDown={(e) => handleKeyDown(e)}
//       >
//         <Row className="tools-chat-row">
//           <Tools />
//           <Col
//             className="p-2 d-flex align-items-center justify-content-center chatwrap-wrapper"
//             md={7}
//             lg={6}
//             sm={12}
//           >
//             <Col
//               style={{ width: "100%", height: "90%" }}
//               className="d-flex chat-align-wrapper"
//               sm={12}
//               md={12}
//             >
//               <ActiveUsers
//                 uploadedImages={
//                   uploadedImage
//                     ? [uploadedImage, ...uploadedImages]
//                     : uploadedImages
//                 }
//               />
//               <ChatProvider>
//                 <ChatWrapper />
//                 <RightSidebar />
//               </ChatProvider>
//             </Col>
//           </Col>
//         </Row>
//       </Container>
//     );
//   }
// }

function BodySection({ uploadedImage, uploadedImages }) {
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
    //config provider is for antd design tokens
    <ConfigProvider
      theme={{
        // token: {
        //   colorPrimary: "#a457fe",
        // },
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
            <Container
              fluid
              className="d-flex justify-content-center align-items-center"
              style={{ flexDirection: "column", width: "100vw" }}
            >
              <NavBar />

              <BodySection />
            </Container>
          </ChatProvider>
        </ImageProvider>
      </Provider>
    </ConfigProvider>
  );
}

export default App;
