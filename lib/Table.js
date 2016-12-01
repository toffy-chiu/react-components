"use strict";

var Table = React.createClass({
    displayName: "Table",

    propTypes: {
        checker: React.PropTypes.bool,
        onCheckerChange: React.PropTypes.func
    },
    getInitialState: function getInitialState() {
        return {
            value: []
        };
    },
    handleChange: function handleChange(e) {
        var chk = e.target;
        if (chk.value == 'master') {
            //thead的复选框
            var value = [];
            if (chk.checked) {
                //全部勾上
                React.Children.forEach(this.props.children[1].props.children, function (tr) {
                    value.push(+tr.key);
                });
            }
            this.state.value = value;
        } else {
            //tbody里的复选框
            var id = +chk.value;
            if (chk.checked) {
                //添加
                this.state.value.push(id);
            } else {
                //移除
                var index = this.state.value.indexOf(id);
                if (~index) {
                    this.state.value.splice(index, 1);
                }
            }
        }
        this.setState(this.state);

        //把最终的值传递出去
        this.props.onCheckerChange(this.state.value);
    },
    render: function render() {
        //获取总记录行数（根据tbody的children获取）
        var totalCount = this.props.children[1].props.children.length;

        return React.createElement(
            "div",
            { className: "am-scrollable-horizontal" },
            React.createElement(
                "table",
                { className: "am-table am-table-striped am-table-hover am-table-bordered table-main" },
                this.props.checker ? React.Children.map(this.props.children, function (child) {
                    //在每行第一列插入复选框列
                    //thead,tbody
                    var rows = React.Children.map(child.props.children, function (tr) {
                        //tr
                        return React.createElement(
                            "tr",
                            null,
                            child.type == 'thead' ? React.createElement(
                                "th",
                                { style: { width: 30 } },
                                React.createElement("input", { type: "checkbox", value: "master", onChange: this.handleChange, checked: totalCount > 0 && this.state.value.length == totalCount })
                            ) : React.createElement(
                                "td",
                                { style: { width: 30 } },
                                React.createElement("input", { type: "checkbox", value: tr.key, onChange: this.handleChange, checked: ~this.state.value.indexOf(+tr.key) })
                            ),
                            tr.props.children
                        );
                    }.bind(this));
                    return child.type == 'thead' ? React.createElement(
                        "thead",
                        null,
                        rows
                    ) : React.createElement(
                        "tbody",
                        null,
                        rows
                    );
                }.bind(this)) : this.props.children
            )
        );
    }
});

module.exports = Table;