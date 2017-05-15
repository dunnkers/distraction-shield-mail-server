var express = require('express');
var app = express();


function sendMail(from, subject, rawContent) {
  // using SendGrid's v3 Node.js Library
  // https://github.com/sendgrid/sendgrid-nodejs

  var helper = require('sendgrid').mail;
  var fromEmail = new helper.Email(from);
  var toEmail = new helper.Email('distractionshield.devteam@gmail.com');
  var content = new helper.Content('text/plain', rawContent);
  var mail = new helper.Mail(fromEmail, subject, toEmail, content);

  var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });

  sg.API(request, function (error, response) {
    if (error) {
      console.log('Error response received');
    }
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  });

};


app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res) {
  sendMail(req.query.from, req.query.subject, req.query.content);

  res.send('<p>Success!</p>');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
