var score = 0;
var preguntasRespondidas = [];
var jsonResult = []; // Variable para almacenar el resultado JSON
var indiceAleatorio = []
let puntajes = {};

document.getElementById('dowload').addEventListener('click', function() {
    const fileURL = 'assets/preguntas.xlsx'; // Ruta del archivo a descargar

    fetch(fileURL)
        .then(response => response.blob())
        .then(blob => {
            // Crear un enlace temporal (a) para descargar el archivo
            const a = document.createElement('a');
            a.style.display = 'none';
            document.body.appendChild(a);

            // Crear una URL para el blob del archivo
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = 'preguntas.xlsx'; // Nombre del archivo al descargar

            // Simular clic en el enlace para iniciar la descarga
            a.click();

            // Limpiar el objeto URL y remover el enlace
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        })
        .catch(error => {
            console.error('Error al descargar el archivo:', error);
        });
});

document.getElementById('instrucc').addEventListener('click', function() {
    const fileURL = 'assets/instrucciones.txt'; // Ruta del archivo a descargar

    fetch(fileURL)
        .then(response => response.blob())
        .then(blob => {
            // Crear un enlace temporal (a) para descargar el archivo
            const a = document.createElement('a');
            a.style.display = 'none';
            document.body.appendChild(a);

            // Crear una URL para el blob del archivo
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = 'instrucciones.txt'; // Nombre del archivo al descargar

            // Simular clic en el enlace para iniciar la descarga
            a.click();

            // Limpiar el objeto URL y remover el enlace
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        })
        .catch(error => {
            console.error('Error al descargar el archivo:', error);
        });
});

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

const fail = new Audio('assets/fail.mp3');
const nice = new Audio('assets/nice.wav');

function convertirJSON() {
    var button = document.getElementById('convertButton');
    var dow = document.getElementById('dowload');
    var inst = document.getElementById('instrucc');
    button.style.display = 'none';
    dow.style.display = 'none';
    inst.style.display = 'none';
    const url = 'assets/datos.json';
    fetch(url)
        .then(response => response.json()) // Convertir la respuesta a JSON
        .then(data => {
            // Asignar el JSON obtenido a una variable
            var miVariable = data;

            console.log(miVariable);
            jsonResult = miVariable;

            generarPreguntaAleatoria();
        })
        .catch(error => {
            console.error('Error al obtener el archivo JSON:', error);
        });
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
        input.id = 'opciones';
        input.value = opcionesMezcladas[i];
        input.name = 'opcion'; // Asignar un nombre a los botones (puedes cambiar 'opcion' si es necesario)
        window.onload = function() {
            var input = document.getElementById('opciones');

            // Obtener el tamaño del texto actual dentro del input
            var textSize = input.scrollWidth;

            // Comparar el tamaño del texto con el tamaño del input y ajustar el tamaño de fuente si es necesario
            if (textSize > input.offsetWidth) {
                var newSize = parseFloat(window.getComputedStyle(input).fontSize) * (input.offsetWidth / textSize);
                input.style.fontSize = newSize + 'px';
            }
        };
        input.onclick = function() {
            // Verificar si la opción seleccionada es la correcta
            if (this.value === String(respuestaCorrecta)) {
                mostrarMensaje('¡Respuesta correcta!');
                score = score + 1;
                nice.play();
                intentos++;
                preguntasRespondidas.push(indiceAleatorio); // Agregar la pregunta a las respondidas
                reiniciarFormulario();
            } else {
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
        if (score > 1) {
            puntaje = score
            mensaje.textContent = `Respuesta incorrecta. La respuesta era: ${respuestaCorrecta}.
            \n Puntaje total: ${score}
            \n¿Desea subir su puntuación?`;
            mensaje.appendChild(document.createElement('br'));
            const inputNickname = document.createElement('input');
            inputNickname.type = 'text';
            inputNickname.placeholder = 'Ingrese su nickname';
            mensaje.appendChild(inputNickname);
            // Crear botones Sí y No para volver a intentar
            const botonSi = document.createElement('button');
            botonSi.textContent = 'Sí';
            botonSi.setAttribute('id', 'uplo');
            botonSi.onclick = function() {
                const nickname = inputNickname.value;
                if (nickname.trim() !== '') {
                    function agregarPuntajeAutomatico(nickname, puntaje) {
                        // Verifica si el nickname ya existe en el objeto
                        if (puntajes.hasOwnProperty(nickname)) {
                            // Si el nickname existe, actualiza la puntuación
                            puntajes[nickname] = puntaje;
                        } else {
                            // Si el nickname no existe, agrega un nuevo registro
                            puntajes[nickname] = puntaje;
                        }
                    }
                    agregarPuntajeAutomatico(nickname, puntaje);
                    console.log(puntajes);
                    const asignTop = (puntajes) => {
                        const docId = 'marcadores';
                        const puntajesObj = {
                            nuevosPuntajes: puntajes
                        };

                        db.collection("marcadores").doc(docId).set(puntajesObj, { merge: true })
                            .then(() => {
                                msgok();
                            })
                            .catch((error) => {
                                msgfail();
                            });
                    }
                    const msgok = () => {
                        Swal.fire({
                            title: "Puntuación subida",
                            text: "Verifica si estás en el top :D",
                            icon: "success"
                        });
                    }
                    const msfail = () => {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Parece que su puntuación no se pudo subir",
                        });
                    }
                    asignTop(puntajes);
                    console.log(puntajes);
                    reiniciarFormulario();
                } else {
                    // Si no se ingresó un nickname, muestra un mensaje de advertencia
                    mostrarMensaje('Por favor, ingrese un nickname válido');
                }
            };
            const botonNo = document.createElement('button');
            botonNo.textContent = 'No';
            botonNo.onclick = reiniciarFormulario;

            mensaje.appendChild(document.createElement('br')); // Salto de línea
            mensaje.appendChild(botonSi);
            mensaje.appendChild(botonNo);
        } else {
            mensaje.textContent = `Respuesta incorrecta, la respuesta era: ${respuestaCorrecta}.
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
