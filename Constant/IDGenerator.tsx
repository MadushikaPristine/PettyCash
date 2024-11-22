import { getLoginUserID } from "./AsynStorageFuntion";

export const generateReferenceNo = (type: any, returnValue: any) => {
    //IOU - IOU , IOUSettlement - IOUSET , OneOff - OFS , 
    try {
        let ID: any;
        const currentDate = new Date();
        const year = currentDate.getFullYear() % 100;
        const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
        const day = String(currentDate.getDate()).padStart(2, "0");
        const hours = String(currentDate.getHours()).padStart(2, "0");
        const minutes = String(currentDate.getMinutes()).padStart(2, "0");
        const seconds = String(currentDate.getSeconds()).padStart(2, "0");

        const formattedVal = `${year}${month}${day}${hours}${minutes}${seconds}`;
        const hashValue = parseInt(formattedVal) % 1000000; // Keep only the last 6 digits
        const lastval = hashValue.toString().padStart(6, "0");

        getLoginUserID().then(res => {
            // console.log(" user ID ===  " , res);
            if (type == 'IOU') {
                ID = "IOU" + lastval + res + "M"
            } else if (type == 'IOUSET') {
                ID = "IOUSET" + lastval + res + "M"
            } else if (type == 'OFS') {
                ID = "OFS" + lastval + res + "M"
            } else {
                ID = lastval + "M";
            }
            returnValue(ID);
        })
    } catch (error) {
        console.log(" ####  ID generate failed  ### ");
    }
}