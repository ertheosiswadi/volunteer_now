const express = require('express');
var gctrl = require('./g_controller');
var vctrl = require('./v_controller');
var octrl = require('./o_controller');
var ectrl = require('./e_controller');

var router = express.Router();

router.route('/').get(vctrl.sayHello);
router.route('/add_account/:username/:password/:type').get(gctrl.add_account);
router.route('/volunteer/set_basic_details').post(vctrl.set_basic_details);
router.route('/volunteer/get_uid/:username').get(vctrl.get_uid);
router.route('/volunteer/get_profile_summary/:uid').get(vctrl.get_profile_summary);
router.route('/volunteer/set_rating').post(vctrl.set_rating);
router.route('/volunteer/get_rating/:uid').get(vctrl.get_rating);
router.route('/volunteer/add_friend').post(vctrl.add_friend);
router.route('/volunteer/add_favourite').post(vctrl.add_favourite);

router.route('/org/set_basic_details').post(octrl.set_basic_details);
router.route('/org/add_event').post(octrl.add_event);

module.exports = router;