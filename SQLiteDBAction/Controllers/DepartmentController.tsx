import { get_ASYNC_COST_CENTER } from '../../Constant/AsynStorageFuntion';
import * as DB from '../DBService';

export const saveDepartment = (data: any, callBack: any) => {

    var response: any;

    for (let i = 0; i < data.length; ++i) {

        DB.insertOrReplace(
            [
                {
                    table: 'DEPARTMENTS',
                    columns: `DepID,DepName,CostCenter,HODNo,HODName,isSubAuth,SubNo,SubstiveName,Status`,
                    values: '?,?,?,?,?,?,?,?,?',
                    params: [

                        data[i].ID,
                        data[i].DepName,
                        data[i].CostCenter,
                        data[i].HODNo,
                        data[i].HODName,
                        data[i].isSubAuth,
                        data[i].SubNo,
                        data[i].SubstiveName,
                        data[i].Status,

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

export const getDepartments = (callBack: any) => {

    DB.searchData(
        'SELECT * FROM DEPARTMENTS',
        [],
        (resp: any, err: any) => {
            //console.log("************** all IOU Types ************  " + resp.length);
            callBack(resp, err);
        },
    );
};

export const getHODDetails = (ID:any,callBack: any) => {

    DB.searchData(
        'SELECT HODName as Name , HODNo as ID FROM DEPARTMENTS WHERE HODNo=? ',
        [],
        (resp: any, err: any) => {
            //console.log("************** all IOU Types ************  " + resp.length);
            callBack(resp, err);
        },
    );
};
export const getLoggedUserHOD = (callBack: any) => {

    get_ASYNC_COST_CENTER().then(async res => {

        console.log(" center ====  " , res);
        

        DB.searchData(
            'SELECT HODName as Name , HODNo as ID FROM DEPARTMENTS WHERE CostCenter=?',
            [res],
            (resp: any, err: any) => {
                //console.log("************** all IOU Types ************  " + resp.length);
                callBack(resp, err);
            },
        );

    });


};

export const getHODDetailsID = (ID:any,callBack: any) => {

    DB.searchData(
        'SELECT DEPARTMENTS.HODNo FROM USER join DEPARTMENTS on DEPARTMENTS.DepID = USER.DepartmentId WHERE USER.USER_ID =? ',
        [ID],
        (resp: any, err: any) => {
            //console.log("************** all IOU Types ************  " + resp.length);
            callBack(resp, err);
        },
    );
};
