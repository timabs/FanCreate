import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../css/index.css";
import "../css/custom.scss";
import { Form } from "react-bootstrap";
import ImageUploader from "../ImageHandling/ImageUploader";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
//redux actions
import {
  editContact,
  clearContactToEdit,
  createContact,
} from "../redux/contacts";
import { setActiveScreen } from "../redux/active";
//custom hooks
import { useImage } from "../ImageHandling/ImageContext";
import { useDebounce } from "../CustomHooks/useDebounce";
import useActiveScreen from "../CustomHooks/useActiveScreen";
import CustomSpinner from "../utils/Spinner";
import {
  getCloudinaryImgId,
  uploadImgToCloud,
  deleteImgFromCloud,
} from "../utils/cloudinary";

export default function AddContactsForm() {
  const contactToEdit = useSelector((state) => state.contacts.contactToEdit);
  const { updateImage } = useImage();
  //url
  const [selectedImage, setSelectedImage] = useState(null);
  //actual blob
  const [imageBlob, setImageBlob] = useState(null);
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const imgIsUploading = useSelector((state) => state.chat.imgIsUploading);
  const addContact = (contact) => {
    dispatch(createContact({ contact: contact }));
  };
  const handleCancel = (e) => {
    if (contactToEdit) {
      dispatch(clearContactToEdit());
    }
    dispatch(setActiveScreen(null));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newImageUrl = selectedImage;
    let oldImgDeleted = false;
    if (imageBlob) {
      newImageUrl = await uploadImgToCloud(imageBlob);
      updateImage(newImageUrl);
      setSelectedImage(newImageUrl);
    }
    if (contactToEdit && contactToEdit.pfp !== newImageUrl) {
      const oldImgId = getCloudinaryImgId(contactToEdit.pfp);
      await deleteImgFromCloud(oldImgId);
      oldImgDeleted = true;
    }
    const contact = {
      first: firstName,
      last: lastName,
      phoneNumber: phone,
      pfp: newImageUrl,
      defaultTexter: false,
    };
    if (contactToEdit) {
      dispatch(editContact({ contactToEdit, newContactData: contact }));
    } else {
      addContact(contact);
    }

    setFirstName("");
    setLastName("");
    setPhone("");
  };

  const debouncedSubmit = useDebounce(handleSubmit, 500);
  useEffect(() => {
    if (contactToEdit) {
      setFirstName(contactToEdit.first);
      setLastName(contactToEdit.last);
      setPhone(contactToEdit.phoneNumber);
      setSelectedImage(contactToEdit.pfp);
    } else {
      // If there's no contact to edit, reset the form fields
      setFirstName("");
      setLastName("");
      setPhone("");
      setSelectedImage(null);
    }
  }, [contactToEdit]);

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    await debouncedSubmit(e);
    dispatch(setActiveScreen("contacts"));
    setSelectedImage(null);
  };

  const handleImageUpload = (imageURL, blob) => {
    setImageBlob(blob);
    setSelectedImage(imageURL);
  };

  const activeScreen = useActiveScreen();
  const userFormClass =
    activeScreen === "add-contact"
      ? "add-user-form chat-pages"
      : "add-user-form chat-pages d-none";
  return (
    <div className={userFormClass} style={{ zIndex: 5 }}>
      <Form
        style={{ width: "100%", flexDirection: "column" }}
        className="d-flex justify-content-center"
        ref={formRef}
      >
        <Form.Group className="d-flex" style={{ width: "100%" }}>
          <div
            className="d-flex justify-content-between mb-3"
            style={{
              height: "fit-content",
              width: "100%",
              fontSize: "1rem",
              flexDirection: "row",
              padding: "0.75rem",
            }}
          >
            <p
              className="mb-0"
              style={{ color: "#017afe", cursor: "pointer" }}
              onClick={handleCancel}
            >
              Cancel
            </p>
            <p className="mb-0" style={{ fontWeight: "bold" }}>
              {contactToEdit ? "Edit Contact" : "New Contact"}
            </p>
            <p
              className="mb-0"
              style={{
                fontWeight: "bold",
                color: "#017afe",
                cursor: "pointer",
              }}
              onClick={handleCustomSubmit}
            >
              {contactToEdit ? "Update" : "Done"}
            </p>
          </div>
        </Form.Group>
        <Form.Group
          className="d-flex"
          style={{ flexDirection: "column", alignItems: "center" }}
        >
          <div className="pfp-div d-flex align-items-center justify-content-center">
            <CustomSpinner
              style={{ position: "absolute", borderRadius: "0.5rem" }}
              loadingType={imgIsUploading}
            />
            {selectedImage ? (
              <img src={selectedImage} alt="uploaded" />
            ) : (
              <img src="/among us.jpg" className="among-us" alt="default" />
            )}
          </div>
          <Form.Label className="add-photo-label">
            <span
              style={{ cursor: "pointer", fontFamily: "Apple" }}
              className="mb-3 mt-2"
            >
              Add Photo
            </span>
            <ImageUploader tempImage={handleImageUpload} id="img-up" />
          </Form.Label>
        </Form.Group>
        <Form.Group className="bg-white contact-input-groups">
          <input
            type="text"
            id="first-name"
            placeholder="First name"
            className="bg-white p-2 contact-input-fields"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          ></input>
        </Form.Group>
        <Form.Group className="bg-white contact-input-groups mb-2">
          <input
            type="text"
            id="last-name"
            placeholder="Last name"
            className="bg-white p-2 contact-input-fields"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          ></input>
        </Form.Group>
        <Form.Group
          className="bg-white contact-input-groups mb-2 mt-3 d-flex"
          style={{ width: "100%" }}
        >
          <PhoneInput
            country={"us"}
            value={phone}
            onChange={(phone) => setPhone(phone)}
          />
        </Form.Group>
      </Form>
    </div>
  );
}
