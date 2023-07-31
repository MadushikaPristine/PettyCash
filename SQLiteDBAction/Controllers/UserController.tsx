import * as DB from '../DBService';

export const saveUser = (data: any, callBack: any) => {

    var response: any;

    for (let i = 0; i < data.length; ++i) {

        DB.insertOrReplace(
            [
                {
                    table: 'USER',
                    columns: `USER_ID,UserName,DisplayName,ExternalName,Email,RoleID,Status,UserRole,DepartmentId,DepartmentName,IOULimit`,
                    values: '?,?,?,?,?,?,?,?,?,?,?',
                    params: [

                        data[i].UserId,
                        data[i].Username,
                        data[i].DisplayName,
                        data[i].ExternalName,
                        data[i].Email,
                        data[i].RoleId,
                        data[i].ActiveStatus,
                        data[i].UserRole,
                        data[i].DepartmentId,
                        data[i].DepartmentName,
                        data[i].IOULimit,

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

export const getJobOwners = (TypeID: any, callBack: any) => {

    DB.searchData(
        'SELECT * FROM USER WHERE RoleID=?',
        [TypeID],
        (resp: any, err: any) => {
            // console.log("************** type wise users ************  " + resp.length);
            callBack(resp, err);
        },
    );
};

export const getAllUsers = (callBack: any) => {

    DB.searchData(
        'SELECT * FROM USER',
        [],
        (resp: any, err: any) => {
            // console.log("************** All employee ************  " + resp.length);
            callBack(resp, err);
        },
    );
};

export const getLoginUserDetails = (uID:any,callBack: any) => {

    DB.searchData(
        'SELECT UserName,DisplayName,Email FROM USER WHERE USER_ID=?',
        [uID],
        (resp: any, err: any) => {
            // console.log("************** All employee ************  " + resp.length);
            callBack(resp, err);
        },
    );
};