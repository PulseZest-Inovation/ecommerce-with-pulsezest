import { signOut } from "firebase/auth";
import { auth } from "./firbeaseConfig";
import { message } from "antd";

export const ApplicationConfig = {
    get securitKey(){
        return localStorage.getItem('securityKey')
    }
}

const key = ApplicationConfig.securitKey;

if(!key){
    message.error("security key not found. singiing out");
    signOut(auth).then(()=> message.success("Singout successfully")).catch((error)=> message.error(`Erro ${error}`))
}