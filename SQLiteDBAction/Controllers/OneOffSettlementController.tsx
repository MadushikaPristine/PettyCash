import * as DB from '../DBService';

export const saveOneOffSettlement = (data: any, callBack: any) => {

    var response: any;

    for (let i = 0; i < data.length; ++i) {

        DB.insertOrReplace(
            [
                {
                    table: 'ONE_OFF_SETTLEMENT',
                    columns: `ONEOFFSettlement_ID,JobOwner_ID,IOU_Type,EmpId,RequestDate,Amount,Approve_Status,CreatedBy,IsSync,Approve_Remark,Reject_Remark,Attachment_Status,ApprovedBy,HOD,FirstActionBy,FirstActionAt,RIsLimit,AIsLimit,RIOULimit,AIOULimit,SecondActionBy,SecondActionAt`,
                    values: '?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?',
                    params: [

                        data[i].PCRCode,
                        data[i].JobOwner,
                        data[i].IOUType,
                        data[i].EmpId,
                        data[i].RequestedDate,
                        data[i].Amount,
                        data[i].StatusID,
                        data[i].RequestedBy,
                        0,
                        data[i].REMARK,
                        "",
                        "0",
                        data[i].FirstActionBy,
                        data[i].HOD,
                        data[i].FirstActionBy,
                        data[i].FirstActionAt,
                        data[i].RIsLimit,
                        data[i].AIsLimit,
                        data[i].RIouLimit,
                        data[i].AIouLimit,
                        data[i].SecondActionBy,
                        data[i].SecondActionAt


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

//---Approved IOU----------------------------------------------------

export const ApprovedONEOFF = (ID: any, callBack: any) => {

    DB.updateData(
        'UPDATE ONE_OFF_SETTLEMENT SET Approve_Status=2 WHERE ONEOFFSettlement_ID=?',
        [ID],
        (resp: any, err: any) => {
            callBack(resp, err)

        },
    );
};

//-----Reject IOU--------------------------------------------------

export const RejectedONEOFF = (ID: any, callBack: any) => {

    DB.updateData(
        'UPDATE ONE_OFF_SETTLEMENT SET Approve_Status=3 WHERE ONEOFFSettlement_ID=?',
        [ID],
        (resp: any, err: any) => {
            callBack(resp, err)

        },
    );
};

//-----Cancel IOU--------------------------------------------------

export const CancelledONEOFF = (ID: any, callBack: any) => {

    DB.updateData(
        'UPDATE ONE_OFF_SETTLEMENT SET Approve_Status=4 WHERE ONEOFFSettlement_ID=?',
        [ID],
        (resp: any, err: any) => {
            callBack(resp, err)

        },
    );
};

//---------update approve remark-----------------

export const saveApproveRemarkONEOFF = (remark: any, ID: any, callBack: any) => {
    DB.updateData(
        'UPDATE ONE_OFF_SETTLEMENT SET Approve_Remark=? WHERE IOU_ID=?',
        [remark, ID],
        (resp: any, err: any) => {
            callBack(resp, err)
        },
    );
};

export const getLastOneOffSettlement = (callBack: any) => {
    DB.searchData(
        'SELECT _Id FROM ONE_OFF_SETTLEMENT ORDER BY _Id DESC LIMIT 1',
        [],
        (resp: any, err: any) => {
            // console.log("************** Last iou ************  " + resp.length);
            callBack(resp, err);
        }
    )
}

export const getApprovedIOUOFS = (callBack: any) => {

    DB.searchData(
        'SELECT ONE_OFF_SETTLEMENT._Id as Id ,ONE_OFF_SETTLEMENT.ONEOFFSettlement_ID as ID ,USER.DisplayName as employee ,USER.USER_ID, IFNULL(ONE_OFF_SETTLEMENT.Amount , 0) as Amount, ONE_OFF_SETTLEMENT.Approve_Status,ONE_OFF_SETTLEMENT.Approve_Remark, RequestDate  FROM ONE_OFF_SETTLEMENT INNER JOIN USER ON ONE_OFF_SETTLEMENT.CreatedBy = USER.USER_ID  WHERE ONE_OFF_SETTLEMENT.Approve_Status=2 ORDER BY ONE_OFF_SETTLEMENT._Id DESC',
        [],
        (resp: any, err: any) => {

            callBack(resp, err);
        },
    );
};

export const getRejectIOUOFS = (callBack: any) => {

    DB.searchData(
        'SELECT ONE_OFF_SETTLEMENT._Id as Id ,ONE_OFF_SETTLEMENT.ONEOFFSettlement_ID as ID ,USER.DisplayName as employee ,USER.USER_ID, IFNULL(ONE_OFF_SETTLEMENT.Amount , 0) as Amount, ONE_OFF_SETTLEMENT.Approve_Status,ONE_OFF_SETTLEMENT.Approve_Remark, RequestDate  FROM ONE_OFF_SETTLEMENT INNER JOIN USER ON ONE_OFF_SETTLEMENT.CreatedBy = USER.USER_ID  WHERE ONE_OFF_SETTLEMENT.Approve_Status=3 ORDER BY ONE_OFF_SETTLEMENT._Id DESC',
        [],
        (resp: any, err: any) => {

            callBack(resp, err);
        },
    );
};

export const getCancelledIOUOFS = (callBack: any) => {

    DB.searchData(
        'SELECT ONE_OFF_SETTLEMENT._Id as Id ,ONE_OFF_SETTLEMENT.ONEOFFSettlement_ID as ID ,USER.DisplayName as employee ,USER.USER_ID, IFNULL(ONE_OFF_SETTLEMENT.Amount , 0) as Amount, ONE_OFF_SETTLEMENT.Approve_Status,ONE_OFF_SETTLEMENT.Approve_Remark, RequestDate  FROM ONE_OFF_SETTLEMENT INNER JOIN USER ON ONE_OFF_SETTLEMENT.CreatedBy = USER.USER_ID  WHERE ONE_OFF_SETTLEMENT.Approve_Status=4 ORDER BY ONE_OFF_SETTLEMENT._Id DESC',
        [],
        (resp: any, err: any) => {

            callBack(resp, err);
        },
    );
};



export const getPendingOneOffSettlement = (callBack: any) => {

    DB.searchData(
        // 'SELECT ONE_OFF_SETTLEMENT.ONEOFFSettlement_ID AS ID, ONE_OFF_SETTLEMENT.Amount, EMPLOYEE.EmpName FROM ONE_OFF_SETTLEMENT INNER JOIN EMPLOYEE ON ONE_OFF_SETTLEMENT.EmpId = EMPLOYEE.Emp_ID INNER JOIN WHERE Approve_Status=0 ORDER BY _Id DESC',
        'SELECT * FROM ONE_OFF_SETTLEMENT WHERE Approve_Status=1 ORDER BY _Id DESC',
        [],
        (resp: any, err: any) => {
            // console.log("************** Last iou settlement ************  " + resp.length);
            callBack(resp, err);
        },
    );
};
export const getPendingOneOffSettlementHome = (callBack: any) => {

    DB.searchData(
        // 'SELECT ONE_OFF_SETTLEMENT.ONEOFFSettlement_ID AS ID, ONE_OFF_SETTLEMENT.Amount, EMPLOYEE.EmpName FROM ONE_OFF_SETTLEMENT INNER JOIN EMPLOYEE ON ONE_OFF_SETTLEMENT.EmpId = EMPLOYEE.Emp_ID INNER JOIN WHERE Approve_Status=0 ORDER BY _Id DESC',
        'SELECT * FROM ONE_OFF_SETTLEMENT WHERE Approve_Status=1 ORDER BY _Id DESC LIMIT 10',
        [],
        (resp: any, err: any) => {
            // console.log("************** Last iou settlement ************  " + resp.length);
            callBack(resp, err);
        },
    );
};


export const getPendingOneOffSetList = (callBack: any) => {

    DB.searchData(
        'SELECT ONE_OFF_SETTLEMENT._Id as Id ,ONE_OFF_SETTLEMENT.ONEOFFSettlement_ID as ID ,USER.DisplayName as employee ,USER.USER_ID,IFNULL(ONE_OFF_SETTLEMENT.Amount ,0) as Amount, ONE_OFF_SETTLEMENT.Approve_Status,ONE_OFF_SETTLEMENT.Approve_Remark, RequestDate  FROM ONE_OFF_SETTLEMENT INNER JOIN USER ON ONE_OFF_SETTLEMENT.CreatedBy = USER.USER_ID  WHERE ONE_OFF_SETTLEMENT.Approve_Status=1 ORDER BY ONE_OFF_SETTLEMENT._Id DESC',
        [],
        (resp: any, err: any) => {

            callBack(resp, err);
        },
    );

};

//------IOU PENDING LIST FILTER BY DATE-------

export const getDateFilterONEOFFList = (firstDate: any, secondDate: any, callBack: any) => {
    //console.log(firstDate);
    DB.searchData(
        'SELECT ONE_OFF_SETTLEMENT._Id as Id ,ONE_OFF_SETTLEMENT.ONEOFFSettlement_ID as ID ,USER.DisplayName as employee ,USER.USER_ID, IFNULL(ONE_OFF_SETTLEMENT.Amount ,0) as Amount, ONE_OFF_SETTLEMENT.Approve_Status,ONE_OFF_SETTLEMENT.Approve_Remark, RequestDate FROM ONE_OFF_SETTLEMENT INNER JOIN USER ON ONE_OFF_SETTLEMENT.CreatedBy = USER.USER_ID WHERE RequestDate >= ? AND RequestDate <= ? AND ONE_OFF_SETTLEMENT.Approve_Status=1 ORDER BY ONE_OFF_SETTLEMENT._Id DESC',
        [firstDate, secondDate],

        (resp: any, err: any) => {

            callBack(resp, err);
        },

    );


};

//------ONEOFF Approve LIST FILTER BY DATE-------

export const getDateFilterONEOFFApproveList = (firstDate: any, secondDate: any, callBack: any) => {
    //console.log(firstDate);
    DB.searchData(
        'SELECT ONE_OFF_SETTLEMENT._Id as Id ,ONE_OFF_SETTLEMENT.ONEOFFSettlement_ID as ID ,USER.DisplayName as employee ,USER.USER_ID, IFNULL(ONE_OFF_SETTLEMENT.Amount ,0) as Amount, ONE_OFF_SETTLEMENT.Approve_Status,ONE_OFF_SETTLEMENT.Approve_Remark, RequestDate FROM ONE_OFF_SETTLEMENT INNER JOIN USER ON ONE_OFF_SETTLEMENT.CreatedBy = USER.USER_ID WHERE RequestDate >= ? AND RequestDate <= ? AND ONE_OFF_SETTLEMENT.Approve_Status=2 ORDER BY ONE_OFF_SETTLEMENT._Id DESC',
        [firstDate, secondDate],

        (resp: any, err: any) => {

            callBack(resp, err);
        },

    );


};

//------ONEOFF Reject LIST FILTER BY DATE-------

export const getDateFilterONEOFFRejectList = (firstDate: any, secondDate: any, callBack: any) => {
    //console.log(firstDate);
    DB.searchData(
        'SELECT ONE_OFF_SETTLEMENT._Id as Id ,ONE_OFF_SETTLEMENT.ONEOFFSettlement_ID as ID ,USER.DisplayName as employee ,USER.USER_ID, IFNULL(ONE_OFF_SETTLEMENT.Amount ,0) as Amount, ONE_OFF_SETTLEMENT.Approve_Status,ONE_OFF_SETTLEMENT.Approve_Remark, RequestDate FROM ONE_OFF_SETTLEMENT INNER JOIN USER ON ONE_OFF_SETTLEMENT.CreatedBy = USER.USER_ID WHERE RequestDate >= ? AND RequestDate <= ? AND ONE_OFF_SETTLEMENT.Approve_Status=3 ORDER BY ONE_OFF_SETTLEMENT._Id DESC',
        [firstDate, secondDate],

        (resp: any, err: any) => {

            callBack(resp, err);
        },

    );


};

//------ONEOFF Cancelled LIST FILTER BY DATE-------

export const getDateFilterONEOFFCancelList = (firstDate: any, secondDate: any, callBack: any) => {
    //console.log(firstDate);
    DB.searchData(
        'SELECT ONE_OFF_SETTLEMENT._Id as Id ,ONE_OFF_SETTLEMENT.ONEOFFSettlement_ID as ID ,USER.DisplayName as employee ,USER.USER_ID, IFNULL(ONE_OFF_SETTLEMENT.Amount ,0) as Amount, ONE_OFF_SETTLEMENT.Approve_Status,ONE_OFF_SETTLEMENT.Approve_Remark, RequestDate FROM ONE_OFF_SETTLEMENT INNER JOIN USER ON ONE_OFF_SETTLEMENT.CreatedBy = USER.USER_ID WHERE RequestDate >= ? AND RequestDate <= ? AND ONE_OFF_SETTLEMENT.Approve_Status=4 ORDER BY ONE_OFF_SETTLEMENT._Id DESC',
        [firstDate, secondDate],

        (resp: any, err: any) => {

            callBack(resp, err);
        },

    );


};


export const getOneOffJobsListByID = (RequestID: any, callBack: any) => {

    DB.searchData(
        'SELECT ONE_OFF_SETTLEMENT_JOBS._Id,ONE_OFF_SETTLEMENT_JOBS.Job_ID, ONE_OFF_SETTLEMENT.JobOwner_ID,ONE_OFF_SETTLEMENT.IOU_Type, ONE_OFF_SETTLEMENT.ONEOFFSettlement_ID, ONE_OFF_SETTLEMENT_JOBS.Job_NO as IOUTypeNo, ONE_OFF_SETTLEMENT_JOBS.Expences_Type as ExpenseType, IFNULL(ONE_OFF_SETTLEMENT.Amount ,0) as Amount, ONE_OFF_SETTLEMENT_JOBS.Remark, ONE_OFF_SETTLEMENT_JOBS.AccNo, ONE_OFF_SETTLEMENT_JOBS.CostCenter, ONE_OFF_SETTLEMENT_JOBS.Resource FROM ONE_OFF_SETTLEMENT INNER JOIN ONE_OFF_SETTLEMENT_JOBS ON ONE_OFF_SETTLEMENT.ONEOFFSettlement_ID = ONE_OFF_SETTLEMENT_JOBS.Request_ID WHERE ONE_OFF_SETTLEMENT.ONEOFFSettlement_ID=?',
        [RequestID],
        (resp: any, err: any) => {
            callBack(resp, err);
        },
    );
};


//---------IOU Total amount------------------

export const getONEOFFToatalAmount = (callBack: any) => {
    DB.searchData(
        'SELECT IFNULL(SUM(Amount),0) as TotalAmount FROM ONE_OFF_SETTLEMENT  WHERE Approve_Status=1',
        //'SELECT Amount FROM IOU',
        [],
        (resp: any, err: any) => {

            callBack(resp, err);
            // console.log(resp);
        },
    )
}

//----------ReOpen Request data----------------

export const getOneOffReOpenRequest = (RequestID: any, callBack: any) => {

    DB.searchData(
        'SELECT * FROM ONE_OFF_SETTLEMENT INNER JOIN ONE_OFF_SETTLEMENT_JOBS ON ONE_OFF_SETTLEMENT.ONEOFFSettlement_ID = ONE_OFF_SETTLEMENT_JOBS.Request_ID WHERE ONE_OFF_SETTLEMENT.ONEOFFSettlement_ID=?',
        [RequestID],
        (resp: any, err: any) => {
            callBack(resp, err);
        },
    );
};

export const updateOneOffSyncStatus = (ID: any, callBack: any) => {

    DB.updateData(
        'UPDATE ONE_OFF_SETTLEMENT SET IsSync=0 WHERE ONEOFFSettlement_ID=?',
        [ID],
        (resp: any, err: any) => {
            callBack(resp, err)

        },
    );
};




