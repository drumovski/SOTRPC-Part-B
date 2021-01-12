import React, { useReducer } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { StateContext } from "./config/globalState";
import stateReducer from "./config/stateReducer";
import Home from "./components/Home/Home";
import Nav from "./components/Nav/Nav";
import Classes from "./components/PotteryClasses/Classes";
import NewClass from "./components/NewClass/NewClass";
import ClassRegister from "./components/ClassRegister/ClassRegister";
import Members from "./components/Members/Members";
import EditMember from "./components/EditMember/EditMember";
import Register from "./components/Register/Register";
import SignIn from "./components/SignIn/SignIn";
import EditClass from "./components/EditClass/EditClass";
import Gallery from "./components/Gallery/Gallery";
import NewPhoto from "./components/NewPhoto/NewPhoto";
import Photo from "./components/Photo/Photo";
import Footer from "./components/Footer/Footer";
import History from "./components/History/History";
import "./styles/app.scss";
const App = () => {
  const initialState = {
    classes: [],
    members: [],
    photos: [],
    LoggedInUser: {},
    errorMessage: null,
    fileState: {
      success: false,
      url: "",
      description: "",
      file: {},
      selectedFile: "",
      type: "",
    },
  };

  const [store, dispatch] = useReducer(stateReducer, initialState);

  return (
    <div>
      <StateContext.Provider value={{ store, dispatch }}>
        <Router>
          <Nav />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/classes" component={Classes} />
            <Route path="/classes/new" component={NewClass} />
            <Route path="/classes/register" component={ClassRegister} />
            <Route path="/classes/edit/:id" component={EditClass} />
            <Route exact path="/users" component={Members} />
            <Route path="/users/edit/:id" component={EditMember} />
            <Route exact path="/auth/register" component={Register} />
            <Route path="/auth/login" component={SignIn} />
            <Route exact path="/photos" component={Gallery} />
            <Route path="/photos/new" component={NewPhoto} />
            <Route path="/history" component={History} />

            <Route path="/photos/:id" component={Photo} />
          </Switch>
          <Footer />
        </Router>
      </StateContext.Provider>
    </div>
  );
};

export default App;
