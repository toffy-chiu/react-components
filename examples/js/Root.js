var React=require('react');
var ReactRouter=require('react-router'),
    history=ReactRouter.hashHistory,
    IndexRedirect=ReactRouter.IndexRedirect,
    Route=ReactRouter.Route,
    Router=ReactRouter.Router;
require('../css/amazeui.min.css');

//顶级组件
var Index=require('./components/index');

//各模块页面
var DateInput=function(location, cb){require.ensure([], function(require){cb(null, require('./components/DateInput'));});};

module.exports = React.createClass({
    render: function() {
        return (
            <Router history={history}>
                <Route path="/">
                    <IndexRedirect to="/index"/>
                    <Route path="/index" getComponent={Index}/>
                    <Route path="DateInput" getComponent={DateInput}/>
                </Route>
            </Router>
        );
    }
});