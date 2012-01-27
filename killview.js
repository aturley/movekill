(function (ctx) {
     var Player = function(id) {
         this.id = id;
         this.location = 0;
         this.kills = 0;
         this.deaths = 0;
         this.onTopOfMe = null;
         this.underMe = null;
     };

     var handleMove = function(player) {
         board.movePlayer(player);
     };

     var handleKill = function(player) {
         if (player.underMe) {
             player.kills++;
             player.underMe.deaths++;
         }
         redraw();
     };

     var redraw = function () {
         // draw board
         var label;

         for (var i = 0; i < 4; i++) {
             label = "";
             var p = board.masters[i];
             while(p) {
                 label = label + p.id + "<br/>";
                 p = p.underMe;
             }
             document.getElementById("" + i).innerHTML = label;
         }

         // draw scores
         label = "";
         for (var playerId in players) {
             console.log("score for :" + playerId);
             var player = players[playerId];
             label = label + player.id + " kills: " + player.kills + " deaths: " + player.deaths + "<br/>";
         }
         document.getElementById("score").innerHTML = label;
     };

     var players = {};

     var board = {
         masters: [null, null, null, null],
         movePlayer: function(player) {
             if (player.onTopOfMe == null) {
                 var newLocation = (player.location + 1) % 4;
                 board.move(player.location, newLocation);
                 player.location = newLocation;
             }
         },
         move: function(oldLocation, newLocation) {
             console.log("move from " + oldLocation + " to " + newLocation);
             var player = this.masters[oldLocation];
             var underPlayer = player.underMe;
             this.masters[oldLocation] = underPlayer;
             if (underPlayer) {
                 underPlayer.onTopOfMe = null;
             }
             var newUnderPlayer = this.masters[newLocation];
             this.masters[newLocation] = player;
             player.underMe = newUnderPlayer;
             if (newUnderPlayer) {
                 newUnderPlayer.onTopOfMe = player;
             }
         },
         removePlayer: function(player) {
             if(player.onTopOfMe) {
                 player.onTopOfMe.underMe = player.underMe;
             } else {
                 master[player.location] = player.underMe;
             }
             if (player.underMe) {
                 player.underMe.onTopOfMe = player.onTopOfMe;
             }
         },
         addPlayer: function(player) {
             var newLoc = Math.floor(Math.random() * 4);
             player.location = newLoc;
             if (this.masters[newLoc]) {
                 this.masters[newLoc].onTopOfMe = player;
             }
             player.underMe = this.masters[newLoc];
             this.masters[newLoc] = player;
         }
     };

     var connection = {
         connect: function () {
             var viewResourceId = '23b544144bd3a8c31af53fad804ccff066835bb0';
             SWARM.connect({ apikey: '49819bbcc8a3543d1daa5899bd40d1cb230524ff'
                             , swarms: '53da4a421f6fc57404cf26b094465517806ed5ae'
                             , resource: viewResourceId
                             , onmessage: function (msgString) {
                                 console.log("msg: " + msgString);
                                 var msg = JSON.parse(msgString).message;
                                 if (msg.payload.msg_type === "announce_player") {
                                     console.log("adding: " + msg.from.resource);
                                     var player = new Player(msg.from.resource);
                                     players["" + msg.from.resource] = player
                                     board.addPlayer(player);
                                 } else if (msg.payload.msg_type === "move") {
                                     board.movePlayer(players["" + msg.from.resource]);
                                 } else if (msg.payload.msg_type === "kill") {
                                     console.log("kill from: " + msg.from.resource);
                                     handleKill(players["" + msg.from.resource]);
                                 }
                                 redraw();
                             }
                             , onpresence: function (presString) {
                                 console.log("pres: " + presString);

                                 var pres = JSON.parse(presString);
                                 if (pres.presence.from.resource !== viewResourceId) {
                                     if (pres.presence.type === "unavailable") {
                                         if (players["" + pres.presence.from.resource]) {
                                             console.log("removing: " + pres.presence.from.resource);
                                             board.removePlayer(players["" + pres.presence.from.resource]);
                                             delete players["" + pres.presence.from.resource];
                                         } else {
                                             console.log("hm ... it wasn't in the list");
                                         }
                                     }
                                 }
                                 redraw();
                             }
                             , onconnect: function (conn) {
                             }
                             , onerror: function (err) {
                             }
                           });
         }
     };

     connection.connect();
})(window);

