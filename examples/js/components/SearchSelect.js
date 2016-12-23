var SearchSelect=require('../../../src/SearchSelect');
var Mock=require('mockjs');

var SearchSelectPage = React.createClass({
    getInitialState:function(){
        var list=Mock.mock({
            "list|5-10":[
                {
                    "id":"@increment",
                    "name":"@name"
                }
            ]
        }).list;
        return {
            value:[],
            list:list
        }
    },
    handleChange:function(e){
        this.setState({value:e.target.value});
    },
    render: function() {
        return (
            <div style={{width:'20%',margin:'50px auto'}}>
                <h1>{this.state.value}</h1>
                <SearchSelect multiple value={this.state.value} onChange={this.handleChange} list={this.state.list}/>
            </div>
        );
    }
});

module.exports = SearchSelectPage;