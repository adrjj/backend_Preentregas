const bcrypt = require("bcrypt");

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidPassword = (userPassword, hashedPassword) => bcrypt.compareSync(userPassword, hashedPassword);

// Simula la creación de un hash para una contraseña
const password = "miPasswordSuperSecreta";
const hashedPassword = createHash(password);

console.log("Password:", password);
console.log("Hashed Password:", hashedPassword);

// Simula la verificación de la contraseña
const isMatch = isValidPassword(password, hashedPassword);
console.log("¿Las contraseñas coinciden?", isMatch ? "Sí" : "No");

// Prueba con una contraseña incorrecta
const incorrectPassword = "contraseñaIncorrecta";
const isIncorrectMatch = isValidPassword(incorrectPassword, hashedPassword);
console.log("¿Las contraseñas incorrectas coinciden?", isIncorrectMatch ? "Sí" : "No");
