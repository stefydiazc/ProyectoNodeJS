$(function (){
  $("#creaCuenta").click(function (e){
    var nick = $("#nick").val();
    var nombre_usuario = $("#nombre_usuario").val();
   var correo = $("#correo").val();
    var clave = $("#clave").val();
    var confirmarClave = $("#confirmarClave").val();
      
      if(nick === ''){
         
          alert("Ingrese su nick");
          return false;
      }
      
      if(nombre_usuario === ''){
          alert("Ingrese su nombre");
          return false;
      }
      
      if(correo === ''){
          alert("Ingrese su correo");
          return false;
      }
      
      if(!isValidEmailAddress(correo)){
          alert("Ingrese un correo valido.");
          return false;          
      }
   
      
      if(clave === ''){
          alert("Ingrese su clave.");
          return false;
      }
      
      if(confirmarClave === ''){
          alert("Para confirmar su clave necesita ingresarla nuevamente.");
          return false;
      }
      
      if(clave !== confirmarClave){
           alert("La clave y su confirmación no son iguales. Inténtelo de nuevo.");
          return false;
      }
      
      $("#creaPag").submit();
      return false;
  });
    
});

function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    return pattern.test(emailAddress);
}