var Table=React.createClass({
    propTypes:{
        checker:React.PropTypes.bool,
        onCheckerChange:React.PropTypes.func
    },
    getInitialState:function(){
        return {
            value:[]
        }
    },
    handleChange:function(e){
        var chk=e.target;
        if(chk.value=='master'){
            //thead的复选框
            var value=[];
            if(chk.checked){
                //全部勾上
                React.Children.forEach(this.props.children[1].props.children, function(tr){
                    value.push(+tr.key);
                });
            }
            this.state.value=value;
        }else {
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
    render:function(){
        //获取总记录行数（根据tbody的children获取）
        var totalCount=this.props.children[1].props.children.length;

        return (
            <div className="am-scrollable-horizontal">
                <table className="am-table am-table-striped am-table-hover am-table-bordered table-main">
                    {
                        this.props.checker?
                            React.Children.map(this.props.children, function(child){
                                //在每行第一列插入复选框列
                                //thead,tbody
                                var rows=React.Children.map(child.props.children, function(tr){
                                    //tr
                                    return (
                                        <tr>
                                            {
                                                child.type=='thead'
                                                    ?<th style={{width:30}}><input type="checkbox" value="master" onChange={this.handleChange} checked={totalCount>0&&this.state.value.length==totalCount}/></th>
                                                    :<td style={{width:30}}><input type="checkbox" value={tr.key} onChange={this.handleChange} checked={~this.state.value.indexOf(+tr.key)}/></td>
                                            }
                                            {tr.props.children}
                                        </tr>
                                    )
                                }.bind(this));
                                return child.type=='thead'
                                    ?(<thead>{rows}</thead>)
                                    :(<tbody>{rows}</tbody>);
                            }.bind(this)):this.props.children
                    }
                </table>
            </div>
        )
    }
});

module.exports=Table;