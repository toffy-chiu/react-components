var Tabs=React.createClass({
    propTypes:{
        className:React.PropTypes.string
    },
    getInitialState:function(){
        return {
            active:0
        }
    },
    handleClick:function(i){
        this.setState({active:i});
    },
    render: function() {
        return (
            <div className={this.props.className}>
                <ul className="am-nav am-nav-tabs">
                    {
                        React.Children.map(this.props.children, function(child, i){
                            return <li className={this.state.active==i?'am-active':''}><a href="javascript:;" onClick={this.handleClick.bind(this, i)}>{child.props.title}</a></li>
                        }.bind(this))
                    }
                </ul>
                <div className="am-tabs-bd">
                    {
                        React.Children.map(this.props.children, function(child, i){
                            return React.cloneElement(child, {active:this.state.active==i});
                        }.bind(this))
                    }
                </div>
            </div>
        );
    }
});

module.exports = Tabs;