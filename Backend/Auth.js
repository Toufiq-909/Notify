const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { loginmodel } = require("./db.js");
require("dotenv").config();

function issueToken(name) {
    return jwt.sign({ name }, process.env.secret, { expiresIn: "5m" });
}

async function Login(req, res) {
    try {
        const { name, password } = req.body;
        const user = await loginmodel.findOne({ name });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ msg: "Invalid username or password." });
        }
        return res.status(200).json({ msg: "Login successful!", token: issueToken(name) });
    } catch (error) {
        console.error("Login failed:", error.message);
        return res.status(500).json({ msg: "Unable to log in. Please try again." });
    }
}

async function Signup(req, res) {
    try {
        const { name, password } = req.body;
        if (await loginmodel.findOne({ name })) {
            return res.status(409).json({ msg: "That username is already taken." });
        }
        const token = issueToken(name);
        const hashedPassword = await bcrypt.hash(password, 10);
        await loginmodel.create({ name, password: hashedPassword });
        return res.status(201).json({ msg: "Account created!", token });
    } catch (error) {
        console.error("Signup failed:", error.message);
        return res.status(500).json({ msg: "Unable to create your account. Please try again." });
    }
}

function Authmiddleware(req, res, next) {
    const { name, password } = req.body || {};
    if (typeof name !== "string" || typeof password !== "string" ||
        name.trim().length < 4 || password.length < 4) {
        return res.status(400).json({ msg: "Username and password must each contain at least 4 characters." });
    }
    req.body.name = name.trim();
    next();
}

module.exports = { Login, Signup, Authmiddleware };
