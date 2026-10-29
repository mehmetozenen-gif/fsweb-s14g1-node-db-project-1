
const express = require('express');

const accountsRouter = require('./accounts/accounts-router');

const server = express();

// JSON verilerini işle
server.use(express.json());

// Accounts API
server.use('/api/accounts', accountsRouter);

// Ana endpoint
server.get('/', (req, res) => {
  res.status(200).json({
    message: 'Node DB1 API is running',
  });
});

// Bulunamayan endpointler
server.use((req, res) => {
  res.status(404).json({
    message: 'endpoint not found',
  });
});

// Genel hata yakalama
server.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: 'internal server error',
  });
});

module.exports = server;
