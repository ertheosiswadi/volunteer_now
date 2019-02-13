const admin = require('firebase-admin');
var db = require('./firestore_init');
const v_ref = db.collection('volunteers');
const acc_ref = db.collection('accounts');
const o_ref = db.collection('organizations');
const e_ref = db.collection('events');


module.exports = {
	sayHello: (req, res) => {
		res.send('Hello Volunteers!');
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
	},
	get_profile_summary: async (req, res) => {
		var uid = req.params.uid;
		await get_profile_summary(uid).then((summary) => {
			res.send(summary);
		});
	},
	set_rating: async (req ,res) => {
		var uid = req.body.uid;
		var rating = req.body.rating;
		await set_rating(rating, uid).then(() => {
			res.send('successfully updated rating');
		})
		.catch((error) => {
			res.status(500).send('failed to update rating', error);
		});
	},
	get_rating: async (req, res) => {
		var uid = req.params.uid;
		await get_rating(uid).then((rating) => {
			if(rating === null)
			{
				res.status(500).send('failed to get rating');
			}
			else
			{
				res.send(rating);
			}
		})
		.catch((error) => {
			res.status(500).send('failed to get rating');
		})
	},
	add_friend: async(req, res) => {
		var friend_uid = req.body.friend_uid;
		var my_uid = req.body.my_uid;
		await add_friend(friend_uid, my_uid).then(() => {
			res.send('successfully added friend');
		})
		.catch(()=>{
			res.status(500).send('failed to add friend');
		});
	},
	add_favourite: async(req, res) => {
		var event_uid = req.body.event_uid;
		var my_uid = req.body.my_uid;

		await add_favourite(event_uid, my_uid).then(() => {
			res.send('successfully added event to favourites');
		}).
		catch((error) => {
			res.status(500).send('Error adding event to favourites');
		});
	},
	add_register: async(req, res) => {
		var event_uid = req.body.event_uid;
		var my_uid = req.body.my_uid;

		await add_favourite(event_uid, my_uid).then(() => {
			res.send('successfully added event to favourites');
		}).
		catch((error) => {
			res.status(500).send('Error adding event to favourites');
		});
	}
}

async function add_register(event_uid, my_uid)
{
	var batch = db.batch();
	var ref1_v = v_ref.doc(my_uid);
	var ref2_e = e_ref.doc(event_uid);
	batch.update(ref1_v, {fav_events: admin.firestore.FieldValue.arrayUnion(event_uid)});
	batch.update(ref2_e, {v_fav: admin.firestore.FieldValue.arrayUnion(my_uid)});
	// batch.update(ref2_e, {'v_fav': 3});
	await batch.commit().then(()=>{
		console.log('successfully added event to favourites');
	}).catch((error) => {
		console.log('Error adding event to favourites', error);
	});
}


async function add_favourite(event_uid, my_uid)
{
	var batch = db.batch();
	
	var ref1_v = v_ref.doc(my_uid);
	var ref2_e = e_ref.doc(event_uid);
	batch.update(ref1_v, {fav_events: admin.firestore.FieldValue.arrayUnion(event_uid)});
	batch.update(ref2_e, {v_fav: admin.firestore.FieldValue.arrayUnion(my_uid)});

	await batch.commit().then(()=>{
		console.log('successfully added event to favourites');
	}).catch((error) => {
		console.log('Error adding event to favourites', error);
	});
}

async function add_friend(friend_uid, my_uid)
{
	var batch = db.batch();
	var ref1_v = v_ref.doc(my_uid);
	var ref2_v = v_ref.doc(friend_uid);
	batch.update(ref1_v, {friends: admin.firestore.FieldValue.arrayUnion(friend_uid)});
	batch.update(ref2_v, {friends: admin.firestore.FieldValue.arrayUnion(my_uid)});

	await batch.commit()
	.then(() => {
		console.log('successfully added friend', friend_uid);
	}).catch((error) => {
		throw error;
		console.log('unable to add friend', friend_uid);
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

async function set_rating(rating, uid)
{
	v_ref.doc(uid).update({
		rating: rating
	})
	.then(() => {
		console.log("rating successfully updated");
	})
	.catch((error) => {
		console.log("Error update rating to ", rating, " ", error);
	});
}
async function get_rating(uid)
{
	await get_profile_summary(uid).then((summary) => {
		if(summary !== null)
		{
			toReturn = summary;
			toReturn = toReturn.rating;
		}
		else return null;
	})
	.catch((error) => {
		console.log("Error getting user's summary", error);
		return error;
	});
	return toReturn;
}

/*query user's document data using it's uid, 
	print to console if error*/
async function get_profile_summary(uid)
{
	toReturn = null;
	await v_ref.doc(uid).get().then((doc) => {
		if(doc.exists)
		{
			toReturn = doc.data();
		}
		else
		{
			console.log("Error: No such user");
		}
	}).catch((error) => {
		console.log("Error getting user's document", error);
	});
	return toReturn;
}

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