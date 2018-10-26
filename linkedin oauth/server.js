"use strict";

var path = require("path"),
    bodyParser = require("body-parser"),
    express = require("express"),
    session = require("express-session"),
    morgan = require("morgan");

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/node", express.static(__dirname + "/node_modules"));

app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true
    })
);

var linkedin = require("./api/api")
var api = linkedin.router;
app.use("/api", api);

app.use("/", (req, res) => {
    res.render("index.ejs", {
        message: linkedin.oauthUrl
    });
});

app.listen(port, function(err) {
    if (err) {
        console.error(err);
        return;
    }

    console.log("Server running on port " + port);
});
