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

    return (

        <div className="flex items-center w-full h-10 px-4 gap-10 text-white bg-[#1D1D1D]">
                 <button
                onClick={handleSignOut}
                className="font-medium text-[16px] text-white cursor-pointer flex items-center gap-1"
              >
                <FiLogOut className="font-normal" />
                Logout
              </button>
              <span className="text-white ">
                {username}
            {/* {props.verifiedUser ? `${username}'s Fun Notes` : "Fun Notes"} */}
          </span>
        </div>
    )
}
export default Navbar;