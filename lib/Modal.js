'use strict';

var hasClass = require('tf-utils/dom/hasClass');
var addClass = require('tf-utils/dom/addClass');
var removeClass = require('tf-utils/dom/removeClass');
var css = require('tf-utils/dom/css');
var objectAssign = require('tf-utils/lib/objectAssign');

//此处作为公共变量，每多一个modal则z-index+100；每个modal中的z-index关系为：modal=dimmer+10，即modal总在dimmer上面
var zIndex = 1100;
var Modal = React.createClass({
    displayName: 'Modal',

    //标示是否已经背景模糊，否则不设置模糊
    alreadyBlur: false,
    propTypes: {
        title: React.PropTypes.string,
        onShow: React.PropTypes.func,
        onShown: React.PropTypes.func,
        onClose: React.PropTypes.func,
        onClosed: React.PropTypes.func,
        onRequestClose: React.PropTypes.func
    },
    componentDidMount: function componentDidMount() {
        zIndex += 100;

        //设置背景模糊
        if (hasClass(document.getElementById('container'), 'filter-blur')) {
            this.alreadyBlur = true;
        } else {
            addClass(document.getElementById('container'), 'filter-blur');

            //隐藏滚动条
            css(document.querySelector('html'), 'overflow', 'hidden');
        }

        //进场动画执行200ms后触发相应函数
        setTimeout(this.handleShown, 200);

        //等modal插入到DOM后再触发onShow
        if (this.props.onShow) {
            this.props.onShow();
        }
    },
    componentWillUnmount: function componentWillUnmount() {
        zIndex -= 100;

        if (!this.alreadyBlur) {
            removeClass(document.getElementById('container'), 'filter-blur');

            css(document.querySelector('html'), 'overflow', '');
        }

        //若有监听关闭的则触发
        if (this.props.onClosed) {
            this.props.onClosed();
        }
    },
    /**
     * 已显示完时
     */
    handleShown: function handleShown() {
        //为退场动画做准备
        removeClass(this.refs.modal, 'am-animation-scale-down');
        addClass(this.refs.modal, 'am-animation-reverse');

        //若有监听显示的则触发
        this.props.onShown && this.props.onShown();
    },
    /**
     * 刚关闭时
     */
    handleClose: function handleClose() {
        //开始退场动画
        addClass(this.refs.modal, 'am-animation-scale-down');

        //若有监听关闭的则触发
        this.props.onClose && this.props.onClose();
    },
    render: function render() {
        var style = objectAssign({}, this.props.style, {
            display: 'block',
            top: 60,
            zIndex: zIndex + 10,
            'WebkitAnimationDuration': '.2s',
            'animationDuration': '.2s',
            'WebkitAnimationTimingFunction': 'ease',
            'animationTimingFunction': 'ease'
        });
        return React.createElement(
            'div',
            null,
            React.createElement('div', { className: 'am-dimmer am-active', style: { display: 'block', backgroundColor: 'rgba(0,0,0,0.2)', zIndex: zIndex } }),
            React.createElement(
                'div',
                { ref: 'modal', className: 'am-modal am-modal-active am-animation-scale-down', style: style },
                React.createElement(
                    'div',
                    { className: 'am-modal-dialog' },
                    this.props.title ? React.createElement(
                        'div',
                        { className: 'am-modal-hd' },
                        React.createElement(
                            'h4',
                            { className: 'am-margin-bottom-sm' },
                            this.props.title
                        ),
                        React.createElement(
                            'button',
                            { className: 'am-close am-close-spin', onClick: this.props.onRequestClose },
                            '\xD7'
                        )
                    ) : null,
                    this.props.children
                )
            )
        );
    }
});

module.exports = Modal;