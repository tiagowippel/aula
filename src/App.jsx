'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import Promise from 'bluebird';
Promise.config({
    cancellation: true,
    warnings: false,
});
global.Promise = Promise;

import DevTools from 'mobx-react-devtools';

import 'roboto-fontface/css/roboto/sass/roboto-fontface-medium.scss';
import 'react-flexbox-grid/dist/react-flexbox-grid.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import { red500, blue500, blue700 } from 'material-ui/styles/colors';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import {
    Card,
    //CardActions,
    //CardHeader,
    //CardMedia,
    //CardTitle,
    CardText,
} from 'material-ui/Card';

import {
    observable,
    action,
    //toJS,
    // extendObservable,
} from 'mobx';

import { observer, Provider } from 'mobx-react';

import {
    BrowserRouter as Router,
    //HashRouter as Router,
    Route,
    Link,
    Redirect,
    Switch,
    withRouter,
} from 'react-router-dom';

//import axios from 'axios';

//import ApolloClient, { HttpLink, createHttpLink, setContext } from 'apollo-client-preset';

const NotificationSystem = require('react-notification-system');

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: blue500,
        primary2Color: blue700,
    },
    datePicker: {
        headerColor: blue500,
    },
    zIndex: {
        //layer: 9999999999,
    },
});

const Teste = props => (
    <div>
        <Card>
            <CardText>
                <h1>{JSON.stringify(props)}</h1>
            </CardText>
        </Card>
        <Card>
            <CardText>
                <RaisedButton
                    label="teste1"
                    onClick={e => {
                        appStore.showError('teste1');
                    }}
                />
                <RaisedButton
                    label="teste2"
                    onClick={e => {
                        appStore.showMessage('teste2');
                        appStore
                            .showDialog('teste2')
                            .then(() => {
                                console.log(value);
                            })
                            .catch(err => {});
                    }}
                />
                <RaisedButton
                    label="teste3"
                    onClick={e => {
                        appStore.addNotification({
                            message: 'teste3',
                            level: 'warning',
                        });
                    }}
                />
                <RaisedButton
                    label="teste graphql"
                    onClick={e => {
                        appStore.waitDialog--;
                        appStore.client
                            .query({
                                query: gql`
                                    query($x: Int!) {
                                        teste(x: $x) {
                                            password
                                        }
                                    }
                                `,
                                variables: {
                                    x: 5,
                                },
                                fetchPolicy: 'network-only',
                            })
                            .then(res => {
                                console.log(res.data.teste);
                            })
                            .finally(() => {
                                appStore.waitDialog--;
                            });
                    }}
                />
            </CardText>
        </Card>
    </div>
);

// import Usuarios from './Usuarios';
// import Perfil from './Perfil';

const imports = {
    // Perfil: Perfil,
    // Usuarios: Usuarios,
    Teste: Teste,
};

import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

const appStore = {
    client: new ApolloClient({
        link: new HttpLink({
            uri: '/graphql',
        }),
        cache: new InMemoryCache({
            addTypename: false,
        }),
    }),

    @observable user: null,

    notificationSystem: null,
    addNotification(obj) {
        this.notificationSystem.addNotification(obj);
    },

    @observable msg: '',
    @action
    showMessage(msg) {
        this.msgColor = muiTheme.palette.primary1Color;
        this.msg = '';
        setTimeout(() => {
            this.msg = msg;
        }, 100);
    },
    @action
    showError(msg) {
        this.msgColor = red500;
        this.msg = '';
        setTimeout(() => {
            this.msg = msg;
        }, 100);
    },

    @observable waitDialog: 0,
    @observable dialog: null,
    @action
    showDialog(msg) {
        return new Promise((resolve, reject) => {
            this.dialog = {
                msg: msg,
                actions: [
                    <FlatButton
                        label="Cancelar"
                        keyboardFocused={true}
                        onClick={() => {
                            this.dialog = null;
                            reject();
                        }}
                        //ref={(obj)=>{this.cancelButton = obj}}
                    />,
                    <FlatButton
                        label="OK"
                        primary
                        onClick={() => {
                            this.dialog = null;
                            resolve();
                        }}
                        //ref={(obj)=>{this.okButton = obj}}
                    />,
                ],
            };
        });
    },
};

//@observer
const Dashboard = withRouter(
    observer(
        class Dashboard extends React.Component {
            constructor(props) {
                super(props);
            }

            pageStore = {
                @observable open: false,
                @action
                toggleDrawer: e => {
                    this.pageStore.open = !this.pageStore.open;
                },
            };

            componentDidMount = () => {};

            render() {
                const { pageStore } = this;

                return (
                    <div>
                        <AppBar
                            title={`SISTEMA (${'x'})`}
                            onLeftIconButtonClick={pageStore.toggleDrawer}
                            style={{
                                position: 'fixed',
                            }}
                            iconElementRight={
                                <FlatButton
                                    label="Sair"
                                    onClick={e => {
                                        e.preventDefault();
                                        appStore
                                            .showDialog('Deseja realmente sair?')
                                            .then(value => {
                                                this.props.history.replace('/');
                                            })
                                            .catch(err => {});
                                    }}
                                />
                            }
                        />
                        <Drawer
                            open={pageStore.open}
                            //width={200}
                            docked={false}
                            onRequestChange={pageStore.toggleDrawer}
                        >
                            <List>
                                <ListItem primaryText="Início" containerElement={<Link to="/" />} onClick={pageStore.toggleDrawer} />
                                <ListItem primaryText="Teste" containerElement={<Link to="/teste" />} onClick={pageStore.toggleDrawer} />
                                {/* <ListItem
                                    primaryText="Usuários"
                                    containerElement={<Link to="/usuarios" />}
                                    onClick={pageStore.toggleDrawer}
                                />
                                <ListItem
                                    primaryText="Perfil"
                                    containerElement={<Link to="/perfil" />}
                                    onClick={pageStore.toggleDrawer}
                                /> */}
                                <Divider />
                            </List>
                        </Drawer>
                        <div
                            style={{
                                padding: 10,
                                paddingTop: 75,
                            }}
                        >
                            <Switch>
                                <Route
                                    path="/"
                                    exact
                                    component={props => (
                                        <Card
                                            style={{
                                                maxWidth: '800px',
                                                margin: 'auto',
                                            }}
                                        >
                                            <CardText>
                                                <h1>Home</h1>
                                            </CardText>
                                        </Card>
                                    )}
                                />
                                <Route path="/404" component={props => <h1>404</h1>} />
                                <Route path="/teste" component={imports['Teste']} />
                                <Route component={() => <Redirect to="/404" />} />
                            </Switch>
                        </div>
                    </div>
                );
            }
        },
    ),
);

@observer
class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <Provider appStore={appStore}>
                    <Router>
                        <div>
                            <Dashboard />

                            <div>
                                <Snackbar
                                    bodyStyle={{ background: appStore.msgColor }}
                                    message={appStore.msg}
                                    open={appStore.msg !== ''}
                                    onRequestClose={() => {
                                        appStore.msg = '';
                                    }}
                                    autoHideDuration={5000}
                                />
                                <Dialog
                                    open={!!appStore.dialog}
                                    title="Atenção"
                                    actions={appStore.dialog && appStore.dialog.actions}
                                    //modal={true}
                                    onRequestClose={() => {
                                        appStore.dialog = null;
                                    }}
                                >
                                    {appStore.dialog && appStore.dialog.msg}
                                </Dialog>
                                <Dialog
                                    //style={{ zIndex: 999999 }}
                                    open={appStore.waitDialog > 0}
                                    modal={true}
                                    contentStyle={{
                                        width: 100,
                                    }}
                                >
                                    <CircularProgress size={50} thickness={10} />
                                </Dialog>
                                <div style={{ fontFamily: muiTheme.fontFamily }}>
                                    <NotificationSystem ref={obj => (appStore.notificationSystem = obj)} />
                                </div>
                                <DevTools />
                            </div>
                        </div>
                    </Router>
                </Provider>
            </MuiThemeProvider>
        );
    }
}

const root = document.getElementById('app');

try {
    ReactDOM.render(<App />, root);
} catch (e) {
    const RedBox = require('redbox-react').default;
    ReactDOM.render(<RedBox error={e} />, root);
}
