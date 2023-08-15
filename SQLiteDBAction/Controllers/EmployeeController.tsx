import { get_ASYNC_COST_CENTER } from '../../Constant/AsynStorageFuntion';
import * as DB from '../DBService';

export const saveEmployee = (data: any, callBack: any) => {

    var response: any;

    for (let i = 0; i < data.length; ++i) {

        DB.insertOrReplace(
            [
                {
                    table: 'EMPLOYEE',
                    columns: `Emp_ID,EmpName,EPFNo,Designation,DEP_ID,Status`,
                    values: '?,?,?,?,?,?',
                    params: [

                        data[i].UserID,
                        data[i].DisplayName,
                        data[i].EPFNo,
                        data[i].Designation,
                        data[i].DEP_ID,
                        1,

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


export const getTypeWiseUsers = (TypeID: any, callBack: any) => {

    DB.searchData(
        'SELECT * FROM EMPLOYEE WHERE EmpType_ID=?',
        [TypeID],
        (resp: any, err: any) => {
            // console.log("************** type wise users ************  " + resp.length);
            callBack(resp, err);
        },
    );
};

export const getAllEmployee = (callBack: any) => {

    get_ASYNC_COST_CENTER().then(async res => {

        DB.searchData(
            'SELECT Emp_ID as ID , EmpName as Name , EPFNo FROM EMPLOYEE WHERE DEP_ID=?',
            [res],
            (resp: any, err: any) => {
                // console.log("************** All employee ************  " + resp.length);
                callBack(resp, err);
            },
        );

    });

  
};

export const getEmployeeByID = (ID:any,callBack: any) => {

        DB.searchData(
            'SELECT * FROM EMPLOYEE WHERE Emp_ID=?',
            [ID],
            (resp: any, err: any) => {
                // console.log("************** All employee ************  " + resp.length);
                callBack(resp, err);
            },
        );


  
};
