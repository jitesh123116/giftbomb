/*
 * @Author: Vinay kumar
 * @Date:   10/July/2017
 */

var Promise = require('bluebird');
var merchantModel = require('./merchantModel');
var STATUS = require('../statusCode');
var md5 = require('md5');

var merchantController = (function(){
    this.login = function(user){      
      var promise = new Promise(function(resolve, reject){
          merchantModel.find({"email":user.email}, function(err, data){
              if(err){					
                reject(err);
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
    return this;
}());

module.exports = merchantController;
