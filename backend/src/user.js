import express from "express"
import mysql2 from "mysql2/promise"
import fs from "node:fs"
import jsyaml from "js-yaml"

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

//默认导出
export default router