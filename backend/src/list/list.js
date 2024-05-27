import express from "express"


//使用express的.Router()方法，调用后返回router实例，然后在router实例上进行操作，编写接口
const router = express.Router()

//路由使用express的json模块，接受客户端post发来的json文件
router.use(express.json())

router.get('/todo/create',(req,res)=>{
    console.log("hello")
    res.send("hello")
})
//默认导出
export default router