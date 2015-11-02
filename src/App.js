var React = require('react');
var DragDropContext = require('react-dnd').DragDropContext;
var HTML5Backend = require('react-dnd/modules/backends/HTML5');
var RoomList = require('./RoomList');

var App = React.createClass({
    displayName: 'App',

    getInitialState: function() {
        var rooms = [[
            { name: "alpha",   id: 1 },
            { name: "beta",    id: 2 },
            { name: "gamma",   id: 3 },
            { name: "delta",   id: 4 },
            { name: "epsilon", id: 5 },
           ],[
            { name: "zeta",    id: 6 },
            { name: "eta",     id: 7 },
            { name: "theta",   id: 8 },
            { name: "iota",    id: 9 },
            { name: "kappa",   id: 10 },
           ],[
            { name: "lambda",  id: 11 },
            { name: "mu",      id: 12 },
            { name: "nu",      id: 13 },
            { name: "xi",      id: 14 },
            { name: "omicron", id: 15 },
           ]];
        return { rooms: rooms };
    },
    
    render: function () {
        return (
            <div>
                <h3>Favourites</h3>
                <RoomList order="manual" initialRooms={ this.state.rooms[0] } />
                <h3>Recent</h3>
                <RoomList order="recent" initialRooms={ this.state.rooms[1] }/>
                <h3>Archive</h3>
                <RoomList order="recent" initialRooms={ this.state.rooms[2] }/>
            </div>
        );
    },
});

module.exports = DragDropContext(HTML5Backend)(App);