import FileUpload from "../elements/FileUpload";
import Navbar from "../elements/Navbar";
import React, { useState, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../services/firebase";
import { db } from "../services/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { FiLogOut } from "react-icons/fi";
import { BiPencil } from "react-icons/bi";
import { VscChromeClose } from "react-icons/vsc";
function Gallery(props) {
  auth.languageCode = "it";
  const provider = new GoogleAuthProvider();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [verifiedUser, setVerifiedUser] = useState(storedUser);
  const store = JSON.parse(localStorage.getItem("Todo"));
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [dark, setDark] = useState(false);
  const currentUser = props.verifiedUser.email;
  const [notes, setNotes] = useState([]);
  const [listItems, setListItems] = useState(() => {
    if (store) {
      return store;
    } else {
      return;
    }
  });
  useEffect(() => {
    localStorage.setItem("Todo", JSON.stringify(listItems));
  }, [listItems]);


  console.log("currentUser", currentUser)
  return (
    <>
      <Navbar verifiedUser={verifiedUser} />
      <div className="flex items-center justify-center">
        <div className="mt-10">
          <FileUpload verifiedUser={verifiedUser} currentUser={currentUser} />
        </div>
      </div>
    </>
  );
}
export default Gallery;
