import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {
  addUserToConvo,
  changeAddUserMode,
  createConversation,
  setActiveConvo,
} from "../redux/messages";
import { setActiveScreen } from "../redux/active";
import useActiveConvo from "../CustomHooks/activeConvosHooks";
import {
  clearContactToEdit,
  clearRecentlyEdited,
  deleteContact,
  fetchContacts,
  setContactToEdit,
} from "../redux/contacts";
import "./ContactsPage.css";
import useLoggedIn from "../CustomHooks/checkLoggedIn";
import { deleteImgFromCloud, getCloudinaryImgId } from "../utils/cloudinary";
import { useDebounce } from "../CustomHooks/useDebounce";
export default function ContactsPage() {
  const contactsScreenOpen = useSelector((state) => state.active.activeScreen);
  const contacts = useSelector((state) => state.contacts.contactsArr);
  const contactSuccess = useSelector((state) => state.contacts.contactSuccess);
  const dispatch = useDispatch();
  const addUsersMode = useSelector((state) => state.messages.addUsersMode);
  //state for checked contacts
  const [areAnyChecked, setAnyChecked] = useState(false);
  const [checkedIndices, setCheckedIndices] = useState(new Set());
  //hook to get actives
  const activeConversation = useActiveConvo();
  const checkLoggedIn = useLoggedIn();
  const contactsClass =
    contactsScreenOpen === "contacts"
      ? "contacts-page chat-pages"
      : "d-none contacts-page chat-pages";

  const handleCheckChange = (index) => {
    setCheckedIndices((currentIndices) => {
      // Create a new Set to avoid mutating state directly
      const newIndices = new Set(currentIndices);
      if (newIndices.has(index)) {
        newIndices.delete(index);
      } else {
        newIndices.add(index);
      }
      return newIndices;
    });
  };
  useEffect(() => {
    dispatch(fetchContacts());
  }, [checkLoggedIn, dispatch]);
  useEffect(() => {
    setAnyChecked(checkedIndices.size > 0);
  }, [checkedIndices]);

  const handleDone = async () => {
    const initialParticipant = {
      first: "me",
      pfp: null,
      defaultTexter: true,
      _id: "1",
    };
    const selected = Array.from(checkedIndices).map((index) => contacts[index]);
    const allParticipants = [initialParticipant, ...selected];
    let newConvoId;
    let updatedParticipants =
      addUsersMode === "add-to-existing"
        ? new Set(activeConversation?.participants?.map((p) => p._id))
        : new Set();
    // addUsersMode === "add-to-existing" &&
    if (!activeConversation || addUsersMode !== "add-to-existing") {
      const newConvoResponse = await dispatch(
        createConversation({
          participants: allParticipants,
        })
      );

      if (createConversation.fulfilled.match(newConvoResponse)) {
        newConvoId = newConvoResponse.payload._id;
        await dispatch(
          setActiveConvo({
            conversationId: newConvoId,
          })
        );
      }
    }

    // Wait for all addUserToConvo dispatches to complete
    if (addUsersMode === "add-to-existing") {
      await Promise.all(
        selected.map(async (contact) => {
          if (!updatedParticipants.has(contact._id)) {
            await dispatch(
              addUserToConvo({
                conversationId:
                  addUsersMode === "add-to-existing"
                    ? activeConversation?._id
                    : newConvoId,
                contact: contact,
              })
            );
            updatedParticipants.add(contact._id);
          }
        })
      );
    }

    setCheckedIndices(new Set());
    dispatch(clearRecentlyEdited());
    dispatch(clearContactToEdit());
    dispatch(setActiveScreen(null));
    dispatch(changeAddUserMode(null));
  };
  const debouncedHandleDone = useDebounce(handleDone, 1000);

  const handleDelete = (contact) => {
    dispatch(deleteContact({ contactId: contact._id }));
    const pfpId = getCloudinaryImgId(contact.pfp);
    deleteImgFromCloud(pfpId);
  };
  const handleEdit = (contact) => {
    dispatch(setContactToEdit(contact));
    dispatch(setActiveScreen("add-contact"));
  };

  return (
    <div className={contactsClass}>
      <Row>
        <h2
          style={{ fontFamily: "Apple", fontWeight: "bold" }}
          className="contacts-header mb-0 p-2 text-dark fs-1"
        >
          Contacts
        </h2>
      </Row>
      {contacts?.map((contact, index) => (
        <Row
          key={index}
          className="bg-dark contact-row p-2"
          style={{ width: "100%" }}
        >
          <Col
            lg={2}
            sm={2}
            className="contact-col d-flex justify-content-center align-items-center p-0"
          >
            <img
              src={contact.pfp ? contact.pfp : "/among-us.jpg"}
              className="contact-pfp"
              alt={`Contact "${contact.first}"'s profile pic`}
            ></img>
          </Col>
          <Col className="contact-col d-flex justify-content-left align-items-center p-0 gap-2 col-7">
            <span className="text-info">
              {contact.first} {contact.last}
            </span>
          </Col>
          <Col className="contact-col-buttons d-flex justify-content-center align-items-center p-0 gap-2 col-3">
            <span
              style={{ height: "16px", width: "16px", position: "relative" }}
              className="contact-button-wrapper"
            >
              <input
                type="checkbox"
                id={`custom-checkbox-${index}`}
                className="custom-checkbox-input"
                onChange={() => handleCheckChange(index)}
                checked={checkedIndices.has(index)}
              />
              <label
                htmlFor={`custom-checkbox-${index}`}
                className="custom-checkbox-label"
              ></label>
            </span>
            <span
              className="contact-button-wrapper"
              onClick={() => handleDelete(contact)}
            >
              <img
                className="contact-button"
                src="./light-delete.png"
                alt="Delete contact button"
              ></img>
            </span>
            <span
              className="contact-button-wrapper"
              onClick={() => handleEdit(contact)}
            >
              <img
                className="contact-button"
                src="./edit-button.png"
                alt="Edit contact button"
              ></img>
            </span>
          </Col>
        </Row>
      ))}
      <Button
        className={`btn-danger ${areAnyChecked ? "" : "d-none"}`}
        style={{ width: "25%", position: "absolute", bottom: "2%" }}
        onClick={() => debouncedHandleDone()}
      >
        <span className="text-dark done-add-button">Done</span>
      </Button>
      <div
        className={`contact-added bg-success ${
          contactSuccess ? "d-block animate" : "d-none"
        }`}
      >
        Contact Added!
      </div>
    </div>
  );
}
