(function (ctx) {
     var connection = {
         connected : false,
         resourceId : null,
         adminConnect : function () {
             var bigNumber = "" + Math.floor(Math.random() * 1000000);
             SWARM.connect({ apikey: '49819bbcc8a3543d1daa5899bd40d1cb230524ff'
                             , swarms: '481a0bd24754be82f4768df7ef2028995038fdde'
                             , resource: 'ce478a6f9d41736c32aac4b1d3d1da907892f9d8'
                             , onmessage: function (msgString) {
                                 console.log("msg: " + msgString);
                                 var msg = JSON.parse(msgString).message;
                                 if ((msg.payload.bigNumber == bigNumber) && msg.payload.resourceId) {
                                     console.log("got resource id:" + msg.payload.resourceId);
                                     SWARM.disconnect();
                                     connection.gameConnect(msg.payload.resourceId);
                                 } else {
                                     console.log("did not get resource id");
                                 }
                             }
                             , onpresence: function (pres) {
                                 console.log("presence: " + pres);
                             }
                             , onconnect: function (conn) {
                                 SWARM.send({bigNumber : bigNumber, "type" : "resource_request"});
                             }
                             , onerror: function (err) {
                             }
                           });
         },
         gameConnect : function (resourceId) {
             if (!this.connected) {
                 var self = this;
                 console.log("connecting");
                 SWARM.connect({ apikey: '49819bbcc8a3543d1daa5899bd40d1cb230524ff'
                                 , swarms: '53da4a421f6fc57404cf26b094465517806ed5ae'
                                 , resource: resourceId
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

             } else {
                 console.log("already connected");
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
         connection.adminConnect();
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

