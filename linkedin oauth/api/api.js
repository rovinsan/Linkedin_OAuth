"use strict";

require("dotenv").config();
var request = require("request"),
    express = require("express"),
    router = express.Router();

const CLIENTID = process.env.CLIENTID,
    CLIENTSECRET = process.env.CLIENTSECRET,
    REDIRECTURI = process.env.REDIRECTURI;

var access_token = "";

var oauthUrl = getOAuthURL();

function getOAuthURL() {

    var authUrl = "https://www.linkedin.com/uas/oauth2/authorization?";
    var access_type = "access_type=offline&";
    var scope =
        "scope=" +
        encodeURIComponent(
            "r_basicprofile r_emailaddress" 
        ) +
        "&";
    var response_type = "response_type=code&";
    var client_id = "client_id=" + CLIENTID + "&";
    var state = "state=123456&";
    var redirect_uri = "redirect_uri=" + encodeURIComponent(REDIRECTURI);

    var oauthUrl = authUrl + access_type + scope + response_type + client_id + state + redirect_uri;
    return oauthUrl;
}


router.get(
    "/auth",
    (req, res) => {
        res.json({ url: oauthUrl });
    },
    (err) => {
        console.error(err);
        res.send(500);
    }
);


router.use("/callback", (req, res) => {
    var session = req.session;
    var code = req.query.code;

    var url = "https://www.linkedin.com/uas/oauth2/accessToken";
    request(
        {
            uri: url,
            method: "POST",
            form: {
                code: code,
                client_id: CLIENTID,
                client_secret: CLIENTSECRET,
                grant_type: "authorization_code",
                redirect_uri: REDIRECTURI
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        },
        (err, response, body) => {
            if (err) {
                return console.error(err);
            }

            console.log(body);

            var json = JSON.parse(body);
            access_token = json.access_token;
            session["tokens"] = body;

            res.redirect("/home");
        }
    );
});


router.post("/user", (req, res) => {

    var url = "https://api.linkedin.com/v1/people/~:(first-name,last-name,email-address,picture-url,public-profile-url,summary,industry)?format=json";
    request(
        {
            uri: url,
            method: "GET",
            headers: {
                Authorization: "Bearer " + access_token
            }
        },
        (error, response, body) => {
            if (error) {
                console.error(error);
                res.sendStatus(500);
            }

            console.log(body);
            res.json(body);
        }
    );
});

function summa() {
    // authorization uri
    var authUrl = "https://accounts.google.com/o/oauth2/v2/auth?";

    //#region get parameters

    // access_type
    var access_type = "access_type=offline&";
    // scopes
    var scope =
        "scope=" +
        encodeURIComponent(
            "https://www.googleapis.com/auth/drive.file" +
                " " +
                "https://www.googleapis.com/auth/drive.metadata.readonly" +
                " " +
                "https://www.googleapis.com/auth/plus.me"
        ) +
        "&";
    // response type
    var response_type = "response_type=code&";
    // client id
    var client_id = "client_id=" + CLIENTID + "&";
    // redirect uri
    var redirect_uri = "redirect_uri=" + encodeURIComponent("http://localhost:8082/SSD-I/oauth-google-drive-file-upload-php/service.php");

    //#endregion

    // prepare url and return
    var oauthUrl = authUrl + access_type + scope + response_type + client_id + redirect_uri;
    console.log(oauthUrl);
    return oauthUrl;
}

summa();

module.exports = router;
