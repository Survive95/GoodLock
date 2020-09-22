import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import {FirebaseContext} from './Firebase'
import logo from '../media/logo.svg'

function ForgetPassword(props) {

    const firebase = useContext(FirebaseContext)

    const [email, setEmail] = useState('')
    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)

    const handleSubmit = e => {
        e.preventDefault();
        firebase.passwordReset(email)
        .then(() => {
            setError(null)
            setSuccess('Consultez votre adresse mail pour réinitialiser le mot de passe')
            setEmail('')
            setTimeout(() => {
                props.history.push('/login')
            }, 5000);
        })
        .catch(err => {
            setSuccess(null)
            setError(err)
            setEmail('')
        })
    }

    return (
        <>
            <header>
                <div className="header-content">
                    <Link to="/" className="logo"><img className="logo-image" src={logo} alt="logo-image"></img>Goodlock</Link>
                    <Link className="link" to="/login">Se connecter</Link>
                </div>
            </header>
            <main>
                <h2>Mot de passe oublié</h2>
                {error === null ? "" : <p className="error">{error.message}</p>}
                {success === null ? "" : <p className="success">{success}</p>}
                <form onSubmit={handleSubmit} className='form-login-register'>

                    <label htmlFor='email'>Adresse mail</label>
                    <input onChange={e => setEmail(e.target.value)} value={email} required id="email" type="email"></input>

                    {email === '' ? <button disabled>Réinitialiser le mot de passe</button> : <button>Réinitialiser le mot de passe</button>}
                </form>
            </main>
        </>
    )
}

export default ForgetPassword