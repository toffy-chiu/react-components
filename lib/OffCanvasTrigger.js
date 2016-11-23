var ReactDOM=require('react-dom');

var OffCanvasTrigger=React.createClass({
    _wrapper:null,
    _instance:null,
    propTypes: {
        offCanvas: React.PropTypes.element.isRequired
    },
    componentDidMount: function() {
        this.mountWrapper();
    },
    componentDidUpdate:function(){
        //每次更新都要重新renderOffCanvas，这样OffCanvas里面的children才会实时跟着变
        //重新render要的就是调用Modal里面的componentWillReceiveProps
        if(this._instance){
            this.renderOffCanvas();
        }
    },
    /**
     * 移除相关组件
     */
    componentWillUnmount: function() {
        this.removeOffCanvas();

        if (this._wrapper) {
            document.body.removeChild(this._wrapper);
            this._wrapper = null;
        }
    },
    /**
     * Create Modal wrapper
     * @private
     */
    mountWrapper: function() {
        this._wrapper = document.createElement('div');
        document.body.appendChild(this._wrapper);
    },
    getOffCanvas: function() {
        return React.cloneElement(this.props.offCanvas, {onRequestClose:this.close})
    },
    renderOffCanvas:function(){
        //显示modal
        var offCanvas = this.getOffCanvas();
        this._instance = ReactDOM.render(offCanvas, this._wrapper);
    },
    // Remove a mounted Modal from wrapper
    removeOffCanvas: function removeOffCanvas() {
        this._instance = null;
        ReactDOM.unmountComponentAtNode(this._wrapper);
    },
    /**
     * 显示modal
     * 大致对应Modal的componentDidMount
     */
    open:function(){
        this.renderOffCanvas();
    },
    /**
     * 隐藏modal
     * 大致对应Modal的componentWillUnmount
     */
    close:function(){
        //通知Modal关闭操作
        this._instance.handleClose();

        //等退场动画执行完后再关闭
        setTimeout(function(){
            //移除modal
            this.removeOffCanvas();
        }.bind(this), 300);
    },
    render:function(){
        var props={
            onClick:this.open
        };
        return React.cloneElement(React.Children.only(this.props.children), props);
    }
});

module.exports=OffCanvasTrigger;