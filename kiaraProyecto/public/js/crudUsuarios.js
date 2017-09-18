$(function (){
     $('#crudsaveUsuario').click(function (e){
        var data = {};
        
        data.codigo_usuario=$('#codigo_usuario').val();
        data.nick_usuario=$('#nick_usuario').val();
        data.nombre_usuario=$('#nombre_usuario').val();
        data.correo=$('#correo').val();

       
        var request = $.ajax({
          url: "crudUsuarios",
          method: "POST",
          data: data,
          dataType: "json"
        });

        request.done(function( msg ) {
                //alert(msg.mensaje);
                //alert(JSON.stringify(location));
                location.pathname="/administradorUsuarios";
        });

        request.fail(function( jqXHR, textStatus ) {
          alert( "Request failed: " + textStatus );
        });
        
        
            return false;
        });
});