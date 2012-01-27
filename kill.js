(function (ctx) {
     var connection = {
         connected : false,
         connect: function () {
             if (!this.connected) {
                 var self = this;
                 SWARM.connect({ apikey: '49819bbcc8a3543d1daa5899bd40d1cb230524ff'
                                 , swarms: '53da4a421f6fc57404cf26b094465517806ed5ae'
                                 , resource: document.getElementById('nickname').value
                                 , onmessage: function (msg) {
                                     console.log("msg: " + msg);
                                 }
                                 , onpresence: function (pres) {
                                     console.log("presence: " + pres);
                                 }
                                 , onconnect: function (conn) {
                                     self.connected = true;
                                     self.announce();
                                 }
                                 , onerror: function (err) {
                                 }
                               });

             }
         },
         kill: function() {
             SWARM.send({msg_type: "kill"});
         },
         move: function() {
             SWARM.send({msg_type: "move"});
         },
         announce: function() {
             SWARM.send({msg_type: "announce_player"});
         }
     };

     ctx.do_connect = function() {
         connection.connect();
         console.log("connect");
     };

     ctx.do_kill = function() {
         connection.kill();
         console.log("kill");
     };

     ctx.do_move = function() {
         connection.move();
         console.log("move");
     };
})(window);

