import express from "express"
import mysql2 from "mysql2/promise"
import fs from "node:fs"
import jsyaml from "js-yaml"
import jwt from "jsonwebtoken"
import { expressjwt } from "express-jwt"
import moment from "moment" 

import secretKey from './secretKey.js';

//使用express的.Router()方法，调用后返回router实例，然后在router实例上进行操作，编写接口
const router = express.Router()

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
    path:[
        "/user/reg",
        "/user/login"
    ]
}))

//用户注册 输入账号和密码 返回jwt类型的token
router.post("/reg", async (req, res)=>{
    //使用mysql2的createConnection()方法返回的实例，的.query()方法执行sql语句。先在数据库中查询，账号是否重复。如果重复的话，返回code400
    let [result] = await sql.query(`SELECT account FROM user WHERE account = ?`, [req.body.account])
    console.log(result);
    //如果查询账号没有结果，返回了undefined，则说明账号没有被注册过，允许注册
    if(result.length <= 0){
        //前端确保提交的账号和密码都不为空，并且符合要求
        await sql.query(`INSERT INTO user(account, password) VALUES(?, ?)`, [req.body.account, req.body.password])
        res.send({
            code: 200,
            message: "账号成功注册"
        })
        return
    }
    //说明查询账号有结果，不允许二次注册
    res.send({
        code: 400,
        message: "账号已存在"
    })
})

//用户登录，输入账号和密码，然后在user表中查询。正确的话返回jwt生成的token，jwt的payload中包含用户id。
router.post("/login", async (req, res)=>{
    //从请求体中，将账号和密码解构出来
    let { account, password } = req.body
    //通过账号在user表中查询，判断密码是否正确
    //第一层数组解构，获取query返回数组中第一个元素（查询到的表数据的数组）
    //地而成对象解构，获取表数据数组中的第一个元素，即第一行数据
    let [[result]] = await sql.query(`SELECT password FROM user WHERE account = ?`, [account])
    //如果用户输入的密码等于实际密码
    if(password == result.password){
        //通过jwt生成token，payload部分包含用户id
        let id = await sql.query(`SELECT user_id FROM user WHERE account = ?`, [account])
        //使用jsonwebtoken模块的.sign()方法生成token，通过传入三个参数进行配置
        //第一参数为payload部分，第二参数为加密用的密钥，第三参数可以规定token过期时间
        const Token = jwt.sign({
            userid: id
        }, secretKey, {
            expiresIn: "7d"
        })
        res.send({
            code: 200,
            message: "登录成功",
            token: Token
        })
        return
    }
    //用户密码输入错误
    res.send({
        code: 400,
        message: "密码错误，请重试"
    })
})

//用户创建待办事项，需要token
router.post("/createTodo", async (req, res)=>{
    //从请求体中解构出信息
    let {event_name, start_time, end_time, target_id} = req.body
    //从token中获取用户id
    let user_id = req.auth.userid[0][0].user_id
    //将时间戳转化为YYYY-MM-DD HH:mm:ss格式
    start_time = moment.unix(start_time).format("YYYY-MM-DD HH:mm:ss")
    end_time = moment.unix(end_time).format("YYYY-MM-DD HH:mm:ss")
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


//默认导出
export default router