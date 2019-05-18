<?php 
class Conexion {
    private $servidor = "localhost";
    private $usuario = "user";
    private $contrasena = "1234";
    private $based = "jquery";
    private $conn;

    function __construct() {
       $this->conectar();
   	}
    public function conectar() {
        $this->conn = new mysqli(
                $this->servidor, $this->usuario, $this->contrasena, $this->based
        );
        if ($this->conn->connect_errno) {
            echo "Fallo al contenctar a MySQL: (" . $this->conn->connect_errno . ") " . $this->conn->connect_error;
        }
        //	echo "hola ".$this->conn->host_info . "\n";
    }
    public function desconectar() {
        self::conectar();
        $this->conn->close();
    }
    function EjecutarQuery($query)
    {
    	$result = $mysqli->query($query);
    	return $result->fetch_array(MYSQLI_ASSOC);
    }
    function ValidarUsuario($usuario, $contrasena)
    {
    	$result = $this->conn->query("select 1 from usuario where usuario='".$usuario."' and contrasena='".$contrasena."'");
    	return $result->num_rows;
    }
    function IngresarUsuario($nombres, $apellidos, $correo, $usuario, $contrasena)
    {
    	if($this->ValidarUsuario($usuario,$contrasena)=="1")
    	{
    		return 0;
    	}
    	else
    	{
    		$result = $this->conn->query("INSERT INTO USUARIO (NOMBRES, APELLIDOS, CORREO, USUARIO, CONTRASENA) VALUES ('".$nombres."','".$apellidos."','".$correo."','".$usuario."','".$contrasena."')");
	    	if($result === TRUE)
	    		return 1;
	    	else
	    		return 0;
    	}
    }
    function prueba()
    {
    	$result = $this->conn->query("select 1 from usuario");
    	echo $result->num_rows;
    }
}
?> 