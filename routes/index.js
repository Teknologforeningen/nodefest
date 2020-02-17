var dbModules = require('../modules/db');

var { check, sanitizeBody, validationResult } = require('express-validator');
var express = require('express');
var register = require('../modules/register');
var list = require('../modules/list');
var listExport = require('../modules/export');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Teknologföreningens årsfest' });
});


/* GET register form */
router.get('/register/', function(req, res, next) {
  if (Date.now() < 1581847200000) {
    res.render('notopen', { title: 'Anmälningen är stängd' });
  } else if (Date.now() < 1583532000000) {
    participants_query = dbModules.queryDatabase("SELECT first_name, last_name FROM participants WHERE cancelled='false' AND timestamp>'2019-02-01 12:00:00' ORDER BY id;")
    .then(function (data) {
      res.render('register', { title: 'Anmälan', num_participants: data.length });
    })
    .catch(function(error) {
      console.log("Database error: " + error);
      var err = new Error(error);
      res.status(500);
      res.render('error', { error: err });
    });
    
  } else {
    res.render('closed', { title: 'Anmälningen är stängd' });
  }
});


router.get('/late-registrations/', function(req, res, next) {
  res.render('register', { title: 'Anmälan' });
});

/* POST submit form */
router.post('/submit/', [
  sanitizeBody('first_name').escape(),    
  check('first_name').not().isEmpty().withMessage('Felaktigt förnamn!'),
  sanitizeBody('last_name').escape(),
  check('last_name').not().isEmpty().withMessage('Felaktigt efternamn!'),
  sanitizeBody('email').escape(),
  check('email').isEmail().withMessage('Felaktig e-postadress!'),
  sanitizeBody('inbjuden').escape(),
  sanitizeBody('organisation').escape(),
  sanitizeBody('diet').escape(),
  sanitizeBody('avec').escape(),
  sanitizeBody('bordssällskap').escape(),
  sanitizeBody('price').escape(),
  check('donation').isIn([0, 5, 10, 15]),
  sanitizeBody('misc').escape(),
  check('gdpr').not().isEmpty().withMessage('Godkänn dataskyddsbeskrivningen'),
  ], function(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg)
    res.status(400);
    res.render('error', { error });
  } else if (['free', 'student-tf', 'student-other', 'normal', 'supporter'].indexOf(req.body.price) < 0) {
    const error = new Error('Du har inte valt priskategori!')
    res.status(400);
    res.render('error', { error });

  } else {
    register.saveParticipant(req, res);
  }
});


/* GET the participants' list */
router.get('/list/', function(req, res, next) {
  list.getList(res);
  //res.redirect('/'); // List can be disabled due to GDPR insecurities
});


/* GET the participants' list as JSON */
router.get('/export/json/:code', function(req, res, next) {
  listExport.getList(req, res);
});

module.exports = router;
