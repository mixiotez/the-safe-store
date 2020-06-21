const axios = require("axios");

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
    handleGreeting(sender_psid, received_message);
  }
  else {
    try {
      switch (received_message.quick_reply.payload){
        case 'START': 
          sendStartMessage(sender_psid);
          break;
        default:
          messageUnrecognized(sender_psid);
          break;
      }
    }
    catch (err) {
      messageUnrecognized(sender_psid);
    }
  }
};

const handleGreeting = async (sender_psid, received_message) => {
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
        "Please select from the following options:",
        [
          { title: "Start Shopping 🛍️", payload: "START" },
          { title: "More Information ℹ️", payload: "MORE_INFORMATION" },
        ]
      ),
    4000
  );
};

const sendStartMessage = (sender_psid) => {
  sendQuickReplies(
    sender_psid,
    "Alright! Do you want to shop by item, price, color, or gender?",
    [
      { title: "By item", payload: "SHOP_BY_ITEM"},
      { title: "By price", payload: "SHOP_BY_PRICE"},
      { title: "By color", payload: "SHOP_BY_COLOR"},
      { title: "By gender", payload: "SHOP_BY_GENDER"}
    ]
  );
};

const messageUnrecognized = (sender_psid) => {
  sendTextMessage(sender_psid, "I'm sorry, this is not one of my commands.");
  sendQuickReplies(
    sender_psid,
    "Please select from the following options:",
    [
      { title: "Restart the experience.", payload: "START" },
      { title: "Speak to an agent", payload: "SPEAK_AGENT" },
      { title: "Continue shopping", payload: "CONTINUE" }
    ]
  );
};

const sendQuickReplies = (sender_psid, text, quickReplies) => {
  const quick_replies = quickReplies.map(({ title, payload }) => ({
    content_type: "text",
    title,
    payload,
  }));

  return callSendAPI(sender_psid, { text, quick_replies });
};

const sendTextMessage = (sender_psid, text) =>
  callSendAPI(sender_psid, { text });

// Sends response messages via the Send API
const callSendAPI = (sender_psid, response) => {
  // console.log("Sending message: " + sender_psid);
  // console.log(response);
  axios({
    method: "POST",
    url: "https://graph.facebook.com/v7.0/me/messages",
    params: { access_token: process.env.PAGE_ACCESS_TOKEN },
    data: {
      recipient: {
        id: sender_psid,
      },
      message: response,
    },
  }).catch((err) => console.log("Send API error: ", err));
};

module.exports = handleResponse;
