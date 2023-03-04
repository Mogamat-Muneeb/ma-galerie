import React, { useState, useEffect } from "react";
import { storage, db } from "../services/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, collection, setDoc, getDocs } from "firebase/firestore";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const FileUpload = (props) => {
  // console.log("currentUser FileUpload", props.currentUser)
  const [file, setFile] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const openModal = () => {
    setOpen(!open);
  };
  const userUsing = props.currentUser;
  console.log("userUsing", userUsing);

  useEffect(() => {
    loadAllImages();
  }, []);

  useEffect(() => {
    if (!open) {
      setUploaded(false);
    }
  }, [open]);

  const loadAllImages = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(
      collection(db, "notes", userUsing, "user")
    );
    const images = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setImages(images);
    setLoading(false);
  };

  useEffect(() => {
    loadAllImages();
    console.log(images, "images");
  }, []);
  const handleChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (file == "") {
      alert("Please add the file");
      openModal();
      return;
    }

    const storageRef = ref(storage, `images/${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploaded(false);

    // uploadTask.on(
    //   "state_changed",
    //   (snapshot) => {
    //     const progress =
    //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //     setUploadProgress(progress);
    //   },
    //   (error) => {
    //     console.log(error);
    //   },
    //   () => {
    //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //       const imageStoreRef = doc(db, "notes", userUsing, "user", file.name);
    //       setDoc(imageStoreRef, {
    //         imageUrl: downloadURL,
    //       });
    //     });
    //     setUploaded(true);
    //   }
    // );
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const imageStoreRef = doc(db, "notes", userUsing, "user", file.name);
          setDoc(imageStoreRef, {
            imageUrl: downloadURL,
          }).then(() => {
            setUploaded(true);
            closeModal();
            loadAllImages();
          });
        });
      }
    );
  };

  return (
    <>
      <div className="flex justify-center ">
        {loading && (
          <div class=" flex justify-center items-center">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {images &&
            images.map((imageUrl, id) => {
              return (
                <div className="flex w-full gap-3 shadow-xl" key={id}>
                  <img
                    src={imageUrl.imageUrl}
                    className="w-[150px] h-[150px] object-cover"
                  />
                </div>
              );
            })}
          <button
            onClick={openModal}
            className="w-[150px] h-[150px] bg-[#1D1D1D] text-white flex items-center justify-center text-center"
          >
            Upload an Image
          </button>
        </div>
        {open && (
          <div className="bg-red-500">
            <input
              type="file"
              accept="/image/*"
              onChange={handleChange}
              className=" h-[200px]"
            ></input>
            <button onClick={handleUpload}>Save</button>
            {uploaded && (
              <p className="success-msg">Image was uploaded successfully</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default FileUpload;
