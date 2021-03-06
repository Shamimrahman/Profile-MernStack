const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../Model/userSchema");

const Authenticate = async (req, res, next) => {
  try {
    // console.log(req.cookies);
    const token = req.cookies.jwt;
    if (!token) {
      console.log("token not found", token);
    }
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

    const rootUser = await User.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });
    if (!rootUser) {
      throw new Error("user not found");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;

    next();
  } catch (err) {
    res.status(401).send("Unauthorized: No token provided");
    console.log(err);
  }
};

module.exports = Authenticate;
