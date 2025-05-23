import express, { Application } from "express";
import { AuthRouter } from "../api/auth/auth.route";

export default class App {
  public express: Application;

  constructor() {
    this.express = express();

    this.middlewares();
    this.routes();
  }

  private middlewares() {
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
  }

  private routes() {
    // welcome route
    this.express.get("/", (req, res) => {
      res.send("Welcome to the API");
    });

    const apiPrefix = "/api";
    this.express.use(`${apiPrefix}`, AuthRouter);
  }
}
