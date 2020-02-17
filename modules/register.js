var nodemailer = require('nodemailer');
var refnum = require('fin-id').refnum;
var messages = require('./messages');
var dbModules = require('./db');

exports.sanitizeForm = function(req, res) {
  req.sanitizeBody('first_name').escape();
  req.checkBody('first_name', 'Felaktigt förnamn!').notEmpty();
  req.sanitizeBody('last_name').escape();
  req.checkBody('last_name', 'Felaktigt efternamn!').notEmpty();
  req.sanitizeBody('email').escape();
  req.checkBody('email', 'Felaktig e-postadress!').isEmail();
  req.sanitizeBody('inbjuden').escape();
  req.sanitizeBody('organisation').escape();
  req.sanitizeBody('diet').escape();
  req.sanitizeBody('avec').escape();
  req.sanitizeBody('price').escape();
  req.sanitizeBody('misc').escape();
  req.checkBody('gdpr', 'Godkänn dataskyddsbeskrivningen').notEmpty();

  if (req.validationErrors()) {
    var err = new Error(req.validationErrors()[0].msg);
    res.status(400);
    res.render('error', { error: err });
  } else if (['free', 'student-tf', 'student-other', 'normal', 'supporter'].indexOf(req.body.price) < 0) {
    var err = new Error("Du har inte valt priskategori!");
    res.status(400);
    res.render('error', { error: err });
  } else return true;
};

function checkboxInsert(req) {
  if (req.body.solenn_akt !== "1") req.body.solenn_akt = "0";
  if (req.body.greeting !== "1") req.body.greeting = "0";
  if (req.body.alcoholfree !== "1") req.body.alcoholfree = "0";
  if (req.body.sillis !== "1") req.body.sillis = "0";
}

function countSum(req) {
  req.body.sum = 0;
  if (req.body.price === "student-tf") req.body.sum += 75;
  if (req.body.price === "student-other") req.body.sum += 80;
  if (req.body.price === "normal") req.body.sum += 90;
  if (req.body.price === "supporter") req.body.sum += 150;
  if (req.body.sillis === "1") req.body.sum += 10;
  if (req.body.donation === "5") req.body.sum += 5;
  if (req.body.donation === "10") req.body.sum += 10;
  if (req.body.donation === "15") req.body.sum += 15;
}

function countReferenceNumber(req, count) {
  req.body.reference = refnum.create(147000 + +count);
}

exports.saveParticipant = function(req, res) {
  checkboxInsert(req);
  countSum(req);

  //var transporter = nodemailer.createTransport('smtp://smtp.ayy.fi');
  var transporter = nodemailer.createTransport('smtp://localhost');


  participants_query = dbModules.queryDatabase("SELECT first_name, last_name FROM participants WHERE cancelled='false' AND timestamp>'2019-02-01 12:00:00' ORDER BY id;")
  .then(function (participants_data) {
    req.body.reserve_list = participants_data.length>=234;
    //req.body.reserve_list = participants_data.length>=218;
    //req.body.reserve_list = false;
    dbModules.queryDatabase("SELECT COUNT(id) FROM Participants;")
      .then(function(data) {
        countReferenceNumber(req, data[0].count);
        dbModules.queryDatabase("INSERT INTO Participants(first_name, last_name, inbjuden, organisation, greeting, email, diet, alcoholfree, sillis, solenn_akt, avec, misc, reference, sum, category, reserve_list) VALUES (${first_name}, ${last_name}, ${inbjuden}, ${organisation}, ${greeting}, ${email}, ${diet}, ${alcoholfree}, ${sillis}, ${solenn_akt}, ${avec}, ${misc}, ${reference}, ${sum}, ${price}, ${reserve_list})", req.body)
        .then(function() {
          transporter.sendMail(messages.confirmationMessage(req), function(error, info) {
            if (error) {
              console.log("Email " + error);
              //res.send(error);
              return;
            } 
          });

          transporter.sendMail(messages.infoMessage(req), function(error, info) {
            if (error) {
              console.log("Email " + error);
              //res.send(error);
              return;
            }
          });

          res.render('submit', { title: 'Bekräftelse' });
        })
        .catch(function(error) {
          console.log("Database error: " + error);
          var err = new Error(error);
          res.status(500);
          res.render('error', { error: err });
        });
      })
      .catch(function(error) {
        console.log("Database error: " + error);
        var err = new Error(error);
        res.status(500);
        res.render('error', { error: err });
      });
  })
  .catch(function(error) {
    console.log("Database error: " + error);
    var err = new Error(error);
    res.status(500);
    res.render('error', { error: err });
  });



};
