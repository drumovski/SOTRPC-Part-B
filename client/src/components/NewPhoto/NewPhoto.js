import React from "react";
// import { uploadPhotoToS3 } from "../../services/photoServices";
import Header from "../Header/Header";
// import { addNewPhoto } from "../../services/photoServices";
import { Form, Container, Button, Alert } from "react-bootstrap";
import { validatePhoto, uploadFile } from "../../helpers";
import { useGlobalState } from "../../config/globalState";

// ! reference taken from https://medium.com/@khelif96/uploading-files-from-a-react-app-to-aws-s3-the-right-way-541dd6be689
const NewPhoto = ({ history }) => {
  const { store, dispatch } = useGlobalState();
  // !extracting fileState and errorMessage
  const { fileState, errorMessage } = store;
  console.log("fileState=>", fileState);
  const { selectedFile, success } = fileState;
  console.log("success=>", success);
  console.log("errorMessage=>", errorMessage);

  const handleDescriptionChange = (event) => {
    const { name, value } = event.target;
    const updatedData = {
      ...fileState,
      [name]: value,
      type: "photos",
      success: false,
    };
    // !whenever user enters a description of another photo set success message and error message should disappear
    dispatch({
      type: "setFileState",
      data: updatedData,
    });
    dispatch({
      type: "setErrorMessage",
      data: null,
    });
  };

  const handleFileChange = (event) => {
    const updatedData = {
      ...fileState,
      selectedFile: event.target.files[0],
    };
    dispatch({
      type: "setFileState",
      data: updatedData,
    });

    dispatch({
      type: "setErrorMessage",
      data: null,
    });
    console.log("inside handleFileChange");
  };

  const handleUpload = (event) => {
    event.preventDefault();

    console.log("selectedFile=>", selectedFile);

    //  ! passed dispatch as argument to change the global state
    if (validatePhoto(selectedFile, dispatch)) uploadFile(fileState, dispatch);
  };

  return (
    <Container className="small-container">
      <Header history={history}>Upload Photo</Header>
      {errorMessage && (
        <Alert variant="danger">
          <p>{errorMessage}</p>
        </Alert>
      )}
      {success && (
        <Alert variant="success">
          <p>Upload Successful!</p>
        </Alert>
      )}
      <Form onSubmit={handleUpload}>
        <Form.Group controlId="formBasicDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            maxLength="60"
            name="description"
            placeholder="Enter description..."
            onChange={handleDescriptionChange}
          />
        </Form.Group>

        <Form.Group controlId="formBasicFile">
          <Form.Control required type="file" onChange={handleFileChange} />
        </Form.Group>
        <Button type="submit">Upload Photo</Button>
      </Form>
    </Container>
  );
};

export default NewPhoto;
