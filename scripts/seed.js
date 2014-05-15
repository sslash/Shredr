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
		startedPlaying : playedsince[startedP],
		email : namei + '@sapmail.com',
		profileImgFile : profileimgs[imgi],
		location : locations[loci],
		birth : new Date(),
		guitars : tagsarr,
		description : 'Mandalore skywalker greedo cade grievous jade. Luuke greedo cade moff alderaan darth wicket yavin mace. Gonk yoda darth amidala maul. Jade skywalker c-3po ewok moff. Hutt kit mustafar gamorrean palpatine jango hutt yoda mara. Mace yavin utapau antilles kenobi lobot hutt calrissian padmé'
	});
}

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
		youtubeUrl : 'http://youtu.be/' + youtubeurls[youtubei],
		youtubeId : youtubeurls[youtubei],
		description : "This Shred is neat. cewl. sweet. ty. gangsta #" + i,
		title : titles[ti]
	});
}

// tagslist
db.tagslists.remove({});
db.tagslists.save({
	shredTags : ['17 equal temperament', 'Acoustic scale', 'Aeolian mode', 'Algerian scale', 'Altered scale', 'Augmented scale', 'Bebop dominant scale', 'Beta scale', 'Blues scale', 'Bohlen–Pierce scale', 'Chromatic scale', 'Delta scale', 'Dorian mode', 'Double harmonic scale', 'Enigmatic scale', 'Euler–Fokker genus', 'Flamenco mode', 'Gamma scale','"Gypsy" scale', 'Half diminished scale', 'Harmonic major scale', 'Harmonic minor scale','Harmonic Scale', 'Hexany' ],
	gearTags : ['Gibson Les Pau', 'Fender Stratocaster', 'Fender Telecaster', 'Marshal JCM-2000', 'Mesa Boogie Mark v']
});
