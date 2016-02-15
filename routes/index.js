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
  
  req.sanitizeBody('first_name').escape();
  req.checkBody('first_name', 'Felaktigt förnamn!').notEmpty();
  req.sanitizeBody('last_name').escape();
  req.checkBody('last_name', 'Felaktigt efternamn!').notEmpty();
  req.sanitizeBody('email').escape();
  req.checkBody('email', 'Felaktig e-postadress!').isEmail();
  req.sanitizeBody('organisation').escape();
  req.sanitizeBody('diet').escape();
  req.sanitizeBody('avec').escape();
  req.sanitizeBody('misc').escape();

  if (req.validationErrors()) {
    var err = new Error(req.validationErrors()[0].msg);
    res.status(400);
    res.render('error', { error: err });
  } else {
    var mailOptions = {
      from: 'TF144 <arsfest@teknolog.fi>',
      to: req.body.email,
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
  }
});

module.exports = router;
