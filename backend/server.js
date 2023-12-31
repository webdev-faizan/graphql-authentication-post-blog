import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import cors from "cors";
import rateLimit from "express-rate-limit";
import session from "express-session";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { corsOptions } from "./src/config/config.js";
import xss from "xss-clean";
import express from "express";
import "dotenv/config";
import resolvers from "./src/graphql/resolvers.js";
import typeDefs from "./src/graphql/typedefs.js";
import mongoose, { mongo } from "mongoose";

process.on("uncaughtException", (error) => {
  console.log(error);
  process.exit(-1);
});
// ! db connection
mongoose
  .connect(process.env.URI)
  .then(() => {
    console.log("Successfully connected to the database 🚀");
  })
  .catch((error) => {
    console.error("Failed to establish a connection to the database", error);
  });
console.log(process.env.URI);

async function StartServer() {
  const app = express();

  const PORT = process.env.PORT || 3002;
  const Server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
  });
  //! middleware
  //* Middleware to parse JSON requests with a limit of 10MB
  app.use(express.json({ limit: "10MB" }));

  //* Middleware to parse URL-encoded requests with extended mode set to true and a limit of 10MB
  app.use(bodyParser.urlencoded({ extended: true, limit: "10MB" }));

  //* Middleware to parse URL-encoded requests with extended mode set to false and a limit of 10MB
  app.use(bodyParser.urlencoded({ extended: false, limit: "10MB" }));

  //* Middleware to sanitize user input for preventing Cross-Site Scripting (XSS) attacks
  app.use(xss());
  //* Middleware to sanitize user input against MongoDB query injection
  app.use(mongoSanitize());

  //* Middleware for compressing response bodies for faster transmission
  app.use(compression());

  //* Middleware for enabling Cross-Origin Resource Sharing (CORS)
  app.use(cors(corsOptions));

  //* Middleware for logging HTTP requests
  // app.use(morgan("combined"));

  //* Middleware for parsing cookies attached to the client's request
  app.use(cookieParser());
  await Server.start();
  Server.applyMiddleware({ app, path: "/graphql" });
  //* Middleware to sanitize user input for preventing Cross-Site Scripting (XSS) attacks

  app.get("/test", (req, res) => {
    // Simulate user input from a query parameter
    const userInput = req.query.input || "";
    console.log(req.query);

    // Reflect sanitized user input in the response
    res.send(`<p>${userInput}</p>`);
  });
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at ${PORT}`);
  });
}

StartServer();
process.on("unhandledRejection", (error) => {
  console.log(error);
  process.exit(-1);
});
