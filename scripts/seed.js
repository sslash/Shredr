// Create users
var profileimgs = ['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg','7.jpg','8.jpg','9.jpg','10.jpg','11.jpg','12.jpg','13.jpg','14.jpg','15.jpg', '16.jpg'];
var youtubeurls = [
'LOx_uxq7i3g','y9Yf-r-VG7E','dm3QTgIdT8o','c1AP6NRe7xc','ZUM93WEzMHs','l-0F0A6Du-k', '03-lt7NSItg', '9A6iTzO8aU4', 'GcGl_UGEarc', 'WiGKMpKOBh0','R0fExdKtKsg', 'vHh-6f59hxQ','d2RZXeQc5HU','X1ZRBPA8SK0','B8nEQDaYzrY','DSDpeu0V1Ng','rXq5WcasEdc','VkdrXa_C5nM','naIqbXEGOOA'
];
var names = ['Mikey Megakill', 'Jessica SapDer', 'Derp Derper', 'Jason Bourne', 'King Katwoman', 'The batmobile', 'Slash', 'Slash Shredtown', 'Sick Catmouse', 'Cat n dog', 'Steve Lukestar'];
var tags = ['Gibson GA-20', 'Gibson EB Bass','The Suhr Classic', 'The Gibson Flying V', 'The Rickenbacker 381 V69', 'Gibson','Stratocaster', 'Marshall', 'Jmx' ];
var titles = ['Air Marshal', 'Alone on a Wide, Wide Sea', 'Arms and the Man', 'The Cricket on the Hearth', 'For a Breath I Tarry'];
var locations = ['Oslo, Norway', 'Stockholm, Sweden', 'New York, USA', 'San Fransisco, USA', 'Madrid, Spain', 'London, UK' ];
var types = ['Lick', 'Tutorial', 'Jamtrack', 'Cover', 'Other'];
var playedsince = ['1965', '1945', '1999', '1993', '1988', '1990', '1989'];



var tlenh = tags.length/2;
var tlen = tags.length;

var typelen = types.length;
var youlen = youtubeurls.length;
var titlelen = titles.length;


// Create 100 users
db.users.remove();
for ( var i = 0; i < 100; i++ ) {
	var namei = Math.floor((Math.random()*names.length));
	var imgi = Math.floor((Math.random()*profileimgs.length));
	var loci = Math.floor((Math.random()*locations.length));
	var startedP = Math.floor((Math.random()*playedsince.length));

	var tagsarr = [];
	tagsarr.length = 0;
	for ( var j = 0; j < tlen; j++) {
		var tag = tags[Math.floor(Math.random()*tlen)];
		tagsarr.push(tag);
	}

	db.users.save({
		provider : 'local',
		username : names[namei],
		fans : [],
		fanees : [],
		startedPlaying : playedsince[startedP],
		email : namei + '@sapmail.com',
		profileImgFile : '/img/profiles/' + profileimgs[imgi],
		location : locations[loci],
		birth : new Date(),
		battles : [],
		shreds : [],
		guitars : tagsarr,
		bio : 'Mandalore skywalker greedo cade grievous jade. Luuke greedo cade moff alderaan darth wicket yavin mace. Gonk yoda darth amidala maul. Jade skywalker c-3po ewok moff. Hutt kit mustafar gamorrean palpatine jango hutt yoda mara. Mace yavin utapau antilles kenobi lobot hutt calrissian padmé'
	});
}


// create shreds
db.shreds.remove({});
var users = db.users.find();
var count = db.users.count();

for (var i = 0; i < 100; i++) {
	var typei = Math.floor((Math.random()*typelen)),
		useri = Math.floor((Math.random()*count)),
		youtubei = Math.floor((Math.random()*youlen)),
		ti = Math.floor((Math.random()*titlelen));

	var tagsarr = [];
	tagsarr.length = 0;
	for ( var j = 0; j < tlen; j++) {
		var tag = tags[Math.floor(Math.random()*tlen)];
		tagsarr.push(tag);
	}

	db.shreds.save({
		user : users[useri]._id,
		createdAt : new Date(),
		tags : tagsarr,
		type : types[typei],
		comments : [],
		views : {},
		thumb : 'http://img.youtube.com/vi/' + youtubeurls[youtubei] + '/0.jpg',
		youtubeId : youtubeurls[youtubei],
		description : "This Shred is neat. cewl. sweet. ty. gangsta #" + i,
		title : titles[ti]
	});
}


// battles
db.battles.remove({});
var users = db.users.find();
var count = db.users.count();
var jamtrack = db.jamtracks.find();

var battleTypes = ['Simple', 'Advanced'];
var battleTypesLen = battleTypes.length;

for (var i = 0; i < 100; i++) {
	var typei = Math.floor((Math.random()*battleTypesLen)),
		user1 = Math.floor((Math.random()*count)),
		user2 = Math.floor((Math.random()*count)),
		rCount = Math.floor((Math.random()*5));

		db.battles.save({
			battler: users[user1]._id,
			battlee: users[user2]._id,
			numRounds : rCount,
			mode : battleTypes[typei],
			jamtrackId : jamtrack[0]._id,
			rounds : [
				[
					{
						videoFileId : 'sap1.mp4',
						startSec : 0,
						startFrame : 0,
					}
				]
			]
		});
}

// update battles
var battles = db.battles.find();
var blen = battles.count();

for (var i = 0; i < blen; i++) {
	var battle = battles[i];
	db.users.update( {_id : battle.battler}, { $addToSet: { battles: battle._id } } );
	db.users.update( {_id : battle.battlee}, { $addToSet: { battles: battle._id } } );
}

// update shreds
var shreds = db.shreds.find();
var slen = shreds.count();

for (var i = 0; i < slen; i++) {
	var shred = shreds[i];
	db.users.update( {_id : shred.user}, { $addToSet: { shreds: shred._id } } );
}

// update all users
var users = db.users.find();
var ulen = users.count();

for (var i = 0; i < ulen; i++) {
	var user = users[i];
	db.users.update( {_id : user._id}, { $set: { fans: [] } } );
	db.users.update( {_id : user._id}, { $set: { fanees: [] } } );
}

// tagslist
db.tagslists.remove({});
db.tagslists.save({
	shredTags : ['17 equal temperament', 'Acoustic scale', 'Aeolian mode', 'Algerian scale', 'Altered scale', 'Augmented scale', 'Bebop dominant scale', 'Beta scale', 'Blues scale', 'Bohlen–Pierce scale', 'Chromatic scale', 'Delta scale', 'Dorian mode', 'Double harmonic scale', 'Enigmatic scale', 'Euler–Fokker genus', 'Flamenco mode', 'Gamma scale','"Gypsy" scale', 'Half diminished scale', 'Harmonic major scale', 'Harmonic minor scale','Harmonic Scale', 'Hexany' ],
	gearTags : ['Gibson Les Pau', 'Fender Stratocaster', 'Fender Telecaster', 'Marshal JCM-2000', 'Mesa Boogie Mark v']
});

// scales
var users = db.users.find();
var count = db.users.count();
for (var i = 0; i < 1000; i++) {
	var useri = Math.floor((Math.random()*count));

	db.scales.save({
		title : 'Aeolian loltrain swag scale ' + '#' + i,
		description : 'Bacon ipsum dolor sit amet pork chop sirloin tongue shank short loin. Landjaeger biltong frankfurter turkey doner beef tri-tip brisket prosciutto. Tri-tip filet mignon shank, drumstick jerky turducken leberkas chuck meatball ham jowl. Bacon salami kielbasa porchetta',
		tabs : {},
		tabsKey : 'C',
		user : users[useri]._id,
	});
}


// Jamtracks
var users = db.users.find();
var count = db.users.count();
var jamtracks = ["Sweet JT in d-minor", "Bluesy thing with twis", "Rock in d-minor", "Ballad in a-minor", "Slash-inspired rock in G", "Super sweet JT", "JT for the big D", "Aw yeah, this one's the bomb", "D-minor. Thats it", "Its all I've got", "Srsly, this rox", "Yeah boi. Thats wazup"];
var jtlen = jamtracks.length;

db.jamtracks.remove();
for (var i = 0; i < 30; i++) {
	var useri = Math.floor((Math.random()*count));
	var jt = Math.floor((Math.random()*jtlen));

	db.jamtracks.save({
		createdAt : new Date(),
		description : "Sweet jamtracks, bluesy with a twist of rock.",
		fileId : "scrb1_claptonsmoky_jt.mp3",
		relatedShreds : [ ],
		tags : [
			"blues", "d-minor"
		],
		title : jamtracks[jt],
		user : users[useri]._id,
	});
}






// CUSTOM STUFF

// update array example
db.users.update({"provider" : "facebook"}, {$set : {notifications : []}})

var threeDaysAgo = new Date();
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

var battle = {
	mode : "simple",
	title : 'hey23',
	battlee : ObjectId("53b4454a80cd367703ba5a3a"),
	battler : ObjectId("53b4456480cd367703ba5a3b"),
	rounds : [
		[
			{
				"rating" : {
					"currentValue" : 0,
					"raters" : 0
				},
				"duration" : 1337,
				"startFrame" : 0,
				"startSec" : 0,
				"createdAt" : threeDaysAgo,
				"videoFileId" : "sap2.mp4"
			}
		]
	],
	comments : [],
	votes : {
		"battlees" : [],
		"battlers" : []
	},
	createdAt : new Date(),
	dayLimit : 2,
	numRounds : 3
};

db.battles.save(battle);




// FOR TESTS


// create two fans
db.users.save({
	provider : 'local',
	username : 'testuserFan1',
	fans : [],
	fanees : [],
	startedPlaying : '1965',
	email : 'testuserFan1@sapmail.com',
	profileImgFile : '/img/profiles/1.jpg',
	location : 'Planet Marsh',
	birth : new Date(),
	battles : [],
	salt : '855018864738',
	hashed_password : 'da60354b118ade78b7a060036a652d2286c89462'
	shreds : [],
	feed : [],
	testFan : true,
	guitars : ['Gibson Les Paul'],
	bio : 'Mandalore skywalker greedo cade grievous jade. Luuke greedo cade moff alderaan darth wicket yavin mace. Gonk yoda darth amidala maul. Jade skywalker c-3po ewok moff. Hutt kit mustafar gamorrean palpatine jango hutt yoda mara. Mace yavin utapau antilles kenobi lobot hutt calrissian padmé'
});

db.users.save({
	provider : 'local',
	username : 'testuserFan2',
	fans : [],
	fanees : [],
	startedPlaying : '1965',
	email : 'testuserFan2@sapmail.com',
	profileImgFile : '/img/profiles/1.jpg',
	location : 'Planet Marsh',
	birth : new Date(),
	battles : [],
	shreds : [],
	salt : '855018864738',
	hashed_password : 'da60354b118ade78b7a060036a652d2286c89462'
	feed : [],
	testFan : true,
	guitars : ['Gibson Les Paul'],
	bio : 'Mandalore skywalker greedo cade grievous jade. Luuke greedo cade moff alderaan darth wicket yavin mace. Gonk yoda darth amidala maul. Jade skywalker c-3po ewok moff. Hutt kit mustafar gamorrean palpatine jango hutt yoda mara. Mace yavin utapau antilles kenobi lobot hutt calrissian padmé'
});

// main test user1
db.users.save({
	provider : 'local',
	username : 'testuser',
	fans : [],
	fanees : [],
	startedPlaying : '1965',
	email : 'testuser@sapmail.com',
	profileImgFile : '/img/profiles/1.jpg',
	location : 'Planet Marsh',
	birth : new Date(),
	battles : [],
	shreds : [],
	feed : [],
	salt : '855018864738',
	hashed_password : 'da60354b118ade78b7a060036a652d2286c89462'
	guitars : ['Gibson Les Paul'],
	bio : 'Mandalore skywalker greedo cade grievous jade. Luuke greedo cade moff alderaan darth wicket yavin mace. Gonk yoda darth amidala maul. Jade skywalker c-3po ewok moff. Hutt kit mustafar gamorrean palpatine jango hutt yoda mara. Mace yavin utapau antilles kenobi lobot hutt calrissian padmé'
});

// main test user2
db.users.save({
	provider : 'local',
	username : 'testuser2',
	fans : [],
	fanees : [],
	startedPlaying : '1965',
	email : 'testuser@sapmail.com',
	profileImgFile : '/img/profiles/1.jpg',
	location : 'Planet Marsh',
	birth : new Date(),
	battles : [],
	shreds : [],
	feed : [],
	salt : '855018864738',
	hashed_password : 'da60354b118ade78b7a060036a652d2286c89462',
	guitars : ['Gibson Les Paul'],
	bio : 'Mandalore skywalker greedo cade grievous jade. Luuke greedo cade moff alderaan darth wicket yavin mace. Gonk yoda darth amidala maul. Jade skywalker c-3po ewok moff. Hutt kit mustafar gamorrean palpatine jango hutt yoda mara. Mace yavin utapau antilles kenobi lobot hutt calrissian padmé'
});

// set fans relations
var fans = db.users.find({testFan : true});
db.users.update({"username" : "testuser2"}, {$set : {fans : [
	{
		_id : ObjectId(),
		user : fans[0]._id
	},{
		_id : ObjectId(),
		user : fans[1]._id
	}
]}});

db.users.update({"username" : "testuser"}, {$set : {fans : [
	{
		_id : ObjectId(),
		user : fans[0]._id
	},{
		_id : ObjectId(),
		user : fans[1]._id
	}
]}});

var user = db.users.find({username : 'testuser2'});
var user2 = db.users.find({username : 'testuser'});
db.users.update({username : 'testuserFan1'}, {$set : {fanees : [{
		_id : ObjectId(),
		user : user[0]._id
	},{
		_id : ObjectId(),
		user : user2[0]._id
	}

]}});
var user = db.users.find({username : 'testuser2'});
var user2 = db.users.find({username : 'testuser'});
db.users.update({username : 'testuserFan2'}, {$set : {fanees : [{
		_id : ObjectId(),
		user : user[0]._id
	},{
		_id : ObjectId(),
		user : user2[0]._id
	}
]}});


// clean
db.users.remove({testFan : true});
db.users.remove({username : 'testuser'});

var user = db.users.find({username : 'testuser'});

db.shreds.save({
	user : user[0]._id,
	createdAt : new Date(),
	tags : ['test'],
	type : ['tutorial'],
	comments : [],
	views : {},
	description : "This is a test shred",
	title : 'Test Shred'
});


var battler = db.users.find({username : 'testuser'})
var battlee = db.users.find({username : 'testuser2'})

db.battlerequests.save({
	"advVidFile" : "sap3.mp4",
	"battlee" : battler[0]._id,
	"battler" : battlee[0]._id,
	"createdAt" : new Date(),
	"dayLimit" : 5,
	"duration" : 12.865,
	"jamtrackId" : null,
	"mode" : "simple",
	"rounds" : 3,
	"startFrame" : 0,
	"startSec" : 0,
	"statement" : "test yolo battle"
});



// Test battles
// create a battle request
