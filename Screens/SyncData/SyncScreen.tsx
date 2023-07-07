import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL, headers } from '../../Constant/ApiConstants';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as DB_IOUType from '../../SQLiteDBAction/Controllers/IOUTypeController'
import * as DB_User from '../../SQLiteDBAction/Controllers/UserController'
import * as DB_ExpenseType from '../../SQLiteDBAction/Controllers/ExpenseTypeController'
import * as DB_VehicleNo from '../../SQLiteDBAction/Controllers/VehicleNoController'
import * as DB_JobNo from '../../SQLiteDBAction/Controllers/JobNoController'
import * as DB_IOURequest from '../../SQLiteDBAction/Controllers/IOUController'
import * as DB_IOUSETRequest from '../../SQLiteDBAction/Controllers/IouSettlementController'
import * as DB_OneOffSETRequest from '../../SQLiteDBAction/Controllers/OneOffSettlementController'
import * as DB_JobOwners from '../../SQLiteDBAction/Controllers/JobOwnerController'
import * as DB_IOUJobs from '../../SQLiteDBAction/Controllers/IOUJobController'
import * as DB_IOUAttachments from '../../SQLiteDBAction/Controllers/AttachmentController'
import { BackHandler, View } from 'react-native';

const SyncScreen = () => {
    const navigation = useNavigation();

    useFocusEffect(

        React.useCallback(() => {

            backHandletListener();

            // Download_IOU_Types();
            // Download_Expense_Types();
            // Download_IOURequest();

            //navigation.navigate("BottomNavi");
        }, [])

    );

    const buttonClick = () => {
        Download_IOU_Types();
           // Download_Expense_Types();
            //Download_IOURequest();
            //Download_IOUJobs();
    }

    const backHandletListener = () => {

        const onBackPress = () => {
  
            // Return true to stop default back navigaton
            // Return false to keep default back navigaton
            return true;
        };
  
        // Add Event Listener for hardwareBackPress
        BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );
  
        return () => {
            // Once the Screen gets blur Remove Event Listener
            BackHandler.removeEventListener(
                'hardwareBackPress',
                onBackPress
            );
        };
  
  
    }

   

    // -------------------- Download IOU Types --------------------------------------

    const Download_IOU_Types = async () => {

        const URL = BASE_URL + '/Mob_GetIOUType.xsjs?dbName=TPL_REPORT_TEST'

        await axios.get(URL, { headers })
            .then(response => {

                if (response.status === 200) {

                    DB_IOUType.saveIOUType(response.data, (resp: any) => {


                        // console.log("save get response ------------>>>>>  ", resp);

                        if (resp == 3) {

                            Download_Expense_Types();
                        }

                    });




                } else {

                    // console.log(" response code ======= ", response.status);



                }


            })
            .catch((error) => {

                // console.log(" IOUTypes error .....   ", error);


            });

    }


    // -------------------- Download Expence Types --------------------------------------

    const Download_Expense_Types = async () => {

        const URL = BASE_URL + '/Mob_GetExpenseTypes.xsjs?dbName=TPL_REPORT_TEST'

        await axios.get(URL, { headers })
            .then(response => {

                if (response.status === 200) {

                    DB_ExpenseType.saveExpenseType(response.data, (resp: any) => {

                        if (resp == 3) {

                            Download_Users();
                        }

                    });

                } else {

                    // console.log(" response code ======= ", response.status);

                }


            })
            .catch((error) => {

                // console.log(" Expense Types error .....   ", error);


            });

    }


    // -------------------- Download Users --------------------------------------

    const Download_Users = async () => {

        const URL = BASE_URL + '/Mob_GetUserMaster.xsjs?dbName=TPL_REPORT_TEST'

        await axios.get(URL, { headers })
            .then(response => {

                if (response.status === 200) {

                    DB_User.saveUser(response.data, (resp: any) => {


                        if (resp == 3) {
                            Download_VehicleNo();

                        }

                    });

                } else {

                    // console.log(" response code ======= ", response.status);

                }


            })
            .catch((error) => {

                // console.log(" IOUTypes error .....   ", error);


            });

    }


    // -------------------- Download Vehicle No --------------------------------------

    const Download_VehicleNo = async () => {

        const URL = BASE_URL + '/Mob_GetAllVehicleNumbers.xsjs?dbName=TPL_REPORT_TEST&sapDbName=TPL_LIVE_SL&ResType=VEHICLE'
        

        await axios.get(URL, { headers })
            .then(response => {

                if (response.status === 200) {

                    DB_VehicleNo.saveVehicleNo(response.data, (resp: any) => {

                        // console.log(" Vehicle No ======= ", resp);
                        if (resp == 3) {
                            Download_JobOwners();
                            

                        }

                    });

                } else {

                    // console.log(" response code ======= ", response.status);

                }


            })
            .catch((error) => {

                // console.log(" VehicleNo error .....   ", error);


            });

    }

     // -------------------- Download Job Owners --------------------------------------

     const Download_JobOwners = async () => {

        const URL = BASE_URL + '/Mob_GetJobOwners.xsjs?dbName=TPL_REPORT_TEST&sapDbName=TPL_LIVE_SL'
        

        await axios.get(URL, { headers })
            .then(response => {

                if (response.status === 200) {

                    DB_JobOwners.saveJobOwners(response.data, (resp: any) => {

                        // console.log(" Job Owners ======= ", resp);
                        if (resp == 3) {
                            Download_JobNo();

                        }

                    });

                } else {

                    // console.log(" response code ======= ", response.status);

                }


            })
            .catch((error) => {

                // console.log(" VehicleNo error .....   ", error);


            });

    }

    // -------------------- Download Job No -------------------------------------------

    const Download_JobNo = async () => {

        const URL = BASE_URL + '/Mob_GetAllJobNoJobOwners.xsjs?dbName=TPL_REPORT_TEST'

        await axios.get(URL, { headers })
            .then(response => {

                if (response.status === 200) {

                    DB_JobNo.saveJobNo(response.data, (resp: any) => {

                        // console.log(" Job No ======= ", resp);
                        if (resp == 3) {
                            Download_IOURequest();
                            
                        }

                    });

                } else {

                    // console.log(" response code ======= ", response.status);

                }


            })
            .catch((error) => {

                // console.log(" JobNo error .....   ", error);


            });

    }

   


    // -------------------- Download User Role --------------------------------------

    const Download_UserRole = async () => {

        const URL = BASE_URL + '/Mob_GetAllVehicleNumbers.xsjs?dbName=TPL_REPORT_TEST&sapDbName=TPL_LIVE_SL&ResType=VEHICLE'

        await axios.get(URL, { headers })
            .then(response => {

                if (response.status === 200) {

                    // DB_VehicleNo.saveVehicleNo(response.data, (resp: any) => {

                    //     console.log(" response code ======= ", resp);
                    //     if (resp == 3) {


                    //     }

                    // });

                } else {

                    // console.log(" response code ======= ", response.status);

                }


            })
            .catch((error) => {

                // console.log(" IOUTypes error .....   ", error);


            });

    }

    // -------------------- Download IOU Request --------------------------------------

    const Download_IOURequest = async () => {
        
        const URL = BASE_URL + '/Mob_GetAllIOURequest.xsjs?dbName=TPL_REPORT_TEST'

        await axios.get(URL, { headers })
            .then(response => {

                if (response.status === 200) {

                    //console.log(response.data.header,'=====================');
                    

                     DB_IOURequest.saveIOU(response.data.header, (resp: any) => {

                        // console.log("save IOU ------------>>>>>  ", resp);
                        if (resp == 3) {
                            Download_IOUJobs();
                            Download_IOUSETRequest();
                        }

                    });

                } else {

                    // console.log(" response code ======= ", response.status);

                }


            })
            .catch((error) => {

                // console.log(" IOUTypes error .....   ", error);


            });

    }

    // -------------------- Download IOU Job Data --------------------------------------


    const Download_IOUJobs = async () => {
        
        const URL = BASE_URL + '/Mob_GetAllIOURequest.xsjs?dbName=TPL_REPORT_TEST'

        await axios.get(URL, { headers })
            .then(response => {

                // console.log(response.status);
                if (response.status === 200) {

                    // console.log(response.data.detail,'=====================');
                    // console.log(response.status);

                     DB_IOUJobs.saveIOUJOB(response.data.detail, (resp: any) => {

                        // console.log("save IOU Jobs ------------>>>>>  ", resp);
                        if (resp == 3) {
                            //Download_IOUSETRequest();

                        }

                    });

                } else {

                    // console.log(" response code ======= ", response.status);

                }


            })
            .catch((error) => {

                // console.log(" IOUTypes error .....   ", error);


            });

    }

    // -------------------- Download IOU Attachment Data --------------------------------------


    const Download_IOUAttachment = async () => {
        
        const URL = BASE_URL + '/Mob_GetAllIOURequest.xsjs?dbName=TPL_REPORT_TEST'

        await axios.get(URL, { headers })
            .then(response => {

                // console.log(response.status);
                if (response.status === 200) {

                    //console.log(response.data.detail,'=====================');
                    // console.log(response.status);

                     DB_IOUAttachments.saveAttachments(response.data.attachments, (resp: any) => {

                        // console.log("save IOU Attachments ------------>>>>>  ", resp);
                        if (resp == 3) {
                            //Download_IOUSETRequest();

                        }

                    });

                } else {

                    // console.log(" response code ======= ", response.status);

                }


            })
            .catch((error) => {

                // console.log(" IOUTypes error .....   ", error);


            });

    }


    // -------------------- Download IOU Settlement Request --------------------------------------

    const Download_IOUSETRequest = async () => {
        
        const URL = BASE_URL + '/Mob_GetIOUSettlements.xsjs?dbName=TPL_REPORT_TEST&status=1'

        await axios.get(URL, { headers })
            .then(response => {

                if (response.status === 200) {

                     DB_IOUSETRequest.saveIOUSettlement(response.data.header, (resp: any) => {

                        // console.log("save IOU SET ------------>>>>>  ", resp);
                        if (resp == 3) {
                            Download_ONE_OFF_SETRequest();

                        }

                    });

                } else {

                    // console.log(" response code ======= ", response.status);

                }


            })
            .catch((error) => {

                // console.log(" IOUTypes error .....   ", error);


            });

    }

    // -------------------- Download One-Off Settlement Request --------------------------------------

    const Download_ONE_OFF_SETRequest = async () => {
        
        const URL = BASE_URL + '/Mob_GetOneOffSettlements.xsjs?dbName=TPL_REPORT_TEST&status=1'

        await axios.get(URL, { headers })
            .then(response => {

                if (response.status === 200) {

                     DB_OneOffSETRequest.saveOneOffSettlement(response.data.header, (resp: any) => {

                        // console.log("save ONE OFF ------------>>>>>  ", resp);
                        if (resp == 3) {


                        }

                    });

                } else {

                    // console.log(" response code ======= ", response.status);

                }


            })
            .catch((error) => {

                // console.log(" IOUTypes error .....   ", error);


            });

    }

    




    return (

        <View>
            {/* <Button onPress={buttonClick} >Sync</Button> */}
        </View>

    );



}
export default SyncScreen;