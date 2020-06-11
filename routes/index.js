var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.get('/privacy', (req, res) => {
  res.render('privacyPolicy', { title: 'Privacy Policy'});
});

module.exports = router;