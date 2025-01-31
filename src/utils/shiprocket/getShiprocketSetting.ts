import { getDataByDocName } from "@/services/FirestoreData/getFirestoreData";
import { ShipRocketLoginType } from "@/types/shipRocketType";

export const getShiprocketSetting = async (): Promise<ShipRocketLoginType | null> =>{
    try {
        const data = await getDataByDocName<ShipRocketLoginType>("settings", "shipping");

        if(!data){
            console.warn("No data fount for Shipp Rocket Setting");
            return null;
        }

        return data;
    } catch (error) {
        console.error("Error getting Shipping Details");
        return null;

    }
};