import * as DB from '../DBService';

export const saveIOUSettlement = (data: any, type: any, callBack: any) => {

    var response: any;

    for (let i = 0; i < data.length; ++i) {

        DB.insertOrReplace(
            [
                {
                    table: 'IOU_SETTLEMENT',
                    columns: `IOUSettlement_ID,IOU_ID,JobOwner_ID,IOU_Type,EmpId,RequestDate,Amount,Approve_Status,CreatedBy,IsSync,Approve_Remark,Reject_Remark,Attachment_Status,ApprovedBy,HOD,FirstActionBy,FirstActionAt,RIsLimit,AIsLimit,RIOULimit,AIOULimit,SecondActionBy,SecondActionAt,ActionStep,WebRefID`,
                    values: '?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?',
                    params: [

                        data[i].PCRCode,
                        data[i].IOU,
                        data[i].JobOwner,
                        data[i].IOUType,
                        data[i].EmployeeNo,
                        data[i].RequestedDate,
                        data[i].Amount,
                        data[i].StatusID,
                        data[i].RequestedBy,
                        parseInt(type),
                        data[i].Remark,
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
                        data[i].SecondActionAt,
                        data[i].ActionStep,
                        data[i].ID

                    ],
                },
            ],
            (res: any, err: any) => {

                // console.log(" save response ===  " , res);

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
                        console.log(res, " ..........  error ...  ", err);

                    }
                }

            },
        );

    }

};

//---Approved IOU----------------------------------------------------

export const ApprovedIOUSET = (ID: any, callBack: any) => {

    DB.updateData(
        'UPDATE IOU_SETTLEMENT SET Approve_Status=2 WHERE IOUSettlement_ID=?',
        [ID],
        (resp: any, err: any) => {
            callBack(resp, err)

        },
    );
};

//-----Reject IOU--------------------------------------------------

export const RejectedIOUSET = (ID: any, callBack: any) => {

    DB.updateData(
        'UPDATE IOU_SETTLEMENT SET Approve_Status=3 WHERE IOUSettlement_ID=?',
        [ID],
        (resp: any, err: any) => {
            callBack(resp, err)

        },
    );
};

//-----Cancel IOU--------------------------------------------------

export const CancelledIOUSET = (ID: any, callBack: any) => {

    DB.updateData(
        'UPDATE IOU_SETTLEMENT SET Approve_Status=4 WHERE IOUSettlement_ID=?',
        [ID],
        (resp: any, err: any) => {
            callBack(resp, err)

        },
    );
};

//---------update approve remark-----------------

export const saveApproveRemarkIOUSET = (remark: any, ID: any, callBack: any) => {
    DB.updateData(
        'UPDATE IOU_SETTLEMENT SET Approve_Remark=? WHERE IOU_ID=?',
        [remark, ID],
        (resp: any, err: any) => {
            callBack(resp, err)
        },
    );
};




export const getLastIOUSettlemnt = (callBack: any) => {

    DB.searchData(
        'SELECT _Id FROM IOU_SETTLEMENT ORDER BY _Id DESC LIMIT 1',
        [],
        (resp: any, err: any) => {
            // console.log("************** Last iou settlement ************  " + resp.length);
            callBack(resp, err);
        },
    );
};

export const getPendingIOUSettlement = (callBack: any) => {

    DB.searchData(
        // 'SELECT IOU_SETTLEMENT.IOUSettlement_ID AS ID, IOU_SETTLEMENT.Amount, EMPLOYEE.EmpName FROM IOU_SETTLEMENT INNER JOIN EMPLOYEE ON IOU_SETTLEMENT.EmpId = EMPLOYEE.Emp_ID INNER JOIN WHERE Approve_Status=0 ORDER BY _Id DESC',
        'SELECT * FROM IOU_SETTLEMENT WHERE Approve_Status=1 ORDER BY _Id DESC',
        [],
        (resp: any, err: any) => {
            // console.log("************** Last iou settlement ************  " + resp.length);
            callBack(resp, err);
        },
    );
};
export const getPendingIOUSettlementHome = (callBack: any) => {

    DB.searchData(
        // 'SELECT IOU_SETTLEMENT.IOUSettlement_ID AS ID, IOU_SETTLEMENT.Amount, EMPLOYEE.EmpName FROM IOU_SETTLEMENT INNER JOIN EMPLOYEE ON IOU_SETTLEMENT.EmpId = EMPLOYEE.Emp_ID INNER JOIN WHERE Approve_Status=0 ORDER BY _Id DESC',
        'SELECT * FROM IOU_SETTLEMENT WHERE Approve_Status=1  OR Approve_Status=5 ORDER BY _Id DESC LIMIT 10',
        [],
        (resp: any, err: any) => {
            // console.log("************** Last iou settlement ************  " + resp.length);
            callBack(resp, err);
        },
    );
};

export const getApprovedIOUSET = (callBack: any) => {

    DB.searchData(
        'SELECT IOU_SETTLEMENT._Id as Id ,IOU_SETTLEMENT.IOUSettlement_ID as ID ,USER.DisplayName as employee, USER.USER_ID, IFNULL(IOU_SETTLEMENT.Amount,0) as Amount,IOU_SETTLEMENT.Approve_Status,IOU_SETTLEMENT.Approve_Remark, RequestDate FROM IOU_SETTLEMENT INNER JOIN USER ON IOU_SETTLEMENT.CreatedBy = USER.USER_ID WHERE IOU_SETTLEMENT.Approve_Status=2 ORDER BY IOU_SETTLEMENT._Id DESC',
        [],
        (resp: any, err: any) => {

            callBack(resp, err);
        },
    );
};

export const getRejectIOUSET = (callBack: any) => {

    DB.searchData(
        'SELECT IOU_SETTLEMENT._Id as Id ,IOU_SETTLEMENT.IOUSettlement_ID as ID ,USER.DisplayName as employee, USER.USER_ID,  IFNULL(IOU_SETTLEMENT.Amount,0) as Amount,IOU_SETTLEMENT.Approve_Status,IOU_SETTLEMENT.Approve_Remark, RequestDate FROM IOU_SETTLEMENT INNER JOIN USER ON IOU_SETTLEMENT.CreatedBy = USER.USER_ID WHERE IOU_SETTLEMENT.Approve_Status=3 ORDER BY IOU_SETTLEMENT._Id DESC',
        [],
        (resp: any, err: any) => {

            callBack(resp, err);
        },
    );
};

export const getCancelledIOUSET = (callBack: any) => {

    DB.searchData(
        'SELECT IOU_SETTLEMENT._Id as Id ,IOU_SETTLEMENT.IOUSettlement_ID as ID ,USER.DisplayName as employee, USER.USER_ID,  IFNULL(IOU_SETTLEMENT.Amount,0) as Amount,IOU_SETTLEMENT.Approve_Status,IOU_SETTLEMENT.Approve_Remark, RequestDate FROM IOU_SETTLEMENT INNER JOIN USER ON IOU_SETTLEMENT.CreatedBy = USER.USER_ID WHERE IOU_SETTLEMENT.Approve_Status=4 ORDER BY IOU_SETTLEMENT._Id DESC',
        [],
        (resp: any, err: any) => {

            callBack(resp, err);
        },
    );
};


export const getPendingIOUSetList = (roleID: any, callBack: any) => {

    if (roleID == '3') {
        //Job owner  

        DB.searchData(
            'SELECT IOU_SETTLEMENT._Id as Id ,IOU_SETTLEMENT.IOUSettlement_ID as ID ,USER.DisplayName as employee, USER.USER_ID,  IFNULL(IOU_SETTLEMENT.Amount,0) as Amount,IOU_SETTLEMENT.Approve_Status,IOU_SETTLEMENT.Approve_Remark, RequestDate FROM IOU_SETTLEMENT INNER JOIN USER ON IOU_SETTLEMENT.CreatedBy = USER.USER_ID WHERE IOU_SETTLEMENT.Approve_Status=1 AND IOU_SETTLEMENT.IOU_Type=1 ORDER BY IOU_SETTLEMENT._Id DESC',
            [],
            (resp: any, err: any) => {
    
                callBack(resp, err);
            },
        );

    } else {
        //transport officer

        DB.searchData(
            'SELECT IOU_SETTLEMENT._Id as Id ,IOU_SETTLEMENT.IOUSettlement_ID as ID ,USER.DisplayName as employee, USER.USER_ID,  IFNULL(IOU_SETTLEMENT.Amount,0) as Amount,IOU_SETTLEMENT.Approve_Status,IOU_SETTLEMENT.Approve_Remark, RequestDate FROM IOU_SETTLEMENT INNER JOIN USER ON IOU_SETTLEMENT.CreatedBy = USER.USER_ID WHERE IOU_SETTLEMENT.Approve_Status=1 AND IOU_SETTLEMENT.IOU_Type=2 ORDER BY IOU_SETTLEMENT._Id DESC',
            [],
            (resp: any, err: any) => {
    
                callBack(resp, err);
            },
        );
    }

   

};
export const getAllPendingIOUSetList = (callBack: any) => {

    DB.searchData(
        'SELECT IOU_SETTLEMENT._Id as Id ,IOU_SETTLEMENT.IOUSettlement_ID as ID ,USER.DisplayName as employee, USER.USER_ID,  IFNULL(IOU_SETTLEMENT.Amount,0) as Amount,IOU_SETTLEMENT.Approve_Status,IOU_SETTLEMENT.Approve_Remark, RequestDate FROM IOU_SETTLEMENT INNER JOIN USER ON IOU_SETTLEMENT.CreatedBy = USER.USER_ID WHERE IOU_SETTLEMENT.Approve_Status=1 OR IOU_SETTLEMENT.Approve_Status=5 ORDER BY IOU_SETTLEMENT._Id DESC',
        [],
        (resp: any, err: any) => {

            callBack(resp, err);
        },
    );

};
export const getHODPendingIOUSetList = (callBack: any) => {

    DB.searchData(
        'SELECT IOU_SETTLEMENT._Id as Id ,IOU_SETTLEMENT.IOUSettlement_ID as ID ,USER.DisplayName as employee, USER.USER_ID,  IFNULL(IOU_SETTLEMENT.Amount,0) as Amount,IOU_SETTLEMENT.Approve_Status,IOU_SETTLEMENT.Approve_Remark, RequestDate FROM IOU_SETTLEMENT INNER JOIN USER ON IOU_SETTLEMENT.CreatedBy = USER.USER_ID WHERE IOU_SETTLEMENT.Approve_Status=5 ORDER BY IOU_SETTLEMENT._Id DESC',
        [],
        (resp: any, err: any) => {

            callBack(resp, err);
        },
    );

};

//------IOUSET PENDING LIST FILTER BY DATE-------

export const getDateFilterIOUSETList = (firstDate: any, secondDate: any, callBack: any) => {
    //console.log(firstDate);
    DB.searchData(
        'SELECT IOU_SETTLEMENT._Id as Id ,IOU_SETTLEMENT.IOUSettlement_ID as ID ,USER.DisplayName as employee, USER.USER_ID,  IFNULL(IOU_SETTLEMENT.Amount,0) as Amount,IOU_SETTLEMENT.Approve_Status,IOU_SETTLEMENT.Approve_Remark, RequestDate FROM IOU_SETTLEMENT INNER JOIN USER ON IOU_SETTLEMENT.CreatedBy = USER.USER_ID WHERE RequestDate >= ? AND RequestDate <= ? AND IOU_SETTLEMENT.Approve_Status=1 ORDER BY IOU_SETTLEMENT._Id DESC',
        [firstDate, secondDate],

        (resp: any, err: any) => {

            callBack(resp, err);
        },

    );


};

//------IOUSET APPROVED LIST FILTER BY DATE-------

export const getDateFilterIOUSETApproveList = (firstDate: any, secondDate: any, callBack: any) => {
    //console.log(firstDate);
    DB.searchData(
        'SELECT IOU_SETTLEMENT._Id as Id ,IOU_SETTLEMENT.IOUSettlement_ID as ID ,USER.DisplayName as employee, USER.USER_ID,  IFNULL(IOU_SETTLEMENT.Amount,0) as Amount,IOU_SETTLEMENT.Approve_Status,IOU_SETTLEMENT.Approve_Remark, RequestDate FROM IOU_SETTLEMENT INNER JOIN USER ON IOU_SETTLEMENT.CreatedBy = USER.USER_ID WHERE RequestDate >= ? AND RequestDate <= ? AND IOU_SETTLEMENT.Approve_Status=2 ORDER BY IOU_SETTLEMENT._Id DESC',
        [firstDate, secondDate],

        (resp: any, err: any) => {

            callBack(resp, err);
        },

    );


};

//------IOUSET REJECTED LIST FILTER BY DATE-------

export const getDateFilterIOUSETRejectList = (firstDate: any, secondDate: any, callBack: any) => {
    //console.log(firstDate);
    DB.searchData(
        'SELECT IOU_SETTLEMENT._Id as Id ,IOU_SETTLEMENT.IOUSettlement_ID as ID ,USER.DisplayName as employee, USER.USER_ID,  IFNULL(IOU_SETTLEMENT.Amount,0) as Amount,IOU_SETTLEMENT.Approve_Status,IOU_SETTLEMENT.Approve_Remark, RequestDate FROM IOU_SETTLEMENT INNER JOIN USER ON IOU_SETTLEMENT.CreatedBy = USER.USER_ID WHERE RequestDate >= ? AND RequestDate <= ? AND IOU_SETTLEMENT.Approve_Status=3 ORDER BY IOU_SETTLEMENT._Id DESC',
        [firstDate, secondDate],

        (resp: any, err: any) => {

            callBack(resp, err);
        },

    );


};

//------IOUSET CANCELLED LIST FILTER BY DATE-------

export const getDateFilterIOUSETCancelList = (firstDate: any, secondDate: any, callBack: any) => {
    //console.log(firstDate);
    DB.searchData(
        'SELECT IOU_SETTLEMENT._Id as Id ,IOU_SETTLEMENT.IOUSettlement_ID as ID ,USER.DisplayName as employee, USER.USER_ID,  IFNULL(IOU_SETTLEMENT.Amount,0) as Amount,IOU_SETTLEMENT.Approve_Status,IOU_SETTLEMENT.Approve_Remark, RequestDate FROM IOU_SETTLEMENT INNER JOIN USER ON IOU_SETTLEMENT.CreatedBy = USER.USER_ID WHERE RequestDate >= ? AND RequestDate <= ? AND IOU_SETTLEMENT.Approve_Status=4 ORDER BY IOU_SETTLEMENT._Id DESC',
        [firstDate, secondDate],

        (resp: any, err: any) => {

            callBack(resp, err);
        },

    );


};

//IOU_JOBS._Id as Id,IOU.JobOwner_ID,IOU.IOU_Type,IOU.IOU_ID, IOU_JOBS.Job_NO as IOUTypeNo, IOU_JOBS.Expences_Type as ExpenseType, IOU_JOBS.Amount, IOU_JOBS.Remark

export const getIOUSETJobsListByID = (RequestID: any, callBack: any) => {

    DB.searchData(
        'SELECT IOU_SETTLEMENT_JOBS._Id,IOU_SETTLEMENT_JOBS.Job_ID, IOU_SETTLEMENT.JobOwner_ID, IOU_SETTLEMENT.IOU_Type,IOU_SETTLEMENT.IOUSettlement_ID, IOU_SETTLEMENT_JOBS.Job_NO as IOUTypeNo, e.Description as ExpenseType, IFNULL(IOU_SETTLEMENT_JOBS.Amount,0) as Amount, IOU_SETTLEMENT_JOBS.Remark, IOU_SETTLEMENT_JOBS.AccNo, IOU_SETTLEMENT_JOBS.CostCenter, IOU_SETTLEMENT_JOBS.Resource FROM IOU_SETTLEMENT INNER JOIN IOU_SETTLEMENT_JOBS ON IOU_SETTLEMENT.IOUSettlement_ID = IOU_SETTLEMENT_JOBS.Request_ID  LEFT OUTER JOIN EXPENSE_TYPE e ON e.ExpType_ID = IOU_SETTLEMENT_JOBS.Expences_Type WHERE IOU_SETTLEMENT.IOUSettlement_ID=?',
        [RequestID],
        (resp: any, err: any) => {
            callBack(resp, err);
        },
    );
};




export const getIOUJobsListByIOUID = (RequestID: any, callBack: any) => {

    DB.searchData(
        'SELECT * FROM IOU_SETTLEMENT INNER JOIN JOB ON IOU_SETTLEMENT.IOU_ID = JOB.Request_ID WHERE IOU_SETTLEMENT.IOU_ID=?',
        [RequestID],
        (resp: any, err: any) => {
            callBack(resp, err);
        },
    );
};

export const getIOUSETToatalAmount = (callBack: any) => {
    DB.searchData(
        'SELECT IFNULL(SUM(Amount),0) as TotalAmount FROM IOU_SETTLEMENT WHERE Approve_Status=1',
        //'SELECT Amount FROM IOU',
        [],
        (resp: any, err: any) => {

            callBack(resp, err);
            // console.log(resp);
        },
    )
}

export const getIOUSETReOpenRequest = (RequestID: any, callBack: any) => {

    DB.searchData(
        'SELECT * FROM IOU_SETTLEMENT WHERE IOU_SETTLEMENT.IOUSettlement_ID=?',
        [RequestID],
        (resp: any, err: any) => {
            callBack(resp, err);
        },
    );
};


//---Update Sync Status----------------------------------------------------

export const updateIOUSETSyncStatus = (ID: any, callBack: any) => {

    DB.updateData(
        'UPDATE IOU_SETTLEMENT SET IsSync=0 WHERE IOUSettlement_ID=?',
        [ID],
        (resp: any, err: any) => {
            callBack(resp, err)

        },
    );
};


export const getIOUSettlement_Data = (ID: any, callBack: any) => {

    DB.searchData(
        'SELECT * FROM IOU_SETTLEMENT WHERE IOU_SETTLEMENT.IOUSettlement_ID=?',
        [ID],
        (resp: any, err: any) => {
            callBack(resp, err);
        },
    );
};
export const Update_IOUSettlement_FirstApprovel = (data: any, callBack: any) => {


    DB.updateData(
        'UPDATE IOU_SETTLEMENT SET FirstActionBy=?,FirstActionAt=?,Approve_Remark=?,Approve_Status=?,ActionStep=?,IsSync=? WHERE IOUSettlement_ID=?',
        [data[0].FirstActionBy, data[0].FirstActionAt, data[0].Approve_Remark, data[0].Approve_Status, data[0].ActionStep, 0, data[0].IOU_ID],
        (resp: any, err: any) => {
            callBack(resp, err)

        },
    );
};

export const Update_IOUSettelment_ValidateAmount = (data: any, callBack: any) => {

    console.log(data, ">>>>>>>>>>>>>>>>>>>>>>");
    console.log(data[0].FirstActionBy, ">>>>>>>>>>>>>>>>>>>>>>");
    console.log(data[0].IOU_ID, ">>>>>>>>>>>>>>>>>>>>>>");


    DB.updateData(
        'UPDATE IOU_SETTLEMENT SET FirstActionBy=?,FirstActionAt=?,AIsLimit=?,AIOULimit=?,Approve_Remark=?,Approve_Status=?,ActionStep=?,IsSync=? WHERE IOUSettlement_ID=?',
        [data[0].FirstActionBy, data[0].FirstActionAt, data[0].AIsLimit, data[0].AIOULimit, data[0].Approve_Remark, data[0].Approve_Status, data[0].ActionStep, 0, data[0].IOU_ID],
        (resp: any, err: any) => {
            callBack(resp, err)

        },
    );
};

export const Update_IOUSettlement_SecondApprovel = (data: any, callBack: any) => {


    DB.updateData(
        'UPDATE IOU_SETTLEMENT SET SecondActionBy=?,SecondActionAt=?,Approve_Remark=?,Approve_Status=?,ActionStep=?,IsSync=? WHERE IOUSettlement_ID=?',
        [data[0].SecondActionBy, data[0].SecondActionAt, data[0].Approve_Remark, data[0].Approve_Status, data[0].ActionStep, 0, data[0].IOU_ID],
        (resp: any, err: any) => {
            callBack(resp, err)

        },
    );
};

export const updateIDwithStatusSET = (IOUSETID: any, refID: any, callBack: any) => {

    DB.updateData(
        'UPDATE IOU_SETTLEMENT SET IsSync=1 , WebRefID=? WHERE IOUSettlement_ID=?',
        [refID, IOUSETID],
        (resp: any, err: any) => {
            callBack(resp, err)

        },
    );
};











