const express = require('express');
var vctrl = require('./v_controller');

var router = express.Router();

router.route('/').get(vctrl.sayHello);
router.route('/add_account/:username/:password/:type').get(vctrl.add_account);
router.route('/volunteer/set_basic_details').post(vctrl.set_basic_details);
router.route('/volunteer/get_uid/:username').get(vctrl.get_uid);

module.exports = router;