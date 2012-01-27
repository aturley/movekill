(function (ctx) {
     // lifted from http://www.html5rocks.com/en/tutorials/cors/
     function createCORSRequest(method, url) {
         var xhr = new XMLHttpRequest();
         if ("withCredentials" in xhr) {

             // Check if the XMLHttpRequest object has a "withCredentials" property.
             // "withCredentials" only exists on XMLHTTPRequest2 objects.
             xhr.open(method, url, true);
         } else if (typeof XDomainRequest != "undefined") {

             // Otherwise, check if XDomainRequest.
             // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
             xhr = new XDomainRequest();
             xhr.open(method, url);

         } else {

             // Otherwise, CORS is not supported by the browser.
             xhr = null;

         }
         return xhr;
     };

     var generateAndSendResourceId = function(bigNumber) {
         console.log("creating CORS request");
         var xhr = createCORSRequest("POST", "http://api.bugswarm.net/resources");
         console.log("created CORS request");
         var resourceData = "{ \"name\": \"controller" + bigNumber + "\", \"machine_type\": \"pc\" }";
         if (xhr) {
             console.log("setting request header");
             console.log("configuration API key: " + ctx.serverSecrets.configurationAPIKey);
             xhr.setRequestHeader("x-bugswarmapikey", ctx.serverSecrets.configurationAPIKey);
             // xhr.setRequestHeader("content-type", "application/json");
             console.log("set request header");
             xhr.onload = function() {
                 console.log("start onload");
                 var responseText = xhr.responseText;
                 console.log("creation response: " + xhr.responseTxt);
                 var response = JSON.parse(responseText);
                 if (response.id) {
                     SWARM.send({"bigNumber": bigNumber, "resourceId": response.id});
                 }
                 console.log("end onload");
             };
             console.log("sending request");
             xhr.send(resourceData);
             console.log("sent request");
         } else {
             console.log("This browser doesn't support CORS");
         }
     };

     var resourcePool = {
         resources: ["1ff1e0e8956555406f0268a15a58e510bb6006cd",
                     "0fe184a9589fc04d293a13df4f4ddfbdc131005d"
                    ],
         resourcesLookup: {"1ff1e0e8956555406f0268a15a58e510bb6006cd": true,
                           "0fe184a9589fc04d293a13df4f4ddfbdc131005d": true
         },
         allocate: function () {
             var resource = this.resources.pop() || null;
             if (resource) {
                 this.resourcesLookup[resource] = false;
             }
             return resource;
         },
         deallocate: function(resourceId) {
             if (this.resourcesLookup[resourceId] !== undefined && this.resourcesLookup[resourceId] == false) {
                 this.resourcesLookup[resourceId] = true;
                 this.resources.push(resourceId);
             }
         }
     };

     console.log("connecting to swarm");
     SWARM.connect({ apikey: '49819bbcc8a3543d1daa5899bd40d1cb230524ff'
                     , swarms: '481a0bd24754be82f4768df7ef2028995038fdde'
                     , resource: '960135599cdff943247bffa5ba07d6df638c97f3'
                     , onmessage: function (msgString) {
                         console.log("msg: " + msgString);
                         var msg = JSON.parse(msgString).message;
                         if (msg.payload.type === "resource_request" && msg.payload.bigNumber) {
                             var bigNumber = msg.payload.bigNumber;
                             // generateAndSendResourceId(msg.bigNumber);
                             
                             SWARM.send({bigNumber : bigNumber, resourceId : resourcePool.allocate()});
                         }
                     }
                     , onpresence: function (presString) {
                         var pres = JSON.parse(presString).presence;
                         if (pres.type && pres.type === "unavailable") {
                             if (pres.from.swarm === undefined) {
                                 resourcePool.deallocate(pres.from.resource);
                             }
                         }
                     }
                     , onconnect: function (conn) {
                         console.log("conn: " + conn);
                     }
                     , onerror: function (err) {
                     }
                   });
     ctx.genRes = function (bigNumber) { generateAndSendResourceId(bigNumber); };
})(window);

