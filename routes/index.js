var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'The Safe Store' });
});

router.get('/privacy', (req, res) => {
  res.render('privacyPolicy', { title: 'The Safe Store - Privacy Policy' });
});

module.exports = router;
