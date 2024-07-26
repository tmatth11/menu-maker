const Client = require('pg');

const connectionOptions = {
    host: 'localhost',
    port: 5432,
    user: 'root',
    password: 'root',
    database: 'menu_maker'
};
const dbClient = new Client.Client(connectionOptions);

dbClient.connect(() => {
    console.log('Connected to postgres db!');
});

module.exports = dbClient;