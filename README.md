# Proyecto final de Backend de CoderHouse
Creación de un e-commerce
1) Una vez descargado el proyecto, ejecutar npm install para instalar las dependencias.
2) Luego ejecutar npm run dev para poder visualizarlo en http://localhost:8080
3) La vista principal -raíz- será el login. El registro está en /register
4) Una vez logueado, en /products aparecen los productos del e-commerce para comprar
5) En /profile se visualiza el perfil del usuario (nombre, e-mail y rol), con las opciones de ir a la vista de Productos o desloguearse. Roles posibles: user, admin y premium
6) En /carts/:cid (id del carrito) se ven los productos añadidos al mismo.
7) Al tocar en "Purchase" se redirige a /api/carts/:cid/purchase donde aparece el ticket de compra. Con esto se vacía el carrito.

Usuario admin para test: adminCoder@coder.com / pass: adminCod3r123
Usuario premium para test: testpremium@mail.com / pass: 7777

El usuario admin tiene permisos para eliminar cualquier producto pero no para crearlo desde /products/realTimeProducts.

El usuario Premium puede crear productos desde /products/realTimeProducts (una vez logueado) pero no puede eliminar productos que no hayan sido creados por él mismo.

El usuario premium logueado como tal, desde /api/sessions/premium/:pid (id de su usuario premium) actualizará su rol a user, actualizándose también en la Base de datos. Si se vuelve a ejecutar volverá a ser "premium".

El usuario admin no tiene permisos para actualizar su rol.
