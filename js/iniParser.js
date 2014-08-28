"use strict"; // Use ECMAScript 5 strict mode in browsers that support it

// Evento ejecutado cuando "document" esté accesible
$(document).ready(function() {
   $("#fileinput").change(mostrartexto);
   $("#originaltxt").change(activarB);
});


/*  
 *  Función que se llama con el evento de cambio
 *  de "#fileinput"
 *
 *  Pasa el texto contenido en el archivo cargado
 *  al textarea "originaltxt"
 */
function mostrartexto(evt) {
  var f = evt.target.files[0]; 
  var contents = '';

  if (f) {
    var r = new FileReader();
    r.onload = function(e) { 
      contents = e.target.result;
      originaltxt.focus();
      originaltxt.value = contents;
      activarB ();
    }
    r.readAsText(f);
  } else { 
    alert("Failed to load file");
  }
}

/*
 *  Función que se llama con el evento de cambio
 *  de "#originaltxt" (este evento se activa cuando
 *  al perder el foco el textArea, se ha registrado 
 *  un cambio.
 *
 *  Cambia de activo a inactivo el botón "parsear"
 */
var regexpVac = /^(?:\s*\n*)*$/;
function activarB () {
   //alert(originaltxt.value);
   if (regexpVac.test(originaltxt.value) || originaltxt.value == null) {
      parserbut.className = "hidden";
   } else {
      parserbut.className = "unhidden";
   }
}

/*
var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

function escapeHtml(string) {
  return String(string).replace(/[&<>\/'"]/g, function (s) {
    return entityMap[s];
  });
}*/