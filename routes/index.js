const { Router } = require("express");
const router = Router();

router.use("/calendars", require('./calendars'));

module.exports = router;
