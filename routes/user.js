var express=require('express');
var router=express.Router();
var {db}=require('../database/database');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var {secret:SECRET_KEY}=require('../config');
var authenticateMiddleware=require('./aunthenticate');
router.get('/',authenticateMiddleware, function(req,res){
    res.json(req.user)
});
router.post('/signup', (req,res)=>{
    const email=req.body.email;
    db.get(`SELECT * FROM user WHERE email = ?`,[email], (err, user) => {
     if(err) return res.status(500).json({
       success:false,
       message:err.message
     })
     if (user) return  res.status(201).json({
       message:"email already exists",
       success:false
     })
   bcrypt.hash(req.body.password,8, (err,hash)=>{  
   if(err){
  return res.status(500).json({
    error:err
   });
   } else {
    const user = {
      email:req.body.email,
       name:req.body.name,
       password : hash
      };
    db.run(`INSERT INTO user(email,name,password) VALUES (?,?,?)`,[
     user.email,
     user.name,
     hash
    ]
 )
    } 
  res.status(201).json({
  message:'User created'
   }) 
  })
 })
 })   
     router.post('/login', (req, res, next) => {
       const  email  =  req.body.email;
       const  password  =  req.body.password;
       db.get(`SELECT * FROM user WHERE email = ?`,[email], (err, user) => {
         if(err) return res.status(500).json({
           success:false,
           message:err.message
         })
         if (!user) return  res.status(403).json({
           message:"user not found",
           success:false
         })  

       const  result  =  bcrypt.compareSync(password, user.password);
       if(!result) return  res.status(403).json({
         message: "Invalid password",
            success:'failure'
             });
       const  expiresIn  =  24  *  60  *  60;
       const  accessToken  =  jwt.sign({ email:  user.email, id:user.id }, SECRET_KEY, {
           expiresIn:  expiresIn
       });
       delete user.password
       return res.status(200).json({ "user":  user, "access_token":  accessToken, "expires_in":  expiresIn});
   });
  
   });
   router.get('/createadmin', async (req, res) => {
    
  try {
    const user ={
      name: 'Captain',
      email: 'captain@iminza.com',
      password: '4567',
      isAdmin: true,
    };
    db.run(`INSERT INTO user(email,name,password,isAdmin) VALUES (?,?,?,?)`,[
      user.email,
      user.name,
      user.password,
      user.isAdmin
     
     ]
  )
  const  expiresIn  =  24  *  60  *  60;
  const  accessToken  =  jwt.sign({ email:  user.email, id:user.id }, SECRET_KEY, {
      expiresIn:  expiresIn
  });
  return res.status(200).json({ "user":  user, "access_token":  accessToken, "expires_in":  expiresIn});
  } catch (error) {
    res.send({ message: error.message });
  }
});
   router.delete("/:id",authenticateMiddleware, (req, res) => {
     db.run(`DELETE FROM user WHERE id = ? AND userid=?`,
         [req.params.id,req.user.id],
         function (err, rows) {
           if (err) {
            res.json({
              message:"Entry not deleted",
              success:false
            })
            }
            res.json({
              success:true,
              message: "Entry deleted"
            });
            console.log("Entry deleted");
         });
   })
module.exports=router; 