"use strict";

var Pagination = React.createClass({
    displayName: "Pagination",

    propTypes: {
        size: React.PropTypes.number,
        current: React.PropTypes.number.isRequired,
        count: React.PropTypes.number.isRequired,
        onClick: React.PropTypes.func.isRequired
    },
    getDefaultProps: function getDefaultProps() {
        return {
            size: 6
        };
    },
    /**
     * 选择某一页
     * @param pageNum
     */
    handleClick: function handleClick(pageNum) {
        this.props.onClick(pageNum);
    },
    render: function render() {
        var count = this.props.count;
        if (!count) {
            return null;
        }
        var current = this.props.current;
        var page = shortcutPagination(current, count, this.props.size);
        var pageList = [];
        for (var num, i = 0; i < page.display; i++) {
            num = page.start + i;
            if (num == current) {
                pageList.push(React.createElement(
                    "li",
                    { key: i, className: "am-active" },
                    React.createElement(
                        "span",
                        null,
                        num
                    )
                ));
            } else {
                pageList.push(React.createElement(
                    "li",
                    { key: i },
                    React.createElement(
                        "a",
                        { href: "javascript:;", onClick: this.handleClick.bind(this, num) },
                        num
                    )
                ));
            }
        }
        return React.createElement(
            "ul",
            { className: "pagination am-pagination am-pagination-centered" },
            current <= 1 ? React.createElement(
                "li",
                { className: "am-disabled" },
                React.createElement(
                    "span",
                    null,
                    "\xAB"
                )
            ) : React.createElement(
                "li",
                null,
                React.createElement(
                    "a",
                    { href: "javascript:;", onClick: this.handleClick.bind(this, current - 1) },
                    "\xAB"
                )
            ),
            page.start > 1 ? React.createElement(
                "li",
                null,
                React.createElement(
                    "a",
                    { href: "javascript:;", onClick: this.handleClick.bind(this, Math.max(current - page.display, 1)) },
                    "..."
                )
            ) : null,
            pageList,
            count > page.start + page.display - 1 ? React.createElement(
                "li",
                null,
                React.createElement(
                    "a",
                    { href: "javascript:;", onClick: this.handleClick.bind(this, Math.min(Math.max(Math.ceil(page.display / 2), current) + page.display + 1, count - Math.floor(page.display / 2) + 1)) },
                    "..."
                )
            ) : null,
            current >= count ? React.createElement(
                "li",
                { className: "am-disabled" },
                React.createElement(
                    "span",
                    null,
                    "\xBB"
                )
            ) : React.createElement(
                "li",
                null,
                React.createElement(
                    "a",
                    { href: "javascript:;", onClick: this.handleClick.bind(this, current + 1) },
                    "\xBB"
                )
            )
        );
    }
});

/**
 * 当页码比较多时，此方法可以缩略过长的页码，保持固定的页码
 * @param index 当前的页码
 * @param count 分页后总共的页数
 * @param displaySize 一次显示的页数
 * @returns {start: int 告诉分页器该从第几页开始展示, display: int 告诉分页器要展示多少条页码}
 */
function shortcutPagination(index, count, displaySize) {
    var display = displaySize || 6,
        //要展示多少条页码
    start,
        //从第几页开始展示
    half = Math.floor(display / 2); //展示的页码条的中间位置
    if (count > display) {
        if (index <= half) {
            //如果当前页码在头部一半之前，固定开始页码为1
            start = 1;
        } else if (index > count - half) {
            //如果当前页码在尾部一半之后，固定开始页码为尾部第一个页码
            start = count - display + 1;
        } else {
            //如果当前页码中间徘徊，直接当前页码减去一半
            start = index - half;
        }
    } else {
        //总页数小于等于要展示的页数
        start = 1;
        display = count;
    }
    return {
        start: start,
        display: display
    };
}

module.exports = Pagination;