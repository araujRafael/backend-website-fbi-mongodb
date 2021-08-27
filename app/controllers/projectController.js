const authMiddleware = require("../middlewares/auth")

module.exports = server => {
    server.use(authMiddleware)
    server.get("/projects",(req,res)=>{
        try{
            
            res.send({ok:true,user:req.userId})
        }catch(err){
            res.status(400).send({ok:false})
        }
    })
}
