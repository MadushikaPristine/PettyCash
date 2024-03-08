import * as DB from '../DBService';

export const saveOneOffJOB = (data: any, type: any, callBack: any) => {

    var response: any;

    for (let i = 0; i < data.length; ++i) {

        DB.insertOrReplace(
            [
                {
                    table: 'ONE_OFF_SETTLEMENT_JOBS',
                    columns: `Job_ID,Job_NO,JobOwner_ID,Request_ID,AccNo,CostCenter,Resource,Expences_Type,Amount,Remark,CreateDate,CreatedBy,IsSync`,
                    values: '?,?,?,?,?,?,?,?,?,?,?,?,?',
                    params: [

                        data[i].ID,
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
                        parseInt(type),

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

export const getLastOneOffJobID = (callBack: any) => {

    DB.searchData(
        'SELECT _Id FROM ONE_OFF_SETTLEMENT_JOBS ORDER BY _Id DESC LIMIT 1',
        [],
        (resp: any, err: any) => {
            // console.log("************** Last iou ************  " + resp.length);
            callBack(resp, err);
        },
    );


}

export const DeleteOneOffSyncedDetailLine = (callBack: any) => {

    DB.deleteData(
        [
          {
            table: 'ONE_OFF_SETTLEMENT_JOBS',
            query: "WHERE IsSync=? ",
            params: [1],
          },
        ],
        (resp: any, err: any) => {
          console.log(resp, ">>>>>>", err);
    
          callBack(resp, err);
        },
      );


}

export const getOneOffJOBDataBYRequestID = (ID: any, callBack: any) => {

    DB.searchData(
        'SELECT ONE_OFF_SETTLEMENT.IOU_Type as IOUTypeID, ONE_OFF_SETTLEMENT_JOBS.Job_No as IOUTypeNo,ONE_OFF_SETTLEMENT_JOBS.AccNo,ONE_OFF_SETTLEMENT_JOBS.CostCenter,ONE_OFF_SETTLEMENT_JOBS.Resource, ONE_OFF_SETTLEMENT_JOBS.Expences_Type as ExpenseType, ONE_OFF_SETTLEMENT_JOBS.Amount as Amount, ONE_OFF_SETTLEMENT_JOBS.Remark as Remark FROM ONE_OFF_SETTLEMENT_JOBS INNER JOIN ONE_OFF_SETTLEMENT ON ONE_OFF_SETTLEMENT.ONEOFFSettlement_ID = ONE_OFF_SETTLEMENT_JOBS.Request_ID WHERE ONE_OFF_SETTLEMENT_JOBS.Request_ID=?',
        [ID],
        (resp: any, err: any) => {
            // console.log("************** Last iou ************  " + resp.length);
            callBack(resp);
        },
    )
}

export const getOneOffJobsByID = (ID: any, callBack: any) => {

    DB.searchData(
        'SELECT io._Id,io.Job_NO as IOUTypeNo,io.AccNo,io.CostCenter,io.Resource,e.Description,io.Amount,io.Remark,e.Description as ExpenseType FROM ONE_OFF_SETTLEMENT_JOBS io LEFT OUTER JOIN EXPENSE_TYPE e ON e.ExpType_ID = io.Expences_Type WHERE io.Request_ID=?',
        [ID],
        (resp: any, err: any) => {
            // console.log("************** Last iou ************  " + resp.length);
            callBack(resp, err);
        },
    );


}

export const DeleteOneOffJobByID = (ID: any, callBack: any) => {

    DB.searchData(
        ' DELETE FROM ONE_OFF_SETTLEMENT_JOBS WHERE _Id=?',
        [ID],
        (resp: any, err: any) => {
            // console.log("************** Last iou ************  " + resp.length);
            callBack(resp);
        },
    )

}

export const getOneOFFJobTotAmount = (ID: any, callBack: any) => {

    DB.searchData(
        'SELECT IFNULL(SUM(Amount),0) as totAmount FROM ONE_OFF_SETTLEMENT_JOBS WHERE Request_ID=?',
        [ID],
        (resp: any, err: any) => {
            // console.log("************** Last iou ************  " + resp.length);
            callBack(resp, err);
        },
    );
};

export const updateDetailLineSyncStatus = (ID: any, callBack: any) => {

    DB.updateData(
        'UPDATE ONE_OFF_SETTLEMENT_JOBS SET IsSync=1 WHERE Request_ID=?',
        [ID],
        (resp: any, err: any) => {
            callBack(resp, err)

        },
    );
};