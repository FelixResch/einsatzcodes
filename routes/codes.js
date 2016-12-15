/**
 * Created by felix on 12/13/16.
 */

var express = require('express');
var sprintf = require('sprintf-js').sprintf;
var router = express.Router();

router.get('/:major/:priority/:minor', function (req, res) {
    var major = sprintf('%02d', req.params.major);
    var priority = req.params.priority.toUpperCase();
    var minor = sprintf('%02d', req.params.minor);
    var codes = req.db.getCollection('codes');
    var results = codes.find({"$and": [{"code.major":major}, {"code.priority":priority}, {"code.minor": minor}]});
    console.log(JSON.stringify(results));
    if(results.length == 0) {
        res.status(404)
    } else if (results.length == 1) {
        var code = JSON.parse(JSON.stringify(results[0]));
        code.code.long = sprintf('%02d-%s-%02d', major, priority, minor);
        res.json(code)
    } else {
        res.status(404)
    }
});

router.get('/:major/:priority/:minor/:suffix', function (req, res) {
    var major = sprintf('%02d', req.params.major);
    var priority = req.params.priority.toUpperCase();
    var minor = sprintf('%02d', req.params.minor);
    var suffix = req.params.suffix.toUpperCase();
    var codes = req.db.getCollection('codes');
    var suffixes = req.db.getCollection('suffixes');
    var results = codes.find({"$and": [{"code.major":major}, {"code.priority":priority}, {"code.minor": minor}]});
    var resultsSuffix = suffixes.find({"$and":[{major: major}, {suffix: suffix}]});
    console.log(JSON.stringify(results));
    console.log(JSON.stringify(resultsSuffix));
    if(results.length == 0 || resultsSuffix.length == 0) {
        res.status(404);
        res.end();
    } else if (results.length == 1 && resultsSuffix.length == 1) {
        var code = JSON.parse(JSON.stringify(results[0]));
        code.code.long = sprintf('%02d-%s-%02d%s', major, priority, minor, suffix);
        code.code.suffix = resultsSuffix[0].suffix;
        code.description += " " + resultsSuffix[0].suffixText;
        delete code.meta; delete code.$loki;
        res.json(code);
    } else {
        res.status(404);
        res.end();
    }
});

module.exports = router;