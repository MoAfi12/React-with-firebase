import { createUserWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth"
import { useState } from "react"
import { auth, googleProvider } from "../config/firebase"





export const Auth = ()=>{
const [email , setEmail] = useState("")
const [password , setPassword] = useState("")


    const signIn = async()=>{
      try{
        await createUserWithEmailAndPassword(auth , email , password)
        console.log("email: ", email)
      }
      catch(error){
        console.error("error: ", error)
      }
    }
if(auth.currentUser?.email === undefined){
    console.log("the user is not logged in please login")
}
    const signInWithGoogle = async()=>{
      try{
        await signInWithPopup(auth , googleProvider)
       
      }
      catch(error){
        console.error("error: ", error)
      }
    }
    const logout = async()=>{
      try{
        await signOut(auth)
    
      }
      catch(error){
        console.error("error: ", error)
      }
    }



    return(
        <>
        
        <div className="">
            <input type="text" placeholder="enter your email" value={email}  onChange={(e) => setEmail(e.target.value)}/>
            <input type="text" placeholder="enter your password" value={password} onChange={(e)=> setPassword(e.target.value)} />
            <button onClick={signIn}>Sign In</button>
            <button onClick={signInWithGoogle}>sign In with google</button>
            <button onClick={logout}>logout</button>
        </div>
        
        </>
    )
}