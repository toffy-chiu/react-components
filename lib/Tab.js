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

module.exports = Tab;