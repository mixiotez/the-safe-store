const axios = require('axios'),
      handlers = require("./handlers.js"),
      { nextChoice, addChoice } = require('./user_choices.js');
const { chooser } = require('./handlers.js');

// Handles the entire response
const handleResponse = async (sender_psid, received_message) => {
  console.log(received_message);

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
        case 'SHOP_BY_ITEM':
          chooser('ITEM', sender_psid);
          break;
        case 'SHOP_BY_GENDER':
          chooser('GENDER', sender_psid);
          break;
        case 'SHOP_BY_PRICE':
          chooser('PRICE', sender_psid);
          break;
        case 'SHOP_BY_COLOR':
          chooser('METAL', sender_psid);
          break;
        case 'ITEMS_RINGS':
        case 'ITEMS_BRACELETS':
        case 'ITEMS_NECKLACES':
        case 'ITEMS_EARRINGS':
          addChoice('ITEM', received_message.quick_reply.payload);
          chooser(nextChoice(), sender_psid); // Gets a string value for a category to chose from next, and sends it to chooser function.
          break;
        case 'GENDER_MEN':
        case 'GENDER_WOMEN':
        case 'GENDER_NEUTRAL':
          addChoice('GENDER', received_message.quick_reply.payload);
          chooser(nextChoice(), sender_psid); // Gets a string value for a category to chose from next, and sends it to chooser function.
          break;
        case 'MATERIAL_DIAMOND':
        case 'MATERIAL_ONYX':
        case 'MATERIAL_EMERALD':
        case 'MATERIAL_OTHER':
          addChoice('MATERIAL', received_message.quick_reply.payload);
          chooser(nextChoice(), sender_psid); // Gets a string value for a category to chose from next, and sends it to chooser function.
          break;
        case 'PRICE_LESS_2500':
        case 'PRICE_2500_10K':
        case 'PRICE_10K_25K':
        case 'PRICE_25K_MORE':
          addChoice('PRICE', received_message.quick_reply.payload);
          chooser(nextChoice(), sender_psid); // Gets a string value for a category to chose from next, and sends it to chooser function.
          break;
        case 'METAL_YELLOW_GOLD':
        case 'METAL_WHITE_GOLD':
        case 'METAL_PINK_GOLD':
        case 'METAL_PLATINUM':
          addChoice('METAL', received_message.quick_reply.payload);
          chooser(nextChoice(), sender_psid); // Gets a string value for a category to chose from next, and sends it to chooser function.
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
