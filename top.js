var firebaseConfig = {
    apiKey: "AIzaSyCug3Dr-M4dc_xF9wF2u6X-4lWrp5HLmL8",
    authDomain: "chemgenius-quest.firebaseapp.com",
    databaseURL: "https://chemgenius-quest-default-rtdb.firebaseio.com",
    projectId: "chemgenius-quest",
    storageBucket: "chemgenius-quest.appspot.com",
    messagingSenderId: "857287770591",
    appId: "1:857287770591:web:18f85a15e60e162fbdc46a",
    measurementId: "G-Q9HFB8NL3P"
  };
  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();
  
  // Obtener datos de Firebase y generar la tabla
  function generarTablaPuntuaciones() {
    let tabla = document.getElementById("cuerpoTabla");
  
    obtenerObjetoDocumentoPorId("marcadores").then((objetoDocumento) => {
      const puntuaciones = objetoDocumento.nuevosPuntajes;
  
      // Convertir el objeto a un array de objetos {usuario, puntuacion}
      const puntuacionesArray = Object.entries(puntuaciones).map(([usuario, puntuacion]) => ({
        usuario,
        puntuacion
      }));
  
      // Ordenar por puntuación de mayor a menor
      puntuacionesArray.sort((a, b) => b.puntuacion - a.puntuacion);
  
      // Mostrar las 10 mejores puntuaciones en la tabla
      puntuacionesArray.slice(0, 10).forEach((item) => {
        let fila = tabla.insertRow();
        let celdaUsuario = fila.insertCell(0);
        let celdaPuntuacion = fila.insertCell(1);
  
        celdaUsuario.innerHTML = item.usuario;
        celdaPuntuacion.innerHTML = item.puntuacion;
      });
    }).catch((error) => {
      console.error("Error:", error);
    });
  }
  
  // Función para obtener el objeto del documento por su ID
  function obtenerObjetoDocumentoPorId(docId) {
    return db.collection("marcadores").doc(docId).get().then((doc) => {
      if (doc.exists) {
        return doc.data();
      } else {
        console.log("El documento no existe en la colección 'marcadores'.");
        return null;
      }
    }).catch((error) => {
      console.error("Error al obtener el documento:", error);
      return null;
    });
  }
  
  // Llamar a la función para generar la tabla al cargar la página
  window.onload = generarTablaPuntuaciones;
  