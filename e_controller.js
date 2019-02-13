const admin = require('firebase-admin');
var db = require('./firestore_init');
const v_ref = db.collection('volunteers');
const acc_ref = db.collection('accounts');
const o_ref = db.collection('organizations');
const e_ref = db.collection('events');

module.exports = {
	add_event: add_event,
	get_requirements : get_requirements
}

async function get_requirements(event_id)
{
	var toReturn;
	await e_ref.doc(event_id).get().then((doc) => {
		if(doc.exists)
		{
			toReturn = doc.data().requirements;
		}
		else
		{
			throw "document does not exsist";
		}
	});
	return toReturn;
}

async function add_event(properties)
{
	var name = properties.body.name;
	
	var start_month = properties.body.date.start.month;
	var start_day = properties.body.date.start.day;
	var start_year = properties.body.date.start.year;
	var end_month = properties.body.date.end.month;
	var end_day = properties.body.date.end.day;
	var end_year = properties.body.date.end.year;

	var start_hour = properties.body.time.start.hour;
	var start_minute = properties.body.time.start.minute;
	var end_hour = properties.body.time.end.hour;
	var end_minute = properties.body.time.end.minute;

	var requirements = properties.body.requirements;
	var description = properties.body.description;
	var organizer = properties.body.organizer; //uid of organizer

	var location_name = properties.body.location.location_name;
	var latitude = parseFloat(properties.body.location.latitude);
	var longitude = parseFloat(properties.body.location.longitude);

	var event = {
					name : name,
					date : {
						start : {
							month: start_month,
							day: start_day,
							year: start_year
						},
						end : {
							month: end_month,
							day: end_day,
							year: end_year
						}
					},
					time : {
						start: {
							hour: start_hour,
							minute: start_minute
						},
						end: {
							hour: end_hour,
							minute: end_minute
						}
					},
					requirements : requirements,
					description: description,
					organizer: organizer,
					location: {
						name: location_name,
						coordinates: {
							latitude,
							longitude
						}
					},
					v_fav: [],
					v_reg: []
				};

	console.log(event);

	var event_id;
	await e_ref.add(event)
		.then((doc) => {
			event_id = doc.id;
			console.log('successfully set event properties');
		})
		.catch((error) => {
			throw error;
			console.log("Error adding event" ,error);
		});
	return event_id;
}
