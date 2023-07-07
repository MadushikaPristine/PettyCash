import * as DB from '../DBService';

export const saveJOB = (data: any, callBack: any) => {

    var response: any;

    for (let i = 0; i < data.length; ++i) {

        DB.insertOrReplace(
            [
                {
                    table: 'JOB',
                    columns: `Job_ID,Job_NO,JobOwner_ID,Request_ID,Expences_Type,Amount,Remark,CreateDate,CreatedBy,Status`,
                    values: '?,?,?,?,?,?,?,?,?,?',
                    params: [

                        data[i].Job_ID,
                        data[i].Job_NO,
                        data[i].JobOwner_ID,
                        data[i].Request_ID,
                        data[i].Expences_Type,
                        data[i].Amount,
                        data[i].Remark,
                        data[i].CreateDate,
                        data[i].CreatedBy,
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

export const getLastJobID = (callBack:any) => {

    DB.searchData(
        'SELECT _Id FROM JOB ORDER BY _Id DESC LIMIT 1',
        [],
        (resp: any, err: any) => {
            // console.log("************** Last iou ************  " + resp.length);
            callBack(resp, err);
        },
    );


}
export const getJobDetailsByID = (jobID:any , callBack:any) => {

    DB.searchData(
        'SELECT IOU.IOU_Type as IOUType , JOB.*  FROM JOB INNER JOIN IOU ON IOU.IOU_ID = JOB.Request_ID WHERE JOB.Job_ID=?  ',
        [jobID],
        (resp: any, err: any) => {
            // console.log("************** Last iou ************  " + resp.length);
            callBack(resp);
        },
    );


}