import { Buffer } from 'buffer'
import base64 from 'react-native-base64';

// export const BASE_URL = "http://10.10.0.100:8000/TPL_JOB_A8_SAP_SITHIRA/api/PettyCash_Mobile";
// export const BASE_URL_LOOKUPS = "http://10.10.0.100:8000/TPL_JOB_A8_SAP_SITHIRA/api/lookups";
// export const LOGIN_BASE_URL = "http://10.10.0.100:8000/TPL_JOB_A8_SAP_SITHIRA/api/CommonLogin/";

//----- Public IP --------------------
// export const BASE_URL = "http://123.231.92.201:8002/TPL_JOB_A8_SAP_MERGE/api/PettyCash_Mobile";
// export const BASE_URL_LOOKUPS = "http://123.231.92.201:8002/TPL_JOB_A8_SAP_MERGE/api/lookups";
// export const LOGIN_BASE_URL = "http://123.231.92.201:8002/TPL_JOB_A8_SAP_MERGE/api/CommonLogin/";
// export const COMMON_BASE_URL = "http://123.231.92.201:8002/TPL_JOB_A8_SAP_MERGE/api/PettyCash/";


export const BASE_URL = "http://123.231.92.201:8002/TPL_JOB_A8_SAP_TEST/api/PettyCash_Mobile";
export const BASE_URL_LOOKUPS = "http://123.231.92.201:8002/TPL_JOB_A8_SAP_TEST/api/lookups";
export const LOGIN_BASE_URL = "http://123.231.92.201:8002/TPL_JOB_A8_SAP_TEST/api/CommonLogin/";
export const COMMON_BASE_URL = "http://123.231.92.201:8002/TPL_JOB_A8_SAP_TEST/api/PettyCash/";

// http://10.10.0.100:8000/TPL_JOB_A8_SAP_MERGE/api/CommonLogin/Login.xsjs?dbName=TPL_JOBA8_170723&username=dinushkam&password=GdBzSuV6mAdEyA6/H4plMQ==&sap=PSLTEST_LIVE_SL


// ----------  Database -----------------------
// export const DB_LIVE = "PC_UAT_WM";
// export const DB_Dev = "TPL_JOBA8_170723";

// ---- Client UAT ---------
export const DB_Dev = "TPL_PEETY_A8_TEST";
export const SAP_LIVE_DB = "TPL_PEETY_TEST_SL";
export const DB_LIVE = "TPL_PEETY_A8_TEST";
export const SAP_DEV_DB = "TPL_PEETY_TEST_SL";

// ------ Client Live ------------

// export const DB_Dev = "TPL_PEETY_A8_TEST";
// export const SAP_LIVE_DB = "TPL_PEETY_TEST_SL";
// export const DB_LIVE = "TPL_PEETY_A8_TEST";
// export const SAP_DEV_DB = "PSLTEST_LIVE_SL";

// export const DB_LIVE = "TPL_JOBA8_170723";


// export const SAP_LIVE_DB = "PC_UAT_SAP";
// export const SAP_LIVE_DB = "PSLTEST_LIVE_SL";



export const USERNAME = "SYSTEM";
export const PASSWORD = "Root@123";

const token = `${USERNAME}:${PASSWORD}`;


// const encodedToken = Buffer.from(token).toString('base64');
const encodedToken = base64.encode(token);

console.log(" log ==== " , encodedToken);
export const headers = { 'Authorization': 'Basic '+ encodedToken };


