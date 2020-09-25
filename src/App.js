import React, { useContext } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Add from './components/Add';
import ForgetPassword from './components/ForgetPassword';
import Edit from './components/Edit';
import { FirebaseContext } from './components/Firebase'
import sw from './serviceWorker'


function App() {

  const firebase = useContext(FirebaseContext)

  window.addEventListener('beforeunload', () => {
    firebase.signoutUser()
    localStorage.removeItem('token')
  })
  
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={Home}></Route>
        <Route exact path="/login" component={Login}></Route>
        <Route exact path="/register" component={Register}></Route>
        <Route exact path="/add" component={Add}></Route>
        <Route exact path="/forgetpassword" component={ForgetPassword}></Route>
        <Route exact path="/edit/:id" component={Edit}></Route>
      </Router>
    </div>
  );
}

export default App;
