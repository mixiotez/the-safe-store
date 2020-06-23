const handlers = require("./handlers.js");
const { nextChoice, addChoice } = require("./user_choices.js");
const { chooser } = require("./handlers.js");

const handleResponse = async (sender_psid, received_message) => {
  const greeting = received_message.nlp.entities.greetings
    ? received_message.nlp.entities.greetings[0]
    : "";

  if (
    (greeting && greeting.confidence > 0.7) ||
    received_message.text === "Restart"
  )
    return handlers.handleGreeting(sender_psid);

  try {
    switch (received_message.quick_reply.payload) {
      case "GET_STARTED":
        handlers.handleGreeting(sender_psid);
        break;
      case "START":
        handlers.sendStartMessage(sender_psid);
        break;
      case "CONTINUE":
        chooser(nextChoice(), sender_psid);
        break;
      case "MORE_INFORMATION":
        handlers.moreInfo(sender_psid);
        break;
      case "SHOP_BY_ITEM":
        chooser("ITEM", sender_psid);
        break;
      case "SHOP_BY_PRICE":
        chooser("PRICE", sender_psid);
        break;
      case "SHOP_BY_COLOR":
        chooser("METAL", sender_psid);
        break;
      case "ITEMS_RINGS":
      case "ITEMS_BRACELETS":
      case "ITEMS_NECKLACES":
      case "ITEMS_EARRINGS":
      case "ITEMS_ANY":
        addChoice("ITEM", received_message.quick_reply.payload);
        chooser(nextChoice(), sender_psid); // Gets a string value for a category to chose from next, and sends it to chooser function.
        break;
      case "MATERIAL_DIAMOND":
      case "MATERIAL_ONYX":
      case "MATERIAL_EMERALD":
      case "MATERIAL_OTHER":
      case "MATERIAL_ANY":
        addChoice("MATERIAL", received_message.quick_reply.payload);
        chooser(nextChoice(), sender_psid); // Gets a string value for a category to chose from next, and sends it to chooser function.
        break;
      case "PRICE_LESS_2500":
      case "PRICE_2500_10K":
      case "PRICE_10K_25K":
      case "PRICE_25K_MORE":
        addChoice("PRICE", received_message.quick_reply.payload);
        chooser(nextChoice(), sender_psid); // Gets a string value for a category to chose from next, and sends it to chooser function.
        break;
      case "METAL_YELLOW_GOLD":
      case "METAL_WHITE_GOLD":
      case "METAL_PINK_GOLD":
      case "METAL_PLATINUM":
      case "METAL_ANY":
        addChoice("METAL", received_message.quick_reply.payload);
        chooser(nextChoice(), sender_psid); // Gets a string value for a category to chose from next, and sends it to chooser function.
        break;
      case "SHOW_ANOTHER":
        handlers.showAnother(sender_psid);
        break;
      case "LIKE_THIS":
        handlers.likeThisOne(sender_psid);
        break;
      default:
        handlers.messageUnrecognized(sender_psid);
        break;
    }
  } catch (err) {
    console.log(err);
    handlers.messageUnrecognized(sender_psid);
  }
};

const handlePostback = (sender_psid, postback) => {
  if (postback.payload)
    switch (postback.payload) {
      case "GET_STARTED":
        handlers.handleGreeting(sender_psid);
        break;
      case "SHOW_ANOTHER":
        handlers.showAnother(sender_psid);
        break;
      case "LIKE_THIS":
        handlers.likeThisOne(sender_psid);
        break;
      case "MORE_INFORMATION":
        handlers.moreInfo(sender_psid);
        break;
      case "START":
        handlers.sendStartMessage(sender_psid);
        break;
      default:
        handlers.messageUnrecognized(sender_psid);
        break;
    }
};

module.exports = { handleResponse, handlePostback };
