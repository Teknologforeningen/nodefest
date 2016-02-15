var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Teknologföreningens årsfest' });
});

router.get('/register/', function(req, res, next) {
  res.render('register', { title: 'Anmälan' });
});

/* POST submit form */
router.post('/submit/', function(req, res, next) {
  console.log(req.body);
  var transporter = nodemailer.createTransport('smtp://smtp.ayy.fi');
  
  var mailOptions = {
    from: 'TF144 <arsfest@teknolog.fi>',
    to: 'oleg.stikhin@aalto.fi',
    subject: 'Bekräftelse',
    text: 'Din anmälan har mottagits' + req.body.first_name,
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      res.send(error);
    } else {
      console.log('Message sent: ' + info.response);
    }
  });
  res.render('submit', { title: 'Bekräftelse' });
});

module.exports = router;
