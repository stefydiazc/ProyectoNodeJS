
$(function () {
    $("#entrar").click(function (e){
        
        
    	var nick = $("#nick").val();
    	var clave = $("#clave").val();

        if(nick==="" || clave===""){
               alert(" Ingrese su usuario y clave");
               return false;
           }
               
        
    	$.ajax({
            url: "http://localhost:3000/api/validacion/",
            method: "GET",
            data: {nick:nick, clave:clave},
            dataType: "json",
            crossDomain:true,
            success:function(r,t,j){
                //alert(JSON.stringify(r));
                //$(location).attr('href','administradorCuentos');
                $("#targetForm").submit();
            },
            error: function(r,t,e){
                alert(JSON.stringify(r));
            }
        });

        
        e.stopPropagation();
        return false;
    });
    
   //fin de la funcion   
});

 /*function localJsonpCallback(json) {
        if (!json.Error) {
     //       $('#resultForm').submit();
        }
        else {
        //    $('#loading').hide();
         //   $('#userForm').show();
            alert(json.Message);
        }
    }
*/


/*$(document).ready(function () {
    
if ($('#').valid()) {
                var formData = $("#userForm").serializeArray();
                $.ajax({
                    url: 'http://www.example.com/user/' + $('#Id').val() + '?callback=?',
                    type: "GET",
                    data: formData,
                    dataType: "jsonp",
                    jsonpCallback: "localJsonpCallback"
                });
    });*/


