import * as DB from '../DBService';

export const saveIOUSETJOB = (data: any, type: any, callBack: any) => {

    var response: any;

    console.log(" job details array [[[[[   ", data);


    for (let i = 0; i < data.length; ++i) {

        DB.insertOrReplace(
            [
                {
                    table: 'IOU_SETTLEMENT_JOBS',
                    columns: `Job_ID,Job_NO,JobOwner_ID,Request_ID,AccNo,CostCenter,Resource,Expences_Type,Amount,Remark,CreateDate,CreatedBy,IsSync,Requested_Amount,IstoEdit,IOU_TYPEID`,
                    values: '?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?',
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
                        data[i].RequestedAmount,
                        data[i].IstoEdit,
                        data[i].IOU_TYPEID


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
                    console.log(res, " ..........  error ...  ", err);
                }

            },
        );

    }

};

export const getLastIOUSETJobID = (callBack: any) => {

    DB.searchData(
        'SELECT _Id FROM IOU_SETTLEMENT_JOBS ORDER BY _Id DESC LIMIT 1',
        [],
        (resp: any, err: any) => {
            // console.log("************** Last iou ************  " + resp.length);
            callBack(resp, err);
        },
    );


}
export const DeleteSETSyncedDetailLine = (callBack: any) => {

    DB.deleteData(
        [
          {
            table: 'IOU_SETTLEMENT_JOBS',
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


export const getIOUSETJOBDataBYRequestID = (ID: any, callBack: any) => {

    DB.searchData(
        'SELECT IOU_SETTLEMENT.IOU_Type as IOUTypeID, IOU_SETTLEMENT_JOBS.Job_NO as IOUTypeNo,IOU_SETTLEMENT_JOBS.AccNo,IOU_SETTLEMENT_JOBS.CostCenter,IOU_SETTLEMENT_JOBS.Resource, IOU_SETTLEMENT_JOBS.Expences_Type as ExpenseType, IFNULL(IOU_SETTLEMENT_JOBS.Amount,0) as Amount, IOU_SETTLEMENT_JOBS.Remark as Remark FROM IOU_SETTLEMENT_JOBS INNER JOIN IOU_SETTLEMENT ON IOU_SETTLEMENT.IOUSettlement_ID = IOU_SETTLEMENT_JOBS.Request_ID WHERE IOU_SETTLEMENT_JOBS.Request_ID=?',
        [ID],
        (resp: any, err: any) => {
            // console.log("************** Last iou ************  " + resp.length);
            callBack(resp);
        },
    )
}
export const getIOUSETJOBsBYSettlementID = (ID: any, callBack: any) => {

    DB.searchData(
        'SELECT IOU_SETTLEMENT_JOBS._Id,IOU_SETTLEMENT_JOBS.Job_NO as IOUTypeNo,IOU_SETTLEMENT_JOBS.AccNo,IOU_SETTLEMENT_JOBS.CostCenter,IOU_SETTLEMENT_JOBS.Resource, e.Description as ExpenseType, IFNULL(IOU_SETTLEMENT_JOBS.Amount,0) as Amount, IFNULL(IOU_SETTLEMENT_JOBS.Requested_Amount,0) as Requested_Amount,IOU_SETTLEMENT_JOBS.Remark as Remark ,IOU_SETTLEMENT_JOBS.IstoEdit FROM IOU_SETTLEMENT_JOBS  LEFT OUTER JOIN EXPENSE_TYPE e ON e.ExpType_ID = IOU_SETTLEMENT_JOBS.Expences_Type WHERE IOU_SETTLEMENT_JOBS.Request_ID=?',
        [ID],
        (resp: any, err: any) => {
            // console.log("************** Last iou ************  " + resp.length);
            callBack(resp);
        },
    )
}

export const UpdateSettJobbyId = (AccNo: any, Costcenter: any, Resource: any, Amount: any, Remark: any, ExpID:any, ID: any, callBack: any) => {

    DB.updateData(
        'UPDATE IOU_SETTLEMENT_JOBS SET AccNo=? , CostCenter=? , Resource=? , Amount=? , Remark=? , Expences_Type=?  WHERE _Id=?',
        [AccNo, Costcenter, Resource, Amount, Remark, ExpID, ID],
        (resp: any, err: any) => {
            callBack(resp, err)

        },
    );
};

export const getJobDetailsById = (ID: any, callBack: any) => {

    DB.searchData(
        'SELECT IOU_SETTLEMENT_JOBS._Id,IOU_SETTLEMENT_JOBS.Job_NO as IOUTypeNo,IOU_SETTLEMENT_JOBS.AccNo,IOU_SETTLEMENT_JOBS.CostCenter,IOU_SETTLEMENT_JOBS.Resource, IOU_SETTLEMENT_JOBS.Expences_Type as ExpenseType, IFNULL(IOU_SETTLEMENT_JOBS.Amount,0) as Amount, IFNULL(IOU_SETTLEMENT_JOBS.Requested_Amount,0) as Requested_Amount,IOU_SETTLEMENT_JOBS.Remark as Remark ,IOU_SETTLEMENT_JOBS.IstoEdit FROM IOU_SETTLEMENT_JOBS WHERE IOU_SETTLEMENT_JOBS._Id=?',
        [ID],
        (resp: any, err: any) => {
            // console.log("************** Last iou ************  " + resp.length);
            callBack(resp);
        },
    )

}
export const getSettlementJobAmount = (ID: any, callBack: any) => {

    DB.searchData(
        ' SELECT IFNULL(SUM(Amount),0) as totAmount FROM IOU_SETTLEMENT_JOBS WHERE Request_ID=?',
        [ID],
        (resp: any, err: any) => {
            // console.log("************** Last iou ************  " + resp.length);
            callBack(resp);
        },
    )

}
export const DeleteAllDetailsIOUJobs = (ID: any, callBack: any) => {

    DB.searchData(
        ' DELETE FROM IOU_SETTLEMENT_JOBS WHERE Request_ID=?',
        [ID],
        (resp: any, err: any) => {
            // console.log("************** Last iou ************  " + resp.length);
            callBack(resp);
        },
    )

}
export const DeleteJobByID = (ID: any, callBack: any) => {

    DB.searchData(
        ' DELETE FROM IOU_SETTLEMENT_JOBS WHERE _Id=?',
        [ID],
        (resp: any, err: any) => {
            // console.log("************** Last iou ************  " + resp.length);
            callBack(resp);
        },
    )

}

export const updateSettlementDetailLineSyncStatus = (ID: any, callBack: any) => {

    DB.updateData(
        'UPDATE IOU_SETTLEMENT_JOBS SET IsSync=1 WHERE Request_ID=?',
        [ID],
        (resp: any, err: any) => {
            callBack(resp, err)

        },
    );
};




