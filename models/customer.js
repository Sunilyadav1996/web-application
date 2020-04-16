const mongoose = require('mongoose');
// const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const customerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String
        }
    }],
    token:{
        type:String
    }
})


customerSchema.pre('save', async function(next){
    const cust = this;
    const hashPassword= await bcrypt.hash(cust.password,8)
    this.password=hashPassword;
    next();
})

customerSchema.methods.generateAuthToken = async function(){
    const customer = this
    const token =  jwt.sign({ _id: customer._id.toString() }, 'thisismynewcourse')
    customer.tokens = customer.tokens.concat({ token }) 
    return token
}

customerSchema.statics.authenticateByCredential = async function(email, password){
    const customer = await Customer.findOne({email})
   
    if(!customer){
    return new Error('Invalid Credential')
    }

    const isMatch = await bcrypt.compare(password,customer.password)
    
    if(!isMatch){
        return 'Invalid Credential'
    }

    return customer

}


const Customer = mongoose.model('Customer',customerSchema)
module.exports = Customer;

