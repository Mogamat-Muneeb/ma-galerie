import React, { useState, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../services/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function Navbar(props) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("user");
        console.log("Signed Out");
        navigate("/");
        window.location.reload();
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  console.log("verifiedUser", props.verifiedUser?.displayName);

  function capitalizeWords(str) {
    if (!str) {
      return "";
    }
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  const name = props.verifiedUser?.displayName;
  const userName = capitalizeWords(name);
  return (
    <div className="flex items-center w-full h-14 px-4 gap-10 text-white bg-[#1D1D1D] sticky top-0 z-10 ">
      <div className="max-w-[1285px] mx-auto flex justify-between w-full ">
        <button
          onClick={handleSignOut}
          className="font-semibold text-[16px] text-white cursor-pointer flex items-center gap-1"
        >
          <FiLogOut className="font-normal" />
          Logout
        </button>
        <div className="flex items-center justify-center gap-4 ">
          <span className="font-semibold text-white ">{userName}</span>
          <img
            src={props.verifiedUser?.photoURL}
            alt=""
            className="w-10 h-10 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
export default Navbar;
