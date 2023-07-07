import { log } from 'react-native-reanimated';
import * as DB from '../DBService';

export const saveJobNo = (data: any, callBack: any) => {

    var response: any;

    for (let i = 0; i < data.length; ++i) {

        DB.insertOrReplace(
            [
                {
                    table: 'JOB_NO',
                    columns: `DocEntry,Job_No,Title,CustomerName,JobType,Status,OwnerName,OwnerEPFNo`,
                    values: '?,?,?,?,?,?,?,?',
                    params: [

                        data[i].DocEntry,
                        data[i].JobNo,
                        data[i].Title,
                        data[i].CustomerName,
                        data[i].JobType,
                        data[i].Status,
                        data[i].OwnerName,
                        data[i].OwnerEPFNo

                    ],
                },
            ],
            (res: any, err: any) => {
                if (res === 'success') {

                    if (i + 1 == data.length) {
                        response = 3;

                        callBack(response);
                        // console.log(" end");


                    } else if (i == 0) {

                        response = 1;
                        callBack(response);
                        // console.log(" first  .....");
                    }


                } else {

                    if (i + 1 == data.length) {

                        response = 2;
                        callBack(response);
                        // console.log(res, " ..........  error ...  ", err);

                    }
                }

            },
        );

    }

};

export const getJobNoAll = (Name: any, callBack: any) => {

    // console.log(" owner name === " , Name);
    

    DB.searchData(

        "SELECT DISTINCT ifnull(Job_No || ' - ' || CustomerName,Job_No) as Job_No FROM JOB_NO WHERE JOB_NO.OwnerName=?",

        // 'SELECT DISTINCT Job_No FROM JOB_NO WHERE JOB_NO.OwnerName=?',
        [Name],
        (resp: any, err: any) => {
            // console.log("************** expense type ************  " + resp.length);
            callBack(resp, err);
        },
    );
};

// export const getAllJobOwners = (callBack: any) => {

//     DB.searchData(
//         'SELECT DISTINCT FROM JOB_OWNERS',
//         [],
//         (resp: any, err: any) => {
//             //console.log("************** all IOU Types ************  " + resp.length);
//             callBack(resp, err);
//         },
//     );
// };

// export const getJobNoAll = (callBack: any) => {

//     DB.searchData(
//         'SELECT DISTINCT * FROM JOB_NO',
//         [],
//         (resp: any, err: any) => {
//             // console.log("************** expense type ************  " + resp.length);
//             callBack(resp, err);
//         },
//     );
// };