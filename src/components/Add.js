import React, { createRef, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FirebaseContext } from './Firebase'
import AES from 'crypto-js/aes'
import generator from 'generate-password'

function Add(props) {

    const firebase = useContext(FirebaseContext)

    const [userData, setUserData] = useState({})

    const newPassword = (e) => {
        e.preventDefault();
        firebase.addData(localStorage.getItem('token')).set({
            data : [
                ...userData.data,
                {
                    name: name.current.value,
                    identifiant: identifiant.current.value,
                    password: AES.encrypt(password.current.value, localStorage.getItem('token')).toString(),
                    website: website.current.value
                }
            ],
            pseudo : userData.pseudo
        })
        .then(() => {
            props.history.push('/')

        })
        .catch(err => {

        })
    }


    const randomPassword = e => {
        e.preventDefault()
        let pwd = generator.generate({
            length : 16,
            numbers : true,
            symbols : true
        })
        password.current.value = pwd
    }





    useEffect(() => {
        firebase.authUser(localStorage.getItem('token')).get()
        .then( doc => {
            if(doc && doc.exists){
                const allUserData = doc.data()
                setUserData(allUserData)
            }
        })
        .catch()

    }, [firebase])
    

    const name = createRef()
    const identifiant = createRef()
    const password = createRef()
    const website = createRef()


    return (
        <>
            <header>
                <div className="header-content">
                    <Link className="link" to="/"><i className="fas fa-arrow-left"></i>Retour</Link>
                </div>
            </header>
            <main>
                <h2>Ajouter un mot de passe</h2>
                <form autoComplete="off" onSubmit={newPassword} className='form-login-register'>

                    <label htmlFor='name'>Nom</label>
                    <input ref={name} required placeholder="Ex : Facebook" autoComplete="off" id="name" type="text"></input>

                    <label htmlFor='webid'>Identifiant</label>
                    <input ref={identifiant} required autoComplete="off" id="webid" type="text"></input>

                    <label htmlFor='password' >Mot de passe</label>
                    <input autoComplete="off" ref={password} required id="password" type="text"></input>
                    <p onClick={randomPassword} className="randomPasswordButton">Générer un mot de passe</p>

                    <label htmlFor='website' >Site Web</label>
                    <input ref={website} placeholder="Ex : http://www.facebook.com" id="website" type="url"></input>

                    <button>Ajouter</button>
                </form>
            </main>
        </>
    )
}

export default Add