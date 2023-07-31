import SQLite from 'react-native-sqlite-storage';
import { TableData } from './TableData';

const db = SQLite.openDatabase({
  name: 'TPL.db',
  location: 'default',
});

export const createTables = () => {

  db.transaction(
    (tx: any) => {
      TableData.forEach(table => {
        const queryString = createTableMakeQueryString(table);
        tx.executeSql(
          queryString,
          [],
          (tx: any, response: any) => {
            // console.log(`create table success ${table.name}: `, response);
          },
          (tx: any, error: any) => {
            // console.log(`create table error ${table.name}: `, error);
          },
        );
      });
    },
    (error: any) => {
      // console.log('table create query transaction failed: ', error);
    },
    (success: any) => {
      // console.log('table create query transaction:', 'success');
    },
  );
};


const createTableMakeQueryString = (tableQuery: any) => {
  try {
    let query = `CREATE TABLE IF NOT EXISTS ${tableQuery.name} (`;
    let count = 0;
    tableQuery.columns.forEach((column: { name: any; dataType: any; isPrimaryKey: any; autoIncrement: any; shouldNotAllowNull: any; }) => {
      query += `${column.name} ${column.dataType} 
        ${column.isPrimaryKey
          ? 'PRIMARY KEY'
          : column.autoIncrement
            ? 'AUTOINCREMENT'
            : ''
        }
        ${column.shouldNotAllowNull ? 'NOT NULL' : ''}
        ${count < tableQuery.columns.length - 1 ? ',' : ''}`;
      count++;
    });
    query += '); ';
    return query;
  } catch (error) {
    console.log('query string creation failed: ', error);
  }

  return null;
};


// ------------------------ Table Index Key ----------------------------------------------------------


export const CreateTableIndexKey = () => {

  try {
    //..................  IOU Type IDX ...............................................

    db.transaction(
      (tx: any) => {
        const query_idx_IOUTYPE = `CREATE UNIQUE INDEX IF NOT EXISTS idx_IOUTYPE ON  IOU_TYPE(IOUType_ID) `;

        tx.executeSql(
          query_idx_IOUTYPE,
          [],
          (tx: any, response: any) => {
            // console.log(`create table index success IOU_TYPE: `, response);
          },
          (tx: any, error: any) => {
            // console.log(`create table index key error IOU_TYPE: `, error);
          },
        );
      },
      (error: any) => {
        // console.log('table create query transaction failed: ', error);
      },
      (success: any) => {
        // console.log('table create query transaction:', 'success');
      },
    );

    //.............................. Employee IDX .....................................

    db.transaction(
      (tx: any) => {
        const query_idx_EMPLOYEE = `CREATE UNIQUE INDEX IF NOT EXISTS idx_Employee ON  EMPLOYEE(Emp_ID) `;

        tx.executeSql(
          query_idx_EMPLOYEE,
          [],
          (tx: any, response: any) => {
            // console.log(`create table index success EMPLOYEE: `, response);
          },
          (tx: any, error: any) => {
            // console.log(`create table index key error EMPLOYEE: `, error);
          },
        );
      },
      (error: any) => {
        // console.log('table create query transaction failed: ', error);
      },
      (success: any) => {
        // console.log('table create query transaction:', 'success');
      },
    );

    // ............................... EMPLOYEE_TYPE IDX ..........................................

    db.transaction(
      (tx: any) => {
        const query_idx_EMPLOYEE_TYPE = `CREATE UNIQUE INDEX IF NOT EXISTS idx_EmployeeType ON  EMPLOYEE_TYPE(EmpType_ID) `;

        tx.executeSql(
          query_idx_EMPLOYEE_TYPE,
          [],
          (tx: any, response: any) => {
            // console.log(`create table index success EMPLOYEE_TYPE: `, response);
          },
          (tx: any, error: any) => {
            // console.log(`create table index key error EMPLOYEE_TYPE: `, error);
          },
        );
      },
      (error: any) => {
        // console.log('table create query transaction failed: ', error);
      },
      (success: any) => {
        // console.log('table create query transaction:', 'success');
      },
    );

    //.................................. USER IDX ..............................

    db.transaction(
      (tx: any) => {
        const query_idx_USER = `CREATE UNIQUE INDEX IF NOT EXISTS idx_USER ON  USER(USER_ID) `;

        tx.executeSql(
          query_idx_USER,
          [],
          (tx: any, response: any) => {
            // console.log(`create table index success USER: `, response);
          },
          (tx: any, error: any) => {
            // console.log(`create table index key error USER: `, error);
          },
        );
      },
      (error: any) => {
        // console.log('table create query transaction failed: ', error);
      },
      (success: any) => {
        // console.log('table create query transaction:', 'success');
      },
    );


    //.................................. USER ROLES IDX ..............................

    db.transaction(
      (tx: any) => {
        const query_idx_USER = `CREATE UNIQUE INDEX IF NOT EXISTS idx_USER_ROLLS ON  USER_ROLLS(ROLL_ID) `;

        tx.executeSql(
          query_idx_USER,
          [],
          (tx: any, response: any) => {
            // console.log(`create table index success USER: `, response);
          },
          (tx: any, error: any) => {
            // console.log(`create table index key error USER: `, error);
          },
        );
      },
      (error: any) => {
        // console.log('table create query transaction failed: ', error);
      },
      (success: any) => {
        // console.log('table create query transaction:', 'success');
      },
    );

    //.............................. IOU IDX .........................................

    db.transaction(
      (tx: any) => {
        const query_idx_IOU = `CREATE UNIQUE INDEX IF NOT EXISTS idx_IOU ON  IOU(IOU_ID) `;

        tx.executeSql(
          query_idx_IOU,
          [],
          (tx: any, response: any) => {
            // console.log(`create table index success IOU: `, response);
          },
          (tx: any, error: any) => {
            // console.log(`create table index key error IOU: `, error);
          },
        );
      },
      (error: any) => {
        // console.log('table create query transaction failed: ', error);
      },
      (success: any) => {
        // console.log('table create query transaction:', 'success');
      },
    );

    // ................................. IOU_SETTLEMENT IDX ...................................

    db.transaction(
      (tx: any) => {
        const query_idx_IOU_SETTLEMENT = `CREATE UNIQUE INDEX IF NOT EXISTS idx_IOUSETTLEMENT ON  IOU_SETTLEMENT(IOUSettlement_ID) `;

        tx.executeSql(
          query_idx_IOU_SETTLEMENT,
          [],
          (tx: any, response: any) => {
            // console.log(`create table index success IOU_SETTLEMENT: `, response);
          },
          (tx: any, error: any) => {
            // console.log(`create table index key error IOU_SETTLEMENT: `, error);
          },
        );
      },
      (error: any) => {
        // console.log('table create query transaction failed: ', error);
      },
      (success: any) => {
        // console.log('table create query transaction:', 'success');
      },
    );


    // ............................... ONE_OFF_SETTLEMENT IDX ......................

    db.transaction(
      (tx: any) => {
        const query_idx_ONE_OFF_SETTLEMENT = `CREATE UNIQUE INDEX IF NOT EXISTS idx_ONE_OFF_SETTLEMENT ON  ONE_OFF_SETTLEMENT(ONEOFFSettlement_ID) `;

        tx.executeSql(
          query_idx_ONE_OFF_SETTLEMENT,
          [],
          (tx: any, response: any) => {
            // console.log(`create table index success ONE_OFF_SETTLEMENT: `, response);
          },
          (tx: any, error: any) => {
          //   console.log(`create table index key error ONE_OFF_SETTLEMENT: `, error);
          },
        );
      },
      (error: any) => {
        // console.log('table create query transaction failed: ', error);
      },
      (success: any) => {
        // console.log('table create query transaction:', 'success');
      },
    );


    // ........................................ JOB IDX ................................

    db.transaction(
      (tx: any) => {
        const query_idx_JOB = `CREATE UNIQUE INDEX IF NOT EXISTS idx_JOB ON  JOB(Job_NO) `;

        tx.executeSql(
          query_idx_JOB,
          [],
          (tx: any, response: any) => {
            // console.log(`create table index success JOB: `, response);
          },
          (tx: any, error: any) => {
            // console.log(`create table index key error JOB: `, error);
          },
        );
      },
      (error: any) => {
        // console.log('table create query transaction failed: ', error);
      },
      (success: any) => {
        // console.log('table create query transaction:', 'success');
      },
    );


    // ..................................... EXPENSE_TYPE IDX .........................

    db.transaction(
      (tx: any) => {
        const query_idx_EXPENSE_TYPE = `CREATE UNIQUE INDEX IF NOT EXISTS idx_EXPENSE_TYPE ON  EXPENSE_TYPE(ExpType_ID) `;

        tx.executeSql(
          query_idx_EXPENSE_TYPE,
          [],
          (tx: any, response: any) => {
            // console.log(`create table index success EXPENSE_TYPE: `, response);
          },
          (tx: any, error: any) => {
            // console.log(`create table index key error EXPENSE_TYPE: `, error);
          },
        );
      },
      (error: any) => {
        // console.log('table create query transaction failed: ', error);
      },
      (success: any) => {
        // console.log('table create query transaction:', 'success');
      },
    );


    // ...................................... IOU Jobs IDX ................................

    db.transaction(
      (tx: any) => {
        const query_idx_IOU_JOB = `CREATE UNIQUE INDEX IF NOT EXISTS idx_IOUJobs ON  IOU_JOBS(Job_ID) `;

        tx.executeSql(
          query_idx_IOU_JOB,
          [],
          (tx: any, response: any) => {
            // console.log(`create table index success EXPENSE_TYPE: `, response);
          },
          (tx: any, error: any) => {
            // console.log(`create table index key error EXPENSE_TYPE: `, error);
          },
        );
      },
      (error: any) => {
        // console.log('table create query transaction failed: ', error);
      },
      (success: any) => {
        // console.log('table create query transaction:', 'success');
      },
    );
    // ...................................... DEpartments IDX ................................

    db.transaction(
      (tx: any) => {
        const query_idx_IOU_JOB = `CREATE UNIQUE INDEX IF NOT EXISTS idx_DEPARTMENTS ON  DEPARTMENTS(DepID) `;

        tx.executeSql(
          query_idx_IOU_JOB,
          [],
          (tx: any, response: any) => {
            // console.log(`create table index success EXPENSE_TYPE: `, response);
          },
          (tx: any, error: any) => {
            // console.log(`create table index key error EXPENSE_TYPE: `, error);
          },
        );
      },
      (error: any) => {
        // console.log('table create query transaction failed: ', error);
      },
      (success: any) => {
        // console.log('table create query transaction:', 'success');
      },
    );

    // .......................................................................

  } catch (error) {
    console.log('Index key ...........  ', error);

  }

}



// ----------------------------------- Table Data Transactions ------------------------------------------------


//INSERT + UPDATE QUERY
export const insertOrReplace = (data:any, callBack:any) => {
  try {
    db.transaction(
      (tx:any) => {
        data.forEach((table: { table: any; columns: any; values: any; params: any; }) => {
          // let queryString = `INSERT INTO ${table.table} (${table.columns}) VALUES (${table.values})
          // ON CONFLICT(${table.primaryKey}) DO UPDATE SET ${table.subQuery}`;

          // console.log("insert query **********************   "+queryString);

          let queryString = `INSERT OR REPlACE INTO ${table.table} (${table.columns}) VALUES (${table.values})`;

          tx.executeSql(
            queryString,
            table.params,
            (tx:any, response:any) => {
              // callBack(null, response);
              // console.log(`indate data success ${table.table}: `, response);
            },
            (tx:any, error:any) => {
              // callBack(null, error);
              // console.log(`indate data error ${table.table}: `, error);
            },
          );
        });
      },
      (error:any) => {
        // console.log(`${data[0].table} data transaction: `, error);
        callBack(null, error); //notify caller
      },
      (success:any) => {
        // console.log(`${data[0].table} data transaction: `, 'success');
        callBack(success ?? 'success', null); //notify caller
      },
    );
  } catch (error) {
    // console.log('query data error: ', error);
    callBack(null, error); //notify caller
  }
};


//INSERT QUERY
export const insertData = (data:any, callBack:any) => {
  try {
    db.transaction(
      (tx:any) => {
        data.forEach((table: { table: any; columns: any; values: any; params: any; }) => {
          let queryString = `INSERT INTO ${table.table} (${table.columns}) VALUES (${table.values})`;

          tx.executeSql(
            queryString,
            table.params,
            (tx:any, response:any) => {
              // callBack(null, response); 
              // console.log(`insert data success ${table.table}: `, response);
            },
            (tx:any, error:any) => {
              // callBack(null, error); 
              // console.log(`insert data error ${table.table}: `, error);
            },
          );
        });
      },
      (error:any) => {
        // console.log('insert data query transaction failed: ', error);
        callBack(null, error); //notify caller
      },
      (success:any) => {
        // console.log('insert data query transaction success: ', success);
        callBack(success ?? 'success', null); //notify caller
      },
    );
  } catch (error) {
    // console.log('insert data error: ', data);
    callBack(null, error); //notify caller
  }
};


//UPDATE QUERY
export const updateData = (query:any, params:any, callBack:any) => {
  try {
    db.transaction(
      (tx:any) => {
        tx.executeSql(
          query,
          params,
          (tx:any, response:any) => {
            // callBack(null, response); 
            // console.log(`update data success : `, response);
          },
          (tx:any, error:any) => {
            // callBack(null, error);
            // console.log(`update data error: `, error);
          },
        );

      },
      (error:any) => {
        // console.log('update data query transaction failed: ', error);
        callBack(null, error); //notify caller
      },
      (success:any) => {
        // console.log('update data query transaction success: ', success);
        callBack(success ?? 'success', null); //notify caller
      },
    );
  } catch (error) {
    // console.log('update data error: ', data);
    callBack(null, error); //notify caller
  }
};

//DELETE QUERY
export const deleteData = (data:any, callBack:any) => {
  try {
    db.transaction(
      (tx:any) => {
        data.forEach((table: { table: any; query: any; params: any; }) => {

          let queryString = `DELETE FROM ${table.table} ${table.query}`;

          tx.executeSql(
            queryString,
            table.params,
            (tx:any, response:any) => {
              // console.log(`delete data success ${table.name}: `, response);
            },
            (tx:any, error:any) => {
              // console.log(`delete data error ${table.name}: `, error);
            },
          );
        });
      },
      (error:any) => {
        // console.log('delete data query transaction failed: ', error);
        callBack(null, error); //notify caller
      },
      (success:any) => {
        // console.log('delete data query transaction success: ', success);
        callBack(success ?? 'success', null); //notify caller
      },
    );
  } catch (error) {
    console.log('delete data error: ', data);
    callBack(null, error); //notify caller
  }
};

//SEARCH QUERY
export const searchData = (query: any, params: any, callBack: any) => {
  try {
    db.executeSql(
      query,
      params,
      (tx:any, response:any) => {

        if (tx && tx.rows && tx.rows.raw()) {



          // console.log('search data ................. : ', tx.rows.raw());

          return callBack(tx.rows.raw(), null); //notify caller

        }
      },
      (tx:any, error:any) => {
        callBack(null, error); //notify caller
        console.log('search data error : ', tx);
      },
    );
  } catch (error) {
    console.log('search data error: ', error);
    callBack(null, error); //notify caller
  }
};

//ANY QUERY
export const executeQuery = (query:any, params:any, callBack:any) => {
  try {
    db.executeSql(
      query,
      params,
      (tx:any, response:any) => {
        if (tx) {
          // console.log('query data : ', tx);
          return callBack(tx, null); //notify caller
        }
        // console.log('query data error : no data');
      },
      (tx:any, error:any) => {
        callBack(null, error); //notify caller
        // console.log('query data error : ', error);
      },
    );
  } catch (error) {
    // console.log('query data error: ', error);
    callBack(null, error); //notify caller
  }
};

export const CleanDatabase = async () => {

  try {

    db.transaction(tx => {
      tx.executeSql('DELETE FROM IOU_TYPE');
      tx.executeSql('DELETE FROM EMPLOYEE');
      tx.executeSql('DELETE FROM EMPLOYEE_TYPE');
      tx.executeSql('DELETE FROM USER');
      tx.executeSql('DELETE FROM IOU');
      tx.executeSql('DELETE FROM IOU_SETTLEMENT');
      tx.executeSql('DELETE FROM ONE_OFF_SETTLEMENT');
      tx.executeSql('DELETE FROM JOB');
      tx.executeSql('DELETE FROM EXPENSE_TYPE');
      tx.executeSql('DELETE FROM ATTACHMENTS');
      tx.executeSql('DELETE FROM IOU_JOBS');
      tx.executeSql('DELETE FROM IOU_SETTLEMENT_JOBS');
      tx.executeSql('DELETE FROM ONE_OFF_SETTLEMENT_JOBS');
      tx.executeSql('DELETE FROM VEHICLE_NO');
      tx.executeSql('DELETE FROM JOB_NO');
      tx.executeSql('DELETE FROM JOB_OWNERS');
      // ... and so on for all tables in the database
    },
      (error: any) => {
        console.log('Transaction error:', error);
      }, () => {
        console.log('Transaction completed successfully!');
      });

  } catch (error) {
    console.log(" error --- ", error);

  }
  console.log('Database clean');

};
