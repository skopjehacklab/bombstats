var Router = ReactRouter;
var Route = React.createFactory(Router.Route);
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;
var Link = Router.Link;


var Sogovornik = React.createClass({displayName: "Sogovornik",
    render: function() {
        var cel_naziv = this.props.data.назив.map(function(del) {
            return React.createElement("span", null, del, " ");
        })
        return (
            React.createElement("span", {className: "sogovornik"}, cel_naziv)
        );
    }
});

var Razgovor = React.createClass({
    displayName: 'Razgovor',
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },
    getInitialState: function() {
        return null;
    },
    componentDidMount: function() {
        var self = this;
        var razgovorId = this.context.router.getCurrentParams()['razgovorId'];
        $Couch.get(razgovorId).done(function(data) {
            self.setState({ r: data });
        });
    },
    render: function() {
        if (this.state === null) {
            return React.createElement("div", {className: "razgovor"}, "лодин ...")
        }
        var repliki = this.state.r.содржина.map(function(replika) {
            return React.createElement("p", null, replika);
        });
        return (
            React.createElement("div", {className: "razgovor"}, 
              React.createElement("h3", null, 
                "Разговор помеѓу ", 
                React.createElement(Sogovornik, {data: this.state.r.соговорници[0]}), "и ", 
                React.createElement(Sogovornik, {data: this.state.r.соговорници[1]})
              ), 
              repliki
            )
        );
    }
});

var BombaZaVlada = React.createClass({displayName: "BombaZaVlada",
    getInitialState : function () {
        return {data: []};
    },
    componentDidMount : function () {
        $Couch.view('all', {include_docs: true}).done(function(response) {
            var razgovori = response.rows.slice(1,10).map(function(bomba) {
                return React.createElement(Razgovor, {doc: bomba.doc})
            });
            this.setState({data: razgovori});
        }.bind(this));
    },
    render: function() {
        return (
            React.createElement("div", {id: "bomba_za_vlada"}, 
              React.createElement("h2", null, "Бомби"), 
              this.state.data
            )
        );
    }
});


var Naslovna = React.createClass({displayName: "Naslovna",
    render: function() {
        return (
            React.createElement("div", null, React.createElement("h2", null, "TES"))
        );
    }
});


var App = React.createClass({
    displayName: 'App',
    render: function() {
        return React.createElement(RouteHandler, null)
    }
});


var routes = (
    React.createElement(Route, {name: "app", path: "/", handler: App}, 
        React.createElement(DefaultRoute, {handler: Naslovna}), 
        React.createElement(Route, {name: "r/:razgovorId", handler: Razgovor}), 
        React.createElement(NotFoundRoute, {handler: Naslovna})
    )
);

Router.run(routes, function(Handler) {
    React.render(
        React.createElement(Handler, null),
        document.getElementById("container")
    );
});
