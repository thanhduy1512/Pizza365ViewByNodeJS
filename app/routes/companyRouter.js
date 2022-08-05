const express = require("express");

const router = express.Router();

const data = require("../data/dataCompany");

router.get("/companies", (request, response) => {
  response.status(200).json({ ...data });
});

module.exports = router;
