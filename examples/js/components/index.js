var Link=require('react-router').Link;

var Index = React.createClass({
    render: function() {
        return (
            <div>
                <ul>
                    <li>
                        <Link to="/DateInput">DateInput</Link>
                    </li>
                    <li>
                        <Link to="/SearchSelect">SearchSelect</Link>
                    </li>
                </ul>
            </div>
        )
    }
});

module.exports = Index;