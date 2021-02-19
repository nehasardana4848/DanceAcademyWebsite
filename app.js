const express=require ("express");
const path=require("path");
const fs=require("fs");
var fast2sms = require('fast-two-sms');
const bodyparser = require('body-parser')
const mongoose = require('mongoose');
const PUBLISHABLE_KEY="pk_test_51ILqhQJpAJb5irLbUYJ0Vt3OQUDpoJgMuBR8aMFBPocCU5f5SJBGJe2EJsrM7RWUal9NpNnhL7p4oEjz3g6ZYyT200D6SBnbH8"
const SECRET_KEY="sk_test_51ILqhQJpAJb5irLba1aeFenwgbl5qt4XxJjWDBVJfvUl7B9F2pSwidcJ0G3D6VRJi7wu2l9WwihOGSV9YzbPbczu002P0dSQ3R"
const stripe=require('stripe')(SECRET_KEY)
require('dotenv').config();
mongoose.connect('mongodb://localhost/contactdance', {useNewUrlParser: true, useUnifiedTopology: true});
const app=express();
const port=80;
var contactSchema = new mongoose.Schema({
    name: {type:String,
      required:true
    },
    email:{type:String,
      required:true,
      unique:true,
     
    },
    phone: {type:String,
      required:true,
      unique:true
    },
    address: {type:String,
      required:true
    },
    desc: {type:String,
      required:true
    }
  });
    var Contact = mongoose.model('Contact', contactSchema);

app.use('/static', express.static('static'))
//PUG SPECIFIC STUFF
app.use(express.urlencoded())
app.use(express.urlencoded({ extended: false }));

app.set('view engine','pug');
app.set('views' , path.join(__dirname, 'views'));
app.get('/',(req, res)=>{
    const param = {'title': 'Dance Website'}
    res.status(200).render('home.pug',param)
})
app.get('/contact',(req, res)=>{
    const param = {'title': 'Dance Website'}
    res.status(200).render('contact.pug',param)
})
app.post('/contact',async (req, res)=>{
    var myData = new Contact(req.body);
    
     const data= await  fast2sms.sendMessage(  {authorization : process.env.API_KEY , message : `Hello ${req.body.name} ,Welcome to Neha's Dance Academy .Thank You for registering.Our teachers will contact you soon` ,  numbers : [req.body.phone]} )

    myData.save().then(()=>{
         
        res.send(`<script>alert("✅Registered Successfully✅"); window.location.href = "/contact"; </script>`);
    }).catch(()=>{
        res.send(`<script>alert("⚠️Not Registered.Please Enter the Data Correctly!!"); window.location.href = "/contact"; </script>`);
    });
})
app.get('/classinfo',(req, res)=>{
  const param = {'title': 'Dance Website'}
  res.status(200).render('classinfo.pug',param)
})
app.get('/aboutus',(req, res)=>{
  const param = {'title': 'Dance Website'}
  res.status(200).render('aboutus.pug',param)
})
app.use(bodyparser.urlencoded({extended:false})) 
app.use(bodyparser.json()) 
app.get('/price',(req,res)=>{

  res.render('price')
})
app.post('/payment', function(req, res){ 

  // Moreover you can take more details from user 
  // like Address, Name, etc from form 
  stripe.customers.create({ 
      email: req.body.stripeEmail, 
      source: req.body.stripeToken, 
      name: 'Neha Sardana', 
      address: { 
          line1: 'TC 9/4 Old MES colony', 
          postal_code: '160036', 
          city: 'New Delhi', 
          state: 'Delhi', 
          country: 'India', 
      } 
  }) 
  .then((customer) => { 

      return stripe.charges.create({ 
          amount: 110000,    // Charing Rs 25 
          description: 'Web Development Product', 
          currency: 'INR', 
          customer: customer.id 
      }); 
  }) 
  .then((charge) => { 
      res.send(`<script>alert("✅ Successfull✅"); window.location.href = "/price"; </script>`) // If no error occurs 
  }) 
  .catch((err) => { 
      res.send(err)    // If some error occurs 
  }); 
}) 
app.listen(port,()=>{
    console.log("this has sucessfully started")
    })