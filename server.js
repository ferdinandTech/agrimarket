const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path:'./config/config.env'})

const Db = process.env.DATABASE
mongoose.set("strictQuery", false)

mongoose.connect(Db,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then( ()=>{
    console.log("mongooseDB connected");
    app.listen(process.env.PORT || 1600, ()=>{
        console.log('connected')
    })
})

const app = require('./app')
// app.listen(process.env.PORT || 1600, ()=>{
//     console.log('connected')
// })                                                                                                                                                                                                                                             