var React = require('react');
var DragSource = require('react-dnd').DragSource;
var DropTarget = require('react-dnd').DropTarget;
var PropTypes = React.PropTypes;

/**
 * Specifies the drag source contract.
 * Only `beginDrag` function is required.
 */
var roomTileSource = {
    beginDrag: function (props) {
        // Return the data describing the dragged item
        var item = {
            room: props.room,
            originalList: props.roomList,            
            originalIndex: props.findRoomTile(props.room).index,
            targetList: props.roomList, // at first target is same as original
        };
        return item;
    },

    endDrag: function (props, monitor, component) {
        var item = monitor.getItem();
        var dropResult = monitor.getDropResult();

        console.log("roomTile endDrag for " + item.room.id);

        if (!monitor.didDrop()) {
            props.moveRoomTile(item.room, item.originalIndex);
            if (item.targetList !== item.originalList) {
                item.targetList.removeRoomTile(item.room);
            }
            return;
        }
        else {
            if (item.targetList.props.order !== 'manual') {
                // for now, just append
                // XXX: is it naughty to refer to RoomList's state from here?
                item.targetList.moveRoomTile(item.room, item.targetList.state.rooms.length);
            }
        }

        // When dropped on a compatible target, do something
        // persistNewOrder(item.room, dropResult.listId);
    }
};

var roomTileTarget = {
    canDrop: function() {
        return false;
    },

    hover: function(props, monitor) {
        var item = monitor.getItem();
        //console.log("hovering on room " + props.room.id + ", isOver=" + monitor.isOver());

        console.log("item.targetList=" + item.targetList + ", roomList=" + props.roomList);
        if (item.targetList !== props.roomList) {
            item.targetList.removeRoomTile(item.room);
            item.targetList = props.roomList;
        }

        if (item.targetList.props.order === 'manual' && item.room.id !== props.room.id) {
            var roomTile = props.findRoomTile(props.room);
            props.moveRoomTile(item.room, roomTile.index);
        }
    },

    drop: function(props, monitor, component) {
        return monitor.getItem();
    },
};

var RoomTile = React.createClass({
    propTypes: {
        connectDragSource: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired,
        room: PropTypes.object.isRequired,
        roomList: PropTypes.object.isRequired,
        moveRoomTile: PropTypes.func.isRequired,
        findRoomTile: PropTypes.func.isRequired,
    },

    render: function () {
        // These two props are injected by React DnD,
        // as defined by your `collect` function above:
        var isDragging = this.props.isDragging;
        var connectDragSource = this.props.connectDragSource;
        var connectDropTarget = this.props.connectDropTarget;

        return connectDragSource(connectDropTarget(
            <div>
                Room { this.props.room.name } id { this.props.room.id }
            </div>
        ));
    }
});

// Export the wrapped version, inlining the 'collect' functions
// to more closely resemble the ES7
module.exports = 
DropTarget('RoomTile', roomTileTarget, function(connect) {
    return {
        // Call this function inside render()
        // to let React DnD handle the drag events:
        connectDropTarget: connect.dropTarget(),
    }
})(
DragSource('RoomTile', roomTileSource, function(connect, monitor) {
    return {
        // Call this function inside render()
        // to let React DnD handle the drag events:
        connectDragSource: connect.dragSource(),
        // You can ask the monitor about the current drag state:
        isDragging: monitor.isDragging()
    };
})(RoomTile));