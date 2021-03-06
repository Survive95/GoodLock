import React, { createRef, useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FirebaseContext } from './Firebase'
import AES from 'crypto-js/aes'
import CryptoJS from 'crypto-js'
import apps from '../apps.json'

function Password(props) {

    const firebase = useContext(FirebaseContext)

    const data = props.data

    const [userData, setUserData] = useState({})

    const identifiant = createRef()
    const pwd = createRef()

    const [android, setAndroid] = useState(null)
    const [ios, setIos] = useState(null)

    const [passwordCrypt, setPasswordCrypt] = useState(data.password)

    const [visiblePwd, setVisiblePwd] = useState(false)
    const [notify, setNotify] = useState(false)

    const handleVisible = () => {
        if (visiblePwd) {
            //crypt
            setPasswordCrypt(data.password)
        }
        else {
            //decrypt
            setPasswordCrypt(AES.decrypt(data.password, localStorage.getItem('token')).toString(CryptoJS.enc.Utf8))

        }
        setVisiblePwd(!visiblePwd)
    }

    const copy = () => {
        setNotify(true)
        navigator.clipboard.writeText(identifiant.current.textContent)
        setTimeout(() => {
            setNotify(false)
        }, 2000);
    }

    useEffect(() => {
        firebase.authUser(localStorage.getItem('token')).get()
            .then(doc => {
                if (doc && doc.exists) {
                    const allUserData = doc.data()
                    setUserData(allUserData)
                }
            })
            .catch()

        let ua = navigator.userAgent.toLowerCase()
        let isAndroid = ua.indexOf("android") > -1
        let isIphone = ua.indexOf("iphone") > -1
        console.log(ua);

        if (isAndroid) {
            setAndroid(true)
            setIos(null)
        }
        if (isIphone) {
            setIos(true)
            setAndroid(null)
        }

    }, [])

    return (
        <li>
            <p className="name">{data.name}</p>
            <p ref={identifiant} onClick={copy} className="indentifiant"><i className="fas fa-user"></i>{data.identifiant}</p>
            <div className="list-item-div">
                <div className="password-container">
                    <i className="fas fa-key"></i>
                    <input ref={pwd} value={passwordCrypt} disabled className="password-list-item" type={visiblePwd ? "text" : "password"}></input>
                </div>
                <div className="password-button-container">
                    <button onClick={handleVisible}>{visiblePwd ? <i className="far fa-eye-slash"></i> : <i className="far fa-eye"></i>}</button>
                    <Link to={`/edit/${props.id}`}><i className="fas fa-pen"></i></Link>
                    {data.website === '' ? '' : <a title={data.website} href={data.website} target="_blank"><i className="fas fa-link"></i></a>}
                    {android && data.website !== '' ? apps.map((item, index) => {
                        if (data.website.toLowerCase().includes(item.label.toLowerCase())) {
                            return (
                                <a key={index} href={item.url.android} target="_blank"><i className={item.fa}></i></a>
                            )
                        }

                    }) : ''}

                    <button onClick={() => props.removePassword(props.id)}><i className="fas fa-trash"></i></button>
                </div>
            </div>
            {notify ? <p className="notify">Identifiant copié !</p> : ''}
        </li>
    )
}

export default Password