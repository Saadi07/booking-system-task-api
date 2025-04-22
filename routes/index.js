const express = require("express");
const router = express.Router();

router.use("/booking", require("./booking"));

module.exports = router;
