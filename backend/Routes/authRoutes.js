const express = require("express")
const authControllers = require("../Controllers/authController")
const authMiddleware = require("../Middleware/authMiddleware")

const router = express.Router()

router.post("/login",authControllers.loginUser)
router.post("/signup", authControllers.registerUser)
router.get("/protected", authMiddleware, async(req,res)=> {
    res.status(200).json("protected route")
})




module.exports = router