'use strict'
const awsServerlessExpress = require('aws-serverless-express')
const app = require('./app')
const http =require('http');
const request = require('request')
const binaryMimeTypes = [
	'application/octet-stream',
	'font/eot',
	'font/opentype',
	'font/otf',
	'image/jpeg',
	'image/png',
	'image/svg+xml'
]
const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes);
exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context)

exports.helloworld = function (event, context) {
	console.log(event);
	context.succeed('hello ' + event.name);
};

exports.postUserEmail = async (event, context) => {
	console.log("identity", event.request.userAttributes.email )
	//get email
	// return new Promise((resolve, reject) => {
    //     const options = {
    //         host: 'localhost',
    //         path: '/user',
    //         port: 3001,
    //         method: 'POST'
    //     };

    //     http.request(options, (res) => {
	// 	  resolve('Success');
		
	// 	// console.log(res);
	// 	// context.succeed(res);
	// 	})
	// 	.catch('error', (e) => {
	// 	  reject(e.message);
	// 	// context.done(null, 'FAILURE');
    //     });

    //     // send the request
    //     req.write('');
    //     req.end();
	// });

	
	const url="http://localhost:3001/user"
	console.log('start request to ' + url) 
    http.get(eurl, function(res) { 
        console.log("Got response: " + res.statusCode); 
        context.succeed(); 
    }).on('error', function(e) { 
        console.log("Got error: " + e.message); 
        context.done(null, 'FAILURE'); 
    }); 
    console.log('end request to ' + url); 


	
	//   console.log('end request to ' + url);

	//   request.post(url, {
	// 	json: {
	// 		todo: 'Buy the milk'
	// 	}
	// 	}, (error, res, body) => {
	// 	if (error) {
	// 		console.error(error)
	// 		context.done(null, 'FAILURE');
		
	// 	}
	// 	console.log(`statusCode: ${res.statusCode}`)
	// 	context.succeed();
	// 	console.log(body)
	// 	})
};
//get federated identity email
