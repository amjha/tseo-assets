/*
require('dotenv').config();
const sql = require('mssql');
console.log(process.env.DB_USER)
var sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
};

async function executeQuery(){
    try{
        let pool = await sql.connect(sqlConfig);
        let res = pool.request().execute("test_sys_pro") //.query("select top 10 * from GURU_DEFINITIONS;");
        res.then(r=>{
            r.recordset.forEach(v=>{console.dir(v)})

        })
    } catch(err){
        console.log(err)
    }
}

sql.on("error", err=>{
    console.log(err)
})

executeQuery();

*/
// -----------------------------------------------------------------------------------------------------------------------


import {createConnection} from 'typeorm';
import {Photo} from './model';
let conn;
export async function connectionHandle() {
    if (conn === undefined) {
        try {
            // @ts-ignore
            conn = await createConnection({
                type: 'mssql',
                host: process.env.DB_SERVER,
                port: process.env.DB_PORT,
                username: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
                entities: [
                    Photo
                ],
                synchronize: true,
                logging: false
            });

        } catch (err) {
            throw  err;
        }
    }
    return conn;
}


