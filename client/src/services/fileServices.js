import api from "../config/api";
import axios from "axios";

const addNewFile = async ({ fileName, fileType, description, type }) => {
  console.log("fileName=>", fileName);
  const response = await api.post(`/${type}`, {
    fileName,
    fileType,
    description,
  });
  console.log("response inside addNewFile=>", response);
  return response;
};

const deleteFile = async (id, type) => {
  console.log("inside deletefile=>");
  const response = await api.delete(`/${type}/${id}`, { params: { id } });
  console.log("response inside deletefile in file services=> ", response);
  return response;
};

// ! this function will delete file from db in case s3 bucket returns an error while saving the file
const deleteFileFromDb = (id, type) => {
  console.log("inside deleteFileFromDb=>");
  deleteFile(id, type)
    .then((response) => {
      console.log("response=>", response);
    })
    .catch((error) => console.log(error));
};

const uploadFileToS3 = async (signedRequest, file, options, id, type) => {
  // !axios  call to S3
  console.log("id inside fileServices=>", id);
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

const uploadFile = (fileState, dispatch) => {
  const { selectedFile, description, type } = fileState;
  console.log("selectedFile=>", selectedFile);
  console.log("type inside uploadFile=>", type);
  let fileParts = selectedFile.name.split(".");
  let fileName = fileParts[0];
  let fileType = fileParts[1];
  console.log("fileType=>", fileType);
  console.log("Preparing the upload");
  // !passed type to make this function reusable to call backend api's
  addNewFile({ fileName, fileType, description, type })
    .then((response) => {
      const { returnData } = response.data.data;
      const { signedRequest } = returnData;
      const responsePhoto = response.data.photo;
      console.log("photo=>", responsePhoto);
      let updatedData = {
        ...fileState,
        file: responsePhoto,
        url: returnData.url,
      };
      console.log("updatedData=>", updatedData);
      dispatch({
        type: "setFileState",
        data: updatedData,
      });
      const id = responsePhoto._id;
      console.log("Recieved a signed request=> " + signedRequest);
      var options = {
        headers: {
          "Content-Type": fileType,
        },
      };
      uploadFileToS3(signedRequest, selectedFile, options, id, type)
        .then((result) => {
          console.log(result);
          updatedData = {
            ...fileState,
            success: true,
          };
          dispatch({
            type: "setFileState",
            data: updatedData,
          });
        })
        .catch((error) => {
          console.log(error);
          dispatch({
            type: "setErrorMessage",
            data: "There was a problem saving the photo to S3",
          });
        });
    })
    .catch((error) => {
      console.log(error);
      dispatch({
        type: "setErrorMessage",
        data: "There was a problem saving the photo to the server",
      });
    });
};

export { addNewFile, deleteFile, uploadFileToS3, uploadFile };