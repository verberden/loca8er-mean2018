var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var theEarth =(function(){

    var getDistanceInKiloMeters = function(distance) {
        return parseFloat(distance / 1000);
    };

    var getDistanceInMeters = function(distance) {
        return parseFloat(distance * 1000);
    };

    return {
        getDistanceInKiloMeters : getDistanceInKiloMeters,
        getDistanceInMeters : getDistanceInMeters
    };
})();

var _bildLocations = function (results) {
    var locations = [];

    results.forEach(doc => {
        locations.push({
            distance: Math.round((theEarth.getDistanceInKiloMeters(doc.dist.calculated)*100)/100),
            name: doc.name,
            address: doc.address,
            rating: doc.rating,
            facilities: doc.facilities,
            _id: doc._id
        });
    });

    return locations;
}

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.locationsCreate = function (req, res) {
    Loc.create({
        name: req.body.name,
        address: req.body.address,
        facilities: req.body.facilities.split(","),
        loc: {
            type: "Point",
            coordinates: 
                [parseFloat(req.body.lng), parseFloat(req.body.lat)]   
        },
        openingTimes: [{
            days: req.body.days1,
            opening: req.body.opening1,
            closing: req.body.closing1,
            closed: req.body.closed1,
        }, {
            days: req.body.days2,
            opening: req.body.opening2,
            closing: req.body.closing2,
            closed: req.body.closed2,
        }]
    }, function (err, location) {
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 200, location);
        }
    })
};

module.exports.locationsReadOne = function (req, res) {
    if (req.params && req.params.locationid) {
        Loc
        .findById(req.params.locationid)
        .exec(function(err, location) {
            if (!location) {
                sendJsonResponse(res, 404, { "message" : "Locationid not found" });
                return;
            } else if (err) {
                sendJsonResponse(res, 404, err);
                return;
            }
            sendJsonResponse(res, 200, location);
        });

    } else {
        sendJsonResponse(res, 404, { "message" : "No location in request" });
    }
};

module.exports.locationsUpdateOne = function (req, res) {
    if (!req.params.locationid) {
        sendJsonResponse(res, 404, { "message" : "Not found, locationid is required." });
        return;
    }

    Loc
    .findById(req.params.locationid)
    .select('-reviews -rating')
    .exec(function(err, location) {
        if (!location) {
            sendJsonResponse(res, 404, { "message" : "Locationid not found" });
            return;
        } else if (err) {
            sendJsonResponse(res, 404, err);
            return;
        }
        location.name = req.body.name || location.name;
        location.address = req.body.address || location.address;
        location.facilities = req.body.facilities ? req.body.facilities.split(",") : location.facilities;
        location.loc.coordinates = [req.body.lng ? parseFloat(req.body.lng) : location.loc.coordinates[0] , 
        req.body.lat ? parseFloat(req.body.lat) : location.loc.coordinates[1]];
        location.openingTimes = [{
            days: req.body.days1 || location.openingTimes[0].days,
            opening: req.body.opening1 || location.openingTimes[0].opening,
            closing: req.body.closing1 || location.openingTimes[0].closing,
            closed: req.body.closed1 || location.openingTimes[0].closed,
        }, {
            days: req.body.days2 || location.openingTimes[1].days,
            opening: req.body.opening2 || location.openingTimes[1].opening,
            closing: req.body.closing2 || location.openingTimes[1].closing,
            closed: req.body.closed2 || location.openingTimes[1].closed,
        }];
        location.save(function(err, location) {
            if (err) {
                sendJsonResponse(res, 404, err);
            } else {
                sendJsonResponse(res, 200, location);
            }
        })
    });
};

module.exports.locationsListByDistance = function (req, res) {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    var maxDistance = parseInt(req.query.maxDistance)

    var point = {
        type: "Point",
        coordinates: [lng, lat]
    };

    if (!lng||!lat) {
        sendJsonResponse(res, 404, { "message" : "Lng and lat parameters are required" });
        return;        
    }

    Loc.aggregate([
        {
            $geoNear: {
                near: point,
                distanceField: "dist.calculated",
                maxDistance: theEarth.getDistanceInMeters(maxDistance),
                includeLocs: "dist.location",
                num: 10,
                spherical: true
                }
            }
    ], function (err, result) {
        if (err) {
            sendJsonResponse(res, 404, err);
            return;
        } else {
            sendJsonResponse(res, 200, _bildLocations(result));
        }
    });
};

module.exports.locationsDeleteOne = function (req, res) {
    var locationid = req.params.locationid;
    if (locationid) {
        Loc
            .findByIdAndRemove(locationid)
            .exec(function(err, location) {
                if (err ) {
                    sendJsonResponse(res, 404, err);
                    return;
                } 
                sendJsonResponse(res, 204, null);
            }
        );
    } else {
        sendJsonResponse(res, 404, { "message" : "No locationid" });
    }
};