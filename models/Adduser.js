const { verify } = require('jsonwebtoken')
const mongoose = require('mongoose')

const AddusersSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Fullname is required']
    },
    lastName: {
        type: String,
        required: [true, 'Surname is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'phoneNumber is required']
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    location: {
        type: String,
        required: [true, 'location is required']
        
    },
    verified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    token: {
        type: String,
    },
    image:{
        type: String
    },
    cloudId : {
        type: String
    }
},{
    timestamps: true
})

const Adduser = mongoose.model('Adduser', AddusersSchema)
module.exports = Adduser