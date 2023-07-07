import * as DB from '../DBService';

export const saveEmployee = (data: any, callBack: any) => {

    var response: any;

    for (let i = 0; i < data.length; ++i) {

        DB.insertOrReplace(
            [
                {
                    table: 'EMPLOYEE',
                    columns: `Emp_ID,EmpName,EmpType_ID,Status`,
                    values: '?,?,?,?',
                    params: [

                        data[i].Emp_ID,
                        data[i].EmpName,
                        data[i].EmpType_ID,
                        data[i].Status,

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

                    response = 2;
                    callBack(response);
                    // console.log(res, " ..........  error ...  ", err);
                }

            },
        );

    }

};


export const getTypeWiseUsers = (TypeID:any,callBack: any) => {

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

    DB.searchData(
        'SELECT * FROM EMPLOYEE',
        [],
        (resp: any, err: any) => {
            // console.log("************** All employee ************  " + resp.length);
            callBack(resp, err);
        },
    );
};