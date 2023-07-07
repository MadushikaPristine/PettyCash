import * as DB from '../DBService';

export const saveVehicleNo = (data: any, callBack: any) => {

    var response: any;

    for (let i = 0; i < data.length; ++i) {

        DB.insertOrReplace(
            [
                {
                    table: 'VEHICLE_NO',
                    columns: `Vehicle_No,ResName,VehCostForKm`,
                    values: '?,?,?',
                    params: [

                        data[i].ResCode,
                        data[i].ResName,
                        data[i].VehCostForKm,

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

export const getVehicleNoAll = (callBack: any) => {

    DB.searchData(
        'SELECT Vehicle_No FROM VEHICLE_NO',
        [],
        (resp: any, err: any) => {
            // console.log("************** expense type ************  " + resp.length);
            callBack(resp, err);
        },
    );
};