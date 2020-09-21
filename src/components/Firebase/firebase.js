import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

var firebaseConfig = {
    apiKey: "AIzaSyAcVa9AHVs5AwaLQr2eDe530lblFrHEpTM",
    authDomain: "goodlock-10ad7.firebaseapp.com",
    databaseURL: "https://goodlock-10ad7.firebaseio.com",
    projectId: "goodlock-10ad7",
    storageBucket: "goodlock-10ad7.appspot.com",
    messagingSenderId: "486282749829",
    appId: "1:486282749829:web:be71306f515094f12686ec"
};

class Firebase {
    constructor(){
        app.initializeApp(firebaseConfig)
        this.auth = app.auth()
        this.db = app.firestore()
    }

    //Inscription
    signupUser = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password)

    //Connexion
    loginUser = (email, password) => 
    this.auth.signInWithEmailAndPassword(email, password)

    //Deconnexion
    signoutUser = () => this.auth.signOut()

    //Récupération
    passwordReset = email => this.auth.sendPasswordResetEmail(email) 


    authUser = uid => this.db.doc(`users/${uid}`)

    addData = uid => this.db.collection(`users`).doc(uid)

}

export default Firebase