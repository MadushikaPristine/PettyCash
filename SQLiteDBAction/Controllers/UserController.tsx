import * as DB from '../DBService';

export const saveUser = (data: any, callBack: any) => {

    var response: any;

    for (let i = 0; i < data.length; ++i) {

        DB.insertOrReplace(
            [
                {
                    table: 'USER',
                    columns: `USER_ID,UserName,DisplayName,ExternalName,Email,RoleID,Status,UserRole,DepartmentId,DepartmentName,RequestIOULimit,IOULimit,SapEmpId,EPFNo`,
                    values: '?,?,?,?,?,?,?,?,?,?,?,?,?,?',
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
                        data[i].RequestIOULimit,
                        data[i].ApproveIOULimit,
                        data[i].SapEmpId,
                        data[i].EPFNo,

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

export const getAllTransportOfficers = (callBack: any) => {

    DB.searchData(
        'SELECT DisplayName as Name , USER_ID as ID , IFNULL(IOULimit,0) as IOULimit FROM USER WHERE RoleID=4',
        [],
        (resp: any, err: any) => {
            // console.log("************** All employee ************  " + resp.length);
            callBack(resp, err);
        },
    );
};

export const getTransportOfficerDetails = (ID:any , callBack: any) => {

    DB.searchData(
        'SELECT DisplayName as Name , USER_ID as ID , IFNULL(IOULimit,0) as IOULimit FROM USER WHERE USER_ID=?',
        [ID],
        (resp: any, err: any) => {
            // console.log("************** All employee ************  " + resp.length);
            callBack(resp, err);
        },
    );
};

export const getAllJobOwners = (callBack: any) => {


    DB.searchData(
        'SELECT USER_ID as ID , DisplayName as Name , DepartmentId , DepartmentName, IOULimit ,EPFNo, SapEmpId , DepartmentId , DepartmentName  FROM USER WHERE RoleID=3',
        [],
        (resp: any, err: any) => {
            // console.log("************** All employee ************  " + resp.length);
            callBack(resp, err);
        },
    );
};

export const getAllLoginUserDetails = (uID:any,callBack: any) => {

    DB.searchData(
        'SELECT IFNULL(IOULimit , 0) as IOULimit , IFNULL(RequestIOULimit,0) as ReqLimit, EPFNo FROM USER WHERE USER_ID=?',
        [uID],
        (resp: any, err: any) => {
            // console.log("************** All employee ************  " + resp.length);
            callBack(resp, err);
        },
    );
};
