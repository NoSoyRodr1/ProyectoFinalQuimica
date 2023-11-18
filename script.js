
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
      const jsonResult = XLSX.utils.sheet_to_json(sheet);
      let indiceAleatorio = Math.floor(Math.random() * jsonResult.length);
      const datos = jsonResult[indiceAleatorio];
      // Llamar a la función para crear el formulario
      formulario(datos);
  };

  reader.readAsArrayBuffer(file);
  fileInput.remove();
  button.remove();
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
    formulario(datos);
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
        intentos++;
      } else {
        mostrarMensaje(`Respuesta incorrecta. La respuesta era: ${respuestaCorrecta}.`);
        mostrarBotones();
      }

      // Reiniciar el formulario si se falla en el segundo intento
      if (intentos >= 2) {
        reiniciarFormulario();
      }
    };

    const label = document.createElement('label');
    label.appendChild(input);
    form.appendChild(label);
  }

  function mostrarBotones() {
    // Limpiar mensajes anteriores
    mensaje.textContent = '¿Deseas volver a intentar?';

    // Crear botones Sí y No para volver a intentar
    const botonSi = document.createElement('button');
    botonSi.textContent = 'Sí';
    botonSi.onclick = reiniciarFormulario;

    const botonNo = document.createElement('button');
    botonNo.textContent = 'No';
    botonNo.onclick = function() {
      mostrarMensaje('Entendido, puedes intentarlo más tarde.');
      container.style.display = 'none';
      // Puedes agregar aquí alguna otra lógica si es necesario
    };

    mensaje.appendChild(document.createElement('br')); // Salto de línea
    mensaje.appendChild(botonSi);
    mensaje.appendChild(botonNo);
  }

  container.style.display = 'block'; // Mostrar el formulario generado
}