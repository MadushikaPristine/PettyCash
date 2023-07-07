import * as DB from '../DBService';

export const saveAttachments = (data: any, callBack: any) => {

    var response: any;

    for (let i = 0; i < data.length; ++i) {

        DB.insertOrReplace(
            [
                {
                    table: 'ATTACHMENTS',
                    columns: `Request_ID,Img_url,Status`,
                    values: '?,?,?',
                    params: [

                        data[i].PCRCode,
                        data[i].Img_url,
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

export const getLastAttachment = (callBack: any) => {

    DB.searchData(
        'SELECT _Id FROM ATTACHMENTS ORDER BY _Id DESC LIMIT 1',
        [],
        (resp: any, err: any) => {
            // console.log("************** Last iou ************  " + resp.length);
            callBack(resp, err);
        },
    );
};

//-----------Get Attachment Data-----------

export const getIOUAttachmentListByID = (RequestID:any,callBack: any) => {
    //console.log(RequestID);
    
    DB.searchData(
        'SELECT * FROM ATTACHMENTS WHERE ATTACHMENTS.Request_ID=?',
        [RequestID],
        (resp: any, err: any) => {
            callBack(resp, err);
        },
    );
};