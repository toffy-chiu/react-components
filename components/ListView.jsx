var React=require('react');

var ListView = React.createClass({
    render: function() {
        return (
            <div>
                <h3>{this.props.title}</h3>
                <ol>
                    {
                        React.Children.map(this.props.children, function(child){
                            return <li>{child}</li>;
                        })
                    }
                </ol>
            </div>
        );
    }
});
module.exports=ListView;