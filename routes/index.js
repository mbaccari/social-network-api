// Require express
const express = require('express');

// Require express router
const router = require('express').Router();

// Import all of the API routes 
const apiRoutes = require('./api');

// add prefix of `/api` to all of the api routes
router.use('/api', apiRoutes);

// 404 Status error message
router.use((req, res) => {
    console.log("shits broke")
    res.status(404).send('<h1>404 Error....</h1>');
  });
  
  router.use("/", express.static("public"));

// Module exports router
module.exports = router;