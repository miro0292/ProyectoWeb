$(function () {


/*al digitar el password solo deben ser numeros*/
	$("#password").change(function(){
		alert("hola "+$(this).val());
	});


/*boton aceptar*/
	$("form input[type='submit']").click(function(){
		var user=$("#user").val();
		var pass=$("#pass").val();
		alert(user+pass+"jajajaj");
	});

});
