const express = require('express')
const router = express.Router();
const Customer = require('../models/customer')
const auth = require('../middleware/auth')

router.get('/customer', auth , (req,res)=>{
    const cust = Customer.find({})
    cust.exec().then((docs)=>{
      return  res.send(docs);
    }).catch((err)=>{
        console.log('Error'+err);
        res.status(500).send('Server Internal Error')
    })
    
})

router.post('/customer', async (req,res)=>{
    console.log(req.body);
    const customer = new Customer(req.body)
    
    try{
        await customer.save();
        const token = await customer.generateAuthToken()
        console.log(customer);
        res.status(201).send({customer,token})
    }catch(err){
        res.status(400).send(err)
    }
    
})


router.post('/customer/login', async (req, res)=>{
    try{

    const customer = await Customer.authenticateByCredential(req.body.email, req.body.password)

    if(!(typeof customer=="object")){
       return res.status(200).send('Invalid Credentials')
    }

    const token = await customer.generateAuthToken()
    
    if(!token){
        res.status(404).send("Invalid Credentials")
    }

    res.render('index', {name:customer.name,email:customer.email} )
    }catch(e){
        res.send(e);
    }

   
} )

router.get('/customer/:id', auth , async (req,res) =>{
    const cust = await Customer.findById(req.params.id).exec();
    if(!cust){
     return res.status(500).send('Server Error')
    }
    res.send(cust);
})

router.patch('/customer/:id', auth , async (req,res)=>{
    console.log(req.params.id);
    const cust = await Customer.findByIdAndUpdate(req.params.id,req.body).exec();
    if(!cust){
        res.status(500).send('Enternal Error');
    }else{
        res.send(cust);
    }

})

router.post('/customer/logout', auth , async (req, res)=>{
    try{
    const customer = req.customer;
    customer.tokens=[];
    customer.token=''
    await Customer.findOneAndUpdate(customer.id, customer)
    res.send('Logout Successfully')
    }catch(error){
        res.status(200).send(error)
    }
})

module.exports = router
