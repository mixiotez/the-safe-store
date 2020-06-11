var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/webhook', (req, res) => {
  const body = req.body;

  if (body.object !== 'page') 
    return res.sendStatus(404);

  // Iterates over each entry - there may be multiple if batched
  body.entry.forEach(function(entry) {

    // Gets the message
    const webhook_event = entry.messaging[0];
    console.log(webhook_event);
  });

  res.status(200).send('EVENT_RECEIVED');
});

router.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
    
  if (!mode || !token)
    return res.sendStatus(400);
  
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    
    // Responds with the challenge token from the request
    console.log('WEBHOOK_VERIFIED');
    res.status(200).send(challenge);
  
  } 
  else res.sendStatus(403);
});

module.exports = router;
