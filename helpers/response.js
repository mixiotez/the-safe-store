const axios = require('axios');

// handles the response
const handleResponse = async (sender_psid, received_message) => {
  handleGreeting(sender_psid, received_message);
};

const handleGreeting = async (sender_psid, received_message) => {
  // Retrieves user's first name
  const userName = await axios({
    method: 'GET',
    url: `https://graph.facebook.com/${sender_psid}`,
    params: {
      access_token: process.env.PAGE_ACCESS_TOKEN,
      fields: 'first_name',
    },
  })
    .then((user) => user.data.first_name)
    .catch((err) => console.log('Unable to fetch firstName: ', err));

  const greeting = received_message.nlp.entities.greetings[0];

  if (
    (greeting && greeting.confidence > 0.7) ||
    received_message.text === 'Start over'
  )
    return callSendAPI(sender_psid, {
      text: `Welcome to The Safe Store, ${userName}! Please tap 'Get started' to start your shopping experience.`,
    });
};

// Creates messages
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
  }).catch((err) => console.log('Send API error: ', err));
};

module.exports = handleResponse;
