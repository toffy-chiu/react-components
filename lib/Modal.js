var handle;
var Modal=React.createClass({
    propTypes: {
        title: React.PropTypes.string,
        onShow: React.PropTypes.func, //内部不可setState，否则进入死循环，应该放在onShown去处理
        onShown: React.PropTypes.func,
        onClose: React.PropTypes.func,
        onRequestShown: React.PropTypes.func.isRequired,
        onRequestClose: React.PropTypes.func.isRequired
    },
    getDefaultProps:function(){
        //供Trigger调用
        return {
            onRequestShown:function(){
                handle.onShown();
            },
            onRequestClose:function(){
                handle.onClose();
            }
        }
    },
    getInitialState:function(){
        return {
            //控制进场退场动画
            isShow:true,
            isReverse:false
        }
    },
    componentDidMount:function(){
        handle=this;
        $('html').css('overflow', 'hidden');
    },
    componentWillUnmount:function(){
        $('html').css('overflow', '');
    },
    /**
     * 已显示完时
     */
    onShown:function(){
        this.setState({
            isShow:false,
            isReverse:true
        });
    },
    /**
     * 刚关闭时
     */
    onClose:function(){
        this.setState({isShow:true});
    },
    render:function(){
        var style=$.extend({}, this.props.style, {
            display:'block',
            'WebkitAnimationDuration':'.2s',
            'animationDuration':'.2s',
            'WebkitAnimationTimingFunction':'ease',
            'animationTimingFunction':'ease'
        });
        return (
            <div className={'am-modal am-modal-active am-modal-no-btn'+(this.state.isReverse?' am-animation-reverse':'')+(this.state.isShow?' am-animation-scale-down':'')} style={style}>
                <div className="am-modal-dialog">
                    <div className="am-modal-hd">
                        <h4 className="am-margin-bottom-sm">{this.props.title}</h4>
                        <button className="am-close am-close-spin" onClick={this.props.onRequestClose}>×</button>
                    </div>
                    <div className="am-modal-bd">
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
});

module.exports=Modal;