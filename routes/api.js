const express = require("express");
const router = express.Router();
const { handleResponse, handlePostback } = require("../helpers/response");
const { callSenderActionAPI } = require("../helpers/handlers.js");

router.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object !== "page") return res.sendStatus(404);

  // Iterates over each entry - there may be multiple if batched
  body.entry.forEach((entry) => {
    const webhook_event = entry.messaging[0];
    const sender_psid = webhook_event.sender.id;

    callSenderActionAPI(sender_psid, "mark_seen");

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

module.exports = router;
