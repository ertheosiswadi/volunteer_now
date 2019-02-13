const admin = require('firebase-admin');
var db = require('./firestore_init');
const v_ref = db.collection('volunteers');
const acc_ref = db.collection('accounts');
const o_ref = db.collection('organizations');
const e_ref = db.collection('events');

module.exports = {
	add_account: async (req, res) => {
		var u = req.body.username;
		var p = req.body.password;
		var t = req.body.type;

		await add_account(u, p, t).then(()=>{
			res.send('account ' + u + ' created');
		});
	},
}

async function add_account(username, password, type)
{
	var account = {
		username: username, 
		pasword: password, 
		type : type
	};

	//add account and set an empty volunteer details
	await acc_ref.add(account)
	.then((doc_ref) => {
		if(type == 'v')
		{
			v_ref.doc(doc_ref.id).set(
				{
					username: username,
					first_name: '',
					last_name: '',
					email: '',
					fav_events: [],
					friends: [],
					rating: 0,
					points: 0,
					search_filters: [],
					assets: [],
					organizations: [],
					reg_events: []
				}
			);
		}
		else if(type == 'o')
		{
			o_ref.doc(doc_ref.id).set(
				{
					username: username,
					name: '',
					email: '',
					rating: 0,
					host_events: [],
					followers: []
				}
			);			
		}
	});
}