exports.confirmationMessage = function(req) {
  return {
    from: 'TF144 <arsfest@teknolog.fi>',
    to: req.body.email,
    subject: 'Bekräftelse',
    text: 'Hej,\n\nDin anmälan till Teknologföreningens årsfest har mottagits.\n\nSumma: ' + req.body.sum + '\nReferensnummer: ' + req.body.reference + '\nKonto: FI13 1309 3000 0570 75\nBIC-kod: NDEAFIHH\nMottagare: Teknologföreningen\nBetalningstid: 14 dagar från mottagande av detta meddelande.\n\nI fall du har frågor kan du kontakta oss genom att svara på detta meddelande.\n\nVälkommen med på festen!',
  };
};

exports.infoMessage = function(req) {
  return {
    from: 'TF144 <arsfest@teknolog.fi>',
    to: 'oleg.stikhin@aalto.fi',
    subject: 'Ny anmälning',
    text: JSON.stringify(req.body),
  };
};
