var express = require('express');
var bodyParser = require('body-parser');
var Slack = require('node-slack');

var slack = new Slack(process.env.SLACK_HOOK_URL,'');

var app = express();
var port = process.env.PORT || 3000;
var getChannel = process.env.SLACK_CHANNEL;

app.use(bodyParser.json());

function sendNotif(msg, name) {
     slack.send({
          text: msg,
          channel: getChannel,
          username: name,
          icon_url: 'http://www.brandsoftheworld.com/sites/default/files/styles/logo-thumbnail/public/022014/untitled-1_206.png'
     });
}

function isCorect(messageToSend){
  if(messageToSend.indexOf('merge') > -1 || messageToSend.indexOf('git.') > -1){
  return false;
  }
  return true;
}

app.post('/gateway', function(req, res) {

  var msg;
  var author;


    switch (req.body.object_kind) {
      case 'push':
        req.body.commits.forEach(function(item) {
            author = item.author.name,
            msg = item.message
          })

        break;
      default:
        break;
    }

    if(isCorect(msg)){
      sendNotif(msg + ' par' + author,'ModBot [' +author+']');
    }
        res.sendStatus(200);

});

app.get('/', function (req, res) {
   res.status(200).send('GitLab to Slack !')
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(400).send('Error: ' + err.message);
});

app.listen(port, function () {
    console.log('Demarrage de gitlab2slack sur le port : ' + port);
});
