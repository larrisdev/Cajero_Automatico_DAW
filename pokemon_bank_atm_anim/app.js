
let balance = 1250;

let history = [
{date:new Date().toLocaleDateString(),type:"Saldo inicial",amount:1250}
];

function login(){

let pin=document.getElementById("pinInput").value;

if(pin==="1234"){

document.getElementById("loginView").classList.add("d-none");
document.getElementById("atmView").classList.remove("d-none");

updateUI();

Swal.fire({
icon:"success",
title:"Bienvenido Ash",
text:"Acceso correcto",
timer:1200,
showConfirmButton:false
});

}else{

Swal.fire("Error","PIN incorrecto","error");

}

}

function logout(){

document.getElementById("loginView").classList.remove("d-none");
document.getElementById("atmView").classList.add("d-none");
document.getElementById("pinInput").value="";

}

function deposit(){

Swal.fire({
title:"¿Cuánto deseas depositar?",
input:"number",
showCancelButton:true
}).then(res=>{

if(!res.value)return;

let val=parseFloat(res.value);

Swal.fire({
title:"Procesando depósito...",
timer:1200,
didOpen:()=>{
Swal.showLoading();
}
}).then(()=>{

balance+=val;

history.unshift({
date:new Date().toLocaleDateString(),
type:"Depósito",
amount:val
});

updateUI();

Swal.fire("Éxito","Depósito realizado","success");

});

});

}

function withdraw(){

Swal.fire({
title:"¿Cuánto deseas retirar?",
input:"number",
showCancelButton:true
}).then(res=>{

if(!res.value)return;

let val=parseFloat(res.value);

if(val>balance){

Swal.fire("Error","Fondos insuficientes","error");
return;

}

Swal.fire({
title:"Contando dinero...",
timer:1500,
didOpen:()=>{
Swal.showLoading();
}
}).then(()=>{

balance-=val;

history.unshift({
date:new Date().toLocaleDateString(),
type:"Retiro",
amount:val
});

updateUI();

Swal.fire("Listo","Retiro exitoso","success");

});

});

}

function payService(){

Swal.fire({
title:"Selecciona servicio",
input:"select",
inputOptions:{
luz:"Luz $45",
agua:"Agua $15",
internet:"Internet $60"
},
showCancelButton:true
}).then(res=>{

if(!res.value)return;

let prices={luz:45,agua:15,internet:60};
let cost=prices[res.value];

if(cost>balance){

Swal.fire("Error","Saldo insuficiente","error");
return;

}

Swal.fire({
title:"Procesando pago...",
timer:1500,
didOpen:()=>{
Swal.showLoading();
}
}).then(()=>{

balance-=cost;

history.unshift({
date:new Date().toLocaleDateString(),
type:"Pago "+res.value,
amount:cost
});

updateUI();

Swal.fire("Pago completado","Servicio pagado","success");

});

});

}

function updateUI(){

document.getElementById("balanceText").innerText="$"+balance.toFixed(2);

let html="";

history.forEach(h=>{

html+=`
<tr>
<td>${h.date}</td>
<td>${h.type}</td>
<td>$${parseFloat(h.amount).toFixed(2)}</td>
</tr>
`;

});

document.getElementById("historyTable").innerHTML=html;

}

function showHistory(){

document.getElementById("historyTable").scrollIntoView({behavior:"smooth"});

}
