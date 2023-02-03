const express = require('express')
const {newUser, logIn, verifyUser, forgotPassword, changePassword, forgotPassWord} = require('../controllers/Adduser')

const Router = express.Router()

Router.route('/sign').post(newUser)
Router.route('/login').post(logIn)
Router.route('/verify').post(verifyUser)
Router.route('/frgtPassWrd').post(forgotPassword)
Router.route('/changepass/:userId').post(changePassword)
module.exports = Router;