require("dotenv").config()
const express =  require("express");
const con = require("../config")
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const serverless = require("serverless-http");
const { json } = require("body-parser");

const app = express();
const router = express.Router();
var secret = "secret";
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function(req, resp){
    con.query("SELECT * from user_data", function(err, result){
        if(err){
            resp.send(err)
        }else{
            resp.json(result)
        }
    });
});

app.post("/addUser", function(req, resp){
    var data = {
        username: req.body.username,
    }
    con.query("INSERT INTO user_data SET ? " , data, function(err, result){
        if(err){
            resp.send(err)
        }else{
            resp.json(result)
        }
    });
});

app.post("/createUser", function(req, resp){
    const data1 = {
        "password": req.body.password,
        "email": req.body.email,    
    }
   const t = jwt.sign(data1, secret, {expiresIn: "10y"})
    const data = {
        "name": req.body.name,
        "password": req.body.password,
        "email": req.body.email,
        "token": t,
        }
        
    con.query("INSERT INTO user_credentials SET? ", data, function(err, result){
        if(err){
            resp.send({
                "code": 1,
                "message": err,

            })
        }else{
            var response = {
                "code": 0,
                "message": "Success",
                "token": t,
                "result": result
            }
            resp.send(response)
        }
    })  
});
app.post("/login", function(req, resp){
    
    const token =
    req.body.token || req.query.token || req.headers["authorization"]; 
   
  if(token == null){
    resp.status(403).send({
        "code": 9,
        "message": "token needed"
    })
  }else{

    var ten = token.split(" ")[1];
    var data1 = jwt.verify(ten, secret);
    con.query("SELECT * from user_credentials WHERE email =?", [data1.email, data1.password], function(err, result){
        if(err){
            resp.send(err)
        }
        else{
            resp.send({
                "code": 0,
                "message": "Login Success",
                "result": result
            })
        }
    });
  }
    
});




// app.use("/.netlify/functions/index",router);   

// module.exports = {
//     output: {
//         hashFunction: "sha256"
//     }
// };
// module.exports.handler = serverless(app);

app.listen(process.env.APP_PORT, function(){
    console.log("listening on port 5000");
});



