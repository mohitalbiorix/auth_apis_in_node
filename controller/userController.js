const UserModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserController {

   // user registration
   static userRegistration = async (req, res) => {
      const { name, email, password, password_confirmation, tc } = req.body;

      try {
         const existingUser = await UserModel.findOne({ email: email });
         if (existingUser) {
            return res.status(400).send({ "status": "failed", "message": "Email already exists" });
         }

         if (!name || !email || !password || !password_confirmation || !tc) {
            return res.status(400).send({ "status": "failed", "message": "All fields are required" });
         }

         if (password !== password_confirmation) {
            return res.status(400).send({ "status": "failed", "message": "Password and Confirm Password don't match" });
         }

         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password, salt);

         const newUser = new UserModel({
            name: name,
            email: email,
            password: hashedPassword,
            tc: tc
         });

         await newUser.save();
         const existUser = await UserModel.findOne({ email: email });
         // Generate Token
         const token = jwt.sign({ userID: existUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' });
         res.status(201).send({ "status": "success", "message": "Registration Successful", "token": token });
      } catch (err) {
         console.log(err);
         res.status(500).send({ "status": "failed", "message": "Unable to register" });
      }
   };

   // user login
   static userLogin = async (req, res) => {
      try {
         const { email, password } = req.body;

         if (!email || !password) {
            return res.status(400).send({ "status": "failed", "message": "All fields are required" });
         }

         const user = await UserModel.findOne({ email: email });

         if (!user) {
            return res.status(400).send({ "status": "failed", "message": "Email or Password is not valid" });
         }

         const isMatch = await bcrypt.compare(password, user.password);

         if (!isMatch) {
            return res.status(400).send({ "status": "failed", "message": "Email or Password is not valid" });
         }

         const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' });

         res.status(201).send({ "status": "success", "message": "Login Successful", "token": token });
      } catch (err) {
         console.log(err);
         res.status(500).send({ "status": "failed", "message": "Unable to Login" });
      }
   };

   // change password
   static changeUserPassword = async (req, res) => {
      try {
         const { password, password_confirmation } = req.body;

         if (!password || !password_confirmation) {
            return res.status(400).send({ "status": "failed", "message": "All fields are required" });
         }

         if (password !== password_confirmation) {
            return res.status(400).send({ "status": "failed", "message": "New Password and Confirm New Password don't match" });
         }

         const salt = await bcrypt.genSalt(10);
         const newHashPassword = await bcrypt.hash(password, salt);

         await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: newHashPassword } });

         res.send({ "status": "success", "message": "Password changed successfully" });
      } catch (err) {
         console.log(err);
         res.status(500).send({ "status": "failed", "message": "Unable to change password" });
      }
   };

   // logged user data
   static loggedUser = async (req, res) => {
      res.send({ "user": req.user })
   }
}

module.exports = UserController;