var score = 0;
var preguntasRespondidas = [];
var jsonResult = []; // Variable para almacenar el resultado JSON
var indiceAleatorio = []
var goku = document.getElementById('goku');
const fail = new Audio('assets/fail.wav');
const nice = new Audio('assets/nice.mp3');

function convertirJSON() {
  var fileInput = document.getElementById('fileInput');
  var button = document.getElementById('convertButton');
  const file = fileInput.files[0];

  const reader = new FileReader();

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    // Suponiendo que el archivo XLSX tiene una sola hoja
    const sheet_name = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheet_name];

    // Convertir la hoja a JSON
    jsonResult = XLSX.utils.sheet_to_json(sheet);
    generarPreguntaAleatoria(); // Llamar a la función para generar una pregunta aleatoria
  };

  reader.readAsArrayBuffer(file);
  fileInput.remove();
  button.remove();
}

function generarPreguntaAleatoria() {
  let indiceAleatorio = obtenerIndiceAleatorio();

  // Verificar si la pregunta ya fue respondida
  while (preguntasRespondidas.includes(indiceAleatorio)) {
    indiceAleatorio = obtenerIndiceAleatorio();
  }

  const datos = jsonResult[indiceAleatorio];
  formulario(datos);
}

function obtenerIndiceAleatorio() {
  return Math.floor(Math.random() * jsonResult.length);
}

function formulario(datos) {
  const container = document.getElementById('formularioContainer');
  const form = document.getElementById('formulario');
  const question = document.getElementById('question');
  const mensaje = document.getElementById('mensaje');
  const mensaje1 = document.getElementById('mensaje1');
  const respuestaCorrecta = datos.correcta;
  let intentos = 0;

  function mostrarMensaje(texto) {
    mensaje1.textContent = texto;
  }

  function reiniciarFormulario() {
    form.innerHTML = '';
    mensaje.textContent = '';
    intentos = 0;
    mensaje1.textContent = '';
    generarPreguntaAleatoria();
  }

  // Mostrar la pregunta
  question.textContent = datos.pregunta;

  // Obtener todas las opciones (correcta e incorrectas) y mezclarlas
  const opciones = [datos.correcta, datos.incorrecta1, datos.incorrecta2, datos.incorrecta3];
  const opcionesMezcladas = opciones.sort(() => Math.random() - 0.5);

  // Crear botones en el formulario para las opciones mezcladas
  for (let i = 0; i < opcionesMezcladas.length; i++) {
    const input = document.createElement('input');
    input.type = 'button';
    input.value = opcionesMezcladas[i];
    input.name = 'opcion'; // Asignar un nombre a los botones (puedes cambiar 'opcion' si es necesario)

    input.onclick = function() {
      // Verificar si la opción seleccionada es la correcta
      if (this.value === String(respuestaCorrecta)) {
        mostrarMensaje('¡Respuesta correcta!');
        score = score + 1;
        nice.play();
        goku.style.display = 'block';
        intentos++;
        preguntasRespondidas.push(indiceAleatorio); // Agregar la pregunta a las respondidas
        reiniciarFormulario();
      } else {
        goku.style.display = 'none';
        container.style.display = 'none';
        fail.play();
        mostrarBotones();
        score = 0; // Reiniciar el puntaje en caso de respuesta incorrecta
      }
    };

    const label = document.createElement('label');
    label.appendChild(input);
    form.appendChild(label);
  }

  function mostrarBotones() {
    if (score >4) {
      mensaje.textContent = `Respuesta incorrecta. La respuesta era: ${respuestaCorrecta}.
      \n Puntaje total: ${score}
      \n¿Desea subir su puntuación?`;

      const inputNickname = document.createElement('input');
      inputNickname.type = 'text';
      inputNickname.placeholder = 'Ingrese su nickname';
      mensaje.appendChild(inputNickname);
      const botonEnviar = document.createElement('button');
      botonEnviar.textContent = 'Enviar';
      botonEnviar.onclick = function() {
        const nickname = inputNickname.value;
        if (nickname.trim() !== '') {
          // Aquí puedes realizar alguna acción con el nickname ingresado, como enviarlo a un servidor
          console.log('Nickname ingresado:', nickname);
          // También puedes reiniciar el juego o hacer alguna otra acción aquí
          reiniciarFormulario();
        } else {
          // Si no se ingresó un nickname, muestra un mensaje de advertencia
          mostrarMensaje('Por favor, ingrese un nickname válido');
        }
      };
      // Crear botones Sí y No para volver a intentar
      const botonSi = document.createElement('button');
      botonSi.textContent = 'Sí';
      botonSi.onclick = reiniciarFormulario;
  
      const botonNo = document.createElement('button');
      botonNo.textContent = 'No';
      botonNo.onclick = function() {
        mostrarMensaje('Entendido, puedes intentarlo más tarde.');
        container.style.display = 'none';
      };
  
      mensaje.appendChild(document.createElement('br')); // Salto de línea
      mensaje.appendChild(botonSi);
      mensaje.appendChild(botonNo);
    } else {
      mensaje.textContent = `Respuesta incorrecta. La respuesta era: ${respuestaCorrecta}.
      \n Puntaje total: ${score}
      \n¿Desea volver a jugar?`;
      // Crear botones Sí y No para volver a intentar
      const botonSi = document.createElement('button');
      botonSi.textContent = 'Sí';
      botonSi.onclick = reiniciarFormulario;
  
      const botonNo = document.createElement('button');
      botonNo.textContent = 'No';
      botonNo.onclick = function() {
        window.close();
      };
  
      mensaje.appendChild(document.createElement('br')); // Salto de línea
      mensaje.appendChild(botonSi);
      mensaje.appendChild(botonNo);
    }
    }

  container.style.display = 'block'; // Mostrar el formulario generado
}
const firebaseConfig = {
  apiKey: "AIzaSyCug3Dr-M4dc_xF9wF2u6X-4lWrp5HLmL8",
  authDomain: "chemgenius-quest.firebaseapp.com",
  databaseURL: "https://chemgenius-quest-default-rtdb.firebaseio.com",
  projectId: "chemgenius-quest",
  storageBucket: "chemgenius-quest.appspot.com",
  messagingSenderId: "857287770591",
  appId: "1:857287770591:web:eb4e38891cea6c7ebdc46a",
  measurementId: "G-RXWNLH1B8D"
};
