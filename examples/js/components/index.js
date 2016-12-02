var Link=require('react-router').Link;

var Index = React.createClass({
    render: function() {
        return (
            <div>
                <ul>
                    <li>
                        <Link to="/DateInput">DateInput</Link>
                    </li>
                </ul>
            </div>
        );
    }
});

module.exports = Index;