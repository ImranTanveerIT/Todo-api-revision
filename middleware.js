// this file contains middleware and it runs before the regular route handler

var cryptojs = require('crypto-js');
module.exports = function(db) {

	return {
		requireAuthentication : function(req,res,next){
			var token = req.get('Auth');


			db.token.findOne({
				where : {
					tokenHash : cryptojs.MD5(token).toString()
				}
			}).then(function(tokenInstance){

				if(!tokenInstance){
					throw new Error();
				}

				req.token = tokenInstance;
				return db.user.findByToken(token);
			}).then(function(user){
				req.user = user;
				next();
			}).catch(function(){
				res.status(401).send();
			});







			// this code was used before lecture 85 but now the token will be saved in db after being hashed
			/*db.user.findByToken(token).then(function(user){
				req.user = user;
				next();
			},function(){
				res.status(401).send();
			});*/
		}
	};

};