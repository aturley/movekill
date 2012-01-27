# MoveKill

MoveKill is a COD clone. It lets you play against other people by
moving and killing.

It uses BUGswarm for communicating between controllers and the
view/model. Controllers and the view/model are just html pages with
some Javascript.

The first time a controller page is loaded, it connect to an "admin"
swarm using a known resource id and sends a large random number. An
admin server then creates a swarm resource for the controller, adds
the controller to the game swarm as a producer, and sends a message to
the swarm with the same large random number and the new resource
id. The controller stores the resource id and then uses it to connect
to the "game" swarm.

Admin swarm id: 

Game swarm id: 53da4a421f6fc57404cf26b094465517806ed5ae

View/Modle resource id: 23b544144bd3a8c31af53fad804ccff066835bb0

Resource 1: 1ff1e0e8956555406f0268a15a58e510bb6006cd

Resource 2: 0fe184a9589fc04d293a13df4f4ddfbdc131005d


