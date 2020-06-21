const axios = require('axios'),
      handlers = require("./handlers.js");

// Handles the entire response
const handleResponse = async (sender_psid, received_message) => {
  console.log(received_message);
  // Retrieves user's first name
  const userName = await axios({
    method: "GET",
    url: `https://graph.facebook.com/${sender_psid}`,
    params: {
      access_token: process.env.PAGE_ACCESS_TOKEN,
      fields: "first_name",
    },
  })
    .then((user) => user.data.first_name)
    .catch((err) => console.log("Unable to fetch firstName: ", err));

  const greeting = received_message.nlp.traits.greetings
    ? received_message.nlp.traits.greetings[0]
    : "";

  if ((greeting && greeting.confidence > 0.7) || received_message.text === "Restart") {
    handlers.handleGreeting(sender_psid, received_message);
  }
  else {
    try {
      switch (received_message.quick_reply.payload){
        case 'START': 
          handlers.sendStartMessage(sender_psid);
          break;
        default:
          handlers.messageUnrecognized(sender_psid);
          break;
      }
    }
    catch (err) {
      handlers.messageUnrecognized(sender_psid);
    }
  }
};

module.exports = handleResponse;
