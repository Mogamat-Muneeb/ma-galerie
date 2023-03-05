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
    let username =
      props.verifiedUser && props.verifiedUser.displayName.split(" ")[0];

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


  console.log("verifiedUser", props.verifiedUser.displayName)

    return (

        <div className="flex items-center w-full h-14 px-4 gap-10 text-white bg-[#1D1D1D] sticky top-0 z-10">
                 <button
                onClick={handleSignOut}
                className="font-medium text-[16px] text-white cursor-pointer flex items-center gap-1"
              >
                <FiLogOut className="font-normal" />
                Logout
              </button>
              <span className="text-white ">
                {props.verifiedUser.displayName}
          </span>
          <img src={props.verifiedUser.photoURL} alt="" className="w-10 h-10 rounded-full" />
        </div>
    )
}
export default Navbar;