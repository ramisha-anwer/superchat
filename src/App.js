
import './App.css';
import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore';
import 'firebase/compat/auth';   
import styled from 'styled-components'

import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'
import { useRef, useState } from 'react';



firebase.initializeApp({apiKey: "AIzaSyAF1PPH0lnXlpP_ohb-7I14rpuP4DbEJ-Y",
authDomain: "superchat-641f8.firebaseapp.com",
projectId: "superchat-641f8",
storageBucket: "superchat-641f8.appspot.com",
messagingSenderId: "545042012275",
appId: "1:545042012275:web:97e2c6fe850b1294dff206"})

const auth =firebase.auth();
const firestore= firebase.firestore();



function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>
      <section>
        {user? <ChatRoom/> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn(){
const signInWithGoogle=()=>{
  const provider = new firebase.auth.GoogleAuthProvider()
  auth.signInWithPopup(provider)
}



  return(
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
const dummy=useRef()

  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt').limit(50)

  const [messages]=useCollectionData(query,{idField:'id'}) //Retrieve and monitor a collection value in Cloud Firestore.
  
  const [formValue,setFormValue]= useState('')
const sendMessage = async (e) => {
  e.preventDefault()
  const {uid, photoURL} = auth.currentUser

  await messagesRef.add({
    text:formValue,
    createdAt:firebase.firestore.FieldValue.serverTimestamp(),
    uid, 
    photoURL
  })
  setFormValue('')
  dummy.current.scrollIntoView({behavior:'smooth'})
   
}

  return(
    <>
    <div>
      {messages && messages.map (msg => <ChatMessage key={msg.id} message={msg}/>)}
      <div ref={dummy}></div>
    </div>
    <form onSubmit={sendMessage}  >
      <input placeholder='Say something nice!' value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
      <button type='submit' >🚀</button>
    </form>
    </>
  )
}

function ChatMessage(props) {
  console.log('message:',props.message);
  const {text,uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent': "recieved"

  return(
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )
}



export default App;
