import React, { useState, useEffect } from "react";
import { storage, db } from "../services/firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  doc,
  collection,
  setDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { RxCross2 } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { config } from "../elements/config/index";

const FileUpload = (props) => {
  // console.log("currentUser FileUpload", props.currentUser)
  const [file, setFile] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [saving, setSaving] = useState(false);

  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const openModal = () => {
    setOpen(!open);
    // document.body.classList.add("overflow-hidden");
    // if (open) {
    //   document.body.classList.remove("overflow-hidden");
    // }
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
      collection(db, "images", userUsing, "user")
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
    setSaving(true); //
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.log(error);
        setSaving(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const imageStoreRef = doc(db, "images", userUsing, "user", file.name);
          setDoc(imageStoreRef, {
            imageUrl: downloadURL,
          }).then(() => {
            setUploaded(true);
            setSaving(false);
            toast("Uploaded Image Successfully", {
              ...config,
              type: "success",
            });
            closeModal();
            loadAllImages();
          });
        });
      }
    );
  };

  const handleDelete = async (id, imageUrl) => {
    // Delete document from Firestore
    const imageRef = doc(db, "images", userUsing, "user", id);
    await deleteDoc(imageRef);

    // Delete file from Firebase Storage
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
    toast("Deleted Image Successfully", {
      ...config,
      type: "success",
    });
    // Reload images
    loadAllImages();
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
        <div className="grid grid-cols-2 gap-2 px-4 md:grid-cols-3 md:px-0">
          {images &&
            images.map((imageUrl, id) => {
              return (
                <div className="relative flex w-full gap-3 shadow-xl" key={id}>
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center duration-300 bg-white opacity-0 hover:opacity-100 bg-opacity-90">
                    <button
                      className=""
                      onClick={() =>
                        handleDelete(imageUrl.id, imageUrl.imageUrl)
                      }
                    >
                      <MdDelete />
                    </button>
                  </div>
                  <img
                    src={imageUrl.imageUrl}
                    className="w-[200px] h-[200px] object-cover relative"
                  />
                </div>
              );
            })}
          <button
            onClick={openModal}
            className="w-[200px] h-[200px] bg-[#1D1D1D] text-white flex items-center justify-center text-center"
          >
            Upload an Image
          </button>
        </div>
      </div>
      <div
        className={`flex items-center justify-center ${
          open
            ? "flex justify-center items-center min-h-screen w-screen fixed inset-0 overflow-y-scroll  bg-black bg-opacity-60 transition-opacity duration-300 md:z-50 z-[101]"
            : "hidden"
        }`}
      >
        <div className=" bg-white flex flex-col justify-center items-center rounded-[3px] gap-2 p-2">
          <div className="flex justify-between w-full">
            <p className="font-bold ">Upload image</p>
            <button className="font-bold text-[20px] " onClick={openModal}>
              <RxCross2 className="font-extrabold" />
            </button>
          </div>
          <div class="flex items-center justify-center gap-1 w-full">
            <label
              for="dropzone-file"
              class="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 "
            >
              <div class="flex flex-col items-center justify-center py-12 px-12">
                {/* <svg aria-hidden="true" class="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg> */}
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span class="font-semibold">
                    {file ? ` Image Uploaded ` : ` Click to upload`}
                  </span>
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                accept="/image/*"
                onChange={handleChange}
                class="hidden"
              />
            </label>
            <button
              className="w-[50px] h-full bg-black text-white py-14  flex justify-center items-center font-semibold rounded-[3px] text-[12px]"
              onClick={handleUpload}
              disabled={saving}
            >
              {saving ? (
                <div class=" flex justify-center items-center">
                  <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileUpload;
