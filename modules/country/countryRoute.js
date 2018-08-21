/*
 * @Author: Sachin kumar
 * @Date:   12/june/2017
 */
 
var express = require('express');
var router = express.Router();
var countryCntrl = require('./countryCntrl');




// add country
router.post('/', function(req, res){
	countryCntrl.addCountry(req.body)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})
// update country
router.put('/:id', function(req, res){
	countryCntrl.updateCountry(req)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})
// add city
router.post('/city/add', function(req, res){
	countryCntrl.addCity(req)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})


// get all city in country
router.get('/:country/city', function(req, res){
	countryCntrl.getAllCity(req.params.country)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})

// add suggestion for country
router.post('/suggestion', function(req, res){
	countryCntrl.addSuggestion(req.body)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})

// get suggestion for country
router.get('/suggestion', function(req, res){
	countryCntrl.getSuggestion()
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})

// get all city in country
router.post('/deleteCountry/:id', function(req, res){
	countryCntrl.deleteCountry(req.params.id)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})


router.post('/deleteCity/:city', function(req, res){
	countryCntrl.deleteCity(req.params.city)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})


// get all city in country
router.get('/fetchCityList', function(req, res){
	countryCntrl.fetchCityList(req)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})


// get all countries
router.get('/getAllCities', function(req, res){
	countryCntrl.getAllCities(req)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})

router.get('/getAllCountryData', function(req, res){
  countryCntrl.getAllCountry(req)  //
  .then(function(data){
          res.send(data);
  }, function(err){
          res.status(401).send(err);
  })
})



router.get('/fetchCountryRecord', function(req, res){
  countryCntrl.fetchCountryRecord(req)  
  .then(function(data){
          res.send(data);
  }, function(err){
          res.status(401).send(err);
  })
})

// get all countries
router.get('/', function(req, res){
    
	countryCntrl.getAllCountryData(req)
	.then(function(data){
		res.send(data);
	}, function(err){
		res.status(401).send(err);
	})
})

module.exports = router;