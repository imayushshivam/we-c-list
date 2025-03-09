import { createRequestHandler } from "@remix-run/express";
import express from "express";
import * as build from "./build/server/index.js";

const app = express();
app.use(express.static("public"));

// Use Remix request handler
app.all(
  "*",
  createRequestHandler({
    build,
    mode: process.env.NODE_ENV,
  })
);

// Use the PORT provided by Render or fall back to 3000
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
