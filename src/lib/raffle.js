var u = require("./util.js");
var api = require("./api.js");

var raffle = {
    active: false,
    time: 30000,
    users: []
};

var startRaffle = function (time = null, callback) {
    if(time != null) {
        if(time.toString().length == 2) {
            time = time * 1000;
        }

		if(time > 300000) {
			callback("You are trying to create a raffle for more than 5 minutes! That's not cool!");
		} else {
			raffle.time = time;
		}
    }

    raffle.active = true;

    var raffleTime = convertTime(raffle.time);

    callback(u.format("A raffle has begun! Type \"!join\" to enter! The raffile will end in %s!", raffleTime));

    setTimeout(function() {
        endRaffle(function(winningMessage) {
            callback(winningMessage);
        });
    }, raffle.time);
};

var addUserToRaffle = function(username, callback) {
    getIsRaffleActive(function(active) {
        if(active) {
            if(raffle.users.indexOf(username) == -1) {
                raffle.users.push(username);

                api.viewers(function(err, res) {
                    if(!err) {
                        if(res.viewers <= 20) {
                            setTimeout(function() {
                                callback(u.format("%s, you have entered the raffle!", username));
                            }, 1000);
                        }
                    }
                });
            }
        } else {
            setTimeout(function() {
                callback(u.format("%s, there is no active raffle to join!", username));
            }, 2000);
        }
    });
};

var endRaffle = function(callback) {
    getIsRaffleActive(function(active) {
        if(active) {
            if(raffle.users.length > 0) {
                callback(u.format("The raffle has ended! And the winner is.... !!! %s !!! Congratulations! FeelsGoodMan", raffle.users[Math.floor(Math.random() * raffle.users.length)]));
            } else {
                callback("Nobody won the raffle because no one entered! FeelsBadMan");
            }

            raffle.active = false;
            raffle.time = 30000;
            raffle.users = [];
        }
    });
};

var getIsRaffleActive = function(callback) {
    callback(raffle.active);
};


var convertTime = function (num) {
    var seconds = Math.floor(num / 1000);

    if(num >= 60000) {
        var minutes = Math.floor(seconds / 60);
        var minFormat = (minutes == 1) ? " minute" : " minutes";

        return minutes + minFormat;
    }

    return seconds + " seconds";
}

module.exports = {
    startRaffle: startRaffle,
    addUserToRaffle: addUserToRaffle
};