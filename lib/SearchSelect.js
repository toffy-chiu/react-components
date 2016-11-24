var React=require('react');
var domUtils=require('./utils/domUtils');
require('./css/SearchSelect.css');

var SearchSelect=React.createClass({
    propTypes:{
        name:React.PropTypes.string, //普通name属性
        maxItemLength:React.PropTypes.number, //最多显示的匹配条数
        idField:React.PropTypes.string,
        nameField:React.PropTypes.string,
        multiple:React.PropTypes.bool,
        list:React.PropTypes.array, //数据源
        value:React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string, React.PropTypes.array]),
        onChange:React.PropTypes.func.isRequired
    },
    getDefaultProps:function(){
        return {
            maxItemLength:8,
            idField:'id',
            nameField:'name'
        }
    },
    getInitialState:function(){
        return {
            active:false,
            showDrop:false,
            resultList:null //null代表不限，[]代表找不到匹配项
        }
    },
    /**
     * 组件聚焦时
     */
    focus:function(){
        if(!this.state.active) {
            this.setState({active: true});

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
    blur:function(){
        if(this.state.active) {
            this.setState({active: false});

            //解绑全局点击事件
            document.removeEventListener('click', this.handleDocumentClick, false);

            this.hideDrop();
        }
    },
    /**
     * 显示下拉框
     */
    showDrop:function(){
        if(!this.state.showDrop) {
            this.setState({showDrop: true});
        }
    },
    /**
     * 隐藏下拉框
     */
    hideDrop:function(){
        if(this.state.showDrop) {
            this.setState({showDrop: false});
        }
    },
    /**
     * document点击事件
     * @param e
     */
    handleDocumentClick:function(e){
        //点击组件以外的区域时失去焦点
        if(!domUtils.hasParent(e.target, this.refs.container)){
            this.blur();
        }
    },
    /**
     * 输入框变化
     * @param e
     */
    handleInputChange:function(e){
        var t=e.target;
        var value=t.value;
        var maxLen = this.props.maxItemLength;
        var list = this.props.list;
        var resultList=null;
        var idField=this.props.idField;
        var nameField=this.props.nameField;
        if(value) {
            resultList=[];
            //处理正则相关敏感字符
            value=value.replace(/[\/\|\\\.\+\?\[\]\{\}]/g, function(m){
                return '\\'+m;
            });
            for (var i = 0, len = list.length; i < len; i++) {
                if (new RegExp(value, 'gi').test(list[i][nameField])){
                    //记录匹配的ID
                    resultList.push(list[i][idField]);
                    if (resultList.length >= maxLen) {
                        //够数，走人
                        break;
                    }
                }
            }
        }
        this.setState({
            showDrop:true,
            resultList:resultList
        });
    },
    /**
     * 选择候选项
     * @param item
     */
    handleItemClick:function(item){
        this.hideDrop();
        this.refs.input.value='';

        var value;
        if(this.props.multiple){
            this.refs.input.focus();
            value=(this.props.value||[]).concat([item[this.props.idField]]);
        }else{
            value=item[this.props.idField];
        }

        //回调出去
        this.props.onChange({
            target:{
                type:'SearchSelect',
                name:this.props.name,
                value:value
            }
        });
    },
    /**
     * 移除某个选择
     * @param i
     * @param e
     */
    handleItemRemove:function(i, e){
        e.stopPropagation();

        var value;
        if(this.props.multiple){
            value=this.props.value.concat();
            value.splice(i, 1);
        }

        //回调出去
        this.props.onChange({
            target:{
                type:'SearchSelect',
                name:this.props.name,
                value:value
            }
        });
    },
    render: function() {
        var idField=this.props.idField;
        var nameField=this.props.nameField;
        var resultList=this.state.resultList;
        var list = this.props.list;

        if(!list||!list.length){
            return <div>加载中...</div>
        }
        console.log(list);

        var selectedValue=this.props.value||(this.props.multiple?[]:'');

        //第一次时，把列表映射成键值对
        if(!this.mapName){
            var map={};
            list.forEach(function(o){
                map[o[idField]]=o[nameField];
            });
            this.mapName=map;
        }

        //过滤出匹配项
        if(resultList) {
            list = list.filter(function (o) {
                return ~resultList.indexOf(o[idField]);
            });
        }

        return (
            <div ref="container" className={'ss-container ss-'+(this.props.multiple?'multiple':'single')+(this.state.active?' ss-active':'')} onClick={this.focus}>
                {/*<select style={{display:'none'}}>{this.props.children}</select>*/}
                {
                    this.props.multiple?(
                        <ul className="ss-choices">
                            {
                                selectedValue.map(function(id, i){
                                    return (
                                        <li key={i} className="ss-choice">
                                            <span>{this.mapName[id]}</span>
                                            <a className="ss-remove" onClick={this.handleItemRemove.bind(this, i)}><i className="am-icon-remove"/> </a>
                                        </li>
                                    )
                                }.bind(this))
                            }
                            <li className="ss-field"><input ref="input" type="text" autoComplete="off" onChange={this.handleInputChange}/></li>
                        </ul>
                    ):(
                        <a className="ss-single-choice">
                            <span>{this.mapName[selectedValue]||'请选择'}</span>
                            <div><i className="am-icon-caret-down"/> </div>
                        </a>
                    )
                }
                <div className={'ss-drop'+(this.state.showDrop?' ss-show':'')}>
                    {
                        !this.props.multiple?(
                            <div className="ss-search">
                                <input ref="input" type="text" autoComplete="off" onChange={this.handleInputChange}/>
                                <i className="am-icon-search"/>
                            </div>
                        ):null
                    }
                    <ul className="ss-results">
                        {
                            list.length?list.map(function(o, i){
                                var name=o[nameField];

                                //标记匹配颜色
                                if(this.refs.input&&this.refs.input.value) {
                                    var value=this.refs.input.value;
                                    //检索出所有匹配项
                                    var shotKeys=name.match(new RegExp(value, 'gi'));
                                    //截断再用React方式拼接
                                    var arr = name.split(new RegExp(value, 'i'));
                                    for(var j=arr.length-1;j>0;j--){
                                        arr.splice(j, 0, <b key={j}>{shotKeys[j-1]}</b>)
                                    }
                                    name=arr;
                                }

                                if(this.props.multiple?~selectedValue.indexOf(o[idField]):selectedValue==o[idField]){
                                    //已选择的
                                    return <li key={i} className="ss-result ss-selected">{name}</li>
                                }else{
                                    //未选择的
                                    return <li key={i} className="ss-result" onClick={this.handleItemClick.bind(this, o)}>{name}</li>
                                }
                            }.bind(this))
                                :<li className="ss-null">找不到匹配项</li>
                        }
                    </ul>
                </div>
            </div>
        )
    }
});

module.exports = SearchSelect;