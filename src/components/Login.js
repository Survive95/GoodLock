import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {FirebaseContext} from './Firebase'
import logo from '../media/logo.svg'

function Login(props) {

    const firebase = useContext(FirebaseContext)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loginBtn, setLoginBtn] = useState(false)
    const [error, setError] = useState('')


    useEffect(() => {
        if(password.length > 5 && email !== ''){
            setLoginBtn(true)
        }
        else if(loginBtn){
            setLoginBtn(false)
        }
    }, [password, email, loginBtn])

    const handleSubmit = e => {
        e.preventDefault();
        firebase.loginUser(email, password)
        .then(user => {
            setEmail('')
            setPassword('')
            localStorage.setItem('token', user.user.uid)
            props.history.push('/')
        })
        .catch(err => {
            setEmail('')
            setPassword('')
            setError(err)
        })
    }

    return (
        <>
            <header>
                <div className="header-content">
                    <Link to="/" className="logo"><img className="logo-image" src={logo} alt="logo-image"></img>Goodlock</Link>
                    <Link className="link" to="/register">S'enregistrer <i className="fas fa-arrow-right"></i></Link>
                </div>
            </header>
            <main>
                <h2>Connexion</h2>
                {error === '' ? "" : <p className="error">{error.message}</p>}
                <form onSubmit={handleSubmit} className='form-login-register'> 

                    <label htmlFor='email'>Adresse mail</label>
                    <input onChange={(e) => setEmail(e.target.value)} value={email}  id="email" type="email"></input>

                    <label htmlFor='password' >Mot de passe</label>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} id="password" type="password"></input>

                    <Link className="forget" to="/forgetpassword">Mot de passe oublié ?</Link>
                    
                    {loginBtn ? <button>Se connecter</button> : <button disabled >Se connecter</button>}
                </form>
            </main>
        </>
    )
}

export default Login