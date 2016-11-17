var React=require('react');

var Sortable=React.createClass({
    draggingElement:null,
    draggingIndex:-1,
    propTypes:{
        children:React.PropTypes.element.isRequired
    },
    getInitialState:function(){
        return {
        }
    },
    handleDragStart:function(e){
        e.stopImmediatePropagation();

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text', '');

        this.draggingElement=e.currentTarget;
        this.draggingIndex=getElementIndex(this.draggingElement);
        console.log(this.draggingIndex);
    },
    handleDragEnd:function(e){
        if(!this.draggingElement){
            return;
        }

        this.draggingElement=null;
    },
    render: function() {
        var parent=React.Children.only(this.props.children);
        return React.cloneElement(parent, {}, React.Children.map(parent.props.children, function(child, i){
            return React.createElement('div', {
                draggable:true,
                onDragStart:this.handleDragStart,
                onDragEnd:this.handleDragEnd
            }, child)
        }));
        //return (
        //    <div>
        //        {
        //            React.Children.map(this.props.children, function(child, i){
        //                return React.cloneElement(child, {
        //                    onDragStart:this.handleDragStart,
        //                    onDragEnd:this.handleDragEnd
        //                })
        //            }.bind(this))
        //        }
        //    </div>
        //);
    }
});

/**
 * 获取当前元素在兄弟节点中的索引
 * @param element
 * @returns {number}
 */
function getElementIndex(element){
    var index=-1;
    var sibling=element.previousSibling;
    while (sibling){
        index++;
        sibling=sibling.previousSibling;
    }
    return index;
}

module.exports = Sortable;