import express from "express";
import mysql2 from "mysql2/promise";
import fs from "node:fs";
import jsyaml from "js-yaml";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import crypto from "node:crypto";

import secretKey from "../secretKey.js";
import { priKey } from "../../store/crypt.js";

//使用express的.Router()方法，调用后返回router实例，然后在rout、er实例上进行操作，编写接口
const router = express.Router();

//路由使用express的json模块，接受客户端post发来的json文件
router.use(express.json());

const dbYaml = fs.readFileSync("./src/db.config.yaml", "utf-8");
//用js-yaml模块的.load()方法，解析yaml文件
const dbConfig = jsyaml.load(dbYaml);
//通过mysql2模块的.createConnetion()方法，将解析的yaml文件解构后作为配置传入，await回调连接
const sql = await mysql2.createConnection({
    //使用yaml文件的db部分
    ...dbConfig.db,
});


router.post('/todo/getList',async (req,res)=>{
    const {userId} = req.body;
    console.log(userId)
    const query = `select * from todo where userId = ?`
    let [result] = await sql.query(query,[userId])
    res.send({code:200,msg:result,success:true})
})

router.post('/todo/create',async(req,res)=>{
    const {userId, content, title, endTime, startTime} = req.body;
    console.log(userId, content, title, endTime, startTime)
    const query = `INSERT INTO todo (userId, content, title, endTime, startTime)
    VALUES (?, ?, ?, ?, ?);`
    let [result] = await sql.query(query,[userId, content, title, endTime, startTime])
    res.send({code:200,msg:result,success:true})
})

router.post('/todo/finish',async(req,res)=>{
    const {todoId} = req.body;
    const query = `UPDATE todo
    SET status = 1,
        finishTime = CURRENT_TIMESTAMP
        WHERE todoId = ?;
    `
    let [result] = await sql.query(query,[todoId])
    res.send({code:200,msg:'ok',success:true})
})


router.post('/todo/delete',async(req,res)=>{
    const {todoId} = req.body;
    const query = `delete from todo where todoId = ?`
    let [result] = await sql.query(query,[todoId])
    res.send({code:200,msg:'ok',success:true})
})

router.post('/todo/quadrant',async(req,res)=>{
    const {todoId,quadrant} = req.body;
    const query = `update todo 
    set quadrant = ?
    where todoId = ?`
    let [result] = await sql.query(query,[quadrant,todoId])
    res.send({code:200,msg:'ok',success:true})
})

export default router

