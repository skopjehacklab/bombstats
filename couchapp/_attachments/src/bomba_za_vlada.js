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
            return <div className="razgovor">лодин ...</div>
        }
        var repliki = this.state.r.содржина.map(function(replika) {
            return <p>{replika}</p>;
        });
        return (
            <div className="razgovor">
              <h3>
                <a href={this.state.link}>
                  Разговор помеѓу&nbsp;
                  <Sogovornik data={this.state.r.соговорници[0]} />и&nbsp;
                  <Sogovornik data={this.state.r.соговорници[1]} />
                </a>
              </h3>
              {repliki}
            </div>
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
            return <div>лодин бомба ...</div>
        }
        var bombi = this.state.b.map(function(razgovor) {
            return <Razgovor key={razgovor.doc._id} data={razgovor.doc} />
        });
        return (
            <div id="bomba_za_vlada">
              <h2>Бомбa {this.state.id}</h2>
              {bombi}
            </div>
        );
    }
});


var Naslovna = React.createClass({
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
            return <div>лодин ...</div>
        }
        var bombi = this.state.b.map(function(bomba) {
            var brojRazgovori =  "(" + bomba.value + " разговори)";
            var linkUrl = "#b/" + bomba.key;
            return <a href={linkUrl}><b>{bomba.key}</b><span>{brojRazgovori}</span></a>
        });
        return (
            <div className="bombi">{bombi}</div>
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
        <Route name="b/:bombaId" handler={Bomba} />
        <NotFoundRoute handler={Naslovna} />
    </Route>
);

Router.run(routes, function(Handler) {
    React.render(
        <Handler />,
        document.getElementById("container")
    );
});
