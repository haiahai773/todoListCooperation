import express from "express";
import mysql2 from "mysql2/promise";
import fs from "node:fs";
import jsyaml from "js-yaml";

//express模块化，导入user接口模块
import list from "./src/list/list.js";
import login from "./src/login/login.js";
import note from "./src/note/note.js";
import tomato from "./src/tomato/tomato.js";

//异步读取文件，编码格式为utf-8
const dbYaml = fs.readFileSync("./src/db.config.yaml", "utf-8");
//使用jsyaml 解析yaml文件配置
const dbConfig = jsyaml.load(dbYaml);
//使用mysql2的.createConnetion方法，传入数据库配置，await回调连接数据库
const sql = await mysql2.createConnection({
    //用...解构配置
    ...dbConfig.db,
});

const app = express();

//使用模块，增加根路径/user
app.use("/user", list);
app.use("/user", login);
app.use("/user", note);
app.use("/user", tomato);

//通过中间件实现jwt验证
app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        return res.send({
            status: 401,
            message: "无效token",
        });
    }

    res.send({
        status: 500,
        message: "未知的错误",
    });
});

//中间件允许跨域
app.use("*", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.listen(3000, () => {
    console.log("http://localhost:3000");
});
