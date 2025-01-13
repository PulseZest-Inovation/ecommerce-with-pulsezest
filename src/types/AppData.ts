export interface AppDataType{
    app_name: string;
    app_logo: string;
    callback_url: string;
    returnUrl: string;
    scope: string;
    securityKey: string | null,   // Add the securityKey to the object

}