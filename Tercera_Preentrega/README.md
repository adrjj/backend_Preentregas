En este proyecto se utilizo de la biblioteca de node.js

-express

-paht

-handlebars

-sweetalert2

-dotenv

-moongose

-socket.io

-moongose-paginate-v2

-connect-mongo

-passport-local

-passport-githubv2

Este proyecto tiene la base de un ECOMERCE el paso mas importante es que esta conectado todo con la
base de datos de MONGO db Atlas

Cunentas con varias rutas
api/products  (se maneja dede postman)
api/carts (se maneja dede postman)

Chat interno 
/chat (vista con handlebars)

Carga de productos y eliminacion de los mismos por el ID
/realtimeProducts (vista con handlebars)

Visualizacion de todos los productos cargados en la base de datos
/home (vista con handlebars) 

inicio de sesion usuarios
api/session/login

Registro de usuarios
api/session/register

Datos del perfil
api/session/profile

Carrito del usuario
api/cart

------------------- PERFILE DE USUARIO Y REGISTRO --------------------------
CARRITO DEL USUARIO (UNICO POR CADA USUARIO REGISTRADO)
![Texto Alternativo](./imagenes/carrto_unico_por_usuario.png)

PERFIL DE USUARIO CON LINK AL CARRITO DE COMPRA
![Texto Alternativo](./imagenes/profile.png)

INICIO DE SESION CON GITHUB
![Texto Alternativo](./imagenes/ingresar_github.png)

INICIO DE SESION
![Texto Alternativo](./imagenes/iniciar_session.png)

REGISTRO DE USUARIOS
![Texto Alternativo](./imagenes/registro.png)

PERFIL
![Texto Alternativo](./imagenes/perfil_usuario.png)

VISTA ADMIN: se lo redigige a /realtimeproducts
![Texto Alternativo](./imagenes/vista_para_el_usuario_admin.png)

VISTA USUARIO COMUN: se lo redirige a /products
![Texto Alternativo](./imagenes/vista_para_el_usuario_comun.png)




--------------------------  PAGINADOS --------------



PRODUCTOS PAGINADOS.
![Texto Alternativo](./imagenes/products.png)

PRODUCTOS DENTRO DEL CARRITO CON
URL:http://localhost:8080/cart/6654a391db46bd58f8df45e3

![Texto Alternativo](./imagenes/porductos_carrito.png)



------------------------- FILTROS ----------------------------



![Texto Alternativo](./imagenes/api_products_category.png)

![Texto Alternativo](./imagenes/api_products_limit_page.png)

![Texto Alternativo](./imagenes/api_products_sort_mayor.png)

![Texto Alternativo](./imagenes/api_products_total.png)

--------------------- CART ---------------------------------

![Texto Alternativo](./imagenes/api_cart_borrar_producto.png)

![Texto Alternativo](./imagenes/api_cart_guardar_agregar_cantidad.png)

![Texto Alternativo](./imagenes/api_cart_guardar_agregar_producto.png)

![Texto Alternativo](./imagenes/api_cart_guardar_porductos.png)





