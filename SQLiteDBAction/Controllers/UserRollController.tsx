import * as DB from '../DBService';

export const saveUserRolls = (data: any, callBack: any) => {

    var response: any;

    for (let i = 0; i < data.length; ++i) {

        DB.insertOrReplace(
            [
                {
                    table: 'USER_ROLLS',
                    columns: `ROLL_ID,RollName,Status`,
                    values: '?,?,?',
                    params: [

                        data[i].ID,
                        data[i].UserRole,
                        "1",
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


export const getAllUserRolls = (callBack: any) => {

    DB.searchData(
        'SELECT * FROM USER_ROLLS',
        [],
        (resp: any, err: any) => {
            // console.log("************** expense type ************  " + resp.length);
            callBack(resp, err);
        },
    );
};