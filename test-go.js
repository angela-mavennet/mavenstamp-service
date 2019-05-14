var axios = require('axios');

function testGO(email) {
    console.log("email", email)
    postData = { email: email }
var headers = {
  'Content-Type': 'application/json',
  // 'AccessKey':  global.gConfig.ACCESS_KEY, 
}
axios({
    url: "http://api.mavenstamp.com/v1/user/create",
    method: 'post',
    data: postData,
    headers: headers
})
.then(response => {
    console.log("success", response.status + " - " + response.body)
//   res.status(response.status).send(response.body)
})
.catch(error => {
  console.log(error.response.status)
  console.log(error.response.statusText)
//   return res.send(error)
});
}

testGO(process.argv.email || "angela@mavennet.com")