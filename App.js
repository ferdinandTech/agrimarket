const express = require('express');
const dotenv = require('dotenv')

dotenv.config({path: './config/config'})
const Auth = require('./router/AddUser')

const app = express()
app.use(express.json())

app.use('/api', Auth)

app.use('', (req,res)=>{
    res.status(200).send('connected to our Api')
});

module.exports = app;