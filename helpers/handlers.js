const axios = require("axios"),
  { searchItems } = require("./search.js"),
  { USER_CHOICES } = require("./user_choices");

var options = []; // Options that are filtered by the choice tree, globals

const handleGreeting = async (sender_psid) => {
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

  sendTextMessage(
    sender_psid,
    `Welcome to The Safe Store, ${userName}. We appreciate your preference!`
  );
  setTimeout(
    () =>
      sendTextMessage(
        sender_psid,
        'Feel free to type "Restart" at any time to start over your shopping experience.'
      ),
    3700
  );
  setTimeout(
    () =>
      sendQuickText(sender_psid, "Please select from the following options:", [
        { title: "Start Shopping 🛍️", payload: "START" },
        { title: "More Information ℹ️", payload: "MORE_INFORMATION" },
      ]),
    9000
  );
};

const sendStartMessage = (sender_psid) => {
  USER_CHOICES["ITEM"] = "";
  USER_CHOICES["PRICE"] = "";
  USER_CHOICES["MATERIAL"] = "";
  USER_CHOICES["METAL"] = "";

  sendQuickText(
    sender_psid,
    "Alright! Do you want to browse by category, price, or color?",
    [
      { title: "By Category", payload: "SHOP_BY_ITEM" },
      { title: "By Price", payload: "SHOP_BY_PRICE" },
      { title: "By Color", payload: "SHOP_BY_COLOR" },
    ]
  );
};

const chooseItems = (sender_psid) => {
  sendQuickText(sender_psid, "What type of jewelry are you looking for?", [
    {
      title: "Rings",
      payload: "ITEMS_RINGS",
      image_url:
        "https://static.diamondsbyme.com/lsjqb/product/6904308790-FEM2-RINGS-0.A-YG.B-DI-RND-V0.JPG",
    },
    {
      title: "Bracelets",
      payload: "ITEMS_BRACELETS",
      image_url:
        "https://images-na.ssl-images-amazon.com/images/I/612DA0LO7oL._AC_UL1500_.jpg",
    },
    {
      title: "Necklaces",
      payload: "ITEMS_NECKLACES",
      image_url:
        "https://asset.swarovski.com/images/$size_1450/t_swa103/b_rgb:fafafa,c_scale,dpr_3.0,f_auto,w_500/5518868_png/swarovski-infinity-double-heart-necklace--white--mixed-metal-finish-swarovski-5518868.png",
    },
    {
      title: "Earrings",
      payload: "ITEMS_EARRINGS",
      image_url:
        "https://images-na.ssl-images-amazon.com/images/I/71NnFhMamIL._UY395_.jpg",
    },
    {
      title: "Any",
      payload: "ITEMS_ANY",
    },
    { title: "Restart", payload: "START" },
  ]);
};

const chooseMetal = (sender_psid) => {
  sendTextMessage(sender_psid, "Cartier offers the following 4 alloys:");
  setTimeout(
    () =>
      sendTextMessage(
        sender_psid,
        "Yellow gold: pure gold mixed with metals such as copper and zinc."
      ),
    4400
  );
  setTimeout(
    () =>
      sendTextMessage(
        sender_psid,
        "White gold: gold mixed with at least one white metal, usually nickel, silver, or palladium."
      ),
    9400
  );
  setTimeout(
    () =>
      sendTextMessage(
        sender_psid,
        "Pink/Rose gold: pure gold mixed with copper and silver."
      ),
    14000
  );
  setTimeout(
    () => sendTextMessage(sender_psid, "Platinum: 95-98% platinum mixture."),
    16000
  );
  setTimeout(
    () =>
      sendQuickText(sender_psid, "What metal do you fancy most?", [
        {
          title: "Yellow Gold",
          payload: "METAL_YELLOW_GOLD",
          image_url: "https://www.colorcombos.com/images/colors/FFD80A.png",
        },
        {
          title: "White Gold",
          payload: "METAL_WHITE_GOLD",
          image_url:
            "https://cdn.shopify.com/s/files/1/0405/8713/products/white_gold_a4_8252ef35-4176-4965-8d83-9aa0b72f0bc6_2048x.jpg?v=1406364517",
        },
        {
          title: "Pink/Rose Gold",
          payload: "METAL_PINK_GOLD",
          image_url: "https://www.colorhexa.com/e6c2b4.png",
        },
        {
          title: "Platinum",
          payload: "METAL_PLATINUM",
          image_url:
            "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-platinum-solid-color-background.jpg",
        },
        {
          title: "Any",
          payload: "METAL_ANY",
        },
        { title: "Restart", payload: "START" },
      ]),
    18000
  );
};

const choosePrice = (sender_psid) => {
  sendQuickText(sender_psid, "What is your price range?", [
    { title: "< $2500", payload: "PRICE_LESS_2500" },
    { title: "Up to $10K", payload: "PRICE_2500_10K" },
    { title: "Up to $25K", payload: "PRICE_10K_25K" },
    { title: "> $25K", payload: "PRICE_25K_MORE" },
    { title: "Restart", payload: "START" },
  ]);
};

const chooseMaterials = (sender_psid) => {
  sendQuickText(sender_psid, "Which materials are you seeking?", [
    {
      title: "Diamond",
      payload: "MATERIAL_DIAMOND",
      image_url:
        "https://images-na.ssl-images-amazon.com/images/I/615HMgt2EoL._UL1500_.jpg",
    },
    {
      title: "Onyx",
      payload: "MATERIAL_ONYX",
      image_url:
        "https://thewifechoice.com/wp-content/uploads/2019/12/Black-Onyx-Meaning-stone.jpg",
    },
    {
      title: "Emerald",
      payload: "MATERIAL_EMERALD",
      image_url:
        "https://www.gemsociety.org/wp-content/uploads/2013/09/51561341_1_x.jpg",
    },
    {
      title: "Other",
      payload: "MATERIAL_OTHER",
      image_url: "https://financesonline.com/uploads/2014/05/gem.png",
    },
    { title: "Any", payload: "MATERIAL_ANY" },
    { title: "Restart", payload: "START" },
  ]);
};

const messageUnrecognized = (sender_psid) => {
  sendQuickText(
    sender_psid,
    `Sorry, I didn't get that. Please select one of the following options:`,
    [
      { title: "Restart", payload: "START" },
      { title: "Continue Shopping", payload: "CONTINUE" },
    ]
  );
};

const iterateChoices = (sender_psid) => {
  const elements = options.splice(0, 10).map(({ title, price, image }) => ({
    title,
    subtitle: `$${price} USD`,
    image_url: `https://www.cartier.com${image}`,
    buttons: [postbackButton("Bring me this one!", "LIKE_THIS")],
  }));

  sendQuickMediaMessage(sender_psid, elements);

  let quickReplies = [{ title: "Start Over", payload: "START" }];

  if (elements.length === 10 && options.length)
    quickReplies.unshift({
      title: "Show me more options",
      payload: "SHOW_ANOTHER",
    });

  sendQuickText(
    sender_psid,
    "Please scroll through the options above, or select an option from the menu below",
    quickReplies
  );
};

const showAnother = (sender_psid) => {
  iterateChoices(sender_psid);
};

const likeThisOne = (sender_psid) => {
  sendQuickText(
    sender_psid,
    "Thanks for using the Safe Store. Our representative will bring the selected product to you momentarily!",
    [{ title: "Browse again!", payload: "START" }]
  );
};

const displayChoices = async (sender_psid) => {
  let payloadToText = {
    MATERIAL_DIAMOND: "diamond",
    MATERIAL_ONYX: "onyx",
    MATERIAL_EMERALD: "emerald",
    MATERIAL_OTHER: "OTHER",
    MATERIAL_ANY: "",
    PRICE_LESS_2500: "2500",
    PRICE_2500_10K: "10000",
    PRICE_10K_25K: "25000",
    PRICE_25K_MORE: "370000",
    METAL_YELLOW_GOLD: "yellow gold",
    METAL_WHITE_GOLD: "white gold",
    METAL_PINK_GOLD: "pink gold",
    METAL_PLATINUM: "platinum",
    METAL_ANY: "",
    ITEMS_RINGS: "rings",
    ITEMS_BRACELETS: "bracelets",
    ITEMS_EARRINGS: "earrings",
    ITEMS_NECKLACES: "necklaces",
    ITEMS_ANY: "",
  };

  options = searchItems(
    payloadToText[USER_CHOICES["ITEM"]],
    payloadToText[USER_CHOICES["PRICE"]],
    payloadToText[USER_CHOICES["METAL"]],
    payloadToText[USER_CHOICES["MATERIAL"]]
  );

  if (options.length) iterateChoices(sender_psid);
  else
    sendQuickText(
      sender_psid,
      "I'm afraid an item doesn't exist with these characteristics. Would you like to search again?",
      [{ title: "Search Again", payload: "START" }]
    );
};

const moreInfo = (sender_psid) => {
  sendTextMessage(
    sender_psid,
    "I am a chatbot that serve as a sales representative."
  );
  setTimeout(
    () =>
      sendTextMessage(
        sender_psid,
        "You only need to scan a QR code (or directly message me), login to Facebook's Messenger, and answer a set of questions related to which product you're looking for."
      ),
    3200
  );
  setTimeout(
    () =>
      sendTextMessage(
        sender_psid,
        "Once you answer the questions, you'll receive all the items that match your query, and you can choose which one you want."
      ),
    10000
  );
  setTimeout(
    () =>
      sendQuickText(
        sender_psid,
        "Please notice that we're using Cartier's online catalog as an example",
        [{ title: "Start Shopping", payload: "START" }]
      ),
    15500
  );
};

/**
 * Chooses which branch function to call next.
 *
 * @param {String} category What category to choose from next.
 */
const chooser = (category, sender_psid) => {
  switch (category) {
    case "ITEM":
      chooseItems(sender_psid);
      break;
    case "PRICE":
      choosePrice(sender_psid);
      break;
    case "MATERIAL":
      chooseMaterials(sender_psid);
      break;
    case "METAL":
      chooseMetal(sender_psid);
      break;
    case "FINISHED":
      displayChoices(sender_psid);
      break;
    default:
      messageUnrecognized(sender_psid);
      break;
  }
};

// ------------------------ Generic functions --------------------- //

const sendQuickText = (sender_psid, text, quickReplies) => {
  const quick_replies = quickReplies.map(
    ({ title, payload, image_url = "" }) => ({
      content_type: "text",
      title,
      payload,
      image_url,
    })
  );

  return messageSendAPI(sender_psid, { text, quick_replies });
};

const postbackButton = (title, payload) => {
  return {
    type: "postback",
    title,
    payload,
  };
};

const sendQuickMediaMessage = (sender_psid, elements) => {
  const attachment = {
    type: "template",
    payload: {
      template_type: "generic",
      image_aspect_ratio: "square",
      elements,
    },
  };

  callSenderActionAPI(sender_psid, "typing_off");

  return messageSendAPI(sender_psid, { attachment });
};

const sendTextMessage = (sender_psid, text) =>
  messageSendAPI(sender_psid, { text });

// Sends response messages via the Send API
const messageSendAPI = (sender_psid, response) => {
  callSenderActionAPI(sender_psid, "typing_on");

  setTimeout(
    () =>
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
      }).catch((err) => console.log("Send API error: ", err)),
    response.text ? (response.text.split(" ").length / 2.75) * 1000 : 0
  );
};

// Sends a "sender action"
const callSenderActionAPI = (sender_psid, action) => {
  axios({
    method: "POST",
    url: "https://graph.facebook.com/v7.0/me/messages",
    params: { access_token: process.env.PAGE_ACCESS_TOKEN },
    data: {
      recipient: {
        id: sender_psid,
      },
      sender_action: action,
    },
  }).catch((err) => console.log("Sender action API error: ", err));
};

module.exports = {
  handleGreeting,
  sendStartMessage,
  messageUnrecognized,
  chooser,
  moreInfo,
  iterateChoices,
  likeThisOne,
  showAnother,
  callSenderActionAPI,
};
