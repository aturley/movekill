(function (ctx) {
     var ticker = {
         tickList: [],
         lastTime: new Date().getTime(),
         running: false,
         addHandler: function(handler) {
             ticker.tickList.push(handler);
         },
         tick: function() {
             if (ticker.running) {
                 var currentTime = new Date().getTime();
                 setTimeout(ticker.tick, ticker.interval);
                 var elapsedTime = (currentTime - ticker.lastTime);
                 ticker.lastTime = currentTime;

                 for (var x = 0; x < ticker.tickList.length; x++) {
                     ticker.tickList[x].tick(elapsedTime);
                 }
             }
         },
         start: function(interval) {
             ticker.interval = interval;
             if (ticker.running === false) {
                 ticker.running = true;
                 setTimeout(ticker.tick, ticker.interval);
             }
         },
         stop: function() {
             ticker.running = false;
         }
     };

     var onlybullet = {
         x: -5,
         y: -5,
         currentVelocityX: 0,
         currentVelocityY: 0,
         normalizeMove: function(move) {
             var magnitude = Math.sqrt(Math.pow(move.x, 2) + Math.pow(move.y, 2));
             if (magnitude === 0) {
                 return {x: 0, y:0};
             }
             return {x: move.x / magnitude, y: move.y / magnitude};
         },
         setVelocity: function(move) {
             console.log("setVelocity: " + move.x + "," + move.y);
             onlybullet.x = onlyone.x + 5;
             onlybullet.y = onlyone.y + 5;
             var normalizedMove = this.normalizeMove(move);
             onlybullet.currentVelocityX = normalizedMove.x * 200 / 1000;
             onlybullet.currentVelocityY = normalizedMove.y * 200 / 1000;
         },
         tick:function(elapsed) {
             // console.log("moving at " + elapsed);
             // console.log("current velocity: (" + onlyone.currentVelocityX + "," + onlyone.currentVelocityY + ")");

             var element = document.getElementById("onlybullet");

             onlybullet.x += (onlybullet.currentVelocityX * elapsed);
             onlybullet.y += (onlybullet.currentVelocityY * elapsed);

             element.style.top = "" + onlybullet.y + "px";
             element.style.left = "" + onlybullet.x + "px";
         }
     };

     var onlyone = {
         x: 0,
         y: 0,
         // currentVelocityX: 20 / 1000, // px / s
         // currentVelocityY: 20 / 1000, // px / s
         currentVelocityX: 0,
         currentVelocityY: 0,
         normalizeMove: function(move) {
             var magnitude = Math.sqrt(Math.pow(move.x, 2) + Math.pow(move.y, 2));
             if (magnitude === 0) {
                 return {x: 0, y:0};
             }
             return {x: move.x / magnitude, y: move.y / magnitude};
         },
         setVelocity: function(move) {
             console.log("setVelocity: " + move.x + "," + move.y);
             var normalizedMove = this.normalizeMove(move);
             onlyone.currentVelocityX = normalizedMove.x * 100 / 1000;
             onlyone.currentVelocityY = normalizedMove.y * 100 / 1000;
         },
         tick:function(elapsed) {
             // console.log("moving at " + elapsed);
             // console.log("current velocity: (" + onlyone.currentVelocityX + "," + onlyone.currentVelocityY + ")");

             var element = document.getElementById("onlyone");
             if (onlyone.x > (1000 - 20)) {
                 onlyone.currentVelocityX = 0;
                 onlyone.currentVelocityY = 0;
                 onlyone.x = 1000 - 20;
             } else if (onlyone.x < 0) {
                 onlyone.currentVelocityX = 0;
                 onlyone.currentVelocityY = 0;
                 onlyone.x = 0;
             } else {
                 onlyone.x += (onlyone.currentVelocityX * elapsed);
             }

             if (onlyone.y > (600 - 20)) {
                 onlyone.currentVelocityX = 0;
                 onlyone.currentVelocityY = 0;
                 onlyone.y = 600 - 20;
             } else if (onlyone.y < 0) {
                 onlyone.currentVelocityX = 0;
                 onlyone.currentVelocityY = 0;
                 onlyone.y = 0;
             } else {
                 onlyone.y += (onlyone.currentVelocityY * elapsed);
             }

             element.style.top = "" + onlyone.y + "px";
             element.style.left = "" + onlyone.x + "px";
         }
     };

     ticker.addHandler(onlyone);
     ticker.addHandler(onlybullet);

     ticker.start(16);

     var Player = function(id) {
         this.id = id;
         this.location = 0;
         this.kills = 0;
         this.deaths = 0;
         this.onTopOfMe = null;
         this.underMe = null;
     };

     var handleMoveSwipe = function(player, moveSwipe) {
         console.log("handleMoveSwipe");

         onlyone.setVelocity({x: moveSwipe.x2 - moveSwipe.x1, y: moveSwipe.y2 - moveSwipe.y1});
     };

     var handleKillSwipe = function(player, moveSwipe) {
         console.log("handleMoveSwipe");

         onlybullet.setVelocity({x: moveSwipe.x2 - moveSwipe.x1, y: moveSwipe.y2 - moveSwipe.y1});
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
                                 } else if (msg.payload.msg_type === "move_swipe") {
                                     handleMoveSwipe(players["" + msg.from.resource], msg.payload.swipe);
                                 } else if (msg.payload.msg_type === "kill_swipe") {
                                     handleKillSwipe(players["" + msg.from.resource], msg.payload.swipe);
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

