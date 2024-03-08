import moment from 'moment';
import RNFS from 'react-native-fs';
const common_path = `${RNFS.DocumentDirectoryPath}`;

const current_date = moment().utcOffset('+05:30').format('YYYY-MM-DD') + "_log";

const logFilePath = `${RNFS.DocumentDirectoryPath}/${current_date}.txt`;


export const CreateLogFile = () => {

    RNFS.exists(logFilePath)
        .then(async (exists) => {
            if (exists) {
                console.log('File exists');
            } else {
                const content = 'Log File ' + moment().utcOffset('+05:30').format('YYYY-MM-DD'); // Define the file content

                // Use writeFile to create the file
                await RNFS.writeFile(logFilePath, content, 'utf8');
                console.log('File not exists');
            
            }
        })
        .catch((error) => {
            console.log(error);
        });


}

export const logger = async (message: string, message1: string) => {
    try {
        await RNFS.appendFile(logFilePath, `${message}\n${message1}\n`);
        // console.log(`Logged: ${message}${message1}`);
    } catch (error) {
        console.error('Failed to log:', error);
    }
};
export const Massage = async (Code: string, response: string) => {
    try {
        await RNFS.appendFile(logFilePath, `${Code}\n${response}\n`);
        // console.log(`Logged: ${Code}${Code}`);
    } catch (error) {
        console.error('Failed to log:', error);
    }
};

//function to converte a JSON into a String and save in the loger file
export const saveJsonObject_To_Loog = async (data: object) => {
    try {
        const logStringJSON = JSON.stringify(data);
        await RNFS.appendFile(logFilePath, `${logStringJSON}\n`);
        // console.log('Saved JSON object to log file:', logStringJSON);
    } catch (error) {
        console.error('Failed to save JSON object:', error);
    }
};

//Function to Read the 
export const readLogs = async () => {
    try {
        const logs = await RNFS.readFile(logFilePath);
        console.log('Logs:', logs);
    } catch (error) {
        console.error('Failed to read logs:', error);
    }
};
