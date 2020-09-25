import React, { useContext, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Add from './components/Add';
import ForgetPassword from './components/ForgetPassword';
import Edit from './components/Edit';
import { FirebaseContext } from './components/Firebase'


function App() {

  const firebase = useContext(FirebaseContext)

  window.addEventListener('beforeunload', () => {
    firebase.signoutUser()
    localStorage.removeItem('token')
  })

  const [defferedPrompt, setDefferedPrompt] = useState(null)
  const [installBtn, setInstallBtn] = useState(false)

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    setDefferedPrompt(e)
    setInstallBtn(true)
  })

  const install = () => {
    setInstallBtn(false)
    defferedPrompt.prompt()
    defferedPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("installation réussie");
      } else {
        console.log("installation refusée");
      }

      setDefferedPrompt(null)
    });
  }
  
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
      {installBtn ? <button onClick={install} className="installer"><i className="fas fa-download"></i></button> : ''}
    </div>
  );
}

export default App;
