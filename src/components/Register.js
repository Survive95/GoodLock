import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import {FirebaseContext} from './Firebase'
import logo from '../media/logo.svg'


function Register(props){

    const firebase = useContext(FirebaseContext)

    const data = {
        pseudo : '',
        email : '', 
        password : '', 
        confirmPassword : ''
    }

    const [loginData, setLoginData] = useState(data)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setLoginData({...loginData, [e.target.id]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const { email, password, pseudo} = loginData
        firebase.signupUser(email, password)
        .then(user => {
            firebase.authUser(user.user.uid).set({
                pseudo,
                data : []
            })
            setLoginData({...data})
            localStorage.setItem('token', user.user.uid)
            props.history.push('/')

        })
        .catch(err => {
            setError(err)
            setLoginData({...data})
        })
    }

    const {pseudo, email, password, confirmPassword} = loginData

    const buttonCheck = pseudo === '' || email === '' || password === '' || password !== confirmPassword ? <button disabled >Inscription</button> : <button>Inscription</button>

    return(
        <>
            <header>
                <div className="header-content">
                    <Link to="/" className="logo"><img className="logo-image" src={logo} alt="logo-image"></img>Goodlock</Link>
                    <Link className="link" to="/login">Se connecter <i className="fas fa-arrow-right"></i></Link>
                </div>
            </header>
            <main>
                <h2>S'enregistrer</h2>
                {error === '' ? "" : <p className="error">{error.message}</p>}
                <form onSubmit={handleSubmit} className='form-login-register'> 

                    <label htmlFor='pseudo'>Nom d'utilisateur</label>
                    <input onChange={handleChange} value={pseudo} autoComplete="off" required id="pseudo" type="text"></input>

                    <label htmlFor='email'>Adresse mail</label>
                    <input onChange={handleChange} value={email} required id="email" type="email"></input>

                    <label htmlFor='password' >Mot de passe</label>
                    <input onChange={handleChange} value={password} autoComplete="off" required id="password" type="password"></input>

                    <label htmlFor='confirmPassword' >Comfirmer le mot de passe</label>
                    <input onChange={handleChange} value={confirmPassword} autoComplete="off" required id="confirmPassword" type="password"></input>

                    {buttonCheck}
                </form>
            </main>
        </>
    )
}

export default Register