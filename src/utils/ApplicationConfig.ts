import { signOut } from "firebase/auth";
import { auth } from "./firbeaseConfig";

const key = localStorage.getItem('securityKey');

if(!key){
    console.log("key not found");
    signOut(auth);
}

export const  ApplicationConfig ={
    secuityKey: key
}