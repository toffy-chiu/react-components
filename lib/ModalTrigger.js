'use strict';

var ReactDOM = require('react-dom');

var ModalTrigger = React.createClass({
    displayName: 'ModalTrigger',

    _modalWrapper: null,
    _modalInstance: null,
    propTypes: {
        modal: React.PropTypes.element.isRequired
    },
    componentDidMount: function componentDidMount() {
        this.mountModalWrapper();
    },
    componentDidUpdate: function componentDidUpdate() {
        //每次更新都要重新renderModal，这样Modal里面的children才会实时跟着变
        //重新render要的就是调用Modal里面的componentWillReceiveProps
        if (this._modalInstance) {
            this.renderModal();
        }
    },
    /**
     * 移除相关组件
     */
    componentWillUnmount: function componentWillUnmount() {
        this.removeModal();

        if (this._modalWrapper) {
            document.body.removeChild(this._modalWrapper);
            this._modalWrapper = null;
        }
    },
    /**
     * Create Modal wrapper
     * @private
     */
    mountModalWrapper: function mountModalWrapper() {
        this._modalWrapper = document.createElement('div');
        document.body.appendChild(this._modalWrapper);
    },
    getModal: function getModal() {
        return React.cloneElement(this.props.modal, { onRequestClose: this.close });
    },
    renderModal: function renderModal() {
        //显示modal
        var modal = this.getModal();
        this._modalInstance = ReactDOM.render(modal, this._modalWrapper);
    },
    // Remove a mounted Modal from wrapper
    removeModal: function removeModal() {
        this._modalInstance = null;
        ReactDOM.unmountComponentAtNode(this._modalWrapper);
    },
    /**
     * 显示modal
     * 大致对应Modal的componentDidMount
     */
    open: function open() {
        this.renderModal();
    },
    /**
     * 隐藏modal
     * 大致对应Modal的componentWillUnmount
     */
    close: function close() {
        //通知Modal关闭操作
        this._modalInstance.handleClose();

        //等退场动画执行完后再关闭
        setTimeout(function () {
            //移除modal
            this.removeModal();
        }.bind(this), 200);
    },
    render: function render() {
        var props = {
            onClick: this.open
        };
        return React.cloneElement(React.Children.only(this.props.children), props);
    }
});

module.exports = ModalTrigger;