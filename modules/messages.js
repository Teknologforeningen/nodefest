exports.confirmationMessage = function(req) {
  
  if (req.body.reserve_list) {
    var text = 'Hej,\n\nDu har placerats på reservlistan till Teknologföreningens årsfest. Vi kontaktar dig separat ifall det uppstår lediga platser till festen.\n\nI fall du har frågor kan du kontakta oss genom att svara på detta meddelande.\n\nMed vänliga hälsningar,\nÅrsfestmarskalkerna Emmi och Rickard\narsfest@tf.fi';
  } else {
    var text = 'Hej,\n\nDin anmälan till Teknologföreningens årsfest har mottagits.\n\nSumma: ' + req.body.sum + '\nReferensnummer: ' + req.body.reference + '\nKonto: FI13 1309 3000 0570 75\nBIC-kod: NDEAFIHH\nMottagare: Teknologföreningen\nBetalningstid: 14 dagar från mottagande av detta meddelande.\n\nI fall du har frågor kan du kontakta oss genom att svara på detta meddelande.\n\nVälkommen med på festen!\n\nMed vänliga hälsningar,\nÅrsfestmarskalkerna Emmi och Rickard\narsfest@tf.fi';
  }
  
  return {
    from: 'TF148 <arsfest@tf.fi>',
    to: req.body.email,
    subject: 'Bekräftelse',
    text: text,
  };
};

exports.infoMessage = function(req) {
  return {
    from: 'TF148 <arsfest@tf.fi>',
    to: 'tobias.jern@aalto.fi',
    subject: 'Ny anmälning',
    text: JSON.stringify(req.body),
  };
};
