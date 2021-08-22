import React, { useState, useContext } from "react";
import './App.css';
import Login from "./components/Login/Login";
import Register from './components/Register/Register';
// import Header from './components/Header/Header';
// import Home from "./components/Home/Home";
// import setAuthToken from "./utils/setAuthToken";
import AlertComponent from './components/AlertComponent/AlertComponent';
import {
  Switch
} from "react-router-dom";
// import PrivateRoute from "./utils/PrivateRoute";
import PublicRoute from "./utils/PublicRoute";
import { GlobalState } from './GlobalState';
import Home from "./components/Home";


function App() {
  const [errorMessage, updateErrorMessage] = useState(null);
  // const [isLogin, setIsLogin] = useState(false);

  const state = useContext(GlobalState);
  const [loading] = state.userAPI.loading;

  return (
    <div className="App">
      {!loading && <>
        <div className="container d-flex align-items-center flex-column">
          <Switch>
            <PublicRoute path="/" restricted={false} exact>
              <Home />
            </PublicRoute>
            <PublicRoute path="/register" restricted={true}>
              <Register showError={updateErrorMessage} />
            </PublicRoute>
            <PublicRoute path="/login" restricted={true}>
              <Login showError={updateErrorMessage} />
            </PublicRoute>
          </Switch>
          <AlertComponent errorMessage={errorMessage} hideError={updateErrorMessage} />
        </div>
      </>}
    </div>
  );
}

export default App;
