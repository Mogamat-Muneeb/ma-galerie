import Navbar from "../src/elements/Navbar";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "./services/firebase";
import Gallery from "./elements/Gallery";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  auth.languageCode = "it";
  const provider = new GoogleAuthProvider();

  // const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  // let [verifiedUser, setVerifiedUser] = useState(null);
  const store = JSON.parse(localStorage.getItem("Todo"));
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [verifiedUser, setVerifiedUser] = useState(storedUser);
  const [listItems, setListItems] = useState(() => {
    if (store) {
      return store;
    } else {
      return [];
    }
  });

  let username = verifiedUser && verifiedUser.displayName.split(" ")[0];
  // console.log(verifiedUser, "verifiedUser");

  useEffect(() => {
    localStorage.setItem("Todo", JSON.stringify(listItems));
  }, [listItems]);
  useEffect(() => {
    if (verifiedUser) {
      localStorage.setItem("user", JSON.stringify(verifiedUser));
    }
  }, [verifiedUser]);

  let signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setVerifiedUser(user);
        // console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(error, errorCode);
      });
  };

  if (!verifiedUser) {
    return (
      <div className="flex content-center justify-center w-screen h-screen p-4">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-center">Gallery</h1>
          <button
            className="bg-black text-white rounded h-[45px] w-[160px] mt-4 font-medium shadow-lg"
            onClick={() => signInWithGoogle()}
          >
          Sign In
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="App">
      <ToastContainer/>
    <Router>
      <Routes>
      <Route path="/"  element={    <Gallery verifiedUser={verifiedUser} /> }/>
      </Routes>
    </Router>
    </div>
  );
}

export default App;
