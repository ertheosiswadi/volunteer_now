const admin = require('firebase-admin');
var db = require('./firestore_init');
const v_ref = db.collection('volunteers');
const acc_ref = db.collection('accounts');
const o_ref = db.collection('organizations');
const e_ref = db.collection('events');
var ectrl = require('./e_controller');

module.exports = {
	set_basic_details: async (req, res) => {
		var name = req.body.name;
		var email = req.body.email;
		var uid = req.body.uid;
		await set_basic_details(req).then(() => {
			res.send('basic details of ' + uid + ' updated');
		})
		.catch((error) => {
			res.status(500).send('failed to update org\'s basic details');
		});
	},
	add_event: async (req, res) => {
		await ectrl.add_event(req).then(() => {
			res.send('event added to organization');
		})
		.catch((error) => {
			res.status(500).send('failed to add event');
		});
	}
}

async function set_basic_details(req)
{
	var name = req.body.name;
	var email = req.body.email;
	var uid = req.body.uid; 

	await o_ref.doc(uid).update({
		name: name,
		email: email
	})
	.then(() => {
		console.log("basic details successfully updated");
	})
	.catch((error) => {
		console.error("Error updating org's basic details: ", error);
	});
}