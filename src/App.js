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
import { cache } from 'sw-toolbox';


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

  const handleInstall = () => {
    setInstallBtn(false)
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
      {installBtn ? <div className="installer-container">
        <p>Ajouter GoodLock à la page d'accueil</p>
        <div>
          <button onClick={handleInstall}>Ne plus afficher</button>
          <button onClick={install}>Ajouter</button>
        </div>
      </div> : ''}
    </div>
  );
}

export default App;
