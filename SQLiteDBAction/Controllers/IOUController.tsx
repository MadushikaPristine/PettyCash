import * as DB from '../DBService';
import moment from "moment";

export const saveIOU = (data: any, callBack: any) => {

    var response: any;

    for (let i = 0; i < data.length; ++i) {

        DB.insertOrReplace(
            [
                {
                    table: 'IOU',
                    columns: `IOU_ID,JobOwner_ID,IOU_Type,EmpId,RequestDate,Amount,Approve_Status,CreatedBy,IsSync,Approve_Remark,Reject_Remark,Attachment_Status,FinanceStatus,ApprovedBy,HOD,FirstActionBy,FirstActionAt,RIsLimit,AIsLimit,RIOULimit,AIOULimit,SecondActionBy,SecondActionAt,ActionStep,WebRefID,FStatus`,
                    values: '?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?',
                    params: [

                        data[i].PCRCode,
                        data[i].JobOwner,
                        data[i].IOUType,
                        data[i].EmployeeNo,
                        data[i].RequestedDate,
                        data[i].Amount,
                        data[i].StatusID,
                        data[i].RequestedBy,
                        1,
                        data[i].Remark,
                        "",
                        "0",
                        data[i].FinanceStatus,
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
                        data[i].ID,
                        data[i].FStatus,


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

//---approve remark-----------------
export const saveRemark = (data: any, callBack: any) => {

    var response: any;

    for (let i = 0; i < data.length; ++i) {

        DB.insertOrReplace(
            [
                {
                    table: 'IOU',
                    columns: `Approve_Remark`,
                    values: '?',
                    params: [

                        data[i].Approve_Remark,

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



//---Approved IOU----------------------------------------------------

export const ApprovedIOU = (ID: any, callBack: any) => {

    DB.updateData(
        'UPDATE IOU SET Approve_Status=2 WHERE IOU_ID=?',
        [ID],
        (resp: any, err: any) => {
            callBack(resp, err)

        },
    );
};

//-----Reject IOU--------------------------------------------------

export const RejectedIOU = (ID: any, callBack: any) => {

    DB.updateData(
        'UPDATE IOU SET Approve_Status=3 WHERE IOU_ID=?',
        [ID],
        (resp: any, err: any) => {
            callBack(resp, err)

        },
    );
};


//-----Cancel IOU--------------------------------------------------

export const CancelledIOU = (ID: any, callBack: any) => {

    DB.updateData(
        'UPDATE IOU SET Approve_Status=4 WHERE IOU_ID=?',
        [ID],
        (resp: any, err: any) => {
            callBack(resp, err)

        },
    );
};

//---------update approve remark-----------------

export const saveApproveRemark = (remark: any, ID: any, callBack: any) => {

    console.log(ID, " approve remark ----- ", remark);

    DB.updateData(
        'UPDATE IOU SET Approve_Remark=? WHERE IOU_ID=?',
        [remark, ID],
        (resp: any, err: any) => {
            callBack(resp, err)
        },
    );
};


export const getLastIOU = (callBack: any) => {

    DB.searchData(
        'SELECT _Id FROM IOU ORDER BY _Id DESC LIMIT 1',
        [],
        (resp: any, err: any) => {
            // console.log("************** Last iou ************  " + resp.length);
            callBack(resp, err);
        },
    );
};


export const getIOU = (callBack: any) => {

    DB.searchData(
        "SELECT ifnull(a.IOU_ID || ' - ' || a.Amount || ' LKR' || ' - ' ||  STRFTIME('%d/%m/%Y', a.RequestDate) ,IOU_ID) as IOU_ID,a.WebRefID, a.JobOwner_ID , a.IOU_Type , a.EmpId , a.Amount , a.RequestDate , a.HOD FROM IOU a WHERE NOT EXISTS(SELECT b.* FROM IOU_SETTLEMENT b WHERE b.IOU_ID = a.IOU_ID ) AND a.FinanceStatus=?",
        // 'SELECT a.* FROM IOU a WHERE NOT EXISTS(SELECT b.* FROM IOU_SETTLEMENT b WHERE b.IOU_ID = a.IOU_ID ) AND a.FinanceStatus=?',
        ['Approved'],
        (resp: any, err: any) => {
            // console.log("************** Last iou ************  " + resp.length);
            callBack(resp, err);
        },
    );
};

export const getPendingIOU = (callBack: any) => {

    DB.searchData(
        // 'SELECT IOU.IOU_ID AS ID, IOU.Amount, EMPLOYEE.EmpName FROM IOU INNER JOIN EMPLOYEE ON IOU.EmpId = EMPLOYEE.Emp_ID INNER JOIN WHERE Approve_Status=0 ORDER BY _Id DESC',
        'SELECT * FROM IOU WHERE Approve_Status=1 ORDER BY _Id DESC',
        [],
        (resp: any, err: any) => {
            //console.log(" pending iou ", resp);

            callBack(resp, err);
        },
    );
};

export const getPendingIOUHome = (callBack: any) => {

    DB.searchData(
        // 'SELECT IOU.IOU_ID AS ID, IOU.Amount, EMPLOYEE.EmpName FROM IOU INNER JOIN EMPLOYEE ON IOU.EmpId = EMPLOYEE.Emp_ID INNER JOIN WHERE Approve_Status=0 ORDER BY _Id DESC',
        'SELECT * FROM IOU WHERE Approve_Status=1 ORDER BY _Id DESC LIMIT 10',
        [],
        (resp: any, err: any) => {
            //console.log(" pending iou ", resp);

            callBack(resp, err);
        },
    );
};

export const getApprovedIOU = (callBack: any) => {

    DB.searchData(
        'SELECT IOU._Id as Id ,IOU.IOU_ID as ID ,USER.DisplayName as employee, USER.USER_ID, IFNULL(IOU.Amount,0) as Amount,IOU.Approve_Status, IOU.Approve_Remark, RequestDate FROM IOU INNER JOIN USER ON IOU.CreatedBy = USER.USER_ID WHERE IOU.Approve_Status=2 ORDER BY IOU._Id DESC',
        [],
        (resp: any, err: any) => {

            callBack(resp, err);
        },
    );
};

export const getRejectIOU = (callBack: any) => {

    DB.searchData(
        'SELECT IOU._Id as Id ,IOU.IOU_ID as ID ,USER.DisplayName as employee, USER.USER_ID, IFNULL(IOU.Amount,0) as Amount,IOU.Approve_Status, IOU.Approve_Remark, RequestDate FROM IOU INNER JOIN USER ON IOU.CreatedBy = USER.USER_ID WHERE IOU.Approve_Status=3 ORDER BY IOU._Id DESC',
        [],
        (resp: any, err: any) => {

            callBack(resp, err);
        },
    );
};

export const getCancelledIOU = (callBack: any) => {

    DB.searchData(
        'SELECT IOU._Id as Id ,IOU.IOU_ID as ID ,USER.DisplayName as employee, USER.USER_ID, IFNULL(IOU.Amount,0) as Amount,IOU.Approve_Status,IOU.Approve_Remark, RequestDate FROM IOU INNER JOIN USER ON IOU.CreatedBy = USER.USER_ID WHERE IOU.Approve_Status=4 ORDER BY IOU._Id DESC',
        [],
        (resp: any, err: any) => {

            callBack(resp, err);
        },
    );
};


export const getPendingIOUList = (callBack: any) => {

    DB.searchData(
        'SELECT IOU._Id as Id ,IOU.IOU_ID as ID, USER.DisplayName as employee, USER.USER_ID, IFNULL(IOU.Amount,0) as Amount,IOU.Approve_Status, IOU.Approve_Remark,IOU.CreatedBy, IOU.RequestDate,it.Description as IOUType FROM IOU INNER JOIN USER ON IOU.CreatedBy = USER.USER_ID  LEFT OUTER JOIN IOU_Type it ON it.IOUType_ID = IOU.IOU_Type WHERE IOU.Approve_Status=1 ORDER BY IOU._Id DESC',
        [],
        (resp: any, err: any) => {

            callBack(resp, err);
        },
    );

};


export const getAllPendingIOUList = (callBack: any) => {

    DB.searchData(
        'SELECT IOU._Id as Id ,IOU.IOU_ID as ID, USER.DisplayName as employee, USER.USER_ID, IFNULL(IOU.Amount,0) as Amount,IOU.Approve_Status, IOU.Approve_Remark,IOU.CreatedBy, IOU.RequestDate,it.Description as IOUType FROM IOU INNER JOIN USER ON IOU.CreatedBy = USER.USER_ID LEFT OUTER JOIN IOU_Type it ON it.IOUType_ID = IOU.IOU_Type  WHERE IOU.Approve_Status=1 OR IOU.Approve_Status=5 ORDER BY IOU._Id DESC',
        [],
        (resp: any, err: any) => {

            callBack(resp, err);
        },
    );

};

export const getPendingIOUListByJobOwner = (callBack: any, OwnerName: any) => {

    DB.searchData(
        'SELECT IOU._Id as Id ,IOU.IOU_ID as ID,IOU.JobOwner_ID, USER.DisplayName as employee, USER.USER_ID, IFNULL(IOU.Amount,0) as Amount,IOU.Approve_Status, IOU.Approve_Remark,IOU.CreatedBy, IOU.RequestDate ,it.Description as IOUType FROM IOU INNER JOIN USER ON IOU.CreatedBy = USER.USER_ID LEFT OUTER JOIN IOU_Type it ON it.IOUType_ID = IOU.IOU_Type WHERE IOU.Approve_Status=1 AND USER.DisplayName= ? ORDER BY IOU._Id DESC',
        [OwnerName],
        (resp: any, err: any) => {

            callBack(resp, err);
        },
    );

};

export const getPendingHODApprovalIOUList = (callBack: any) => {

    DB.searchData(
        'SELECT IOU._Id as Id ,IOU.IOU_ID as ID, USER.DisplayName as employee, USER.USER_ID, IFNULL(IOU.Amount,0) as Amount,IOU.Approve_Status, IOU.Approve_Remark,IOU.CreatedBy, IOU.RequestDate,it.Description as IOUType FROM IOU INNER JOIN USER ON IOU.CreatedBy = USER.USER_ID LEFT OUTER JOIN IOU_Type it ON it.IOUType_ID = IOU.IOU_Type  WHERE IOU.Approve_Status=5  ORDER BY IOU._Id DESC',
        [],
        (resp: any, err: any) => {

            callBack(resp, err);
        },
    );

};

export const getPendingSecondApprovalIOUList = (amount: any, callBack: any) => {

    DB.searchData(
        'SELECT IOU._Id as Id ,IOU.IOU_ID as ID, USER.DisplayName as employee, USER.USER_ID, IFNULL(IOU.Amount,0) as Amount,IOU.Approve_Status, IOU.Approve_Remark, IOU.RequestDate,it.Description as IOUType FROM IOU INNER JOIN USER ON IOU.CreatedBy = USER.USER_ID LEFT OUTER JOIN IOU_Type it ON it.IOUType_ID = IOU.IOU_Type WHERE IOU.Approve_Status=1 AND IOU.Amount >= ? ORDER BY IOU._Id DESC',
        [amount],
        (resp: any, err: any) => {

            callBack(resp, err);
        },
    );

};

export const getIOUJobsListByID = (RequestID: any, callBack: any) => {

    // console.log(" ID SETT === " , RequestID);


    DB.searchData(
        'SELECT IOU_JOBS._Id,IOU_JOBS.Job_ID,IOU.JobOwner_ID,IOU.IOU_Type,IOU.IOU_ID, IOU_JOBS.Job_NO as IOUTypeNo, IOU_JOBS.Expences_Type as ExpenseType, IFNULL(IOU_JOBS.Amount,0) as Amount, IOU_JOBS.Remark, IOU_JOBS.AccNo, IOU_JOBS.CostCenter, IOU_JOBS.Resource FROM IOU INNER JOIN IOU_JOBS ON IOU.IOU_ID = IOU_JOBS.Request_ID WHERE IOU.IOU_ID=?',
        [RequestID],
        (resp: any, err: any) => {
            callBack(resp, err);
        },
    );
};



export const getIOUJobsListDetailsByID = (RequestID: any, callBack: any) => {

    // console.log(" ID SETT === " , RequestID);


    DB.searchData(
        'SELECT IOU_JOBS._Id,IOU_JOBS.Job_ID,IOU.JobOwner_ID,IOU.IOU_Type,IOU.IOU_ID, IOU_JOBS.Job_NO as IOUTypeNo, e.Description as ExpenseType, IFNULL(IOU_JOBS.Amount,0) as Amount, IOU_JOBS.Remark, IOU_JOBS.AccNo, IOU_JOBS.CostCenter, IOU_JOBS.Resource FROM IOU INNER JOIN IOU_JOBS ON IOU.IOU_ID = IOU_JOBS.Request_ID LEFT OUTER JOIN EXPENSE_TYPE e ON e.ExpType_ID = IOU_JOBS.Expences_Type WHERE IOU.IOU_ID=?',
        [RequestID],
        (resp: any, err: any) => {
            callBack(resp, err);
        },
    );
};


//------IOU PENDING LIST FILTER BY DATE-------

export const getDateFilterIOUList = (firstDate: any, secondDate: any, callBack: any) => {
    // console.log(firstDate, secondDate);

    DB.searchData(
        //'SELECT IOU._Id as Id ,IOU.IOU_ID as ID ,EMPLOYEE.EmpName as employee ,IOU.Amount as Amount,IOU.Approve_Status, IOU.RequestDate FROM IOU INNER JOIN EMPLOYEE ON IOU.EmpId = EMPLOYEE.Emp_ID WHERE IOU.RequestDate >= ? AND IOU.RequestDate <= ? AND IOU.Approve_Status=0',
        'SELECT IOU._Id as Id ,IOU.IOU_ID as ID ,USER.DisplayName as employee, USER.USER_ID, IFNULL(IOU.Amount,0) as Amount,IOU.Approve_Status, IOU.Approve_Remark, IOU.RequestDate FROM IOU INNER JOIN USER ON IOU.CreatedBy = USER.USER_ID  WHERE IOU.RequestDate >= ? AND IOU.RequestDate <= ? AND IOU.Approve_Status=1 ORDER BY IOU._Id DESC',
        [firstDate, secondDate],

        (resp: any, err: any) => {

            callBack(resp, err);
            //console.log(resp);
            // console.log(secondDate);
        },

    );


};

//------IOU APPROVED LIST FILTER BY DATE-------

export const getDateFilterIOUApproveList = (firstDate: any, secondDate: any, callBack: any) => {
    // console.log(firstDate);

    DB.searchData(
        'SELECT IOU._Id as Id ,IOU.IOU_ID as ID ,USER.DisplayName as employee ,USER.USER_ID, IFNULL(IOU.Amount,0) as Amount,IOU.Approve_Status,IOU.Approve_Remark, RequestDate FROM IOU INNER JOIN USER ON IOU.CreatedBy = USER.USER_ID WHERE RequestDate >= ? AND RequestDate <= ? AND IOU.Approve_Status=2 ORDER BY IOU._Id DESC',
        [firstDate, secondDate],

        (resp: any, err: any) => {

            callBack(resp, err);
            // console.log(resp);

        },

    );


};

//------IOU REJECTED LIST FILTER BY DATE-------

export const getDateFilterIOURejectList = (firstDate: any, secondDate: any, callBack: any) => {
    //console.log(firstDate);
    DB.searchData(
        'SELECT IOU._Id as Id ,IOU.IOU_ID as ID ,USER.DisplayName as employee ,USER.USER_ID, IFNULL(IOU.Amount,0) as Amount,IOU.Approve_Status,IOU.Approve_Remark, RequestDate FROM IOU INNER JOIN USER ON IOU.CreatedBy = USER.USER_ID WHERE RequestDate >= ? AND RequestDate <= ? AND IOU.Approve_Status=3 ORDER BY IOU._Id DESC',
        [firstDate, secondDate],

        (resp: any, err: any) => {

            callBack(resp, err);
        },

    );


};

//------IOU CANCELLED LIST FILTER BY DATE-------

export const getDateFilterIOUCancelList = (firstDate: any, secondDate: any, callBack: any) => {
    //console.log(firstDate);
    DB.searchData(
        'SELECT IOU._Id as Id ,IOU.IOU_ID as ID ,USER.DisplayName as employee ,USER.USER_ID, IFNULL(IOU.Amount,0) as Amount,IOU.Approve_Status,IOU.Approve_Remark, RequestDate FROM IOU INNER JOIN USER ON IOU.CreatedBy = USER.USER_ID WHERE RequestDate >= ? AND RequestDate <= ? AND IOU.Approve_Status=4 ORDER BY IOU._Id DESC',
        [firstDate, secondDate],

        (resp: any, err: any) => {

            callBack(resp, err);
        },

    );


};

//---------IOU Total amount------------------

export const getIOUToatalAmount = (callBack: any) => {
    DB.searchData(
        'SELECT IFNULL(SUM(Amount),0) as TotalAmount FROM IOU WHERE Approve_Status=1',
        //'SELECT Amount FROM IOU',
        [],
        (resp: any, err: any) => {

            callBack(resp, err);
            // console.log(resp);
        },
    )
}


//----------ReOpen Request data----------------

export const getIOUReOpenRequest = (RequestID: any, callBack: any) => {

    DB.searchData(
        'SELECT * FROM IOU WHERE IOU.IOU_ID=?',
        [RequestID],
        (resp: any, err: any) => {
            callBack(resp, err);
        },
    );
};

//---Update Sync Status----------------------------------------------------

export const updateSyncStatus = (ID: any, callBack: any) => {

    DB.updateData(
        'UPDATE IOU SET IsSync=0 WHERE IOU_ID=?',
        [ID],
        (resp: any, err: any) => {
            callBack(resp, err)

        },
    );
};

export const updateIDwithStatus = (IOUID: any, refID: any, callBack: any) => {

    DB.updateData(
        'UPDATE IOU SET IsSync=1 , WebRefID=? WHERE IOU_ID=?',
        [refID, IOUID],
        (resp: any, err: any) => {
            callBack(resp, err)

        },
    );
};



export const filterRequestsByStatus = (Date: any, callBack: any) => {



    DB.searchData(
        'SELECT * FROM IOU WHERE RequestDate >= "2023-05-15 00:00:00" AND RequestDate <= "2023-05-15 23:59:59"',
        //WHERE RequestDate <= "2023-05-15 23:59:59" AND RequestDate >= "2023-05-15 00:00:00" AND Approve_Status >= 2',
        [Date],
        (resp: any, err: any) => {

            callBack(resp, err);
            // console.log(resp);
        },
    )
}

export const getIOUdatainfo = (ID: any, callBack: any) => {

    DB.searchData(
        'SELECT JobOwner_ID, IOU_Type, EmpId  FROM IOU WHERE IOU.IOU_ID=?',
        //WHERE RequestDate <= "2023-05-15 23:59:59" AND RequestDate >= "2023-05-15 00:00:00" AND Approve_Status >= 2',
        [ID],
        (resp: any, err: any) => {

            callBack(resp, err);
            // console.log(resp);
        },
    )
}
export const saveApproveAllData = (HOD: any, FirstActionBy: any, FirstActionAt: any, AIsLimit: any, AIOULimit: any, Approve_Remark: any, IOUID: any, callBack: any) => {

    // console.log(ID," approve remark ----- " , remark);

    DB.updateData(
        'UPDATE IOU SET HOD=?,FirstActionBy=?,FirstActionAt=?,AIsLimit=?,AIOULimit=?,Approve_Remark=? WHERE IOU_ID=?',
        [HOD, FirstActionBy, FirstActionAt, AIsLimit, AIOULimit, Approve_Remark, IOUID],
        (resp: any, err: any) => {
            callBack(resp, err)
        },
    );
};


export const getIOUDataByID = (ID: any, callBack: any) => {

    DB.searchData(
        'SELECT * FROM IOU WHERE IOU.IOU_ID=?',
        //WHERE RequestDate <= "2023-05-15 23:59:59" AND RequestDate >= "2023-05-15 00:00:00" AND Approve_Status >= 2',
        [ID],
        (resp: any, err: any) => {

            callBack(resp, err);
            // console.log(resp);
        },
    )
}

export const checkOpenRequests = (ID: any, callBack: any) => {

    DB.searchData(
        'SELECT * FROM IOU WHERE CreatedBy=? AND FStatus=?',
        //WHERE RequestDate <= "2023-05-15 23:59:59" AND RequestDate >= "2023-05-15 00:00:00" AND Approve_Status >= 2',
        [ID, 0],
        (resp: any, err: any) => {

            callBack(resp, err);
            // console.log(resp);
        },
    )
}
export const Update_IOU_ValidateAmount = (data: any, callBack: any) => {

    console.log(data, ">>>>>>>>>>>>>>>>>>>>>>");
    console.log(data[0].FirstActionBy, ">>>>>>>>>>>>>>>>>>>>>>");
    console.log(data[0].IOU_ID, ">>>>>>>>>>>>>>>>>>>>>>");


    DB.updateData(
        'UPDATE IOU SET FirstActionBy=?,FirstActionAt=?,AIsLimit=?,AIOULimit=?,Approve_Remark=?,Approve_Status=?,ActionStep=? WHERE IOU_ID=?',
        [data[0].FirstActionBy, data[0].FirstActionAt, data[0].AIsLimit, data[0].AIOULimit, data[0].Approve_Remark, data[0].Approve_Status, data[0].ActionStep, data[0].IOU_ID],
        (resp: any, err: any) => {
            callBack(resp, err)

        },
    );
};

export const Update_IOU_FirstApprovel = (data: any, callBack: any) => {


    DB.updateData(
        'UPDATE IOU SET FirstActionBy=?,FirstActionAt=?,Approve_Remark=?,Approve_Status=?,ActionStep=? WHERE IOU_ID=?',
        [data[0].FirstActionBy, data[0].FirstActionAt, data[0].Approve_Remark, data[0].Approve_Status, data[0].ActionStep, data[0].IOU_ID],
        (resp: any, err: any) => {
            callBack(resp, err)

        },
    );
};
export const Update_IOU_SecondApprovel = (data: any, callBack: any) => {


    DB.updateData(
        'UPDATE IOU SET SecondActionBy=?,SecondActionAt=?,Approve_Remark=?,Approve_Status=?,ActionStep=? WHERE IOU_ID=?',
        [data[0].SecondActionBy, data[0].SecondActionAt, data[0].Approve_Remark, data[0].Approve_Status, data[0].ActionStep, data[0].IOU_ID],
        (resp: any, err: any) => {
            callBack(resp, err)

        },
    );
};