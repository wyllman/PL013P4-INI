"use strict"; // Use ECMAScript 5 strict mode in browsers that support it

// Evento ejecutado cuando "document" esté accesible
$(document).ready(function() {
   $("#fileinput").change(mostrartexto);
   $("#originaltxt").change(activarB);
   $("#parserbut").click(parsear);
   activarB ();
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
 *  Función que se llama con el evento click del
 *  botón de parseo.
 *  
 *  Se encarga de obtener el texto del textarea
 *  y parsearlo como si fuera un fichero INI,
 *  obtener los tokens del mismo.
 */
function parsear () {
   //alert("CLick!");
   
   var tokens = lexer(originaltxt.value);
   var pretty = tokensToString(tokens);
   
   initialinput.innerHTML = pretty;
   //finaloutput.innerHTML = pretty;

}


var temp = '<li> <span class = "<%= token.type %>"> <%= match %> </span> <span class="type"><%= token.type %></span>\n';

function tokensToString(tokens) {
   var r = '';
   for(var i=0; i < tokens.length; i++) {
     var t = tokens[i]
     //var s = JSON.stringify(t, undefined, 2);
     var s = JSON.stringify(t.match[0], undefined, 2);
     s = _.template(temp, {token: t, match: s});
     r += s;
   }
   return '<ol compact>' + r + '</ol>';
}

function lexer(input) {
  var blanks         = /^[^\S\n\r]*\n/;
  var iniheader      = /^[^\S\n\r]*\[([^\]\r\n]+)\][^\S\n\r]*\n/;
  var comments       = /^[^\S\n\r]*[;#]([^\n\r]*)\n/;
  var nameEqualValue = /^([^=;\r\n]+)=([^;\r\n]*\n)/;
  var any            = /^(.)+\n/;
  var finalErr = false;

  var result = [];
  var m = null;

  while (input != '') {
    if (m = blanks.exec(input)) {
      input = input.substr(m.index + m[0].length);
      result.push({ type : 'blanks', match: m });
    }
    else if (m = iniheader.exec(input)) {
      input = input.substr(m.index + m[0].length);
      result.push({ type: 'header', match: m });
    }
    else if (m = comments.exec(input)) {
      input = input.substr(m.index + m[0].length);
      result.push({ type: 'comments', match: m });
    }
    else if (m = nameEqualValue.exec(input)) {
      input = input.substr(m.index + m[0].length);
      result.push({ type: 'nameEqualValue', match: m });
    }
    else if (m = any.exec(input)) { 
      input = input.substr(m.index + m[0].length);
      result.push({ type: 'error', match: m });
      //input = '';
    }
    else {
      if (!finalErr) {
         finalErr = true;
         input += "\n";
      } else {
         alert("Fatal Error!" + String.substr(input, 0, 20));
         input = '';
         finalErr = false;
      }
      
    }
  }
  return result;
}