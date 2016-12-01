'use strict';

var React = require('react');
var domUtils = require('./utils/domUtils');
require('./css/SearchSelect.css');

var SearchSelect = React.createClass({
    displayName: 'SearchSelect',

    propTypes: {
        name: React.PropTypes.string, //普通name属性
        maxItemLength: React.PropTypes.number, //最多显示的匹配条数
        idField: React.PropTypes.string,
        nameField: React.PropTypes.string,
        implicitNameField: React.PropTypes.string, //隐式匹配项，如中文人名时可用简拼作为隐式匹配项
        multiple: React.PropTypes.bool,
        list: React.PropTypes.array, //数据源
        value: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string, React.PropTypes.array]),
        onChange: React.PropTypes.func.isRequired
    },
    getDefaultProps: function getDefaultProps() {
        return {
            maxItemLength: 8,
            idField: 'id',
            nameField: 'name',
            implicitNameField: 'pinyin'
        };
    },
    getInitialState: function getInitialState() {
        return {
            active: false,
            showDrop: false,
            matchList: null //null代表不限，[]代表找不到匹配项
        };
    },
    /**
     * 组件聚焦时
     */
    focus: function focus() {
        if (!this.state.active) {
            this.setState({ active: true });

            //绑定全局点击事件
            document.addEventListener('click', this.handleDocumentClick, false);
        }

        //聚焦状态下也有没展开的可能
        this.showDrop();

        this.refs.input.focus();
    },
    /**
     * 组件取消聚焦
     */
    blur: function blur() {
        if (this.state.active) {
            this.setState({ active: false });

            //解绑全局点击事件
            document.removeEventListener('click', this.handleDocumentClick, false);

            this.hideDrop();
        }
    },
    /**
     * 显示下拉框
     */
    showDrop: function showDrop() {
        if (!this.state.showDrop) {
            this.setState({ showDrop: true });
        }
    },
    /**
     * 隐藏下拉框
     */
    hideDrop: function hideDrop() {
        if (this.state.showDrop) {
            this.setState({
                showDrop: false,
                matchList: null
            });
        }
    },
    /**
     * document点击事件
     * @param e
     */
    handleDocumentClick: function handleDocumentClick(e) {
        //点击组件以外的区域时失去焦点
        if (!domUtils.hasParent(e.target, this.refs.container)) {
            this.blur();
        }
    },
    /**
     * 输入框变化
     * @param e
     */
    handleInputChange: function handleInputChange(e) {
        var t = e.target;
        var value = t.value;
        var maxLen = this.props.maxItemLength;
        var list = this.props.list;
        var matchList = null;
        var idField = this.props.idField;
        var nameField = this.props.nameField;
        var implicitNameField = this.props.implicitNameField;
        if (value) {
            matchList = [];
            //处理正则相关敏感字符
            value = value.replace(/[\/\|\\\.\+\?\[\]\{\}]/g, function (m) {
                return '\\' + m;
            });
            for (var i = 0, len = list.length; i < len; i++) {
                if (new RegExp(value, 'gi').test(list[i][nameField] + (list[i][implicitNameField] || ''))) {
                    //记录匹配的ID
                    matchList.push(list[i][idField]);
                    if (matchList.length >= maxLen) {
                        //够数，走人
                        break;
                    }
                }
            }
        }
        this.setState({
            showDrop: true,
            matchList: matchList
        });
    },
    /**
     * 选择候选项
     * @param item
     */
    handleItemClick: function handleItemClick(item) {
        this.hideDrop();
        this.refs.input.value = '';

        var value;
        if (this.props.multiple) {
            this.refs.input.focus();
            value = (this.props.value || []).concat([item[this.props.idField]]);
        } else {
            value = item[this.props.idField];
        }

        //回调出去
        this.props.onChange({
            target: {
                type: 'SearchSelect',
                name: this.props.name,
                value: value
            }
        });
    },
    /**
     * 移除某个选择
     * @param i
     * @param e
     */
    handleItemRemove: function handleItemRemove(i, e) {
        e.stopPropagation();

        var value;
        if (this.props.multiple) {
            value = this.props.value.concat();
            value.splice(i, 1);
        }

        //回调出去
        this.props.onChange({
            target: {
                type: 'SearchSelect',
                name: this.props.name,
                value: value
            }
        });
    },
    render: function render() {
        var idField = this.props.idField;
        var nameField = this.props.nameField;
        var matchList = this.state.matchList;
        var list = this.props.list;

        if (!list || !list.length) {
            return React.createElement(
                'div',
                null,
                '\u52A0\u8F7D\u4E2D...'
            );
        }

        var selectedValue = this.props.value || (this.props.multiple ? [] : '');

        //第一次时，把列表映射成键值对
        if (!this.mapName) {
            var map = {};
            list.forEach(function (o) {
                map[o[idField]] = o[nameField];
            });
            this.mapName = map;
        }

        //过滤出匹配项
        if (matchList) {
            list = list.filter(function (o) {
                return ~matchList.indexOf(o[idField]);
            });
        }

        return React.createElement(
            'div',
            { ref: 'container', className: 'ss-container ss-' + (this.props.multiple ? 'multiple' : 'single') + (this.state.active ? ' ss-active' : ''), onClick: this.focus },
            this.props.multiple ? React.createElement(
                'ul',
                { className: 'ss-choices' },
                selectedValue.map(function (id, i) {
                    return React.createElement(
                        'li',
                        { key: i, className: 'ss-choice' },
                        React.createElement(
                            'span',
                            null,
                            this.mapName[id]
                        ),
                        React.createElement(
                            'a',
                            { className: 'ss-remove', onClick: this.handleItemRemove.bind(this, i) },
                            React.createElement('i', { className: 'am-icon-remove' }),
                            ' '
                        )
                    );
                }.bind(this)),
                React.createElement(
                    'li',
                    { className: 'ss-field' },
                    React.createElement('input', { ref: 'input', type: 'text', autoComplete: 'off', onChange: this.handleInputChange })
                )
            ) : React.createElement(
                'a',
                { className: 'ss-single-choice' },
                React.createElement(
                    'span',
                    null,
                    this.mapName[selectedValue] || '请选择'
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement('i', { className: 'am-icon-caret-down' }),
                    ' '
                )
            ),
            React.createElement(
                'div',
                { className: 'ss-drop' + (this.state.showDrop ? ' ss-show' : '') },
                !this.props.multiple ? React.createElement(
                    'div',
                    { className: 'ss-search' },
                    React.createElement('input', { ref: 'input', type: 'text', autoComplete: 'off', onChange: this.handleInputChange }),
                    React.createElement('i', { className: 'am-icon-search' })
                ) : null,
                React.createElement(
                    'ul',
                    { className: 'ss-results' },
                    list.length ? list.map(function (o, i) {
                        var name = o[nameField];

                        //标记匹配颜色
                        if (this.refs.input && this.refs.input.value) {
                            var value = this.refs.input.value;
                            //检索出所有匹配项
                            var shotKeys = name.match(new RegExp(value, 'gi'));
                            //截断再用React方式拼接
                            var arr = name.split(new RegExp(value, 'i'));
                            for (var j = arr.length - 1; j > 0; j--) {
                                arr.splice(j, 0, React.createElement(
                                    'b',
                                    { key: j },
                                    shotKeys[j - 1]
                                ));
                            }
                            name = arr;
                        }

                        if (this.props.multiple ? ~selectedValue.indexOf(o[idField]) : selectedValue == o[idField]) {
                            //已选择的
                            return React.createElement(
                                'li',
                                { key: i, className: 'ss-result ss-selected' },
                                name
                            );
                        } else {
                            //未选择的
                            return React.createElement(
                                'li',
                                { key: i, className: 'ss-result', onClick: this.handleItemClick.bind(this, o) },
                                name
                            );
                        }
                    }.bind(this)) : React.createElement(
                        'li',
                        { className: 'ss-null' },
                        '\u627E\u4E0D\u5230\u5339\u914D\u9879'
                    )
                )
            )
        );
    }
});

module.exports = SearchSelect;