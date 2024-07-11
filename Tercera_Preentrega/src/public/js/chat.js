


const socket = io();

let user;
let chatBox= document.getElementById('chatBox')

Swal.fire({
    title:"Cual es tu nombre",
    input:"text",
    text:"Ingrese su nombre para entrar",
    inputValidator: (value)=>{
        return !value && "!Debes escribir tu nombre para chatear"
    },
    allowOutsideClick:false

}).then( result =>{
    user = result.value

})
 
chatBox.addEventListener('keyup', evt=>{
    if(evt.key==="Enter"){
        if(chatBox.value.trim().length>0){
            console.log("1//mensaje enviado,",chatBox.value)
            socket.emit("message",{user:user,message:chatBox.value});
            console.log("2//mensaje enviado,",chatBox.value,"nombre",user)
            
            chatBox.value="";
            console.log("3//mensaje enviado,",chatBox.value)
            console.log("4//mensaje enviado,",user)
        }

    }
})


socket.on("messageLog", data => {
    console.log("10// esto trae el mensje a chat.js",data)
    let log = document.getElementById("messageLog");
    let messages = "";
    data.forEach(message => {
        messages += `${message.user} dice: ${message.message}<br>`;
    });
      // Agregar los nuevos mensajes al final del contenido existente
      log.innerHTML += messages;
 
});

