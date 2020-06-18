const axios = require('axios');

// Handles the entire response
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

  const greeting = received_message.nlp.entities.greetings
    ? received_message.nlp.entities.greetings[0]
    : '';

  if (
    (greeting && greeting.confidence > 0.7) ||
    received_message.text === 'Restart'
  ) {
    sendTextMessage(
      sender_psid,
      `Welcome to The Safe Store, ${userName}. We appreciate your preference!`
    );
    setTimeout(
      () =>
        sendTextMessage(
          sender_psid,
          'Feel free to type "Restart" at any time to restart your shopping experience.'
        ),
      2000
    );
    setTimeout(
      () =>
        sendQuickReplies(
          sender_psid,
          'Please select from the following options:',
          [
            { title: 'Start Shopping 🛍️', payload: 'START' },
            { title: 'More Information ℹ️', payload: 'MORE_INFORMATION' },
          ]
        ),
      4000
    );
  }
};

const sendQuickReplies = (sender_psid, text, quickReplies) => {
  const quick_replies = quickReplies.map(({ title, payload }) => ({
    content_type: 'text',
    title,
    payload,
  }));

  return callSendAPI(sender_psid, { text, quick_replies });
};

const sendTextMessage = (sender_psid, text) =>
  callSendAPI(sender_psid, { text });

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
