const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/webhook', (req, res) => {
  const body = req.body;

  if (body.object !== 'page') return res.sendStatus(404);

  // Iterates over each entry - there may be multiple if batched
  body.entry.forEach((entry) => {
    // Gets the message
    const webhook_event = entry.messaging[0];
    console.log(webhook_event);

    const sender_psid = webhook_event.sender.id;

    if (webhook_event.message) {
      handleMessage(sender_psid, webhook_event.message);
    }
  });

  res.status(200).send('EVENT_RECEIVED');
});

router.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (!mode || !token) return res.sendStatus(400);

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    // Responds with the challenge token from the request
    console.log('WEBHOOK_VERIFIED');
    res.status(200).send(challenge);
  } else res.sendStatus(403);
});

// Handles messages events
const handleMessage = (sender_psid, received_message) => {
  let response;

  // Check if the message contains text
  if (received_message.text) {
    response = {
      text: `You sent the message: "${received_message.text}"!`,
    };
  }

  // Sends the response message
  callSendAPI(sender_psid, response);
};

// Sends response messages via the Send API
const callSendAPI = (sender_psid, response) => {
  axios({
    method: 'POST',
    url: 'https://graph.facebook.com/v7.0/me/messages',
    params: { access_token: process.env.PAGE_ACCESS_TOKEN },
    data: {
      recipient: {
        id: sender_psid,
      },
      message: response,
    },
  }).catch((err) => console.log('error: ', err));
};

module.exports = router;
