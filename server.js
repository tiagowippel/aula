'use strict';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const sequelize = new Sequelize('db_test', '', '', {
    dialect: 'sqlite',
    logging: false,
    storage: './db/db.sqlite',
});

const Usuario = sequelize.define(
    'cadUsuario',
    {
        username: Sequelize.STRING,
        password: Sequelize.STRING,
        nome: Sequelize.STRING,
        email: Sequelize.STRING,
        permissoes: Sequelize.STRING,
        ativo: Sequelize.BOOLEAN,
        admin: Sequelize.BOOLEAN,
    },
    {
        freezeTableName: true,
        //tableName: 'my_very_custom_table_name'
        indexes: [
            {
                unique: true,
                fields: ['username'],
            },
        ],
    },
);

sequelize
    .sync({
        //force: true,
        match: /_test$/,
    })
    .then(value => {
        Usuario.findOne({ where: { username: 'admin' }, raw: true }).then(value => {
            return (
                !value &&
                Usuario.create({
                    username: 'admin',
                    password: 'admin',
                    nome: 'Admin',
                    ativo: true,
                    admin: true,
                }).then(value => {
                    //console.log(value);
                })
            );
        });
    });

const schema = `

    type Usuario {
        username:  String
        password: String
        ativo: Int
    }

    type Query {
        teste(x: Int!): Usuario
        teste2(x: Int!): Usuario
    }

    type Mutation {
        teste(input: String!): String
    }

    schema {
        query: Query
        mutation: Mutation
    }

`;

const resolvers = {
    Query: {
        teste(obj, args, context, info) {
            return new Promise((resolve, reject) => {
                const x = args.x;
                resolve({
                    username: '111',
                    password: x * 2,
                });
            });
        },
        teste2(obj, args, context, info) {
            return new Promise((resolve, reject) => {
                const x = args.x;
                resolve({
                    username: '111',
                    password: x * 2,
                });
            });
        },
    },
    Mutation: {
        teste(obj, args, context, info) {
            return new Promise((resolve, reject) => {
                console.log(args);
                resolve('ok');
            });
        },
    },
};

////////////////////////////////////////////////////////////////////////////////

const { makeExecutableSchema } = require('graphql-tools');
const graphqlHTTP = require('express-graphql');
//const { maskErrors, UserError } = require('graphql-errors');

const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');

const app = express();

function loggingMiddleware(req, res, next) {
    //console.log(req.headers);
    console.log('ip:', req.ip);
    next();
}

app.use(loggingMiddleware);

const compression = require('compression');
// compress all responses
//app.use(compression());

const executableSchema = makeExecutableSchema({
    typeDefs: schema,
    resolvers: resolvers,
});

//maskErrors(executableSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const api = express.Router();
app.use('/api', api);

const authMiddleware = (req, res, next) => {
    next();
};

app.use(
    '/graphql',
    authMiddleware,
    graphqlHTTP({
        schema: executableSchema,
        graphiql: true,
    }),
);

app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

const srv = app.listen(50000);
srv.setTimeout(24 * 10 * 60 * 1000);

const _ = require('lodash');
const moment = require('moment');

const numeral = require('numeral');
require('numeral/locales');
numeral.locale('pt-br');
