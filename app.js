var port = process.env.PORT || 3000;
var getChannel = process.env.SLACK_CHANNEL;

app.use(bodyParser.json());

function sendNotif(msg, name, author, project) {
     slack.send({
          text: 'Nouveauté:',
          channel: getChannel,
          username: name,
          attachments: [{"pretext": "", "text": "" + msg + "", "color":"#01B0F0", "fields": [{"title": "Fait par:", "value": "" + author + "", "short": "true"}, {"title": "Projet:", "value": "" + project + "", "short": "true"}]}],
          icon_url: 'http://img15.hostingpics.net/pics/834337TechnicalSupport64.png'
     });
}

function isCorect(messageToSend){
  if(messageToSend.indexOf('merge') > -1 || messageToSend.indexOf('git.') > -1 || messageToSend.indexOf('pom.xml') > -1 || messageToSend.indexOf('.yml') > -1 || messageToSend.indexOf('!hide') > -1){
  return false;
  }
  return true;
}

app.post('/gateway', function(req, res) {

  var msg;
  var author;
  var project;


    switch (req.body.object_kind) {
      case 'push':

        project = req.body.repository.name;
        req.body.commits.forEach(function(item) {
            author = item.author.name,
            msg = item.message
          })

        break;
      default:
        break;
    }

    if(isCorect(msg)){
      sendNotif(msg, 'UHBot', author, project);
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
