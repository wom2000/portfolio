var visor = document.querySelector(".visor");
var btnonoff = document.querySelector(".btnonoff");
var btnac = document.querySelector(".btnac");
var btnresult = document.querySelector(".btnresult");
var conteudo = document.querySelector(".conteudo");


var estado = false;
btnonoff.onclick = function(){
	if (estado == false) {
		estado = true;
		visor.value = "0";
	}else{
		estado = false;
		visor.value = "";
	}
	console.log("Estado da maquina = "+estado);
};
btnac.onclick = function(){
	if (estado == true) {
		visor.value = "0";
	}
};
btnresult.onclick = function(){
	if (estado == true) {
		conteudo.innerHTML += visor.value;
		visor.value = eval(visor.value);
		conteudo.innerHTML += " = <span>"+visor.value+"</span><br>";
	}

};
function escreveEcra(valor){
	if (estado == true) {
		if (visor.value == '0') {
			visor.value = '';
		}
		visor.value += valor;
	}
}



var btndinamico = document.querySelectorAll('.btndinamico');
for(let i = 0; i < btndinamico.length; i++){
	btndinamico[i].onclick = function(){
		var simb = this.getAttribute("data-valor");
		escreveEcra(simb);
	}
}



// document.querySelector('.btn1').onclick = function(){
// 	escreveEcra("1");
// }
// document.querySelector('.btn2').onclick = function(){
// 	escreveEcra("2");
// }
// document.querySelector('.btn3').onclick = function(){
// 	escreveEcra("3");
// }
// document.querySelector('.btn4').onclick = function(){
// 	escreveEcra("4");
// }
// document.querySelector('.btn5').onclick = function(){
// 	escreveEcra("5");
// }
// document.querySelector('.btn6').onclick = function(){
// 	escreveEcra("6");
// }
// document.querySelector('.btn7').onclick = function(){
// 	escreveEcra("7");
// }
// document.querySelector('.btn8').onclick = function(){
// 	escreveEcra("8");
// }
// document.querySelector('.btn9').onclick = function(){
// 	escreveEcra("9");
// }
// document.querySelector('.btn0').onclick = function(){
// 	escreveEcra("0");
// }
// document.querySelector('.btncomma').onclick = function(){
// 	escreveEcra(".");
// }
// document.querySelector('.btnsoma').onclick = function(){
// 	escreveEcra("+");
// }
// document.querySelector('.btnmulti').onclick = function(){
// 	escreveEcra("*");
// }
// document.querySelector('.btndivide').onclick = function(){
// 	escreveEcra("/");
// }
// document.querySelector('.btnsub').onclick = function(){
// 	escreveEcra("-");
// }
// document.querySelector('.btnpercent').onclick = function(){
// 	escreveEcra("%");
// }


