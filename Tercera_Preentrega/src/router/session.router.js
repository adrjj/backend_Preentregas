const express = require("express");
const router = express.Router();
const sessionModel = require("../models/user.model.js")
const authenticatedMiddleware = require("../middleware/authenticated.js");
const { createHash, isValidPassword } = require('../utils/utils.js');
const passport = require("passport");

const isAuthenticated = authenticatedMiddleware.isAuthenticated;
const isNotAuthenticated = authenticatedMiddleware.isNotAuthenticated;

router.get("/github",passport.authenticate("github",{scope:"user.email"}),async(req,res)=>{})

router.get("/githubCallback",passport.authenticate("github",{failureRedirect:"/login"}),async(req,res)=>{
  req.session.user=req.user
  res.redirect("/products?welcome=1")
})

router.get("/register", isNotAuthenticated, (req, res) => {
  res.render("register"); // Renderiza la vista de registro
});

router.get("/login", isNotAuthenticated, (req, res) => {
  res.render("login"); // Renderiza la vista de registro
});

router.get("/profile", isAuthenticated, (req, res) => {
  res.render("profile", { user: req.session.user }); // Renderiza la vista de registro
  console.log("2//", req.session.user)
});


router.post("/register", passport.authenticate("register", { failureRedirect: "failRegister" }), async (req, res) => {
  //res.send({status:"sucess",message:"usuario regsitrado"})
  res.redirect("login")

})
router.get("/failRegister", async (req, res) => {
  console.log("estrategia fallida")
  res.send(error, "fallo")

})
/*router.post("/register", async (req, res) => {
  const { first_name, last_name, email, password, isAdmin } = req.body;

  try {
    // Verificar si el correo electrónico ya está registrado
    const existingUser = await sessionModel.findOne({ email: email });
    if (existingUser) {
      // Si el correo electrónico ya está registrado, enviar una alerta
      return res.status(400).send("El correo electrónico ya está registrado.");
    }

    // Si el correo electrónico no está registrado, crear un nuevo usuario
    const newUser = new sessionModel({
      first_name,
      last_name,
      email,
      password: createHash(password),
      isAdmin
    });
    await newUser.save();
    res.redirect("login");
  } catch (error) {
    // Manejar errores
    res.status(500).send("Error al registrar usuario: " + error.message);
  }
});*/

/*router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Espera la respuesta de la búsqueda en la base de datos
    const user = await sessionModel.findOne({ email});
    if (!user) return res.status(404).send("Usuario no encontrado. O contraseña incorrecta");
    if (!isValidPassword(user, password)) return res.status(403).send({ status: "error", error: "Contraseña incorrecta" })
    delete user.password;
    req.session.user = {
      id: user._id,
      last_name: user.last_name,
      first_name: user.first_name,
      email: user.email,
      username: user.first_name, // Almacena el nombre de usuario en la sesión
    };

    // Verificar si el usuario es un administrador
    if (user.isAdmin) {
      // Si es un administrador, redirigir a la página de productos en tiempo real para administradores
      return res.redirect("/realtimeproducts");
    } else {
      // Si no es un administrador, redirigir a la página de productos regulares
      return res.redirect("/products?welcome=1");
    }
  } catch (error) {
    res.status(500).send("Error al iniciar sesión", error);
  }
});*/

router.post("/login", passport.authenticate("login", { failureRedirect: "faillogin" }), async (req, res) => {
  if (!req.user) return res.status(400).send({ status: "error", error: "datos incompletos" })
  try {
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,   
      isAdmin:req.user.isAdmin,
      username: req.user.username 
    }
    console.log(req.session.user)
  
     // Verificar si el usuario es un administrador
     if (req.user.isAdmin) {
      // Si es un administrador, redirigir a la página de productos en tiempo real para administradores
      return res.redirect("/realtimeproducts");
    } else {
      // Si no es un administrador, redirigir a la página de productos regulares
      return res.redirect("/products?welcome=1");
    }
  } catch (error) {
    res.status(500).send("error al iniciar session")
  }
})

router.get("/faillogin", async (req, res) => {
  console.log("login fallido")
  res.send(error, "fallo")

})

router.post("/logout", async (req, res) => {

  req.session.destroy((err) => {

    if (err) return res.status(500).send("Error al cerrar session", error);
    res.redirect("login");


  })





})

module.exports = router;