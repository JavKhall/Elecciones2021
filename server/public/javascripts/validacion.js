const inputs = document.querySelectorAll('#formulario input');

const expresiones = {
	nombre: /^[a-zA-ZÀ-ÿ\s\r\t,. ]{0,40}$/, 
	documento: /^\d{0,8}$/ 
}

const campos = {
    nombre: false,
    dni: false,
}

const validarFormulario = (e) => {
	switch (e.target.name) {
		case "nombre":
			validarCampo(expresiones.nombre, e.target, e.target.name);
		break;
		case "dni":
			validarCampo(expresiones.documento, e.target, e.target.name);
		break;
	}
}

const validarCampo = (expresion, input, campo) => {
	if(expresion.test(input.value)){
        const mensaje = document.getElementById(`mensaje_${campo}`);
        mensaje.classList.replace('mensaje_mostrar','mensaje_oculto');
        campos[campo] = true;
	} else {
        const mensaje = document.getElementById(`mensaje_${campo}`);
        mensaje.classList.replace('mensaje_oculto','mensaje_mostrar');
        campos[campo] = false;
	}
}

inputs.forEach((input) => {
	input.addEventListener('keyup', validarFormulario);
	input.addEventListener('blur', validarFormulario);
});

formulario.addEventListener('submit', (e) => {
    if (campos.nombre == false || campos.dni == false) {
        e.preventDefault();
    }
});
