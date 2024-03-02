import express from "express"
import mysql2 from "mysql2/promise"
import fs from "node:fs"
import jsyaml from "js-yaml"
import jwt from "jsonwebtoken"
import { expressjwt } from "express-jwt"
import moment from "moment"

import secretKey from './secretKey.js';

//express创建路由实例
const router = express.Router()

//路由实例使用express.json()中间件，解析json格式的body
router.use(express.json())

//读取数据库yaml配置
const dbYaml = fs.readFileSync("./src/db.config.yaml", "utf-8")
//使用js-yaml解析yaml文件
const dbConfig = jsyaml.load(dbYaml)
//使用mysql2连接数据库 链式回调
const sql = await mysql2.createConnection({
    ...dbConfig.db
})

//jwt解析中间件 express-jwt
router.use(expressjwt({
    secret: secretKey,
    algorithms: ["HS256"]
}).unless({
    path: [
        "/orga/login",
        "/orga/reg"
    ]
}))

//组织注册 req携带account和password
router.post("/reg", async (req, res) => {
    let { account, password, orga_name } = req.body
    let [result] = await sql.query(`SELECT account FROM orga WHERE account = ?`, [account])
    if (result.length <= 0) {
        //账号未重复，写入账号密码，生成jwt
        await sql.query(`INSERT INTO orga(account, password, orga_name) VALUES(?, ?)`, [account, password, orga_name])
        res.send({
            code: 200,
            messaeg: "组织账号成功注册"
        })
        return
    }

    //账号重复
    res.send({
        code: 400,
        messaeg: "组织账号以存在"
    })
})

router.post("/login", async (req, res) => {
    let { account, password } = req.body
    //先判断密码是否正确
    let [[result]] = await sql.query(`SELECT orga_id, password FROM orga WHERE account = ?`, [account])
    if (result.password == password) {
        //密码正确，根据组织id生成jwt
        let Token = jwt.sign({
            orga_id: result.orga_id
        }, secretKey, {
            expiresIn: "7d"
        })

        res.send({
            code: 200,
            messaeg: "登录成功",
            token: Token
        })
        return
    }
    //密码不正确
    res.send({
        code: 400,
        messaeg: "密码错误"
    })
})

router.post("/asignTodo", (req, res) => {
    //为指定用户id添加代办事项
    //从请求体中解构出信息
    let { event_name, start_time, end_time, target_id } = req.body
    //从token中获取组织id
    let orga_id = req.auth.orga_id
    //将时间戳转化为YYYY-MM-DD HH:mm:ss格式
    start_time = moment.unix(start_time).format("YYYY-MM-DD HH:mm:ss")
    end_time = moment.unix(end_time).format("YYYY-MM-DD HH:mm:ss")
    //将待办事项信息插入数据库
    //异步执行，无需等待，因为不是链式回调
    sql.query(`INSERT INTO todo(event_name, start_time, end_time, target_id, orga_id) VALUES(?, ?, ?, ?, ?)`, [
        event_name,
        start_time,
        end_time,
        target_id,
        orga_id
    ])
    res.send({
        code: 200,
        message: "待办事项添加成功"
    })
})

router.get("/getOrgaTodo", async (req, res) => {
    //从token中获取orga_id
    let orga_id = req.auth.orga_id
    //在todo表中按照orga_id条件查询
    let [result] = await sql.query(`SELECT * FROM todo WHERE orga_id = ?`, [orga_id])
    //将查询结果返回
    res.send({
        code: 200,
        message: "成功获取组织待办事项",
        data: result
    })
})

router.get("/getMember",async (req, res) => {
    //从token中获取orga_id
    let orga_id = req.auth.orga_id
    //在todo表中按照orga_id条件查询
    let [result] = await sql.query(`SELECT * FROM user WHERE orga_id = ?`, [orga_id])
    //将查询结果返回
    res.send({
        code: 200,
        message: "成功获取组织待办事项",
        data: result
    })
})


router.post("/addMember", (req, res)=>{
    //获取要添加的用户id
    let { user_id } = req.body
    //从jwt获取组织id
    let orga_id = req.auth.orga_id
    //将用户的orga_id修改为当前组织id
    sql.query(`UPDATE user SET orga_id = ? WHERE user_id = ?`, [orga_id, user_id])
    res.send({
        code: 200,
        message: "添加成功"
    })
})

router.post("/deleteMember", (req, res)=>{
    //获取要删除的用户id
    let { user_id } = req.body
    //从jwt获取组织id
    let orga_id = req.auth.orga_id
    //将用户当前组织id修改为NULL
    sql.query(`UPDATE user SET orga_id = NULL WHERE user_id = ?`, [user_id])
    res.send({
        code: 200,
        message: "删除成功"
    })
})

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

//默认导出
export default router