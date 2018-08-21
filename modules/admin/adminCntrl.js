/*
 * @Author: Sachin kumar
 * @Date:   08/june/2017
 */

var Promise = require('bluebird');
var adminModel = require('./adminModel');
var md5 = require('md5');
var STATUS = require('../statusCode');
var mail = require('../mail');
var serverConstants = require('../serverConstants');

var adminCtrl = (function(){
	this.loginData = function(user){
                
		var promise = new Promise(function(resolve, reject){
			adminModel.find({"email": user.email}, function(err, data){                           
                                
				if(err){
					resolve(STATUS("SC202",err));
				}else if(data.length > 0){  
                                        
					if(data[0].password == md5(user.password)){
						resolve(STATUS("SC200","Login successful",data));
					}else{
						resolve(STATUS("SC202","Invalid Password"));
					}
				}else{
					resolve(STATUS("SC202","Please check yout email address"));
				}
			})
		})
		return promise;
	}
	this.createAdmin = function(user){
		var promise = new Promise(function(resolve, reject){
			var newUser = new adminModel();
			newUser.email = user.email.toLowerCase();
			newUser.password = md5(user.password);
			newUser.phoneNumber = user.phoneNumber;
			newUser.roles.push('admin');
			newUser.save(function(err, data){
				if(err){
					reject(err);
				}else{
					resolve(data);
				}
			})
		})
		return promise;
	}
	this.toChangePassword = function(req){
                
		var promise = new Promise(function(resolve, reject){
			adminModel.find({"_id":req.params.id}, function(err, userFound){
				if(err){
					resolve(STATUS("SC202",err));
				}else{
                                    //    console.log("userFound",userFound);
                                     //   console.log("oldPassword",md5(req.body.oldPassword));
                                    //    console.log("new pass", md5(req.body.newPassword));
                    if(userFound.length== 0){
                    	resolve(STATUS("SC202","you have provided wrong password"));
                    }                    
					else if(userFound[0].password === md5(req.body.oldPassword)){
						adminModel.updateOne({"_id": userFound[0]._id}, {$set:{"password":md5(req.body.newPassword)}}, {new:true}, function(err, data){
							if(err){								
                                resolve(STATUS("SC202",err));
							}else{
								resolve(STATUS("SC200","Password changed Successfully"));
							}
						})
					}else{
						resolve(STATUS("SC202","you have provided wrong password"));
					}
				}
			})
		})
		return promise;
	}
	this.resetPassword = function(req){
		var promise = new Promise(function(resolve, reject){
			adminModel.find({"_id": req.params.id}, function(err, userFound){
				if(err){
					reject(err);
				}else{
					adminModel.findOneAndUpdate({"_id": userFound[0]._id}, {$set:{"password":md5(req.body.password), "passwordCode": req.body.passwordCode}}, function(err, data){
						if(err){
							reject(STATUS("SC202","",err));
						}else{
							resolve(STATUS("SC200","Password Reset Successfully"));
						}
					})
				}
			})
		})
		return promise;
	}
	this.updateProfile = function(req){
		var promise = new Promise(function(resolve, reject){
			adminModel.find({"_id": req.params.id}, function(err, userFound){
				if(err){
					reject(err);
				}else{
					var email = req.body.email ? req.body.email.toLowerCase() : userFound[0].email;
					var ph = req.body.phoneNumber ? req.body.phoneNumber : userFound[0].phoneNumber;
					var ad = req.body.address ? req.body.address : userFound[0].address;
					var city = req.body.city ? req.body.city : userFound[0].city;
					var state = req.body.state ? req.body.state : userFound[0].state;
					var country = req.body.country ? req.body.country : userFound[0].country;
					adminModel.findOneAndUpdate({"_id": userFound[0]._id}, {$set:{"email":email,"phoneNumber":ph,"address":ad,"city":city,"state":state,"country":country}}, {new : true}, function(err, data){
						if(err){
							reject({"message":"Internal server error"});
						}else{
							resolve(data);
						}
					})
				}
			})
		})
		return promise;
	}
  this.resetRequestData = function(req){
    
     //console.log("==fetchDataForAdmin==",constantUrl);
    
    var promise = new Promise(function(resolve, reject){
      adminModel.find({"email":req.body.email.toLowerCase()}, function(err, data){
        if(err){
                reject(STATUS("SC202","",err));
        }else if(data.length > 0){
          var passwordCode = getRandomIntInclusive(10000,99999);
          adminModel.findOneAndUpdate({"_id": data[0]._id}, {$set:{"passwordCode":passwordCode}}, {new : true}, function(err, data){
            if(err){
              resolve(STATUS("SC200",err));
            }else{              
              var to = data.email;
              var sub = "Reset Password";                                      
              var htmlBody = 'Hi, \n\n'+'click on below link to generate password and use the same for merchant login.'+'\n\n';
              htmlBody+='<a href="'+ serverConstants.url.BASEURl+'/#/reset/'+ data._id+'/'+passwordCode+'">'+ serverConstants.url.BASEURl+'/#/reset/'+ data._id+'/'+passwordCode+'</a>'+'\n\n';
              htmlBody += 'Thanks'+'\n\n';
              htmlBody += 'Giftbomb team';              
              mail.sendMail(to,sub,htmlBody)
              .then(function(emailSuccess){
                      resolve(STATUS("SC200","Email sent successfully", emailSuccess));
              }, function(emailFail){
                      resolve(STATUS("SC202","Email sent fail", emailFail));
              }) 
            }
          })  
        }else{
          resolve(STATUS("SC202","This email address does not exist."));
        }
      })
    })
    return promise;
  }
  
  
  this.fetchDataForAdmin = function(where){
    //console.log("==fetchDataForAdmin==",constantUrl);
    var promise = new Promise(function(resolve, reject){
     // console.log("erwer",where);
      adminModel.find(where, function(err, data){
        if(err){
          resolve(STATUS("SC202",err));
        }else{
          resolve(STATUS("SC200","Record found successfully",data));
        }
      })
    })
    return promise;
  }
  
        
  /**
   * 
   * @param {type} min
   * @param {type} max
   * @returns {Number|adminCntrl_L12.getRandomIntInclusive.min}
   */
  this.getRandomIntInclusive = function(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }        
  return this;
        
}());

module.exports = adminCtrl;
