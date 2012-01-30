Ext.define('Kitchensink.view.touchevent.Pad', {
    extend: 'Ext.Container',
    xtype: 'toucheventpad',
    id: 'touchpad',
    
    config: {
        flex: 1,
        margin: 10,
        
        layout: {
            type: 'vbox',
            pack: 'center',
            align: 'stretch'
        },
        
        items: [
            {
                html: 'swipe to move'
            }
        ]
    }
});

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
                }
                , onerror: function (err) {
                }
              });


var sendMove = function(move) {
    SWARM.send({msg_type: "2dmove", move:move});
}

var moveTouchStart = null;

Ext.define('Kitchensink.view.TouchEvents', {
    extend: 'Ext.Container',

    initialize: function() {
        this.callParent(arguments);

        this.getEventDispatcher().addListener('element', '#touchpad', '*', this.onTouchPadEvent, this);
    },
    
    onTouchPadEvent: function(a, b, c, d) {
        var name = d.info.eventName;

        if (!name.match("mouse") && !name.match("click")) {
            console.log("" + a.type + " (" + a.pageX + ", " + a.pageY + ")");
            if (a.type === "touchstart" && moveTouchStart == null) {
                moveTouchStart = {x: a.pageX, y: a.pageY};
            } else if (a.type === "touchend" && moveTouchStart) {
                console.log("move from (" + moveTouchStart.x + "," + moveTouchStart.x + ") to (" + a.pageX + "," + a.pageY + ")");
                var touchVector = {x: moveTouchStart.x - a.pageX, y: moveTouchStart.y - a.pageY};
                sendMove(touchVector);
                moveTouchStart = null;
            }
        }
    }
});

Ext.define('Kitchensink.view.tablet.TouchEvents', {
    extend: 'Kitchensink.view.TouchEvents',
    xtype: 'touchevents',
    
    config: {
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        
        items: [
            {
                xtype: 'toucheventpad',
                flex: 1
            }
        ]
    }
});

Ext.application({
    name: 'Kitchensink',
    launch: function() {
        Ext.create("Kitchensink.view.tablet.TouchEvents", {
            fullscreen: true
        });
    }
});

