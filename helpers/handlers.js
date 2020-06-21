const axios = require("axios");

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
      { title: "By item", payload: "SHOP_BY_ITEM" },
      { title: "By price", payload: "SHOP_BY_PRICE" },
      { title: "By color", payload: "SHOP_BY_COLOR" },
      { title: "By gender", payload: "SHOP_BY_GENDER" },
      { title: "Restart", payload: "START" }
    ]
  );
};

const chooseItems = (sender_psid) => {
  sendQuickReplies(
    sender_psid,
    "No problem! What are you looking to buy?",
    [
      { title: "Rings", payload: "RINGS" },
      { title: "Bracelets", payload: "ITEMS_BRACELETS" },
      { title: "Necklaces", payload: "ITEMS_NECKLACES" },
      { title: "Earrings", payload: "ITEMS_EARRINGS" },
      { title: "Restart", payload: "START" }
    ]
  )
};

const chooseMetal = (sender_psid) => {
  sendQuickReplies(
    sender_psid,
    `Good choice!
Cartier sells primarily 4 alloys:

- Yellow gold: Yellow gold is made of pure gold mixed with alloy metals such as copper and zinc
- White gold: White gold is an alloy of gold and at least one white metal (usually nickel, silver, or palladium)
- Pink gold: Also know as rose gold, pink gold is made of pure gold mixed with copper and silver alloys
- Platinum: 95-98% Platinum

What metal do you fancy most?`,
    [
      { title: "Yellow gold", payload: "METAL_YELLOW_GOLD" },
      { title: "White gold", payload: "METAL_WHITE_GOLD" },
      { title: "Pink gold", payload: "METAL_PINK_GOLD" },
      { title: "Platinum", payload: "METAL_PLATINUM" },
      { title: "Restart", payload: "START" }
    ]
  )
};

const chooseGender = (sender_psid) => {
  sendQuickReplies(
    sender_psid,
    "What style are you buying?",
    [
      { title: "For women", payload: "GENDER_WOMEN" },
      { title: "For men", payload: "GENDER_MEN" },
      { title: "Gender-neutral", payload: "GENDER_NEUTRAL" },
      { title: "Restart", payload: "START" }
    ]
  )
};

const chooseBudget = (sender_psid) => {
  sendQuickReplies(
    sender_psid,
    "Sounds good, how much are you willing to spend?",
    [
      { title: "<$2500", payload: "PRICE_LESS_1000" },
      { title: "$2500-$10K", payload: "PRICE_2500_10K" },
      { title: "$10K-$25K", payload: "PRICE_10K_25K" },
      { title: ">$25K", payload: "PRICE_25K_MORE"},
      { title: "Restart", payload: "START" }
    ]
  )
};

const chooseMaterials = (sender_psid) => {
  sendQuickReplies(
    sender_psid,
    "Awesome, how about materials?",
    [
      { title: "Diamonds", payload: "MATERIAL_DIAMONDS" },
      { title: "Onyx", payload: "MATERIAL_ONYX" },
      { title: "Emerald", payload: "MATERIAL_EMERALD" },
      { title: "Other", payload: "MATERIAL_OTHER" },
      { title: "Restart", payload: "START" }
    ]
  )
};

const messageUnrecognized = (sender_psid) => {
  sendTextMessage(sender_psid, "I'm sorry, this is not one of my commands.");
  sendQuickReplies(
    sender_psid,
    "Please select from the following options:",
    [
      { title: "Restart", payload: "START" },
      { title: "Speak to an agent", payload: "SPEAK_AGENT" },
      { title: "Continue shopping", payload: "CONTINUE" }
    ]
  );
};
  

// Generic functions
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

module.exports = { handleGreeting, sendStartMessage, messageUnrecognized, chooseBudget, chooseMaterials, chooseGender, chooseItems, chooseMetal }