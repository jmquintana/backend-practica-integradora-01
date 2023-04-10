#### **backend-desafío-05**

---

## Servidor con Websocket

### **Consigna**

Configurar nuestro proyecto para que trabaje con Handlebars y websocket.

### **Requerimientos**

1. Configurar el servidor para integrar el motor de plantillas Handlebars e instalar un servidor de socket.io al mismo.
2. Crear una vista `home.handlebars` la cual contenga una lista de todos los productos agregados hasta el momento.
3. Además, crear una vista `realTimeProducts.handlebars`, la cual vivirá en el endpoint `/realtimeproducts` en nuestro `views.router`, ésta contendrá la misma lista de productos, sin embargo, ésta trabajará con websockets.
   1. Al trabajar con websockets, cada vez que creemos un producto nuevo, o bien cada vez que eliminemos un producto, se debe actualizar automáticamente en dicha vista la lista.

### **Formato del entregable**

- Link al repositorio de **Github** con el proyecto completo, sin la carpeta de `node_modules`.

### **Sugerencias**

1. Ya que la conexión entre una consulta HTTP y websocket no está contemplada dentro de la clase `ProductManager`. Se recomienda:
   - Para la creación y eliminación de un producto se cree un formulario simple en la vista `realTimeProducts.handlebars` para que el contenido se envíe desde websockets y no HTTP. Sin embargo, esta no es la mejor solución, leer el siguiente punto.
2. Si se desea hacer la conexión de socket emits con HTTP, deberás buscar la forma de utilizar el servidor io de Sockets dentro de la petición POST. ¿Cómo utilizarás un emit dentro del POST?

### **Entregable**

[Link](https://github.com/jmquintana/backend-desafio-04) al repositorio completo.

### **Muchas gracias!**

Made by **José María Quintana** { [josemqu](https://github.com/jmquintana/) } 🤓
