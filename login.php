<?php
include("conexion.php");
session_start();
$con = new Conexion();
if(isset($_POST['tipo']) && $_POST['tipo']=="1")	
{
	if(isset($_POST['user']) && isset($_POST['password']))	
	{
		$usuario = $_POST["user"];
		$contrasena=$_POST["password"];
		/*echo $usuario . "-".$contrasena;*/
		$clave = hash("md5", $contrasena, false);
		//echo $clave;
		//$con->conectar();
		if($con->ValidarUsuario($usuario,$clave)=="1")
			echo 1;
		else
			echo 0;
	}
	else 
		echo 0;
}
else if(isset($_POST['tipo']) && $_POST['tipo']=="2")
{
	if(isset($_POST['nombres']) && isset($_POST['apellidos']) && isset($_POST['correo']) && isset($_POST['usuario']) && isset($_POST['contrasena']))
	{
		$clave = hash("md5", $_POST['contrasena'], false);
		if($con->IngresarUsuario($_POST['nombres'], $_POST['apellidos'], $_POST['correo'], $_POST['usuario'], $_POST['contrasena']) == 1)
			echo 1;
		else
			echo 0;
	}
	else
		echo 0;
}
else
	echo 0;
$con->desconectar();
?>