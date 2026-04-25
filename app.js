if('serviceWorker' in navigator){
navigator.serviceWorker.register('sw.js');
}
const WEBHOOK="https://script.google.com/macros/s/AKfycbwp4iVXdi8AA88_1w843atHUD8i9qMYj3D0cyVhL37fiuGC5BpmRQOdoMuCo31iCVmg/exec";

let entradaAbierta=false;
let historial=[];
let horaEntrada=null;
let segundosTotales=0;



window.onload=function(){

entradaAbierta=
localStorage.getItem("entradaAbierta")==="true";

horaEntrada=
localStorage.getItem("horaEntrada");

segundosTotales=
parseInt(
localStorage.getItem("segundosTotales")
)||0;

historial=
JSON.parse(
localStorage.getItem("historial")
)||[];

renderHistorial();
actualizarHoras();
actualizarBoton();

};



function actualizarBoton(){

document.getElementById(
"mainButton"
).innerText=
entradaAbierta ?
"🔴 SALIR":
"🟢 ENTRAR";

}



function guardar(){

localStorage.setItem(
"entradaAbierta",
entradaAbierta
);

localStorage.setItem(
"horaEntrada",
horaEntrada
);

localStorage.setItem(
"segundosTotales",
segundosTotales
);

localStorage.setItem(
"historial",
JSON.stringify(historial)
);

}



function formatea(seg){

let h=
Math.floor(seg/3600);

let m=
Math.floor(
(seg%3600)/60
);

let s=
seg%60;

return String(h)
.padStart(2,"0")
+":"+
String(m)
.padStart(2,"0")
+":"+
String(s)
.padStart(2,"0");

}



function enviarSheets(
tipo,
duracion
){

fetch(
WEBHOOK,
{
mode:"no-cors",
method:"POST",
headers:{
"Content-Type":
"application/json"
},
body:JSON.stringify({
tipo:tipo,
duracion:duracion,
total:formatea(
segundosTotales
)
})
}
).catch(
e=>console.log(e)
);

}



function actualizarHoras(){

document.getElementById(
"totalHoras"
).innerText=
"Hoy: "+
formatea(
segundosTotales
);

}



function horaTexto(){

return new Date()
.toLocaleTimeString(
'es-ES'
);

}



function renderHistorial(){

let lista=
document.getElementById(
"log"
);

lista.innerHTML="";

historial.forEach(item=>{

let li=
document.createElement("li");

li.textContent=item;

lista.appendChild(li);

});

}



function fichar(){

let ahora=
new Date();

let msg="";

if(!entradaAbierta){

horaEntrada=
ahora.getTime();

msg=
"🟢 Entrada "+
horaTexto();

entradaAbierta=true;

enviarSheets(
"Entrada",
"00:00:00"
);

}
else{

let segundos=
Math.floor(
(ahora.getTime()-horaEntrada)
/1000
);

segundosTotales+=segundos;

msg=
"🔴 Salida "
+horaTexto()
+" ("
+formatea(segundos)
+")";

entradaAbierta=false;

horaEntrada=null;

enviarSheets(
"Salida",
formatea(segundos)
);

}


document.getElementById(
"estado"
).innerText=msg;

historial.unshift(msg);

guardar();

renderHistorial();

actualizarHoras();

actualizarBoton();

}



function resetDia(){

if(confirm(
"¿Reiniciar jornada?"
)){

historial=[];

segundosTotales=0;

entradaAbierta=false;

horaEntrada=null;

guardar();

renderHistorial();

actualizarHoras();

actualizarBoton();

document.getElementById(
"estado"
).innerText=
"Nueva jornada iniciada";

}

}
