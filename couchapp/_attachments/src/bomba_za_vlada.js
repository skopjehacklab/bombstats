var Router = ReactRouter;
var Route = React.createFactory(Router.Route);
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;
var Link = Router.Link;


var Sogovornik = React.createClass({
    render: function() {
        var cel_naziv = this.props.data.назив.map(function(del) {
            return <span>{del}&nbsp;</span>;
        })
        return (
            <span className="sogovornik">{cel_naziv}</span>
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
            return <div className="razgovor">лодин ...</div>
        }
        var repliki = this.state.r.содржина.map(function(replika) {
            return <p>{replika}</p>;
        });
        return (
            <div className="razgovor">
              <h3>
                Разговор помеѓу&nbsp;
                <Sogovornik data={this.state.r.соговорници[0]} />и&nbsp;
                <Sogovornik data={this.state.r.соговорници[1]} />
              </h3>
              {repliki}
            </div>
        );
    }
});

var BombaZaVlada = React.createClass({
    getInitialState : function () {
        return {data: []};
    },
    componentDidMount : function () {
        $Couch.view('all', {include_docs: true}).done(function(response) {
            var razgovori = response.rows.slice(1,10).map(function(bomba) {
                return <Razgovor doc={bomba.doc} />
            });
            this.setState({data: razgovori});
        }.bind(this));
    },
    render: function() {
        return (
            <div id="bomba_za_vlada">
              <h2>Бомби</h2>
              {this.state.data}
            </div>
        );
    }
});


var Naslovna = React.createClass({
    render: function() {
        return (
            <div><h2>TES</h2></div>
        );
    }
});


var App = React.createClass({
    displayName: 'App',
    render: function() {
        return <RouteHandler />
    }
});


var routes = (
    <Route name="app" path="/" handler={App}>
        <DefaultRoute handler={Naslovna} />
        <Route name="r/:razgovorId" handler={Razgovor} />
        <NotFoundRoute handler={Naslovna} />
    </Route>
);

Router.run(routes, function(Handler) {
    React.render(
        <Handler />,
        document.getElementById("container")
    );
});
