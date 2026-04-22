var express = require('express');
var router = express.Router();
const userCTRL = require("../controllers/userCTRL");


router.post("/registration", userCTRL.registerUser);
router.post("/login", userCTRL.loginUser);
router.get("/fetchUser", userCTRL.fetchUser);
router.get("/logoutUser", userCTRL.logoutUser)

module.exports = router;

