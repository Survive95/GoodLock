import React, { createRef, useContext, useEffect, useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Password from './Password'
import 'firebase/database'
import { FirebaseContext } from './Firebase'
import logo from '../media/logo.svg'

function Home(props) {

    const firebase = useContext(FirebaseContext)

    const [, setState] = useState()

    const [allPassword, setAllPassword] = useState([])

    const [userSession, setUserSession] = useState({})

    const [userData, setUserData] = useState({})

    useEffect(() => {
        let listener = firebase.auth.onAuthStateChanged(user => {
            if (user) {
                setUserSession(user)
                localStorage.setItem('token', user.uid)
            }
            else {
                props.history.push('/login')
            }


            firebase.authUser(userSession.uid).get()
                .then(doc => {
                    if (doc && doc.exists) {
                        const allUserData = doc.data()
                        console.log(allUserData.data);
                        setUserData(allUserData)
                        setAllPassword(allUserData.data)
                    }
                })
                .catch()

            return () => {
                listener()
            }
        })
    }, [userSession, firebase, props])

    const signOut = () => {
        firebase.signoutUser()
        localStorage.removeItem('token')
        props.history.push('/login')
    }

    const removePassword = (id) => {
        const array = userData
        array.data.splice(id, 1)

        firebase.addData(localStorage.getItem('token')).set({
            data: [...array.data],
            pseudo: userData.pseudo
        })

        setState({})

    }

    //Data = le mot de passe a crypter
    //password = la clé de chiffrage
    // console.log(AES.encrypt('data', 'password').toString());
    // console.log(AES.decrypt('U2FsdGVkX1/tXudbVsdVYMFyywtaqolusezHoMxUOd0=', 'password').toString(CryptoJS.enc.Utf8));
    


    const search = () => {
        let input = searchInput.current
        let filter = input.value.toUpperCase();
        let ul = document.querySelector(".password-list");
        let li = ul.querySelectorAll('li');

        for (let i = 0; i < li.length; i++) {

            let a = li[i].querySelector(".name");
            let txtValue = a.textContent || a.innerText;

            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } 
            else {
                li[i].style.display = "none";
            }
        }
    }

    const searchInput = createRef()

    allPassword.sort((a, b) => (a.name > b.name) ? 1 : (a.name === b.name) ? ((a.size > b.size) ? 1 : -1) : -1 )

    return (
        <>
            <header>
                <div className="header-content">
                    <Link to="/" className="logo"><img className="logo-image" src={logo} alt="logo-image"></img>Goodlock</Link>
                    {userData.pseudo ? <h3 onClick={signOut} className="profiles">Bonjour, {userData.pseudo}</h3> : ''}
                </div>
            </header>
            <main>
                <form onSubmit={e => e.preventDefault()} className="form-search">
                    <div>
                        <p className="counter-content"><span className="counter">{allPassword.length}</span> sites ou applications</p>
                        <Link className="add-password" to="/add">Ajouter un mot de passe</Link>
                    </div>
                    <div>
                        <input onChange={() => search()} ref={searchInput} placeholder="Rechercher des mots de passe" className="input-search" type="search"></input>
                    </div>
                </form>
                <ul className="password-list">
                    {allPassword.map((item, index) => {
                        return (
                            <Password removePassword={(index) => removePassword(index)} id={index} key={index} data={item}></Password>
                        )
                    })}
                </ul>
            </main>
        </>
    )
}

export default Home