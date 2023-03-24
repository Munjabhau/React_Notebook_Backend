const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');

const JWT_SECRET='Hellou$ser';
//Create a user using: POST "/api/auth/createuser". No login required.
router.post(
  "/createuser",
  [
    body("email", "Enter a valid mail").isEmail(),
    body("name", "Enter valid name").isLength({ min: 3 }),
    body("password", "Enter valid password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    //If there are errors,returns Bad request and the errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //Check whether the user with this email exists already.
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry with this email already exists" });
      }

      const salt=await bcrypt.genSalt(10);
      const secPass= await bcrypt.hash(req.body.password,salt);
      //Create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data={
        user:{
          id:user.id
        }
      }
      const authtoken=jwt.sign(data,JWT_SECRET);
      // console.log(jwtData);

      // res.json(user);
      res.json({authtoken:authtoken})
    } catch(error) {
      console.log(error.message);
      res.status(500).send("some error accured");
    }
  }
);
module.exports = router;
