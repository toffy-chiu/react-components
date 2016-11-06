var React=require('react');
var ReactDOM=require('react-dom');

require('./css/DateInput.css');

var leftIconClass='am-icon-chevron-left',
    rightIconClass='am-icon-chevron-right';

var DateInput=React.createClass({
    pickerWrapper:null,
    picker:null,
    element:null,
    //当前文本框记录的日期
    date: new Date(),
    //日期面板中的日期，选中前有可能不断改变，但不一定最终的值
    viewDate:new Date(),
    _secondaryEvents:function(){
        return [
            {ele:this.picker, type:'click', func:this.click},
            {ele:document, type:'mousedown', func:function(e){
                // 点击其他区域时隐藏
                if (!(
                        this.element===e.target ||
                        hasChild(this.element, e.target) ||
                        this.picker===e.target ||
                        hasChild(this.picker, e.target)
                    )) {
                    this.hide();
                }
            }.bind(this)}
        ];
    },
    propTypes:{
        value:React.PropTypes.string,
        onChange:React.PropTypes.func,
        type:React.PropTypes.oneOf(['year', 'month', 'week', 'date', 'datetime'])
    },
    getDefaultProps:function(){
        return {
            type:'date',
            options:{}
        }
    },
    componentDidMount:function(){
        this._initDate();

        //添加主面板到body
        this.picker=document.createElement('div');
        this.picker.className='datePicker';
        document.body.appendChild(this.picker);
        this.element=this.refs.ele;
    },
    componentDidUpdate:function(){
        this._initDate();
    },
    componentWillUnmount: function() {
        this.hide();

        if (this.picker) {
            document.body.removeChild(this.picker);
            this.picker = null;
        }
    },
    _initDate:function(){
        if(this.props.value){
            switch (this.props.type){
                case 'year'://当作年份处理
                    this.date=new Date(this.props.value+'/01/01');
                    break;
                case 'month'://当作月份处理
                    this.date=new Date(this.props.value.replace('-', '/')+'/01');
                    break;
                case 'week'://当作周处理
                    var wk=this.props.value.split('-');  //目前仅支持“-”连接
                    this.date=week2Date(+wk[0], +wk[1]);
                    break;
                default :
                    this.date=new Date(this.props.value.replace(/-/g, '/'));
                    break;
            }

            //若上面的日期转换失败，则初始化为当前日期
            if(this.date.toString()==='Invalid Date'){
                this.date=new Date();
            }

            this.viewDate=new Date(this.date.getTime());
        }
    },
    //次事件
    _attachEvent:function(){
        this._secondaryEvents().forEach(function(o){
            o.ele.addEventListener(o.type, o.func, false);
        });
    },
    _detachEvent:function(){
        this._secondaryEvents().forEach(function(o){
            o.ele.removeEventListener(o.type, o.func, false);
        });
    },
    _setDate:function(date){
        this.date=date;
        var defaultFormat;
        switch (this.props.type){
            case 'year':
                defaultFormat='yyyy';
                break;
            case 'month':
                defaultFormat='yyyy-MM';
                break;
            case 'datetime':
                defaultFormat='yyyy-MM-dd HH:mm';
                break;
            case 'week':
                defaultFormat='yyyy-WW';
                break;
            case 'date':
            default :
                defaultFormat='yyyy-MM-dd';
                break;
        }
        var value=dateFormat(date, this.props.format||defaultFormat);
        if(typeof this.props.onChange==='function'){
            this.props.onChange(value);
        }
        this.element.value=value;
        //触发change事件
        var evt=document.createEvent('HTMLEvents');
        evt.initEvent('change', false, false);
        this.element.dispatchEvent(evt);
    },
    //隐藏
    hide:function(){
        this.picker.style.display='none';

        ReactDOM.unmountComponentAtNode(this.picker);

        this._detachEvent();
    },
    //显示
    show:function(e){
        e.stopPropagation();

        this.renderTemplate();

        this._attachEvent();
    },
    //定位
    locate:function(){
        var offset=getOffset(this.element);
        var winWidth=document.body.clientWidth;
        var winHeight=window.innerHeight;
        var left,top;
        if(winWidth-offset.left<=this.picker.offsetWidth){
            left=offset.left-this.picker.offsetWidth;
        }else{
            left=offset.left;
        }
        if(winHeight-(offset.top+offset.height)<=this.picker.offsetHeight){
            top=offset.top-this.picker.offsetHeight;
        }else{
            top=offset.top+offset.height;
        }
        this.picker.style.left=left+'px';
        this.picker.style.top=top+'px';
        this.picker.style.display='block';
        return this;
    },
    //渲染模板
    renderTemplate:function(type){
        var template;
        switch (type||this.props.type){
            case 'week':
                this.viewMode=6;
                template=getWeeksTemplate.bind(this)();
                break;
            case 'minute':
                this.viewMode=5;
                template=getMinutesTemplate.bind(this)();
                break;
            case 'hour':
                this.viewMode=4;
                template=getHoursTemplate.bind(this)();
                break;
            case 'year':
                this.viewMode=3;
                template=getYearsTemplate.bind(this)();
                break;
            case 'month':
                this.viewMode=2;
                template=getMonthsTemplate.bind(this)();
                break;
            case 'date':
            default :
                this.viewMode=1;
                template=getDaysTemplate.bind(this)();
                break;
        }
        ReactDOM.render(template, this.picker);
        this.locate();
    },
    /**
     * 清空值
     */
    clear:function(){
        this.element.value='';
        this.hide();
    },
    /**
     * 切换视图
     */
    switchView:function(){
        switch (this.viewMode){
            case 1:
                this.renderTemplate('month');
                break;
            case 2:
                this.renderTemplate('year');
                break;
            case 4:
                this.renderTemplate('date');
                break;
            case 5:
                this.renderTemplate('hour');
                break;
        }
    },
    /**
     * 上一页、下一页
     * @param dir
     */
    changePage:function(dir){
        switch(this.viewMode){
            case 6:
                this.viewDate = moveYear(this.viewDate, dir);
                this.renderTemplate('week');
                break;
            case 5:
                this.viewDate = moveHour(this.viewDate, dir);
                this.renderTemplate('minute');
                break;
            case 4:
                this.viewDate = moveDate(this.viewDate, dir);
                this.renderTemplate('hour');
                break;
            case 3:
                this.viewDate = moveYear(this.viewDate, dir*10);
                this.renderTemplate('year');
                break;
            case 2:
                this.viewDate = moveYear(this.viewDate, dir);
                this.renderTemplate('month');
                break;
            case 1:
            default :
                this.viewDate = moveMonth(this.viewDate, dir);
                this.renderTemplate();
                break;
        }
    },
    /**
     * 选日
     * @param e
     */
    clickDay:function(e){
        var td=e.target;
        var day = parseInt(td.textContent, 10)||1;
        var year = this.viewDate.getFullYear(),
            month = this.viewDate.getMonth();
        if (hasClass(td, 'old')) {
            //上个月的天数
            if (month === 0) {
                month = 11;
                year -= 1;
            } else {
                month -= 1;
            }
        } else if (hasClass(td, 'new')) {
            //下个月的天数
            if (month == 11) {
                month = 0;
                year += 1;
            } else {
                month += 1;
            }
        }
        if(this.props.type=='datetime'){
            this.viewDate.setFullYear(year, month, day);
            this.renderTemplate('hour');
        }else {
            this._setDate(new Date(year, month, day));
            this.hide();
        }
    },
    /**
     * 选月
     * @param month
     */
    clickMonth:function(month){
        var day = 1;
        var year = this.viewDate.getFullYear();
        this.viewDate.setFullYear(year, month, day);
        if (this.props.type == 'date') {
            this.renderTemplate();
        }else{
            this._setDate(this.viewDate);
            this.hide();
        }
    },
    /**
     * 选年
     * @param e
     */
    clickYear:function(e){
        var year = parseInt(e.target.textContent, 10)||0;
        var day = 1;
        var month = 0;
        this.viewDate.setFullYear(year, month, day);
        if(this.props.type!='year'){
            this.renderTemplate('month');
        }else{
            this._setDate(this.viewDate);
            this.hide();
        }
    },
    /**
     * 选时
     * @param e
     */
    clickHour:function(e){
        var hour = parseInt(e.target.textContent, 10)||0;
        this.viewDate.setHours(hour);
        if(this.props.type=='datetime'){
            this.renderTemplate('minute');
        }
    },
    /**
     * 选分
     * @param e
     */
    clickMinute:function(e){
        var text=e.target.textContent;
        var minute = parseInt(text.substr(text.indexOf(':')+1), 10)||0;
        this.viewDate.setMinutes(minute);
        this._setDate(this.viewDate);
        this.hide();
    },
    /**
     * 选周
     * @param e
     */
    clickWeek:function(e){
        var week = parseInt(e.target.textContent, 10)||1;
        var year = this.viewDate.getFullYear();
        this.viewDate=week2Date(year, week);
        this._setDate(this.viewDate);
        this.hide();
    },
    render:function(){
        return (
            <input ref="ele" value={this.props.value} type="text" onClick={this.show} style={{cursor:'pointer'}} readOnly/>
        )
    }
});

/**
 * 对象合并（深复制）
 * @param obj
 * @returns {*}
 */
function objectAssign(obj){
    var type=Object.prototype.toString.call(obj);
    if(type !== "[object Object]"){
        console.error('函数objectAssign(obj,...)，参数必须为对象类型，当前类型：%s', type);
    }
    /**
     * 深复制对象
     * @param srcObj
     * @param distObj
     */
    function copyObj(srcObj, distObj){
        var callee=arguments.callee;
        if(!distObj){
            //初始化
            distObj={};
        }
        //遍历源对象属性
        for(var k in srcObj){
            if(Object.prototype.toString.call(srcObj[k]) === "[object Object]"){
                //如果对象属性还是对象，则继续遍历复制
                callee(srcObj[k], distObj[k]);
            }else if(typeof srcObj[k] != 'object'){
                //如果是对象属性是基本类型，则浅复制
                distObj[k] = srcObj[k];
            }
        }
    }

    if(arguments.length>1) {
        for (var i = 1; i < arguments.length - 1; i++) {
            copyObj(arguments[i], obj);
        }
    }

    return obj;
}

/**
 * 判断父节点是否包含指定子节点
 * @param parentNode
 * @param childNode
 * @returns {boolean}
 */
function hasChild(parentNode, childNode){
    /**
     * 遍历所有子节点
     * @param children
     * @returns {boolean}
     */
    function findChildren(children){
        var callee=arguments.callee;
        if(children.length){
            for(var i=0,len=children.length;i<len;i++){
                //如果是当前节点或者在当前节点的子节点中找到，一层层往上返回true
                if(children[i]===childNode||callee(children[i].childNodes)){
                    return true;
                }
                //否则继续寻找
            }
        }
        return false;
    }

    return findChildren(parentNode.childNodes);
}

/**
 * 判断是否包含指定class
 * @param element
 * @param className
 * @returns {boolean}
 */
function hasClass(element, className){
    var result=false;
    if(element.className){
        var classList=element.className.split(/\s+/);
        result=~classList.indexOf(className);
    }
    return result;
}

/**
 * 获取相对于body元素的offset对象
 * @param element
 * @returns {{left: (Number|number), top: (*|number|Number), width: number, height: number}}
 */
function getOffset(element){
    var obj={
        left:element.offsetLeft,
        top:element.offsetTop,
        width:element.offsetWidth,
        height:element.offsetHeight
    };

    /**
     * 逐层寻找offsetParent，直到根节点为止
     * @param parent
     */
    function findRootParent(parent){
        var callee=arguments.callee;
        if(parent!==document.body){
            obj.left+=parent.offsetLeft;
            obj.Top+=parent.offsetTop;
            callee(parent.offsetParent);
        }
    }

    findRootParent(element.offsetParent);

    return obj;
}

function dateFormat(date, pattern){
    var fix=function(t) {
        if (t < 10)
            t = '0' + t;
        return t;
    };
    var x = date;
    var y = x.getFullYear(),
        W = '',
        M = fix(x.getMonth() + 1),
        d = fix(x.getDate()),
        H = fix(x.getHours()),
        m = fix(x.getMinutes()),
        s = fix(x.getSeconds());
    if(~pattern.indexOf('WW')){
        W=date2Week(date).week;
    }
    return pattern.replace('yyyy', y).replace('MM', M).replace('dd', d).replace('HH', H).replace('mm', m).replace('ss', s).replace('WW', W);
}
function moveHour(date, dir){
    if (!dir) return date;
    var new_date = new Date(date.valueOf());
    //dir = dir > 0 ? 1 : -1;
    new_date.setHours(new_date.getHours() + dir);
    return new_date;
}
function moveDate(date, dir){
    if (!dir) return date;
    var new_date = new Date(date.valueOf());
    //dir = dir > 0 ? 1 : -1;
    new_date.setDate(new_date.getDate() + dir);
    return new_date;
}
function moveMonth(date, dir){
    if (!dir) return date;
    var callee=arguments.callee;
    var new_date = new Date(date.valueOf()),
        day = new_date.getDate(),
        month = new_date.getMonth(),
        mag = Math.abs(dir),
        new_month, test;
    dir = dir > 0 ? 1 : -1;
    if (mag == 1){
        test = dir == -1
            // 如果后退1个月，需确保该月不等于当前月
            // (如, Mar 31 -> Feb 31 应为 Feb 28, 不应该等于 Mar 02)
            ? function(){ return new_date.getMonth() == month; }
            // 如果前进1个月，需确保该月是所期望的
            // (如, Jan 31 -> Feb 31 应为 Feb 28, 不应该等于 Mar 02)
            : function(){ return new_date.getMonth() != new_month; };
        new_month = month + dir;
        new_date.setMonth(new_month);
        // Dec -> Jan (12) or Jan -> Dec (-1) -- 限制月份的值在 0-11 之间
        if (new_month < 0 || new_month > 11)
            new_month = (new_month + 12) % 12;
    } else {    //如果一次跳转多个月的，需要拆分成1个月跳一次
        // For magnitudes >1, move one month at a time...
        for (var i=0; i<mag; i++) {
            // ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
            new_date = callee(new_date, dir);
        }
        // ...then reset the day, keeping it in the new month
        new_month = new_date.getMonth();
        new_date.setDate(day);
        test = function(){ return new_month != new_date.getMonth(); };
    }
    // Common date-resetting loop -- if date is beyond end of month, make it
    // end of month
    while (test()){
        new_date.setDate(--day);
        new_date.setMonth(new_month);
    }
    return new_date;
}
function moveYear(date, dir){
    return moveMonth(date, dir*12);
}

function getDaysTemplate() {
    var year = this.viewDate.getFullYear(),
        month = this.viewDate.getMonth(),
        selectedYear=this.date.getFullYear(),
        selectedMonth=this.date.getMonth(),
        selectedDay=this.date.getDate(),
        weekdayOfMonth1st = new Date(year, month, 1).getDay(), //该月1号为周几
        lastMonthDayMax = new Date(year, month, 0).getDate(), //获取上个月最大的天数
        maxDayOfMonth = new Date(year, month + 1, 0).getDate(); //获取当月最大的天数
    var day=1;
    return (
        <div className="datePicker-days">
            <table>
                <thead>
                <tr>
                    <th className="prev" onClick={this.changePage.bind(this, -1)}><i className={leftIconClass}></i></th>
                    <th colSpan="5" className="header-switch" onClick={this.switchView}>{dateFormat(this.viewDate, 'yyyy年MM月')}</th>
                    <th className="next" onClick={this.changePage.bind(this, 1)}><i className={rightIconClass}></i></th>
                </tr>
                <tr><th className="dow">日</th><th className="dow">一</th><th className="dow">二</th><th className="dow">三</th><th className="dow">四</th><th className="dow">五</th><th className="dow">六</th></tr>
                </thead>
                <tbody>
                {
                    [0,1,2,3,4,5].map(function(r){
                        return (
                            <tr key={r}>
                                {
                                    [0,1,2,3,4,5,6].map(function(c){
                                        var i=7*r+c;
                                        //当前索引在当月的区间内时才计数
                                        if(i >= weekdayOfMonth1st && day <= maxDayOfMonth){
                                            return <td key={i} onClick={this.clickDay} className={'day'+((year == selectedYear && month == selectedMonth && day == selectedDay)?' active':'')}>{day++}</td>
                                        }else{
                                            //非当月份的格子
                                            if (day == 1) {
                                                //上个月的
                                                return <td key={i} onClick={this.clickDay} className="day old">{lastMonthDayMax - weekdayOfMonth1st + 1 + i}</td>
                                            } else {
                                                //下个月的
                                                return <td key={i} onClick={this.clickDay} className="day new">{((day++) - maxDayOfMonth)}</td>
                                            }
                                        }
                                    }.bind(this))
                                }
                            </tr>
                        )
                    }.bind(this))
                }
                </tbody>
                <tfoot><tr><th colSpan="7" className="clear" onClick={this.clear}>清空</th></tr></tfoot>
            </table>
        </div>
    )
}
function getMonthsTemplate() {
    var year = this.viewDate.getFullYear(),
        month = this.viewDate.getMonth(),
        selectedYear=this.date.getFullYear();
    var arr=[];
    for (var i = 0; i < 12; i++) {
        arr.push(<span key={i} onClick={this.clickMonth.bind(this, i)} className={'month'+((year == selectedYear && month == i)?' active':'')}>{i+1}月</span>)
    }
    return (
        <div className="datePicker-months">
            <table>
                <thead>
                <tr>
                    <th className="prev" onClick={this.changePage.bind(this, -1)}><i className={leftIconClass}></i></th>
                    <th colSpan="5" className="header-switch" onClick={this.switchView}>{dateFormat(this.viewDate, 'yyyy年')}</th>
                    <th className="next" onClick={this.changePage.bind(this, 1)}><i className={rightIconClass}></i></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td colSpan="7">{arr}</td>
                </tr>
                </tbody>
                <tfoot><tr><th colSpan="7" className="clear" onClick={this.clear}>清空</th></tr></tfoot>
            </table>
        </div>
    );
}
function getYearsTemplate() {
    var year = this.viewDate.getFullYear(),
        selectedYear=this.date.getFullYear();
    year = parseInt(year/10, 10) * 10;
    var arr=[];
    for (var i = year-1; i <= year+10; i++) {
        arr.push(<span key={i} onClick={this.clickYear} className={'year'+((selectedYear == i)?' active':'')}>{i}</span>)
    }
    return (
        <div className="datePicker-years">
            <table>
                <thead>
                <tr>
                    <th className="prev" onClick={this.changePage.bind(this, -1)}><i className={leftIconClass}></i></th>
                    <th colSpan="5" className="header-switch" onClick={this.switchView}>{year+'-'+(year+9)}</th>
                    <th className="next" onClick={this.changePage.bind(this, 1)}><i className={rightIconClass}></i></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td colSpan="7">{arr}</td>
                </tr>
                </tbody>
                <tfoot><tr><th colSpan="7" className="clear" onClick={this.clear}>清空</th></tr></tfoot>
            </table>
        </div>
    );
}
function getHoursTemplate() {
    var hour = this.viewDate.getHours();
    var arr=[];
    for (var i = 0; i < 24; i++) {
        arr.push(<span key={i} onClick={this.clickHour} className={'hour'+((hour == i)?' active':'')}>{i}:00</span>)
    }
    return (
        <div className="datePicker-hours">
            <table>
                <thead>
                <tr>
                    <th className="prev" onClick={this.changePage.bind(this, -1)}><i className={leftIconClass}></i></th>
                    <th colSpan="5" className="header-switch" onClick={this.switchView}>{dateFormat(this.viewDate, 'yyyy年MM月dd日')}</th>
                    <th className="next" onClick={this.changePage.bind(this, 1)}><i className={rightIconClass}></i></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td colSpan="7">{arr}</td>
                </tr>
                </tbody>
                <tfoot><tr><th colSpan="7" className="clear" onClick={this.clear}>清空</th></tr></tfoot>
            </table>
        </div>
    );
}
function getMinutesTemplate() {
    var hour = this.viewDate.getHours();
    var minute=this.viewDate.getMinutes();
    var arr=[];
    for (var i = 0; i < 60; i+=5) {
        arr.push(<span key={i} onClick={this.clickMinute} className={'minute'+((minute == i)?' active':'')}>{hour+':'+(i<10?'0'+i:i)}</span>)
    }
    return (
        <div className="datePicker-minutes">
            <table>
                <thead>
                <tr>
                    <th className="prev" onClick={this.changePage.bind(this, -1)}><i className={leftIconClass}></i></th>
                    <th colSpan="5" className="header-switch" onClick={this.switchView}>{dateFormat(this.viewDate, 'yyyy年MM月dd日')}</th>
                    <th className="next" onClick={this.changePage.bind(this, 1)}><i className={rightIconClass}></i></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td colSpan="7">{arr}</td>
                </tr>
                </tbody>
                <tfoot><tr><th colSpan="7" className="clear" onClick={this.clear}>清空</th></tr></tfoot>
            </table>
        </div>
    );
}
function getWeeksTemplate() {
    var year = this.viewDate.getFullYear(),
        month = this.viewDate.getMonth(),
        day=this.viewDate.getDate(),
        selectedYear=this.date.getFullYear(),
        week=month>0?day+31:day;
    return (
        <div className="datePicker-weeks">
            <table>
                <thead>
                <tr>
                    <th className="prev" onClick={this.changePage.bind(this, -1)}><i className={leftIconClass}></i></th>
                    <th colSpan="5" className="header-switch" onClick={this.switchView}>{year}年</th>
                    <th className="next" onClick={this.changePage.bind(this, 1)}><i className={rightIconClass}></i></th>
                </tr>
                </thead>
                <tbody>
                {
                    [0,1,2,3,4,5,6,7].map(function(r){
                        return (
                            <tr key={r}>
                                {
                                    [1,2,3,4,5,6,7].map(function(c){
                                        var num=r*7+c;
                                        if(num<=53) {
                                            return <td key={num} onClick={this.clickWeek} className={'week'+((year == selectedYear && week == num)?' active':'')}>{num}</td>
                                        }else{
                                            return <td key={num}></td>
                                        }
                                    }.bind(this))
                                }
                            </tr>
                        )
                    }.bind(this))
                }
                </tbody>
                <tfoot><tr><th colSpan="7" className="clear" onClick={this.clear}>清空</th></tr></tfoot>
            </table>
        </div>
    );
}
//把一年的周数转换到日期格式中保存，取一月和二月的天数来保存周数，一年最多53周，两月天数够用。
function date2Week(date){
    var year=date.getFullYear();
    var month=date.getMonth();
    var day=date.getDate();
    if(month>0){
        day+=31;
    }
    return {
        year:year,
        week:day
    };
}
function week2Date(year, week){
    var month=0;
    var day=week;
    if(day>31){
        month=1;
        day-=31;
    }
    return new Date(year, month, day);
}

module.exports=DateInput;