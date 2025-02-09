export interface AppDataType{
    app_name: string;
    app_logo: string;
    callback_url: string;
    returnUrl: string;
    scope: string;
    uid: string;
    securityKey: string | null,  
    client_phone: string; // Add the securityKey to the object
    client_email: string;
}