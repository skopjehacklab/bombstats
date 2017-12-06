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
    componentWillMount: function() {
        if (this.props.data !== undefined) {
            this.setState({ r: this.props.data, link: "#r/" + this.props.data["_id"] });
        }
    },
    componentDidMount: function() {
        if (this.state === null) {
            var razgovorId = this.context.router.getCurrentParams()['razgovorId'];
            $Couch.get(razgovorId).done(function(data) {
                this.setState({ r: data, link: "#r/" + razgovorId, bomba: data.бомба.реден_број });
            }.bind(this));
        }
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
                React.createElement("a", {href: this.state.link},
                  "Разговор помеѓу ",
                  React.createElement(Sogovornik, {data: this.state.r.соговорници[0]}), "и ",
                  React.createElement(Sogovornik, {data: this.state.r.соговорници[1]})
                )
              ),
              repliki
            )
        );
    }
});

var Bomba = React.createClass({
    displayName: 'Bomba',
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },
    getInitialState: function() {
        return null;
    },
    componentDidMount: function() {
        var bombaId = this.context.router.getCurrentParams()['bombaId'];
        $Couch.view("bombi", {key: bombaId, include_docs: true}).done(function(data) {
            this.setState({ b: data.rows, id: bombaId });
        }.bind(this));
    },
    render: function() {
        if (this.state === null) {
            return React.createElement("div", null, "лодин ...")
        }
        var bombi = this.state.b.map(function(razgovor) {
            return React.createElement(Razgovor, {key: razgovor.doc._id, data: razgovor.doc})
        });
        return (
            React.createElement("div", {id: "bomba_za_vlada"},
              React.createElement("h2", null, "Бомбa ", this.state.id),
              bombi
            )
        );
    }
});


var Naslovna = React.createClass({displayName: "Naslovna",
    getInitialState: function() {
        return null;
    },
    componentDidMount: function() {
        $Couch.view('bombi', {reduce: true, group_level: 1}).done(function(response) {
            this.setState({ b: response.rows });
        }.bind(this));
    },
    render: function() {
        if (this.state === null) {
            return React.createElement("div", null, "лодин ...")
        }
        var bombi = this.state.b.map(function(bomba) {
            var brojRazgovori =  "(" + bomba.value + " разговори)";
            var linkUrl = "#b/" + bomba.key;
            return React.createElement("a", {href: linkUrl}, React.createElement("b", null, bomba.key), React.createElement("span", null, brojRazgovori))
        });
        return (
            React.createElement("div", {className: "bombi"}, bombi)
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
        React.createElement(Route, {name: "b/:bombaId", handler: Bomba}),
        React.createElement(NotFoundRoute, {handler: Naslovna})
    )
);

Router.run(routes, function(Handler) {
    React.render(
        React.createElement(Handler, null),
        document.getElementById("container")
    );
});
