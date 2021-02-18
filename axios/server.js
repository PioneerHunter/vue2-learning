var express = require('express')
var app = express()

// app.all(path, callback)
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Header', 'Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})

// app.get(path, callback)，处理GET请求，换成post同理
app.get('/getTest', function(request, response) {
  data = {
    'FrontEnd': '前端',
    'Sunny': '阳光'
  }
  response.json(data)
})

// app.listen(port, callback)，运行在localhost：5000
var server = app.listen(5000, function () {
  console.log("服务器启动成功")
})