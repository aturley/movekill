window.onload = function() {
    (function (ctx) {
         SWARM.connect({ apikey: '49819bbcc8a3543d1daa5899bd40d1cb230524ff'
                         , swarms: '53da4a421f6fc57404cf26b094465517806ed5ae'
                         , resource: '0fe184a9589fc04d293a13df4f4ddfbdc131005d'
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

         var TouchPad = function(parent) {
             this.parent = parent;
             this.toucShtarted = false;
             this.touchEnd = null;
         };

         TouchPad.prototype.touchStart = function(evt) {
             if (!this.touchStarted) {
                 this.touchStarted = true;
                 this.touchEnd = this.touchEndFactory(evt.touches[0].pageX, evt.touches[0].pageY);
             }
         };

         TouchPad.prototype.touchEndFactory = function(x, y) {
             return function(evt) {
                 if (this.touchStarted) {
                     this.touchStarted = false;
                     console.log("touchEnd");
                     console.log("from (" + x + "," + y + ") to (" + evt.changedTouches[0].pageX + "," + evt.changedTouches[0].pageY + ")");
                     this.parent.swipe({x1: x, y1: y, x2: evt.changedTouches[0].pageX, y2: evt.changedTouches[0].pageY});
                 }
             };
         };

         TouchPad.prototype.getTouchStartHandler = function() {
             var that = this;
             return function(evt) {
                 evt.preventDefault();
                 that.touchStart(evt);
             };
         };

         TouchPad.prototype.getTouchEndHandler = function() {
             var that = this;
             return function(evt) {
                 evt.preventDefault();
                 that.touchEnd(evt);
             };
         };

         var moveSwipe = {
             swipe: function(data) {
                 SWARM.send({msg_type:"move_swipe", swipe: data});
             }
         };

         var killSwipe = {
             swipe: function(data) {
                 SWARM.send({msg_type:"kill_swipe", swipe: data});
             }
         };

         var movePad = new TouchPad(moveSwipe);
         var killPad = new TouchPad(killSwipe);

         document.getElementById("movepad").addEventListener("touchstart", movePad.getTouchStartHandler(), false);
         document.getElementById("movepad").addEventListener("touchend", movePad.getTouchEndHandler(), false);

         document.getElementById("killpad").addEventListener("touchstart", killPad.getTouchStartHandler(), false);
         document.getElementById("killpad").addEventListener("touchend", killPad.getTouchEndHandler(), false);

     })(window);
};