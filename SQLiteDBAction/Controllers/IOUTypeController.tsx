import * as DB from '../DBService';

export const saveIOUType = (data: any, callBack: any) => {

    var response: any;

    for (let i = 0; i < data.length; ++i) {

        DB.insertOrReplace(
            [
                {
                    table: 'IOU_TYPE',
                    columns: `IOUType_ID,Description,Status`,
                    values: '?,?,?',
                    params: [

                        data[i].ID,
                        data[i].Type,
                        "1"
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

export const getIOUTypes = (callBack: any) => {

    DB.searchData(
        'SELECT * FROM IOU_TYPE WHERE Status=1',
        [],
        (resp: any, err: any) => {
            //console.log("************** all IOU Types ************  " + resp.length);
            callBack(resp, err);
        },
    );
};