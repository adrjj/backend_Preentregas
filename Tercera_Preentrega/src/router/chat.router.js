const express = require("express");
const router = express.Router();
const ChatManager = require("../dao/chatManagerdb.js")
const { user  }=require("../middleware/roles.js")
const {isAuthenticated}=require("../middleware/authenticated.js")


router.get("/",isAuthenticated,user, async (req, res) => {
  try {
    

     res.render('chat',{});
  } catch (error) {
      res.status(500).json({ error: "6//Error al cargar los datos", message: error.message });
  }
});



module.exports = router;