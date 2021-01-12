import React from "react";

import { deleteFile } from "../../services/photoServices";
import { useGlobalState } from "../../config/globalState";

import ControlledCarousel from "../ControlledCarousel/ControlledCarousel";
import { Container } from "react-bootstrap";
import Header from "../Header/Header";

const Photo = (props) => {
  // console.log("props.location.state: ",props.location.state)
  const { store, dispatch } = useGlobalState();
  const { photos, fileState } = store;

  const { type } = fileState;
  // !accessing photo that is being passed from Gallery component
  console.log("props=>", props);
  const { history } = props;
  const { photo, index } = props.location.state;
  // console.log("photo=>", photo);

  const handleDelete = (event) => {
    event.preventDefault();
    const updatedPhotos = photos.filter((p) => p._id !== photo._id);
    console.log("updatedPhotos=>", updatedPhotos);

    deleteFile(photo._id, type)
      .then((response) => {
        console.log("response=>", response);
        dispatch({
          type: "setPhotos",
          data: updatedPhotos,
        });
      })
      .catch((error) => console.log(error));
    history.push("/photos");
  };

  return (
    <div>
      <Container className="main-container">
        <Header history={history} showButton={"Delete"} clicked={handleDelete}>
          Gallery
        </Header>
      </Container>
      <Container className="carousel-container">
        <ControlledCarousel index={index} photos={photos} />
      </Container>
    </div>
  );
};
export default Photo;
