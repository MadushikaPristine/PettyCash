import * as DB from '../DBService';

export const saveOneOffJOB = (data: any, callBack: any) => {

    var response: any;

    for (let i = 0; i < data.length; ++i) {

        DB.insertOrReplace(
            [
                {
                    table: 'ONE_OFF_SETTLEMENT_JOBS',
                    columns: `Job_ID,Job_NO,JobOwner_ID,Request_ID,AccNo,CostCenter,Resource,Expences_Type,Amount,Remark,CreateDate,CreatedBy,IsSync`,
                    values: '?,?,?,?,?,?,?,?,?,?,?,?,?',
                    params: [

                        data[i].PCRID,
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

export const getLastOneOffJobID = (callBack:any) => {

    DB.searchData(
        'SELECT _Id FROM ONE_OFF_SETTLEMENT_JOBS ORDER BY _Id DESC LIMIT 1',
        [],
        (resp: any, err: any) => {
            // console.log("************** Last iou ************  " + resp.length);
            callBack(resp, err);
        },
    );


}

export const getOneOffJOBDataBYRequestID = (ID: any, callBack:any) => {

    DB.searchData(
        'SELECT ONE_OFF_SETTLEMENT.IOU_Type as IOUTypeID, ONE_OFF_SETTLEMENT_JOBS.Job_No as IOUTypeNo,ONE_OFF_SETTLEMENT_JOBS.AccNo,ONE_OFF_SETTLEMENT_JOBS.CostCenter,ONE_OFF_SETTLEMENT_JOBS.Resource, ONE_OFF_SETTLEMENT_JOBS.Expences_Type as ExpenseType, ONE_OFF_SETTLEMENT_JOBS.Amount as Amount, ONE_OFF_SETTLEMENT_JOBS.Remark as Remark, ATTACHMENTS.Img_url FROM ONE_OFF_SETTLEMENT_JOBS INNER JOIN ONE_OFF_SETTLEMENT ON ONE_OFF_SETTLEMENT.ONEOFFSettlement_ID = ONE_OFF_SETTLEMENT_JOBS.Request_ID INNER JOIN ATTACHMENTS ON ATTACHMENTS.Request_ID = ONE_OFF_SETTLEMENT_JOBS.Request_ID WHERE ONE_OFF_SETTLEMENT_JOBS.Request_ID=?',
        [ID],
        (resp: any, err: any) => {
            // console.log("************** Last iou ************  " + resp.length);
            callBack(resp);
        },
    )
}