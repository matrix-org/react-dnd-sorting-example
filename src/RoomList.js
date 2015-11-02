var React = require('react');
var DropTarget = require('react-dnd').DropTarget;
var RoomTile = require('./RoomTile');

var roomListTarget = {
    drop: function() {
    }
};

var RoomList = React.createClass({
    displayName: 'RoomList',

    getInitialState: function() {
        return ({
            rooms: this.props.initialRooms,
        });
    },

    moveRoomTile: function(room, atIndex) {
        console.log("moveRoomTile: id " + room.id + ", atIndex " + atIndex);
        console.log("moveRoomTile before: " + JSON.stringify(this.state.rooms));
        var found = this.findRoomTile(room);
        var rooms = this.state.rooms;
        if (found.room) {
            console.log("removing at index " + found.index + " and adding at index " + atIndex);
            rooms.splice(found.index, 1);
            rooms.splice(atIndex, 0, found.room);
        }
        else {
            console.log("Adding at index " + atIndex);
            rooms.splice(atIndex, 0, room);
        }
        this.setState({rooms: rooms});
        console.log("moveRoomTile after: " + JSON.stringify(this.state.rooms));
    },

    // XXX: this isn't invoked via a property method but indirectly via
    // the roomList property method.  Unsure how evil this is.
    removeRoomTile: function(room) {
        console.log("remove room " + room.id);
        var found = this.findRoomTile(room);
        var rooms = this.state.rooms;
        if (found.room) {
            rooms.splice(found.index, 1);
        }        
        else {
            console.log*("Can't remove room " + room.id + " - can't find it");
        }
        this.setState({rooms: rooms});
    },

    findRoomTile: function(room) {        
        var index = this.state.rooms.indexOf(room); 
        if (index >= 0) {
            console.log("found: room: " + room + " with id " + room.id);
        }
        else {
            console.log("didn't find room");
            room = null;
        }
        return ({
            room: room,
            index: index,
        });
    },

    render: function () {
        var connectDropTarget = this.props.connectDropTarget;
        var self = this;
        console.log("render: " + JSON.stringify(this.state.rooms));
        // how evil is it to pass self in as a property here?
        return connectDropTarget(
            <div style={{ 'display': 'inline-block', 'width': '300px', 'backgroundColor': '#aaa' }}>
                { this.state.rooms.map(function(room) {
                    return <RoomTile key={ room.id }
                                     room={ room }
                                     roomList={ self }
                                     moveRoomTile={ self.moveRoomTile }
                                     findRoomTile={ self.findRoomTile }/>
                  })
                }
            </div>
        );
    },
});

// Export the wrapped version, inlining the 'collect' functions
// to more closely resemble the ES7
module.exports = 
DropTarget('RoomTile', roomListTarget, function(connect) {
    return {
        connectDropTarget: connect.dropTarget(),
    }
})(RoomList);
