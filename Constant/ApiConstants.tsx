import { Buffer } from 'buffer'
import base64 from 'react-native-base64';

export const BASE_URL = "http://10.10.0.100:8000/TPL_JOB_A8_SAP_SITHIRA/api/PettyCash_Mobile/";
export const LOGIN_BASE_URL = "http://10.10.0.100:8000/TPL_JOB_A8_SAP_SITHIRA/api/CommonLogin/";

export const USERNAME = "SYSTEM";
export const PASSWORD = "Root@123";

const token = `${USERNAME}:${PASSWORD}`;
// const encodedToken = Buffer.from(token).toString('base64');
const encodedToken = base64.encode(token);
export const headers = { 'Authorization': 'Basic '+ encodedToken };


