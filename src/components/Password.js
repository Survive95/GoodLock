import React, { createRef, useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FirebaseContext } from './Firebase'

function Password(props) {

    const firebase = useContext(FirebaseContext)

    const data = props.data

    const [userData, setUserData] = useState({})

    const identifiant = createRef()

    const [visiblePwd, setVisiblePwd] = useState(false)
    const [notify, setNotify] = useState(false)

    const handleVisible = () => {
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
        .then( doc => {
            if(doc && doc.exists){
                const allUserData = doc.data()
                setUserData(allUserData)
            }
        })
        .catch()

    }, [])

    return (
        <li>
            <p className="name">{data.name}</p>
            <p ref={identifiant} onClick={copy} className="indentifiant"><i className="fas fa-user"></i>{data.identifiant}</p>
            <div className="list-item-div">
                <i className="fas fa-key"></i>
                <input value={data.password} disabled className="password-list-item"  type={visiblePwd ? "text" : "password"}></input>
                <button onClick={handleVisible}>{visiblePwd ? <i className="far fa-eye-slash"></i> : <i className="far fa-eye"></i>}</button>
                <Link to={`/edit/${props.id}`}><i className="fas fa-pen"></i></Link>
                {data.website === '' ? '' : <a title={data.website} href={data.website} target="_blank"><i className="fas fa-link"></i></a>}
                <button onClick={() => props.removePassword(props.id)}><i className="fas fa-trash"></i></button>
            </div>
            {notify ? <p className="notify">Identifiant copié !</p> : ''}
        </li>
    )
}

export default Password