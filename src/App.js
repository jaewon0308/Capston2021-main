import React, { useEffect } from 'react';
import {
  Switch,
  Route,
  useHistory,

} from "react-router-dom";

import ChatPage from './componets/ChatPage/ChatPage';
import LoginPage from './componets/LoginPage/LoginPage';
import RegisterPage from './componets/RegisterPage/RegisterPage';
import firebase from './firebase';
import { useDispatch, useSelector } from 'react-redux';
import {
  setUser,
  clearUser
} from './redux/actions/user_action';


function App(props) {
  let history = useHistory();
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.user.isLoading);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      console.log('user', user)
      //로그인이 된 상태
      if (user) {
        history.push("/");
        dispatch(setUser(user))
      } else {
        history.push("/login");
        dispatch(clearUser())
      }
    })
  }, [])

  if(isLoading) {
    return (
      <div>
        ...loading
      </div>
    )
  }
  return (

    <Switch>
      <Route exact path="/" component={ChatPage} />
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/register" component={RegisterPage} />
    </Switch>

  );
}

export default App;
