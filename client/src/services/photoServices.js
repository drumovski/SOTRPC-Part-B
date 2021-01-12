import api from "../config/api";
import axios from "axios";

const addNewFile = async ({ fileName, fileType, description, type }) => {
  console.log("fileName=>", fileName);
  const response = await api.post(`/${type}`, {
    fileName,
    fileType,
    description,
  });
  console.log("response inside addNewPhoto=>", response);
  return response;
};

const getAllPhotos = async () => {
  const response = await api.get("/photos");
  console.log("response inside getAllPhotos=>", response);
  return response.data;
};

const deleteFile = async (id, type) => {
  console.log("inside deletePhoto=>");
  const response = await api.delete(`/${type}/${id}`, { params: { id } });
  console.log("response inside deletePhoto in photo services=> ", response);
  return response;
};
// ! this function will delete photo from db incase s3 bucket returns an error while saving the photo
const deleteFileFromDb = (id, type) => {
  console.log("inside deletePhotoFromDb=>");

  deleteFile(id, type)
    .then((response) => {
      console.log("response=>", response);
    })
    .catch((error) => console.log(error));
};

const uploadFileToS3 = async (signedRequest, file, options, id, type) => {
  // !axios  call to S3
  console.log("id inside photoServices=>", id);
  let res = false;
  await axios
    .put(signedRequest, file, options)
    .then((result) => {
      console.log("Response from s3=>", result);

      res = true;
    })
    // !delete photo from db incase S3 bucket throws an error while saving the photo
    .catch((error) => {
      deleteFileFromDb(id, type);
      alert("ERROR " + JSON.stringify(error));
    });
  return res;
};
export { addNewFile, getAllPhotos, deleteFile, uploadFileToS3 };
