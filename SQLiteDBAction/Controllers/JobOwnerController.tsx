import { get_ASYNC_COST_CENTER } from '../../Constant/AsynStorageFuntion';
import * as DB from '../DBService';

export const saveJobOwners = (data: any, callBack: any) => {

    var response: any;

    for (let i = 0; i < data.length; ++i) {

        DB.insertOrReplace(
            [
                {
                    table: 'JOB_OWNERS',
                    columns: `JobOwner_ID,Name,IOULimit,SapEmpId,EPFNo,DepartmentId,DepartmentName`,
                    values: '?,?,?,?,?,?,?',
                    params: [

                        data[i].ID,
                        data[i].Name,
                        data[i].IOULimit,
                        data[i].SapEmpId,
                        data[i].EPFNo,
                        data[i].DepartmentId,
                        data[i].DepartmentName,

                        // data[i].Status,

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

export const getAllJobOwners = (callBack: any) => {

    DB.searchData(
        'SELECT JobOwner_ID as ID , Name FROM JOB_OWNERS',
        [],
        (resp: any, err: any) => {
            //console.log("************** all IOU Types ************  " + resp.length);
            callBack(resp, err);
        },
    );
};
export const getAllJobOwnersBYDep = (callBack: any) => {


    get_ASYNC_COST_CENTER().then(async res => {

        console.log(" dep ===   " , res);
        

        DB.searchData(
            'SELECT JobOwner_ID as ID , Name , EPFNo ,IFNULL(IOULimit,0) as IOULimit FROM JOB_OWNERS WHERE DepartmentName=?',
            [res],
            (resp: any, err: any) => {
                //console.log("************** all IOU Types ************  " + resp.length);
                callBack(resp, err);
            },
        );

    })

    
};
export const getJobOWnerDetails = (ID:any,callBack: any) => {

        DB.searchData(
            'SELECT JobOwner_ID as ID , Name , EPFNo ,IFNULL(IOULimit,0) as IOULimit FROM JOB_OWNERS WHERE JobOwner_ID=?',
            [ID],
            (resp: any, err: any) => {
                //console.log("************** all IOU Types ************  " + resp.length);
                callBack(resp, err);
            },
        );
    
};