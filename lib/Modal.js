var handle;
//此处作为公共变量，每多一个modal则z-index+100；每个modal中的z-index关系为：modal=dimmer+10，即modal总在dimmer上面
var zIndex=1100;
var Modal=React.createClass({
    //标示是否已经背景模糊，否则不设置模糊
    alreadyBlur:false,
    propTypes: {
        title: React.PropTypes.string,
        onShow: React.PropTypes.func, //内部不可setState，否则进入死循环，应该放在onShown去处理
        onShown: React.PropTypes.func,
        onClose: React.PropTypes.func,
        onClosed: React.PropTypes.func,
        onRequestClose: React.PropTypes.func.isRequired
    },
    getDefaultProps:function(){
        //供Trigger调用
        return {
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

        zIndex+=100;

        if($('#container').hasClass('filter-blur')){
            this.alreadyBlur=true;
        }else{
            $('#container').addClass('filter-blur');

            $('html').css('overflow', 'hidden');
        }

        //进场动画执行200ms后触发相应函数
        setTimeout(function(){
            this.onShown();
        }.bind(this), 200);

        //等modal插入到DOM后再触发onShow
        if (this.props.onShow) {
            this.props.onShow();
        }
    },
    componentWillUnmount:function(){
        zIndex-=100;

        if(!this.alreadyBlur) {
            $('#container').removeClass('filter-blur');

            $('html').css('overflow', '');
        }

        //若有监听关闭的则触发
        if (this.props.onClosed) {
            this.props.onClosed();
        }
    },
    /**
     * 已显示完时
     */
    onShown:function(){
        this.setState({
            isShow:false,
            isReverse:true
        });

        //若有监听显示的则触发
        if (this.props.onShown) {
            this.props.onShown();
        }
    },
    /**
     * 刚关闭时
     */
    onClose:function(){
        this.setState({isShow:true});

        //若有监听关闭的则触发
        if (this.props.onClose) {
            this.props.onClose();
        }
    },
    render:function(){
        var style=$.extend({}, this.props.style, {
            display:'block',
            top:60,
            zIndex:zIndex+10,
            'WebkitAnimationDuration':'.2s',
            'animationDuration':'.2s',
            'WebkitAnimationTimingFunction':'ease',
            'animationTimingFunction':'ease'
        });
        return (
            <div>
                {/*dimmer层*/}
                <div className="am-dimmer am-active" style={{display:'block',backgroundColor:'rgba(0,0,0,0.2)',zIndex:zIndex}}></div>
                {/*modal层*/}
                <div className={'am-modal am-modal-active'+(this.state.isReverse?' am-animation-reverse':'')+(this.state.isShow?' am-animation-scale-down':'')} style={style}>
                    <div className="am-modal-dialog">
                        <div className="am-modal-hd">
                            <h4 className="am-margin-bottom-sm">{this.props.title}</h4>
                            <button className="am-close am-close-spin" onClick={this.props.onRequestClose}>×</button>
                        </div>
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
});

module.exports=Modal;