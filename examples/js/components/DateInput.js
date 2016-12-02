var DateInput=require('../../../src/DateInput');

var DateInputPage = React.createClass({
    getInitialState:function(){
        return {
            value:'2016-12-02'
        }
    },
    handleChange:function(e){
        this.setState({value:e.target.value});
    },
    render: function() {
        return (
            <div>
                <h1>{this.state.value}</h1>
                <DateInput value={this.state.value} onChange={this.handleChange}/>
            </div>
        );
    }
});

module.exports = DateInputPage;