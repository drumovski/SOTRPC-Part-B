// ! The state that is passed as argument to the function below is the initial state which is defined in app.js
export default function StateReducer(state, action) {
  switch (action.type) {
    case "setClasses":
      return {
        ...state,
        classes: action.data,
      };
    case "setMembers":
      return {
        ...state,
        members: action.data,
      };
    case "setLoggedInUser":
      return {
        ...state,
        // loggedInUser: action.data.name,
        // loggedInUserRole: action.data.role,
        // loggedInUserId: action.data._id,
        LoggedInUser: action.data,
      };

    // eslint-disable-next-line
    case "setClasses":
      return {
        ...state,
        classes: action.data,
      };
    case "setPhotos":
      return {
        ...state,
        photos: action.data,
      };
    case "setFileState":
      return {
        ...state,
        fileState: action.data,
      };
    case "setErrorMessage":
      return {
        ...state,
        errorMessage: action.data,
      };
    default:
      return state;
  }
}
