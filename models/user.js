var bcrypt = require('bcrypt');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');

module.exports = function (sequelize, DateTypes) {
	
	var user =  sequelize.define('user', {
		email: {
			type: DateTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		salt : {
			type: DateTypes.STRING
		},
		password_hash : {
			type: DateTypes.STRING 
		},
		password: {
			type: DateTypes.VIRTUAL,
			allowNull: false,
			validate: {
				len: [7, 100]
			},
			set: function(value){
				var salt = bcrypt.genSaltSync(10);
				var hashedPassword = bcrypt.hashSync(value,salt);

				this.setDataValue('password',value);
				this.setDataValue('salt',salt);
				this.setDataValue('password_hash',hashedPassword);
			}
		}
	}, {
		hooks: {
			beforeValidate: function (user, options) {
				// user.email
				if (typeof user.email === 'string') {
					user.email = user.email.toLowerCase();
				}
			}
		},
			classMethods: {
				authenticate: function(body){

					return new Promise(function(resolve,reject){
						if(typeof body.email !== 'string' || typeof body.password !== 'string'){
							return reject();
						}

						user.findOne({
							where:{
								email: body.email
							}

						}).then(function(user){
							if(!user || !bcrypt.compareSync(body.password,user.get('password_hash'))){
								return reject();
							}
							resolve(user);
						},function(e){
							reject(); 
						});
					});
				}
			},
			instanceMethods: {
				toPublicJSON: function(){
					var json = this.toJSON();
					return _.pick(json,'id','email','createdAt','updatedAt');
				},
				generateToken: function(type){
					if(!_.isString(type)){
						return undefined;
					}

					try{
						 var stringData = JSON.stringify({id:this.get('id'),type: type}); //convert object to json string
						 var encryptedData = cryptojs.AES.encrypt(stringData,'abc123!@#!').toString(); //encrypt the data
						 var token = jwt.sign({ // generate token having user data inside
						 	token : encryptedData
						 },'qwerty098');

						 return token;
					}catch(e){
						return undefined; 
					}
				}
			}  
	});

	return user;
};