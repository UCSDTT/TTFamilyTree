var app = require('../app');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
		res.render('index');
});

router.get('/data', function(req, res) {
		app.knex.select().table('members')
		.catch(function(error) {
			console.error('error in SELECT * FROM members.');
			console.error(error);
		})
		.then(function(members){
			app.knex.select().table('relationships')
			.catch(function(error) {
				console.error('error in SELECT * FROM relationships.')
				console.error(error);
			})
			.then(function(relations){
				var graph = {};
				var families = {};
				families['Incredibles'] = [];
				families['SuperBads'] = [];
				families['Blacks'] = [];
				families['TNA'] = [];
				
				members.forEach(function(member){
					graph[member.id.toString()] = member;
					if(member.class == 'Charter'){
						if(!!member.tt_family)
							families[member.tt_family].push(member);
					}
				});

				relations.forEach(function(relation){
					var big = relation.big_id.toString();
					var little = relation.little_id.toString();
					if(!graph[big].hasOwnProperty('littles'))
						graph[big].littles = [];

					graph[big].littles.push(graph[little]);
				});

				res.json(families);
				//console.log(JSON.stringify(graph['45'], null, 4));
			});
		});
});

module.exports = router;
