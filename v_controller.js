const db = require('./firestore_init');
const v_ref = db.collection('volunteers');
const acc_ref = db.collection('accounts');



module.exports = {
	sayHello: (req, res) => {
		res.send('Hello Volunteers!');
	},
	add_account: async (req, res) => {
		var u = req.params.username;
		var p = req.params.password;
		var t = req.params.type;

		await add_account(u, p, t).then(()=>{
			res.send('account ' + u + ' created');
		});
	},
	set_basic_details: async (req, res) => {
		var first_name = req.body.first_name;
		var last_name = req.body.last_name;
		var email = req.body.email;
		var uid = req.body.uid;
		await set_basic_details(first_name, last_name, email, uid).then(() => {
			res.send('basic details of ' + uid + ' updated');
		});
	},
	get_uid: async (req, res) => {
		var username = req.params.username;
		await get_uid(username).then((uid) => {
			res.send(uid);
		})
	}
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
		v_ref.doc(doc_ref.id).set(
			{
				username: username,
				first_name: '',
				last_name: '',
				email: '',
				fav_events: {},
				friends: {},
				rating: 0,
				points: 0,
				search_filters: {},
				assets: {},
				organizations: {},
				reg_events: {}
			}
		);
	});
}

async function set_basic_details(first_name, last_name, email, uid)
{
	v_ref.doc(uid).update({
		first_name: first_name,
		last_name: last_name,
		email: email
	})
	.then(() => {
		console.log("basic details successfully updated");
	})
	.catch((error) => {
		console.error("Error updating volunteer's basic details: ", error);
	});
}

async function get_profile_summary(){}

async function get_uid(username) //get uid from username
{
	var toReturn;
	console.log('im here ' + username);
	await v_ref.where("username", "==", username).get()
		.then((snapshot) => {
			snapshot.forEach((doc) => {
				toReturn = doc.id;
			})
		});
	return toReturn;
}