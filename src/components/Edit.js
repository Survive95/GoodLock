import React, { createRef, useEffect, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { FirebaseContext } from './Firebase'
import AES from 'crypto-js/aes'
import CryptoJS from 'crypto-js'

function Edit(props) {

    const [userData, setUserData] = useState({})

    const [dataArray, setDataArray] = useState({})

    const firebase = useContext(FirebaseContext)

    useEffect(() => {
        firebase.authUser(localStorage.getItem('token')).get()
        .then( doc => {
            if(doc && doc.exists){
                const allUserData = doc.data()
                allUserData.data[props.match.params.id].password = AES.decrypt(allUserData.data[props.match.params.id].password, localStorage.getItem('token')).toString(CryptoJS.enc.Utf8)
                setUserData(allUserData)
                setDataArray(allUserData.data[props.match.params.id])
            }
        })
        .catch()
    }, [])


    const name = createRef()
    const identifiant = createRef()
    const password = createRef()
    const website = createRef()

    const editPassword = (e) => {
        e.preventDefault();
        let array = [...userData.data]
        array[props.match.params.id].name = name.current.value
        array[props.match.params.id].identifiant = identifiant.current.value
        array[props.match.params.id].password = AES.encrypt(password.current.value, localStorage.getItem('token')).toString()
        array[props.match.params.id].website = website.current.value

        firebase.addData(localStorage.getItem('token')).set({
            data : [...array],
            pseudo : userData.pseudo
        })
        .then(() => {
            props.history.push('/')

        })
        .catch(err => {
        })
    }

    return (
        <>
            <header>
                <div className="header-content">
                    <Link className="link" to="/"><i className="fas fa-arrow-left"></i>Retour</Link>
                </div>
            </header>
            <main>
                <h2>Édition de {dataArray.name}</h2>
                <form autoComplete="off" onSubmit={editPassword} className='form-login-register'>

                    <label htmlFor='name'>Nom</label>
                    <input defaultValue={dataArray.name} ref={name} required placeholder="Ex : Facebook" autoComplete="off" id="name" type="text"></input>

                    <label htmlFor='webid'>Identifiant</label>
                    <input defaultValue={dataArray.identifiant} ref={identifiant} required autoComplete="off" id="webid" type="text"></input>

                    <label htmlFor='password' >Mot de passe</label>
                    <input defaultValue={dataArray.password} autoComplete="off" ref={password} required id="password" type="text"></input>

                    <label htmlFor='website' >Site Web</label>
                    <input defaultValue={dataArray.website} ref={website} placeholder="Ex : http://www.facebook.com" id="website" type="url"></input>

                    <button>Modifié</button>
                </form>
            </main>
        </>
    )
}

export default Edit