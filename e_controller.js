const admin = require('firebase-admin');
var db = require('./firestore_init');
const v_ref = db.collection('volunteers');
const acc_ref = db.collection('accounts');
const o_ref = db.collection('organizations');
const e_ref = db.collection('events');

module.exports = {
	add_event: add_event
}

async function add_event(properties)
{
	var name = properties.body.name;
	var date_start = properties.body.date.start;
	var date_end = properties.body.date.end;
	var duration_unit = properties.body.duration.unit;
	var duration_value = properties.body.duration.value;
	var requirements = properties.body.requirements;
	console.log(requirements);
	var description = properties.body.description;
	var organizer = properties.body.organizer; //uid of organizer

	var event = {
					name : name,
					date : {
						start : date_start,
						end : date_end
					},
					duration : {
						unit: duration_unit,
						value: duration_value
					},
					requirements : requirements,
					description: description,
					organizer: organizer
				};
	console.log(event);

	await e_ref.add(event)
		.then((doc) => {
				console.log('successfully set event properties');
		}).catch((error) => {
			console.log("Error adding event" ,error);
		});
}