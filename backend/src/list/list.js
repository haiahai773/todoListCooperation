import express from "express"
import mysql2 from "mysql2/promise"
import fs from "node:fs"
import jsyaml from "js-yaml"
import { expressjwt } from "express-jwt"

import secretKey from '../secretKey.js';

//使用express的.Router()方法，调用后返回router实例，然后在router实例上进行操作，编写接口
const router = express.Router()

//中间件允许跨域
router.use("*", (req, res, next) => {
    //
    res.setHeader("Access-Control-Allow-Origin", "*")
    if (res.path == "/loign" || res.path == "/reg") {
        //登录和注册不需要jwt认证
        res.setHeader("Access-Control-Allow-Headers", "Content-Type")
        next()
    }
    //其他需要jwt认证，再添加Authorization字段
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
    next()
})

//路由使用express的json模块，接受客户端post发来的json文件
router.use(express.json())

const dbYaml = fs.readFileSync("./src/db.config.yaml", "utf-8")
//用js-yaml模块的.load()方法，解析yaml文件
const dbConfig = jsyaml.load(dbYaml)
//通过mysql2模块的.createConnetion()方法，将解析的yaml文件解构后作为配置传入，await回调连接
const sql = await mysql2.createConnection({
    //使用yaml文件的db部分
    ...dbConfig.db
})

//jwt解析中间件
//通过express实例的.use()方法，传入expressjwt()对象，传入配置对象，secret指的是加密用的密钥，algorithms指的是加密算法
router.use(expressjwt({
    secret: secretKey,
    algorithms: ["HS256"]
    //expressjwt()的.unless()方法传入配置对象，配置对象中的path属性定义不需要jwt验证的接口
}).unless({
    //用户注册和登录不需要jwt验证
    path: [
        "/user/reg",
        "/user/login"
    ]
}))

//用户创建待办事项，需要token
router.post("/createTodo", async (req, res) => {
    //从请求体中解构出信息
    let { event_name, start_time, end_time, target_id } = req.body
    //将Date类型转化为数据库格式，即删除毫秒和时区，houw
    console.log(start_time, end_time)

    //从token中获取用户id
    let user_id = req.auth.user_id
    //将待办事项信息插入数据库
    //异步执行，无需等待，因为不是链式回调
    sql.query(`INSERT INTO todo(event_name, start_time, end_time, target_id, user_id) VALUES(?, ?, ?, ?, ?)`, [
        event_name,
        start_time,
        end_time,
        target_id,
        user_id
    ])
    res.send({
        code: 200,
        message: "待办事项添加成功"
    })
})

//用户获取未完成的待办事项
router.get("/getTodo", async (req, res) => {
    //从token中获取用户id
    let user_id = req.auth.user_id
    //根据userid获取到其创建的待办事项
    //将target_id作为选择条件，在todo表中查找满足条件的表行，返回该用户创建的所有待办事项
    let [result] = await sql.query(`SELECT todo.todo_id, todo.event_name, todo.start_time, todo.end_time, todo.target_id, todo.is_checked, orga.orga_id, orga.orga_name  FROM todo LEFT JOIN orga ON todo.orga_id = orga.orga_id WHERE target_id = ? and todo.is_checked = false`, [user_id])
    //如果有orga_id的话，在orga表中找到用户名返回
    if (result)
        //如果没有orga_id的话，来源就是自己

        console.log(result);
    //将查询结果作为data返回
    res.send({
        code: 200,
        message: "查询成功",
        data: result
    })
})

//用户完成待办事项 请求携带待办事项的id
router.post("/doneTodo", (req, res) => {
    //获取待办事项id
    let { todo_id } = req.body
    //将相应待办事项id对应的is_checked属性设置为true
    sql.query(`UPDATE todo SET is_checked = true WHERE todo_id = ?`, [todo_id])
    res.send({
        code: 200,
        message: "完成待办事项" + todo_id
    })
})

//用户undo待办事项 请求携带待办事项的id
router.post("/undoTodo", (req, res) => {
    //获取待办事项id
    let { todo_id } = req.body
    //将相应待办事项id对应的is_checked属性设置为false
    sql.query(`UPDATE todo SET is_checked = false WHERE todo_id = ?`, [todo_id])
    res.send({
        code: 200,
        message: "未完成待办事项" + todo_id
    })
})

//默认导出
export default router