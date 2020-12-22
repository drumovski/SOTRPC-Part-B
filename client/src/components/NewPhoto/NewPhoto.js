import React, { Component } from "react";

import { addNewPhoto } from "../../services/photoServices";
import axios from "axios";
// ! reference taken from https://medium.com/@khelif96/uploading-files-from-a-react-app-to-aws-s3-the-right-way-541dd6be689
class NewPhoto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false,
      url: "",
      description: "",
    };
    console.log("description=>", this.state.description);
  }
  handleChange = (ev) => {
    const { name, value } = ev.target;

    console.log("name==>", name);
    console.log("value=>", value);
    this.setState({ success: false, url: "", [name]: value });
    // console.log(this.state.description);
    console.log("inside handleChange=>");
  };

  handleUpload = (ev) => {
    console.log(
      "this.state.description inside handleUpload=>",
      this.state.description
    );
    const description = this.state.description;
    console.log("uploadInput.files=>", this.uploadInput.files);
    let file = this.uploadInput.files[0];
    console.log("file=>", file);
    //! Split the filename to get the name and type
    let fileParts = file.name.split(".");
    console.log("fileParts=>", fileParts);
    let fileName = fileParts[0];
    let fileType = fileParts[1];
    console.log("Preparing the upload");

    addNewPhoto({ fileName, fileType, description })
      .then((response) => {
        console.log("response=>", response);
        var returnData = response.data.data.returnData;
        var signedRequest = returnData.signedRequest;
        var url = returnData.url;
        this.setState({ url: url });
        console.log("Recieved a signed request=> " + signedRequest);
        // Put the fileType in the headers for the upload
        var options = {
          headers: {
            "Content-Type": fileType,
          },
        };
        // !axios  call to s3
        axios
          .put(signedRequest, file, options)
          .then((result) => {
            console.log("Response from s3=>", result);
            this.setState({ success: true });
          })
          .catch((error) => {
            alert("ERROR " + JSON.stringify(error));
          });
      })
      .catch((error) => {
        alert(JSON.stringify(error));
      });
  };

  render() {
    const SuccessMessage = () => (
      <div style={{ padding: 50 }}>
        <h3 style={{ color: "green" }}>SUCCESSFUL UPLOAD</h3>
        <a href={this.state.url}>Access the file here</a>
        <br />
      </div>
    );
    return (
      <div>
        <center>
          <h1>UPLOAD A FILE</h1>
          {this.state.success ? SuccessMessage() : null}
          <div>
            <label>Description</label>
            <input
              type="text"
              name="description"
              placeholder="Enter description..."
              onChange={this.handleChange}
            ></input>
          </div>
          <div>
            <input
              onChange={this.handleChange}
              ref={(ref) => {
                this.uploadInput = ref;
              }}
              type="file"
            />
          </div>
          <br />
          <button onClick={this.handleUpload}>UPLOAD</button>
        </center>
      </div>
    );
  }
}
export default NewPhoto;
