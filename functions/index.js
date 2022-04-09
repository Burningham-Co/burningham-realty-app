// const axios = require("axios");
const functions = require("firebase-functions");
const needle = require("needle");
// const express = require("express");
const cors = require("cors")({ origin: true });
// const url = require("url");

// const app = express();

const baseUrl = functions.config().base.url;
const accessToken = functions.config().access.token;

exports.allLoops = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };
    const number = req.query.page;
    const params = `statusIds=4&sortBy=9&sortDirection=0&batchNumber=${number}`;

    needle("get", `${baseUrl}?${params}`, options)
      .then((response) => res.status(200).json(response.body))
      .catch((err) => res.status(500).json(err));

    //   .then((resp) => {
    //     let data = resp.data;
    //     response.status(200).json(data);
    //   })
    //   .catch((err) => {
    //     response.status(500).json(err);
    //   });
  });
});

exports.loopDetails = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };
    // const params = new URLSearchParams({
    //   ...url.parse(req.url, true).query,
    // });
    const loopId = req.query.loopId;
    const params = `${loopId}/detail`;

    needle("get", `${baseUrl}/${params}`, options)
      .then((response) => res.status(200).json(response.body))
      .catch((err) => res.status(500).json(err));
  });
});
