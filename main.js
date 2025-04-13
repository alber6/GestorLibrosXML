let libros = JSON.parse(localStorage.getItem("libros")) || [];
// Se obtiene el array de libros almacenado en el localStorage. Si no hay datos previos, se inicializa como un array vacío.

let editIndex = -1;
//Variable para guardar el índice del libro que se está editando. Se inicia con -1, lo que indica que no hay ningun libro en edición al principio.

window.onload = () =>{
    actualizarTabla();
} // Al cargar la página, se ejecuta la función actualizarTabla(), que actualiza la tabla en la interfaz con los libros almacenadas.

//Escuchador de evento en el botón "agregar": Cuando se hace clic en el botón "agregar", se recuperan los valores del formulario
document.querySelector("#agregar").addEventListener("click", function(){
    let titulo = document.querySelector("#titulo").value.trim();
    let autor = document.querySelector("#autor").value.trim();
    let publicacion = document.querySelector("#publicacion").value.trim();
    let disponibleSeleccionado = document.querySelector('input[name="disponible"]:checked');
    //Busca dentro del documento HTML el input de tipo radio con el name="disponible" que esté seleccionado (checked).
    let disponible = disponibleSeleccionado ? disponibleSeleccionado.value : "No seleccionado";
    //Si disponibleSeleccionado existe (es decir, sí se seleccionó algún radio), entonces genero será su valor (disponibleSeleccionado.value).

    if (titulo === "" || autor === "" || publicacion === ""){
        alert("Por favor, complete todos los campos.")
        return;
    }

    let libro = {
        titulo: titulo,
        autor: autor,
        publicacion: publicacion,
        disponible: disponible
    }; //Se crea un objeto con los datos del libro.

    libros.push(libro); //se agrega el objeto libro al array libros
    guardarLocalStorage(); //se guarda el actualizado de libros
    limpiarFormulario(); //se limpia el formulario despues de agregar un libro
    actualizarTabla(); //se actualiza la tabla con los datos más recientes
});

function actualizarTabla(){
    let tabla = document.querySelector("#tablaLibros");
    tabla.innerHTML = "";
    // Actualiza la tabla HTML con los datos de los libros almacenados en el array libros.

    libros.forEach((libro, index) => {
        let fila = `
        <tr class= "text-center"> 
            <td>${libro.titulo}</td> 
            <td>${libro.autor}</td>
            <td>${libro.publicacion}</td>
            <td>${libro.disponible}</td>
            <td>
                <button class="btn btn-success text-dark w-75 m-3 fw-bold" onclick="editarLibro(${index})">Modificar</button>
                <button class="btn btn-danger text-dark w-75 m-3 fw-bold" onclick="borrarLibro(${index})">Eliminar</button>
            </td>
        </tr>`;
        tabla.innerHTML += fila;
    });
}

function borrarLibro(index) {
    libros.splice(index, 1);
    guardarLocalStorage();
    actualizarTabla();
    // Elimina la libro en el índice dado de la lista libros usando splice().
    // Luego guarda el array actualizado en el localStorage y actualiza la tabla.
}

function editarLibro(index){ //Carga los datos del libro a editar en los campos del formulario.
    let libro = libros[index];
    //Se obtiene la libro a partir del índice index, y se rellenan los campos del formulario con sus valores.
    document.querySelector("#titulo").value = libro.titulo;
    document.querySelector("#autor").value = libro.autor;
    document.querySelector("#publicacion").value = libro.publicacion;

    let radios = document.querySelectorAll('input[name="disponible"]'); //Selecciona todos los input de tipo radio 
    radios.forEach(radio => {
        if (radio.value === libro.disponible) {
            radio.checked = true;
        }
        // compara el valor del radio con el almacenado en libro.disponible. si coinciden lo marca como seleccionado
    });

    document.querySelector("#agregar").style.display = "none";
    document.querySelector("#actualizar").style.display = "block";
    //se cambia la visibilidad de los botones: el botón de "agregar" se oculta, y el de "actualizar" se muestra. Esto indica que se está editando un libro.
    editIndex = index;
    // El índice del libro que se va a editar se guarda en editIndex.
}

document.querySelector("#actualizar").addEventListener("click" , function(){
    let titulo = document.querySelector("#titulo").value.trim();
    let autor = document.querySelector("#autor").value.trim();
    let publicacion = document.querySelector("#publicacion").value.trim();
    let disponibleSeleccionado = document.querySelector('input[name="disponible"]:checked');
    let disponible = disponibleSeleccionado ? disponibleSeleccionado.value : "No seleccionado";
   

    if (titulo === "" || autor === "" || publicacion === ""){
        alert("Por favor, complete todos los campos.")
        return;
    }

    let libro = {
        titulo: titulo,
        autor: autor,
        publicacion: publicacion,
        disponible: disponible
    };

    libros[editIndex] = libro;
    //Si todo es válido, se actualiza el objeto de libro en el array libros usando el índice editIndex.
    guardarLocalStorage();
    limpiarFormulario();
    actualizarTabla();

    document.querySelector("#agregar").style.display = "block";
    document.querySelector("#actualizar").style.display = "none";
    //Se vuelve a ocultar el botón "actualizar" y se muestra el de "agregar".
    editIndex = -1;
})

function limpiarFormulario() {
    document.querySelector("#titulo").value = "";
    document.querySelector("#autor").value = "";
    document.querySelector("#publicacion").value = "";
    let radios = document.querySelectorAll('input[name="disponible"]');
    radios.forEach(radio => radio.checked = false);
    //Limpia los campos del formulario después de agregar o editar un libro.
}

function guardarLocalStorage(){
    localStorage.setItem("libros", JSON.stringify(libros));
    //Guarda el array libros en el localStorage como una cadena JSON, lo que permite persistir los datos incluso si se recarga la página.
}

function descargarXML(){
    //Crea un archivo XML a partir del array 
    let xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xml += '<libros>';
    libros.forEach( l => {
        xml += `<libro>
            <titulo>${l.titulo}</titulo>
            <autor>${l.autor}</autor>
            <publicacion>${l.publicacion}</publicacion>
            <disponible>${l.disponible}</disponible>
        </libro>` 
    });//Se construye un string XML con todos los datos

    xml += '</libros>'; 
    const blob = new Blob( [xml]   , { type: "application/xml"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "libros.xml";
    //se crea un blob de tipo application/xml y se genera un enlace 

    a.click();
}

document.getElementById("fileInput").addEventListener("change" , function(event){
//Se escucha el cambio en un elemento input de tipo file. Si se selecciona un archivo, se lee el archivo como texto.
    const file = event.target.files[0];
    if (!file){
        alert("No hay archivo")
        return;
    }

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function (e) {
        const xmlString = e.target.result;
    }
    //Cuando el archivo se carga, el contenido XML se obtiene de e.target.result, pero no se procesa aún en este fragmento.
});