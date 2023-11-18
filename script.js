// Función para convertir XLSX a JSON
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

    // Guardar el JSON en un archivo
    const jsonData = JSON.stringify(jsonResult, null, 2);
    guardarArchivo(jsonData);
  };

  reader.readAsArrayBuffer(file);
  fileInput.remove();
  button.remove();
}

// Función para guardar el JSON en un archivo
function guardarArchivo(jsonData) {
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'datos.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}