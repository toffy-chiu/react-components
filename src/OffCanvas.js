var addClass=require('tf-utils/dom/addClass');
var removeClass=require('tf-utils/dom/removeClass');

//此处作为公共变量，每多一个modal则z-index+100；每个modal中的z-index关系为：modal=dimmer+10，即modal总在dimmer上面
//var zIndex=1100;
var OffCanvas=React.createClass({
    //标示是否已经背景模糊，否则不设置模糊
    alreadyBlur:false,
    propTypes: {
        //footer: React.PropTypes.bool,
        onShow: React.PropTypes.func,
        onShown: React.PropTypes.func,
        onClose: React.PropTypes.func,
        onClosed: React.PropTypes.func,
        onRequestClose: React.PropTypes.func
    },
    componentDidMount:function(){
        //zIndex+=100;

        //触发相应函数
        this.handleShown();

        //等modal插入到DOM后再触发onShow
        if (this.props.onShow) {
            this.props.onShow();
        }
    },
    componentWillUnmount:function(){
        //zIndex-=100;

        //若有监听关闭的则触发
        if (this.props.onClosed) {
            this.props.onClosed();
        }
    },
    /**
     * 已显示完时
     */
    handleShown:function(){
        var offCanvas=this.refs.offCanvas;
        //为退场动画做准备
        addClass(offCanvas, 'am-active');
        setTimeout(function(){
            addClass(offCanvas.querySelector('.am-offcanvas-bar'), 'am-offcanvas-bar-active');
        }, 0);

        //若有监听显示的则触发
        this.props.onShown&&this.props.onShown();
    },
    /**
     * 刚关闭时
     */
    handleClose:function(){
        //开始退场动画
        removeClass(this.refs.offCanvas.querySelector('.am-offcanvas-bar'), 'am-offcanvas-bar-active');

        //若有监听关闭的则触发
        this.props.onClose&&this.props.onClose();
    },
    render:function(){
        return (
            <div ref="offCanvas" className="am-offcanvas" onClick={this.props.onRequestClose}>
                <div className="am-offcanvas-bar am-offcanvas-bar-flip" onClick={function(e){e.stopPropagation();}}>
                    <div className="am-offcanvas-content">
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
});

module.exports=OffCanvas;