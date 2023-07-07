import * as DB from '../DBService';

export const saveIOUSETJOB = (data: any, callBack: any) => {

    var response: any;

    for (let i = 0; i < data.length; ++i) {

        DB.insertOrReplace(
            [
                {
                    table: 'IOU_SETTLEMENT_JOBS',
                    columns: `Job_ID,Job_NO,JobOwner_ID,Request_ID,AccNo,CostCenter,Resource,Expences_Type,Amount,Remark,CreateDate,CreatedBy,IsSync`,
                    values: '?,?,?,?,?,?,?,?,?,?,?,?,?',
                    params: [

                        data[i].Job_ID,
                        data[i].IOUTypeNo,
                        data[i].JobOwner_ID,
                        data[i].PCRCode,
                        data[i].AccNo,
                        data[i].CostCenter,
                        data[i].Resource,
                        data[i].ExpenseType,
                        data[i].Amount,
                        data[i].Remark,
                        data[i].CreateAt,
                        data[i].RequestedBy,
                        0,

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

export const getLastIOUSETJobID = (callBack:any) => {

    DB.searchData(
        'SELECT _Id FROM IOU_SETTLEMENT_JOBS ORDER BY _Id DESC LIMIT 1',
        [],
        (resp: any, err: any) => {
            // console.log("************** Last iou ************  " + resp.length);
            callBack(resp, err);
        },
    );


}
// export const getIOUJobDetailsByID = (jobID:any , callBack:any) => {

//     DB.searchData(
//         'SELECT IOU.IOU_Type as IOUType , IOU_SETTLEMENT_JOBS.*  FROM IOU_SETTLEMENT_JOBS INNER JOIN IOU ON IOU.IOU_ID = IOU_SETTLEMENT_JOBS.Request_ID WHERE IOU_SETTLEMENT_JOBS.Job_ID=?  ',
//         [jobID],
//         (resp: any, err: any) => {
//             // console.log("************** Last iou ************  " + resp.length);
//             callBack(resp);
//         },
//     );


// }


export const getIOUSETJOBDataBYRequestID = (ID: any, callBack:any) => {

    DB.searchData(
        'SELECT IOU_SETTLEMENT.IOU_Type as IOUTypeID, IOU_SETTLEMENT_JOBS.Job_NO as IOUTypeNo,IOU_SETTLEMENT_JOBS.AccNo,IOU_SETTLEMENT_JOBS.CostCenter,IOU_SETTLEMENT_JOBS.Resource, IOU_SETTLEMENT_JOBS.Expences_Type as ExpenseType, IOU_SETTLEMENT_JOBS.Amount as Amount, IOU_SETTLEMENT_JOBS.Remark as Remark, ATTACHMENTS.Img_url FROM IOU_SETTLEMENT_JOBS INNER JOIN IOU_SETTLEMENT ON IOU_SETTLEMENT.IOUSettlement_ID = IOU_SETTLEMENT_JOBS.Request_ID INNER JOIN ATTACHMENTS ON ATTACHMENTS.Request_ID = IOU_SETTLEMENT_JOBS.Request_ID WHERE IOU_SETTLEMENT_JOBS.Request_ID=?',
        [ID],
        (resp: any, err: any) => {
            // console.log("************** Last iou ************  " + resp.length);
            callBack(resp);
        },
    )
}