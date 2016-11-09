var ReactDOM=require('react-dom');

var ModalTrigger=React.createClass({
    _modalWrapper:null,
    _modalInstance:null,
    propTypes: {
        modal: React.PropTypes.element.isRequired,
        show: React.PropTypes.bool
    },
    getInitialState:function(){
        return {
            isModalActive: false
        }
    },
    componentDidMount: function() {
        this._mountModalWrapper();

        if (this.props.show) {
            this.open();
        }
    },
    componentWillReceiveProps: function(nextProps) {
        if(nextProps.show !== this.props.show){
            if (nextProps.show) {
                this.open();
            }else{
                this.close();
            }
        }
    },
    componentDidUpdate:function(){
        this.renderModal();
    },
    // Remove Modal related DOM node
    componentWillUnmount: function() {
        this._unmountModal();

        if (this._modalWrapper) {
            document.body.removeChild(this._modalWrapper);
            this._modalWrapper = null;
        }
    },
    /**
     * Create Modal wrapper
     * @private
     */
    _mountModalWrapper: function() {
        this._modalWrapper = document.createElement('div');
        document.body.appendChild(this._modalWrapper);
    },
    // Remove a mounted Modal from wrapper
    _unmountModal: function _unmountModal() {
        ReactDOM.unmountComponentAtNode(this._modalWrapper);
        this._modalInstance = null;
    },
    /**
     * 显示modal
     * 大致对应Modal的componentDidMount
     */
    open:function(){
        this.setState({
            isModalActive: true
        });
    },
    /**
     * 隐藏modal
     * 大致对应Modal的componentWillUnmount
     */
    close:function(){
        //马上要退场时触发相应函数
        this.props.modal.props.onRequestClose();

        //等退场动画执行完后再关闭
        setTimeout(function(){
            this.setState({
                isModalActive: false
            });
        }.bind(this), 200);
    },
    getModal: function() {
        return React.cloneElement(this.props.modal, {onRequestClose:this.close})
    },
    renderModal:function(){
        //if (!this.isMounted()) {
        //    return;
        //}

        if (this.state.isModalActive) {
            //显示modal
            var modal = this.getModal();
            this._modalInstance = ReactDOM.render(modal, this._modalWrapper);
        } else {
            //移除modal
            this._unmountModal();
        }
    },
    toggle:function(){
        if (this.state.isModalActive) {
            this.close();
        } else {
            this.open();
        }
    },
    render:function(){
        var props={
            onClick:this.toggle
        };
        return React.cloneElement(React.Children.only(this.props.children), props);
    }
});

module.exports=ModalTrigger;