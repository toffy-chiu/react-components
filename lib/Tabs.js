'use strict';

var Tabs = React.createClass({
    displayName: 'Tabs',

    propTypes: {
        className: React.PropTypes.string,
        activeIndex: React.PropTypes.number.isRequired,
        onSwitch: React.PropTypes.func.isRequired
    },
    getDefaultProps: function getDefaultProps() {
        return {
            activeIndex: 0
        };
    },
    render: function render() {
        return React.createElement(
            'div',
            { className: this.props.className },
            React.createElement(
                'ul',
                { className: 'am-nav am-nav-tabs' },
                React.Children.map(this.props.children, function (child, i) {
                    return React.createElement(
                        'li',
                        { className: this.props.activeIndex == i ? 'am-active' : '' },
                        React.createElement(
                            'a',
                            { href: 'javascript:;', onClick: this.props.onSwitch.bind(null, i) },
                            child.props.title
                        )
                    );
                }.bind(this))
            ),
            React.createElement(
                'div',
                { className: 'am-tabs-bd' },
                React.Children.map(this.props.children, function (child, i) {
                    return React.cloneElement(child, { active: this.props.activeIndex == i });
                }.bind(this))
            )
        );
    }
});

var Tab = React.createClass({
    displayName: 'Tab',

    propTypes: {
        title: React.PropTypes.string.isRequired,
        active: React.PropTypes.bool
    },
    render: function render() {
        return React.createElement(
            'div',
            { className: 'am-tab-panel' + (this.props.active ? ' am-active am-in' : '') },
            this.props.children
        );
    }
});

Tabs.Item = Tab;

module.exports = Tabs;