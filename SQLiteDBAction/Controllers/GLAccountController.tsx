import * as DB from '../DBService';

export const saveGLAccount = (data: any, callBack: any) => {

    var response: any;

    for (let i = 0; i < data.length; ++i) {

        DB.insertOrReplace(
            [
                {
                    table: 'GL_ACCOUNT',
                    columns: `ID,ANALYSIS_CODE,GL_ACCOUNT,TYPE,JOB_RELATED,Code,TYPEID`,
                    values: '?,?,?,?,?,?,?',
                    params: [

                        data[i].ID,
                        data[i].ANALYSIS_CODE,
                        data[i].GL_ACCOUNT,
                        data[i].TYPE,
                        data[i].JOB_RELATED,
                        data[i].Code,
                        data[i].TYPEID,

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


export const getAccNoForJobNo = (callBack: any) => {

    DB.searchData(
        'SELECT * FROM GL_ACCOUNT WHERE TYPEID=? AND Code=?',
        [1,"ALL"],
        (resp: any, err: any) => {
            //console.log("************** all IOU Types ************  " + resp.length);
            callBack(resp, err);
        },
    );
};
export const getGLAccNo = (type:any , code :any, callBack: any) => {

    DB.searchData(
        'SELECT * FROM GL_ACCOUNT WHERE TYPEID=? AND ANALYSIS_CODE=?',
        [type,code],
        (resp: any, err: any) => {
            //console.log("************** all IOU Types ************  " + resp.length);
            callBack(resp, err);
        },
    );
};

export const getAccNoByExpenseType = (type:any,callBack: any) => {

    DB.searchData(
        'SELECT * FROM GL_ACCOUNT WHERE Code=?',
        [type],
        (resp: any, err: any) => {
            //console.log("************** all IOU Types ************  " + resp.length);
            callBack(resp, err);
        },
    );
};