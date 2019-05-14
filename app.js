var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var cors = require('cors')
var axios = require('axios');
var app = express();
var jwt = require("jsonwebtoken");

// const stripe = require("./stripe.js")

var stripe = require("stripe")("sk_test_R2TxJIW1kYX2H3VcBzAqNSmS");

// environment variables
// process.env.NODE_ENV = 'development';

// uncomment below line to test this code against staging environment
// process.env.NODE_ENV = 'staging';

// uncomment below line to test this code against staging environment
// process.env.NODE_ENV = 'production';

// config variables
const config = require('./config/config.js');

console.log("config environment used:", global.gConfig)


var corsOptions = {
  origin: global.gConfig.CLIENT_HOST + ":" + global.gConfig.node_client_port,
  // allowedHeaders: 'Content-Type',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
 console.log("cors policy",corsOptions )

// using nginx cors functions

if (global.config_id != "production"){
  console.log("allow cors on (not prod): ", corsOptions.origin)
  app.use(cors(corsOptions));
}


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));



app.get('/timestamp/:hash', function(req, res) {
  var headers = {
    'Content-Type': 'application/json'
    ,'AccessKey':  global.gConfig.ACCESS_KEY
    
    }

    axios({
        url: `${global.gConfig.GO_URL}/v1/timestamp/${req.params.hash}`,
        method: 'GET',
        headers: headers
    })
    .then(response => {
        console.log(response.data)
        res.send(response.data)
            

    })
    .catch(error => console.log(error));
})

app.post('/proof', function(req,res) {
  let data = {}
  for ( property in req.body ) {
    data = property
  }
const postData = data

  var headers = {
    'Content-Type': 'application/json',
    'AccessKey':  global.gConfig.ACCESS_KEY
  }
  axios({
    url:  global.gConfig.GO_URL+ "/v1/timestamp/proof",
    method: 'post',
    data: postData,
    headers: headers
  })
    .then(response => {
      // res.header("Access-Control-Allow-Origin", corsOptions.origin)
      res.send(response.data)
    
    })
    .catch(error => {
      console.log(error)
      res.send(error)
    });
})


app.post('/timestamp', function(req,res) {

  let data = {}
  for ( property in req.body ) {
    data = property
  }
 

const postData = data
 
  var headers = {
    'Content-Type': 'application/json',
    'AccessKey':  global.gConfig.ACCESS_KEY,
  }
  axios({
      url:  global.gConfig.GO_URL+ "/v1/timestamp/create",
      method: 'post',
      data: postData,
      headers: headers
  })
  .then(response => {
    res.status(response.status).send(response.body)
  })
  .catch(error => {
    console.log(error)
    return res.send(error)
  });

})

app.post('/user/:email/create', function(req,res) {
  const { email, sub } = req.params
  const postData = { email: email, access_key: sub }
  const token = jwt.sign(postData, global.gConfig.secret)
  console.log("in /user/:email/create")
  console.log("payload", postData)
  console.log("token", token)


  var headers = {
    'Content-Type': 'application/json',
    'token': token
    // 'AccessKey':  global.gConfig.ACCESS_KEY, 
  }
  axios({
      url: global.gConfig.GO_URL+ "/v1/user/create",
      method: 'post',
      data: postData,
      headers: headers
  })
  .then(response => {
    res.status(response.status).send(response.body)
  })
  .catch(error => {
    console.log(error)
    return res.send(error)
  });
  
})

app.post('/user', function(req,res) {

  let data = {}
  for ( property in req.body ) {
    data = property
  }
  const postData = data
  const token = jwt.sign(postData, global.gConfig.secret)

  console.log("in post:/user")
  console.log("payload", postData)
  console.log("token", token)

  var headers = {
    'Content-Type': 'application/json',
    'token': token
    // 'AccessKey':  global.gConfig.ACCESS_KEY, 
  }
  axios({
      url: `${ global.gConfig.GO_URL }/v1/user`,
      method: 'post',
      data: postData,
      headers: headers
  })
  .then(response => {
    res.status(response.status).send(response)
  })
  .catch(error => {
    console.log(error)
    return res.send(error)
  });
  
})

app.get('/user/:email', function(req,res) {
  const { email, sub  } = req.params
  const postData = { email: email, access_key: sub }
  const token = jwt.sign(postData, global.gConfig.secret)

  console.log("get user")
  console.log("payload", postData)
  console.log("token", token)

 
  var headers = {
    'Content-Type': 'application/json',
    'token': token
  }
  axios({
      url: `${ global.gConfig.GO_URL}/v1/user`,
      method: 'get',
      data: postData,
      headers: headers
  })
  .then(response => {
    console.log(response.body)
    res.status(response.status).send(response.data)
  })
  .catch(error => {
    console.log(error)
    return res.send(error)
  });
  
})

app.post('/submit', function(req,res){
  // g-recaptcha-response is the key that browser will generate upon form submit.
  // if its blank or null means user has not selected the captcha, so return the error.
  console.log("req header", req.headers)
  if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
  }
  // Put your secret key here.
  // req.connection.remoteAddress will provide IP address of connected user.

  console.log("req.connection.remoteAddress", req.connection.remoteAddress);
  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" +  global.gConfig.RECAPTCHA_SECRET_KEY + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
  // Hitting GET request to the URL, Google will respond with success or error scenario.
  const options = {
    url: verificationUrl,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  
  request(options,function(error,response,body) {
    body = JSON.parse(body);
    console.log("body", body)
    // Success will be true or false depending upon captcha validation.
    if(body.success !== undefined && !body.success) {
      return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
    }
    res.json({"responseCode" : 0,"responseDesc" : "Success"});
  });

});

/* Stripe */


async function createStripeCustomer (){
  // Create a Customer:
  const customer = await stripe.customers.create({
    source: 'tok_mastercard',
    email: 'paying.user@example.com',
  });

  console.log(customer)

  // Charge the Customer instead of the card:
  const charge = await stripe.charges.create({
    amount: 1000,
    currency: 'usd',
    customer: customer.id,
  });

  console.log(charge) 
  return charge

  // YOUR CODE: Save the customer ID and other info in a database for later.
}

app.post('/charge', function(req,res) {

  let data = {}
  for ( property in req.body ) {
    data = property
  }
  createStripeCustomer();

  
})


// This will handle 404 requests.
app.use("*",function(req,res) {
  res.status(404).send("404");
})

// app.listen(global.gConfig.node_server_port, () => {
//   console.log(`${global.gConfig.app_name} listening on port ${global.gConfig.node_server_port}`);
// });

module.exports = app
