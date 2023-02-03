const AddUser = require('../models/Adduser')
const bcryptjs = require ('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const mailSender = require('../helpers/email');
const Adduser = require('../models/Adduser');
dotenv.config({path: './config/config.env'});


exports.newUser = async (req, res,)=>{
  try {
    const {firstName,lastName,email,phoneNumber,password,location,} = req.body;

    const saltedPassword = await bcryptjs.genSalt(10)
    const hashPassword = await bcryptjs.hash(password,saltedPassword)

    const data = {
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashPassword,
    location,
      }
      const createUser = new AddUser(data)

      const generateToken = jwt.sign({
        id: createUser._id,
        isAddmin: createUser.isAddmin
      }, process.env.JWTTOKEN,{expiresIn:'1d'})
      createUser.token = generateToken
      await createUser.save();
      const verifyUser = `${req.prototol}://${req.get('host')}/api/verifyUser/${createUser._id}`;
      const message = `click on the link ${verifyUser}to verify your account... `;
      mailSender({
        email: createUser.email,
        subject : "Kindly verify account",
        message
      })

      res.status(201).json({
        data: createUser
      })
        } catch (error) {
    res.status(404).json({
      message: error.message
    })
  }
};

exports.verifyUser = async(req,res)=>{
  try {
    const userId = req.params.userId;
    const user = await AddUser.findById(userId);
    await AddUser.findByIdAndUpdate(user._id, {
      verified : true
    },{
      new: true
    });
    res.status(201).json({
      message: 'successfully verify user'
    })
  } catch (error) {
    res.status(404).json({
      message: error.message
    })
  }
}

exports.logIn = async (req,res)=>{
  try{
      const {email, password } = req.body;
      const checkEmail = await AddUser.findOne({email});
      if(!checkEmail){
          res.status(404).json({
              message: "Email or password is not authenticated..."
          })
      }else{
          const checkPassword = bcryptjs.compare(password, checkEmail.password);
          if(!checkPassword){
              res.status(404).json({
                  message: "Email or password is not valid...."
              })
          }else{
              const generateToken = jwt.sign({
                  id: checkEmail._id,
                  isAdmin: checkEmail.isAdmin
              },process.env.JWTTOKEN, {expiresIn: "1h"});
              checkEmail.token = generateToken;
              await checkEmail.save();

              const verifyMe = `${req.protocol}://${req.get("host")}/api/verifyUser/${checkEmail._id}`
              const message = `Welcome back  ${checkEmail.firstName} `;
              mailSender({
                  email: checkEmail.email,
                  subject: "testing verification",
                  message
              })
  
              res.status(200).json({
                  data: checkEmail
              })
          }
      }
  }catch(err){
      res.status(400).json({
          message: err.message
      })
  }
};

exports.forgotPassword = async(req,res)=>{
  try {
      const {email} = req.body
      const checkEmail = await AddUser.findOne({email});
      if(!checkEmail){
          res.status(400).json({
              message: "Wrong inputed Email"
          })
      }else{
          const generateToken = jwt.sign({
              id: checkEmail._id,
              isAdmin: checkEmail.isAdmin
          },process.env.JWTTOKEN, {expiresIn: "1h"});
          const verifyEmail = `${req.protocol}://${req.get("host")}/api/changepassword/${checkEmail._id}/${generateToken}`;
          const message = `Click on the link ${verifyEmail} to change ur password`;
          mailSender({
              email: checkEmail.email,
              subject: "Change of password",
              message
          });
          res.status(200).json({
              message: "Check for the email that was sent too you...."
          })
      }
  } catch (error) {
      res.status(400).json({
          message: err.message
      })
  }
};

exports.changePassword = async(req,res)=>{
  try {
      const {password} = req.body
      const userId = req.params.user;
      const user = await Adduser.findById(userId);
       const saltedPassword = await bcryptjs.genSalt(10);
      const hashPassword = await bcryptjs.hash(password, saltedPassword);
      await AddUser.findByIdAndUpdate(userId,{
          password: hashPassword
      }, {
          new: true
      });
      res.status(200).json({
          message: "Successfully inputed a new password.."
      })
  } catch (error) {
      res.status(400).json({
          message: error.message
      })
  }
};

