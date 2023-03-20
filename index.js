const express = require("express");
const fetch = require("axios");
const app = express();
const port = process.env.port || 8080;
const { JWTStrategy } = require("@sap/xssec");
const xsenv = require("@sap/xsenv");
const passport = require("passport");

passport.use(new JWTStrategy(xsenv.getServices({ uaa: { tag: "xsuaa" } }).uaa));

app.use(passport.initialize());
app.use(passport.authenticate("JWT", { session: false }));

app.get("/", (req, res, next) => {
  res.send("Node Js Based Service With App Router for SAP BTP CF by Satyajit");
});

app.get("/PRD/Products", checkScope, async (req, res, next) => {
  var result;
  result = await fetch.get("https://services.odata.org/v2/northwind/northwind.svc/Products?$format=json")
  res.send(result.data);
});


function checkScope(req, res, next) {
  if (req.authInfo.checkLocalScope("read")) {
    next();
  } else {
    res.status(403).end("Forbidden");
  }
}
app.listen(port, console.log(`Listening on port ${port}`));