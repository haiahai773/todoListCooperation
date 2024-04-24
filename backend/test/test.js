import express from "express"
import mysql2 from "mysql2/promise"
import fs from "node:fs"
import jsyaml from "js-yaml"
import jwt from "jsonwebtoken"
import { expressjwt } from "express-jwt"

import secretKey from './src/secretKey.js';

//异步读取文件，编码格式为utf-8
const dbYaml = fs.readFileSync("./src/db.config.yaml", "utf-8")
//使用jsyaml 解析yaml文件配置
const dbConfig = jsyaml.load(dbYaml)
//使用mysql2的.createConnetion方法，传入数据库配置，await回调连接数据库 
const sql = await mysql2.createConnection({
    //用...解构配置
    ...dbConfig.db
})

const app = express()

//使用模块，增加根路径/user
app.use("/user", user)
app.use("/orga", orga)

//通过中间件实现jwt验证
app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        return res.send({
            status: 401,
            message: "无效token"
        })
    }

    res.send({
        status: 500,
        message: "未知的错误"
    })
})

//中间件允许跨域
app.use("*", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")
    next()
})


const test = async () => {
    //使用mysql2的createConnection()方法返回的实例，的.query()方法执行sql语句。先在数据库中查询，账号是否重复。如果重复的话，返回code400
    let [result] = await sql.query(`SELECT todo.todo_id, todo.event_name, todo.start_time, todo.end_time, todo.target_id, todo.is_checked, orga.orga_id, orga.orga_name  FROM todo LEFT JOIN orga ON todo.orga_id = orga.orga_id WHERE target_id = ? and todo.is_checked = false`, [1])
    console.log(result)
}

app.listen(3000, () => {
    console.log("http://localhost:3000")
    test()
})
