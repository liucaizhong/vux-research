const express = require('express')
const http = require('http')
const url = require('url')
// const formidable = require('formidable')
// const util = require('util')
// const querystring = require('querystring')
const router = express.Router()

const slandUrl = 'http://slandasset.appchizi.com'
// const orientUrl = 'http://wwy94621.sinaapp.com'
const orientUrl = 'http://qy.mtouyan.cn'

const urlMap = {
  '/getcontact': slandUrl + '/contacts/API/get.php',
  '/insertcontact': slandUrl + '/contacts/API/insert.php',
  '/updatecontact': slandUrl + '/contacts/API/update.php',
  '/deletecontact': slandUrl + '/contacts/API/delete.php',
  '/getemployees': slandUrl + '/workplan/API/getUsers.php',
  '/getworkplan': slandUrl + '/workplan/API/getWP.php',
  '/updateworkplan': slandUrl + '/workplan/API/updateWP.php',
  '/getconference': orientUrl + '/agenda/convert.php',
  '/getuser': slandUrl + '/workplan/API/getUser.php',
  '/getfinished': slandUrl + '/workplan/API/getFinished.php',
  '/getcs': orientUrl + '/Communication/API/getCS.php',
  '/updatecs': orientUrl + '/Communication/API/updateCS.php',
  '/getcr': orientUrl + '/Communication/API/getCR.php',
  '/updatecr': orientUrl + '/Communication/API/updateCR.php',
  '/getrules': slandUrl + '/rules/API/getRules.php',
  '/deletenote': slandUrl + '/rules/API/delete.php',
  '/getreports': slandUrl + '/reports/API/getReports.php'
}

function mapUrl (rawUrl) {
  let urlObj = url.parse(rawUrl)
  return urlMap[urlObj.pathname]
}

function requestGet (realUrl, req, res) {
  const getReq = http.get(realUrl, (response) => {
    let body = ''
    response.on('data', (d) => {
      body += d
    })

    response.on('end', () => {
      res.json(JSON.parse(body))
    })
  })

  getReq.on('error', (e) => {
    console.log(`problem with request: ${e.message}`)
  })
  getReq.end()
}

function requestPost (realUrl, req, res) {
  console.log(req.body)
  let data = Object.keys(req.body)[0]
  // console.log(rawData)
  // let data = JSON.parse(rawData)
  // console.log(rawData)
  // let data = querystring.stringify(rawData)
  console.log(data)
  let urlObj = url.parse(realUrl)
  let options = {
    host: urlObj.hostname,
    path: urlObj.path,
    port: urlObj.port,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(data)
    }
  }

  const postReq = http.request(options, function (response) {
    let body = ''
    response.setEncoding('utf8')
    response.on('data', function (chunk) {
      body += chunk
    })
    response.on('end', function () {
      res.json(body)
    })
  })

  postReq.on('error', (e) => {
    console.log(`problem with request: ${e.message}`)
  })

  postReq.write(data)
  postReq.end()
}

// function requestPostForm (realUrl, req, res) {
//   const form = new formidable.IncomingForm()
//   const data = {}
//
//   form.parse(req, (err, fields, files) => {
//     if (err) {
//       console.log('err', err)
//     }
//     console.log('fields', fields)
//     console.log('files', files)
//     console.log('data', util.inspect({fields: fields, files: files}))
//
//     data.fields = Object.assign({}, fields)
//     data.files = Object.assign({}, files)
//   })
//
//   const urlObj = url.parse(realUrl)
//   const options = {
//     host: urlObj.hostname,
//     path: urlObj.path,
//     port: urlObj.port,
//     method: 'POST',
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     }
//   }
//
//   const postReq = http.request(options, function (response) {
//     let body = ''
//     response.setEncoding('utf8')
//     response.on('data', function (chunk) {
//       body += chunk
//     })
//     response.on('end', function () {
//       res.json(body)
//     })
//   })
//
//   postReq.on('error', (e) => {
//     console.log(`problem with request: ${e.message}`)
//   })
//
//   postReq.write(data)
//   postReq.end()
// }

module.exports = () => {
  // get contacts
  router.get('/getcontact', (req, res) => {
    console.log('getcontact start!')
    let urlObj = url.parse(req.url)
    urlObj.pathname = mapUrl(urlObj.pathname)
    let realUrl = url.format(urlObj)
    requestGet(realUrl, req, res)
  })
  // insert contacts
  router.post('/insertcontact', (req, res) => {
    console.log('insertcontact start!')
    let realUrl = mapUrl(req.url)
    requestPost(realUrl, req, res)
  })

  // update contacts
  router.post('/updatecontact', (req, res) => {
    console.log('updatecontact start!')
    let realUrl = mapUrl(req.url)
    requestPost(realUrl, req, res)
  })

  // delete contacts
  router.post('/deletecontact', (req, res) => {
    console.log('deletecontact start!')
    let realUrl = mapUrl(req.url)
    requestPost(realUrl, req, res)
  })
  // get employees of one specified department
  router.get('/getemployees', (req, res) => {
    console.log('getemployees start!')
    let urlObj = url.parse(req.url)
    urlObj.pathname = mapUrl(urlObj.pathname)
    let realUrl = url.format(urlObj)
    console.log(realUrl)
    requestGet(realUrl, req, res)
  })
  // get an employee's workplan
  router.get('/getworkplan', (req, res) => {
    console.log('getworkplan start!')
    let urlObj = url.parse(req.url)
    urlObj.pathname = mapUrl(urlObj.pathname)
    let realUrl = url.format(urlObj)
    console.log(realUrl)
    requestGet(realUrl, req, res)
  })
  // update an employee's workplan
  router.post('/updateworkplan', (req, res) => {
    console.log('updateworkplan start!')
    let realUrl = mapUrl(req.url)
    requestPost(realUrl, req, res)
  })
  // get conference list
  router.get('/getconference', (req, res) => {
    console.log('getconference start!')
    let urlObj = url.parse(req.url)
    urlObj.pathname = mapUrl(urlObj.pathname)
    let realUrl = url.format(urlObj)
    console.log(realUrl)
    requestGet(realUrl, req, res)
  })
  // get user info
  router.get('/getuser', (req, res) => {
    console.log('getuser start!')
    let urlObj = url.parse(req.url)
    urlObj.pathname = mapUrl(urlObj.pathname)
    let realUrl = url.format(urlObj)
    console.log(realUrl)
    requestGet(realUrl, req, res)
  })
  // get task achievement of specified user
  router.get('/getfinished', (req, res) => {
    console.log('getfinished start!')
    let urlObj = url.parse(req.url)
    urlObj.pathname = mapUrl(urlObj.pathname)
    let realUrl = url.format(urlObj)
    console.log(realUrl)
    requestGet(realUrl, req, res)
  })
  // get feedback of strategy
  router.get('/getcs', (req, res) => {
    console.log('getcs start!')
    let urlObj = url.parse(req.url)
    urlObj.pathname = mapUrl(urlObj.pathname)
    let realUrl = url.format(urlObj)
    console.log(realUrl)
    requestGet(realUrl, req, res)
  })
  // update feedback of strategy
  router.post('/updatecs', (req, res) => {
    console.log('updatecs start!')
    let realUrl = mapUrl(req.url)
    requestPost(realUrl, req, res)
  })
  // get feedback of research
  router.get('/getcr', (req, res) => {
    console.log('getcr start!')
    let urlObj = url.parse(req.url)
    urlObj.pathname = mapUrl(urlObj.pathname)
    let realUrl = url.format(urlObj)
    console.log(realUrl)
    requestGet(realUrl, req, res)
  })
  // update feedback of research
  router.post('/updatecr', (req, res) => {
    console.log('updatecr start!')
    let realUrl = mapUrl(req.url)
    requestPost(realUrl, req, res)
  })
  // upload notification
  // router.post('/uploadnote', (req, res) => {
  //   console.log('uploadnote start!')
  //   let realUrl = mapUrl(req.url)
  //   requestPostForm(realUrl, req, res)
  // })
  // get notification&rules
  router.get('/getrules', (req, res) => {
    console.log('getrules start!')
    let urlObj = url.parse(req.url)
    urlObj.pathname = mapUrl(urlObj.pathname)
    let realUrl = url.format(urlObj)
    console.log(realUrl)
    requestGet(realUrl, req, res)
  })
  // delete notice&rule
  router.post('/deletenote', (req, res) => {
    console.log('deletenote start!')
    let realUrl = mapUrl(req.url)
    requestPost(realUrl, req, res)
  })
  // get reports
  router.get('/getreports', (req, res) => {
    console.log('getreports start!')
    let urlObj = url.parse(req.url)
    urlObj.pathname = mapUrl(urlObj.pathname)
    let realUrl = url.format(urlObj)
    console.log(realUrl)
    requestGet(realUrl, req, res)
  })

  return router
}
