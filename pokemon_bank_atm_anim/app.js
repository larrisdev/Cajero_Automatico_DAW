let balance = 1250;

let history = [
{date:new Date().toLocaleDateString(),type:"Saldo inicial",amount:1250}
];

let chartInstance = null;

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

let error = validateAmount(res.value);
if(error){
Swal.fire("Error", error, "error");
return;
}

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

let error = validateAmount(res.value);
if(error){
Swal.fire("Error", error, "error");
return;
}

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

function validateAmount(value){

let constraints = {
amount: {
numericality: {
greaterThan: 0
}
}
};

let result = validate({amount:value}, constraints);
return result ? result.amount[0] : null;

}

function generatePDF(){

const { jsPDF } = window.jspdf;
const doc = new jsPDF();

doc.text("Pokémon Bank - Estado de Cuenta", 10, 10);

let y = 20;

history.forEach(h=>{
doc.text(`${h.date} - ${h.type} - $${h.amount}`, 10, y);
y+=10;
});

doc.save("historial.pdf");

}

function generateBalancePDF(){

const { jsPDF } = window.jspdf;
const doc = new jsPDF();

doc.text("Saldo actual:", 10, 10);
doc.text("$" + balance.toFixed(2), 10, 20);

doc.save("saldo.pdf");

}

function showChart(){

let deposits = 0;
let withdrawals = 0;

history.forEach(h=>{
if(h.type.includes("Depósito")) deposits += h.amount;
if(h.type.includes("Retiro")) withdrawals += h.amount;
});

const ctx = document.getElementById('chartCanvas');

if(chartInstance){
chartInstance.destroy();
}

chartInstance = new Chart(ctx, {
type: 'bar',
data: {
labels: ['Depósitos', 'Retiros'],
datasets: [{
label: 'Movimientos',
data: [deposits, withdrawals]
}]
}
});

}

function showPieChart(){

let luz=0, agua=0, internet=0;

history.forEach(h=>{
if(h.type.includes("luz")) luz+=h.amount;
if(h.type.includes("agua")) agua+=h.amount;
if(h.type.includes("internet")) internet+=h.amount;
});

const ctx = document.getElementById('chartCanvas');

if(chartInstance){
chartInstance.destroy();
}

chartInstance = new Chart(ctx, {
type: 'pie',
data: {
labels: ['Luz', 'Agua', 'Internet'],
datasets: [{
data: [luz, agua, internet]
}]
}
});

}