import api from "../config/api";


const getAllPhotos = async () => {
  const response = await api.get("/photos");
  console.log("response inside getAllPhotos=>", response);
  return response.data;
};

export { getAllPhotos };
