var Tabs=React.createClass({
    propTypes:{
        className:React.PropTypes.string,
        activeIndex:React.PropTypes.number.isRequired,
        onSwitch:React.PropTypes.func.isRequired
    },
    getDefaultProps:function(){
        return {
            activeIndex:0
        }
    },
    render: function() {
        return (
            <div className={this.props.className}>
                <ul className="am-nav am-nav-tabs">
                    {
                        React.Children.map(this.props.children, function(child, i){
                            return <li className={this.props.activeIndex==i?'am-active':''}><a href="javascript:;" onClick={this.props.onSwitch.bind(null, i)}>{child.props.title}</a></li>
                        }.bind(this))
                    }
                </ul>
                <div className="am-tabs-bd">
                    {
                        React.Children.map(this.props.children, function(child, i){
                            return React.cloneElement(child, {active:this.props.activeIndex==i});
                        }.bind(this))
                    }
                </div>
            </div>
        );
    }
});

var Tab=React.createClass({
    propTypes:{
        title:React.PropTypes.string.isRequired,
        active:React.PropTypes.bool
    },
    render: function() {
        return (
            <div className={'am-tab-panel'+(this.props.active?' am-active am-in':'')}>
                {this.props.children}
            </div>
        );
    }
});

Tabs.Item=Tab;

module.exports = Tabs;