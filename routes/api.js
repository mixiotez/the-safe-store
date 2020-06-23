const express = require("express");
const axios = require("axios");
const router = express.Router();
const { handleResponse, handlePostback } = require("../helpers/response");
const handlers = require("../helpers/handlers");
const { default: Axios } = require("axios");

router.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object !== "page") return res.sendStatus(404);

  // Iterates over each entry - there may be multiple if batched
  body.entry.forEach((entry) => {
    const webhook_event = entry.messaging[0];
    const sender_psid = webhook_event.sender.id;

    if (webhook_event.message) {
      handleResponse(sender_psid, webhook_event.message);
    } else if (webhook_event.postback) {
      handlePostback(sender_psid, webhook_event.postback);
    }
  });

  res.status(200).send("EVENT_RECEIVED");
});

router.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (!mode || !token) return res.sendStatus(400);

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else res.sendStatus(403);
});

router.get("/profile", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];

  if (!mode || !token) return res.sendStatus(400);

  if ((mode == "profile" || mode == "all") && token === VERIFY_TOKEN) {
    setUpGetStartedButton();
    setUpPersistentMenu();
  } else res.sendStatus(403);
});

const setUpGetStartedButton = () => {
  axios({
    method: "post",
    url:
      "https://graph.facebook.com/v7.0/me/messenger_profile?access_token=" +
      process.env.PAGE_ACCESS_TOKEN,
    data: {
      get_started: {
        payload: "GET_STARTED",
      },
    },
  })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

const setUpPersistentMenu = () => {
  axios({
    method: "post",
    url:
      "https://graph.facebook.com/v7.0/me/messenger_profile?access_token=" +
      process.env.PAGE_ACCESS_TOKEN,
    data: {
      persistent_menu: [
        {
          locale: "default",
          composer_input_disabled: false,
          call_to_actions: [
            {
              type: "postback",
              title: "Talk to an agent",
              payload: "SPEAK_AGENT",
            },
            {
              type: "postback",
              title: "Restart",
              payload: "START",
            },
            {
              type: "postback",
              title: "More information ℹ️",
              payload: "MORE_INFORMATION",
            },
          ],
        },
      ],
    },
  })
    .then((res) => console.log(res))
    .catch((error) => console.log(error));
};

module.exports = router;
