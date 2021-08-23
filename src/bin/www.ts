#!/usr/bin/env node

/**
 * Module dependencies.
 */

import http from "http"

import config from "../server/config"

import app from "../server/app"

import { AddressInfo } from "net";

const log = config.development.log();


// Helper functions

/**
 * Normalize a port into a number, string, or false.
 */

 function normalizePort(val : (string)) {
    const port : number = parseInt(val, 10);
  
    if (Number.isNaN(port)) {
      // named pipe
      return val;
    }
    if (port >= 0) {
      // port number
      return port;
    }
    return false;
  }
  
  
  /**
   * Get port from environment and store in Express.
   */
  const port : (number |string | boolean) = normalizePort(process.env.PORT || '3000');
  app.set('port', port);
  
  /**
   * Create HTTP server and listen on the provided port
   */
  const server = http.createServer(app);

    server.listen(port);
 
  
  server.on("error", onError);
  server.on("listening", onListening);
  /**
   * Event listener for HTTP server "error" event.
   */
  
  function onError(error: { syscall: string; code: string; }) {
    if (error.syscall !== "listen") {
      throw error;
    }
  
    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
  
  /**
   * Event listener for HTTP server "listening" event.
   */
  
  function onListening() {
    var addr: (string |AddressInfo | null) = server.address();
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
    log.info("Listening on " + bind);
  }