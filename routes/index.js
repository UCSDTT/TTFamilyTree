var app = require('../app');
var express = require('express');
var router = express.Router();



router.get('/', function(req, res) {
  	app.knex('members').where({
  		'class': 'Charter',
  		'tt_family': 'Incredibles'
  	})
  	.catch(function(error) {
  		console.error(error);
  	})
  	.then(function(rows){
  		getLittles(rows[0], rows, res);
  	});
});



var getLittles = function(parent, members, res){
	if(members.length === 0)
		return null;

	members.forEach(function(member){
		subquery = app.knex('relationships')
				.where('big_id', member.id)
				.select('little_id');

		app.knex('members').where('id', 'in', subquery)
			.catch(function(error){
				console.error(error);
				return res.status(500).json(error);
			})
			.then(function(rows){
				if(rows.length != 0){
					getLittles(parent, rows, res);
					member['littles'] = rows;
				} else {
					console.log('printing for member: ' + member);
					console.log(parent);
					//res.render('index', {});
				}
			});
	}).then();
}

module.exports = router;
