var React=require('react');
var ReactDOM=require('react-dom');

var ExampleApplication = require('./ExampleApplication');
var ListView = require('./ListView');
var start = new Date().getTime();
ReactDOM.render(
    <div>
        <ExampleApplication elapsed={new Date().getTime() - start} />
        <ListView title="list-view">
            <a href="#">one</a>
            <a href="#">two</a>
            <a href="#">three</a>
        </ListView>
    </div>
    ,
    document.getElementById('container')
);