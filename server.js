const express = require("express")
const consign = require('consign')

const server = express();
server.use(express.json())
server.use(express.json({type:"application/json"}))
server.use(express.urlencoded({extended:true}))
consign().include("routes").include("./app/controllers").into(server)

server.listen(1138, ()=> {
    console.log("Server is running on: http://localhost:1138");
})