import * as DB from '../DBService';

export const saveIOUJOB = (data: any, callBack: any) => {

    var response: any;


    // console.log(" save object IOU ===============    "  , data);
    

    for (let i = 0; i < data.length; ++i) {

        DB.insertOrReplace(
            [
                {
                    table: 'IOU_JOBS',
                    columns: `Job_ID,Job_NO,JobOwner_ID,Request_ID,AccNo,CostCenter,Resource,Expences_Type,Amount,Remark,CreateDate,CreatedBy,IsSync`,
                    values: '?,?,?,?,?,?,?,?,?,?,?,?,?',
                    params: [

                        data[i].PCRID,
                        data[i].IOUTypeNo,
                        data[i].JobOwner,
                        data[i].PCRCode,
                        data[i].AccNo,
                        data[i].CostCenter,
                        data[i].Resource,
                        data[i].ExpenseType,
                        data[i].Amount,
                        data[i].Remark,
                        data[i].CreateAt,
                        data[i].RequestedBy,
                        1,

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
                        console.log(res, " ..........  error ...  ", err);

                    }
                }

            },
        );

    }

};

export const getLastIOUJobID = (callBack: any) => {

    DB.searchData(
        'SELECT _Id FROM IOU_JOBS ORDER BY _Id DESC LIMIT 1',
        [],
        (resp: any, err: any) => {
            // console.log("************** Last iou ************  " + resp.length);
            callBack(resp, err);
        },
    );


}

export const getIOUJobsByID = (ID:any ,callBack: any) => {

    DB.searchData(
        'SELECT io._Id,io.Job_No,io.AccNo,io.CostCenter,io.Resource,e.Description,io.Amount,io.Remark FROM IOU_JOBS io LEFT OUTER JOIN EXPENSE_TYPE e ON e.ExpType_ID = io.Expences_Type WHERE io.Request_ID=?',
        [ID],
        (resp: any, err: any) => {
            // console.log("************** Last iou ************  " + resp.length);
            callBack(resp, err);
        },
    );


}

export const getIOUJobDetailsByID = (jobID: any, callBack: any) => {

    DB.searchData(
        'SELECT IOU.IOU_Type as IOUType , IOU_JOBS.*  FROM IOU_JOBS INNER JOIN IOU ON IOU.IOU_ID = IOU_JOBS.Request_ID WHERE IOU_JOBS.Job_NO=?  ',
        [jobID],
        (resp: any, err: any) => {
            // console.log("************** Last iou ************  " + resp.length);
            callBack(resp);
        },
    );


}

export const getIOUJOBDataBYRequestID = (ID: any, callBack: any) => {

    DB.searchData(
        'SELECT IOU.IOU_Type as IOUTypeID, IOU_JOBS.Job_No as IOUTypeNo,IOU_JOBS.AccNo,IOU_JOBS.CostCenter,IOU_JOBS.Resource, IOU_JOBS.Expences_Type as ExpenseType, IOU_JOBS.Amount as Amount, IOU_JOBS.Remark as Remark, ATTACHMENTS.Img_url FROM IOU_JOBS INNER JOIN IOU ON IOU.IOU_ID = IOU_JOBS.Request_ID LEFT OUTER JOIN ATTACHMENTS ON ATTACHMENTS.Request_ID = IOU_JOBS.Request_ID WHERE IOU_JOBS.Request_ID=?',
        [ID],
        (resp: any, err: any) => {
            // console.log("************** Last iou ************  " + resp.length);
            callBack(resp);
        },
    )
}


export const getIOUJobsList = (RequestID: any, callBack: any) => {

    DB.searchData(
        'SELECT * FROM IOU_JOBS.Request_ID WHERE IOU_JOBS.Request_ID=?',
        [RequestID],
        (resp: any, err: any) => {
            callBack(resp, err);
        },
    );
};

export const getIOUJobDetailsById = (ID:any,callBack:any) => {

    DB.searchData(
        'SELECT IOU.IOU_Type as IOUTypeID , IOU_JOBS._Id,IOU_JOBS.Job_NO as IOUTypeNo,IOU_JOBS.AccNo,IOU_JOBS.CostCenter,IOU_JOBS.Resource, IOU_JOBS.Expences_Type as ExpenseType, IFNULL(IOU_JOBS.Amount,0) as Amount,IOU_JOBS.Remark as Remark ,IOU_JOBS.IstoEdit FROM IOU_JOBS WHERE IOU_JOBS._Id=?',
        [ID],
        (resp: any, err: any) => {
            // console.log("************** Last iou ************  " + resp.length);
            callBack(resp);
        },
    )

}

export const DeleteIOUJobByID = (ID:any,callBack:any) => {

    DB.searchData(
        ' DELETE FROM IOU_JOBS WHERE _Id=?',
        [ID],
        (resp: any, err: any) => {
            // console.log("************** Last iou ************  " + resp.length);
            callBack(resp);
        },
    )

}

export const getIOUJobTotAmount = (ID:any , callBack: any) => {

    DB.searchData(
        'SELECT IFNULL(SUM(Amount),0) as totAmount FROM IOU_JOBS WHERE Request_ID=?',
        [ID],
        (resp: any, err: any) => {
            // console.log("************** Last iou ************  " + resp.length);
            callBack(resp, err);
        },
    );
};
