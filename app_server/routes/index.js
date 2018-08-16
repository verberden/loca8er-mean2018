var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');
var ctrlOthers = require('../controllers/others');

/* GET Location pages. */
router.get('/', ctrlLocations.homelist);
router.get('/location/:locationid', ctrlLocations.locationInfo);
router.get('/location/:locationid/reviews/new', 
           ctrlLocations.addReview);
router.post('/location/:locationid/reviews/new', 
           ctrlLocations.doAddReview);
/* GET Other pages. */
router.get('/about', ctrlOthers.about);

module.exports = router;
