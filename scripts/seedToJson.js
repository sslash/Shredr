var fs = require('fs');
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

// var users = db.users.find();
// var count = db.users.count();
var tlenh = tags.length/2;
var tlen = tags.length;

var typelen = types.length;
var youlen = youtubeurls.length;
var titlelen = titles.len;
for (var i = 0; i < 100; i++) {
	var typei = Math.floor((Math.random()*typelen)),
		useri = Math.floor((Math.random()*count)),
		youtubei = Math.floor((Math.random()*youlen)),
		ti = Math.floor((Math.random()*titlelen));

	var tags = [];
	tags.length = 0;
	for ( var j = 0; j < tlen; j++) {
		var tag = tags[Math.floor((Math.random()*tlen))];
		tags.push(tag);
	}

	// db.shreds.save({
	// 	user : users[useri]._id,
	// 	createdAt : new Date(),
	// 	tags : tags,
	// 	type : types[typei],
	// 	comments : [],
	// 	youtubeUrl : 'http://youtu.be/' + youtubeurls[youtubei],
	// 	youtubeId : youtubeurls[youtubei],
	// 	description : "This Shred is neat. cewl. sweet. ty. gangsta #" + i,
	// 	title : titles[ti]
	// });
} 


// // Create 100 users
// for ( var i = 0; i < 100; i++ ) {
// 	var namei = Math.floor((Math.random()*names.length));
// 	var imgi = Math.floor((Math.random()*profileimgs.length));
// 	var loci = Math.floor((Math.random()*locations.length));
// 	db.users.save({
// 		provider : 'local',
// 		username : names[namei],
// 		email : namei + '@sapmail.com',
// 		profileImgFile : profileimgs[imgi],
// 		location : locations[loci],
// 		birth : '29.12.1988'
// 	});
// }


// // create user
// db.users.save({
// 	"provider" : "local",
// 	"username" : "Mikey Megakill",
// 	"email" : "michaelgunnulfsen@gmail.com",
// 	"profileImgFile" : "sap.jpg",
// 	"location" : "Oslo, Norway",
// 	"Birth" : "29.12.1988"
// });

// // Create shreds
// db.shreds.save({
// 	"user" : {
// 		"$id" : "52f686f60fa645eea55ae78d",
// 		"$ref" : "users"
// 	},
// 	"createdAt" : new Date(),
// 	"tags" : [],
// 	"comments" : [],
// 	"youtubeUrl" : "http://youtu.be/URNUo6oQetU",
// 	"youtubeId" : "URNUo6oQetU",
// 	"description" : "This Shred is neat. cewl. sweet. ty. gangsta",
// 	"title" : "Hello, Shredr. First!"
// });