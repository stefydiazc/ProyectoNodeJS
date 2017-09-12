var nro_paginas=0;
var nro_preguntas=0;

$(function () {
    $.each($("#tabs a"), function (i, v) {
        $(v).click(function (e) {
            var tabindex = $(e.target).attr("tabindex");
            $(".tab:not(hid)").addClass("hid");
            $("#tab-" + tabindex).removeClass("hid");
            return false;
        });
    });

    /*Evento Pagina*/
    nro_paginas = $("#pag-contenido div.pagina").length +10;
    
    $("#btnNuevaPagina").click(function (e) {
       nro_paginas += 1;
       var dpagnew =$('#dpagnew').clone();
       dpagnew.attr("id","pag-" + nro_paginas);
       $("#pag-contenido").append(dpagnew);

       dpagnew.removeClass('hid');

        dpagnew.find('.selfoto').attr("pagCuento",nro_paginas);
        dpagnew.find('.selaudio').attr("pagCuento",nro_paginas);

        dpagnew.find('img').attr("id","img-" + nro_paginas);
        dpagnew.find('audio source').attr("id","aud-" + nro_paginas);
       
        dpagnew.find('.selfoto').click(evento_seleccionar_foto);
        dpagnew.find('.selaudio').click(evento_seleccionar_audio);
       
       return false;
    }); 
    
    $.each($('#dpag').find('.selfoto'), function(i,v){
       $(v).click(evento_seleccionar_foto);
    });
    
    $('#acefoto').click(function (e) {
        var ruta = $("#dfoto select").val();
        var numero = $('#dfoto').attr("numero");
        $('#img-' + numero).attr("src",ruta);
        $('#dfoto').addClass('hid');
        return false;
    }); 
    
    $('#canfoto').click(function (e) {
           $('#dfoto').addClass('hid');
            return false;
        });
    
    $.each($('#dpag').find('.selaudio'), function(i,v){
       $(v).click(evento_seleccionar_audio);
    });

    $('#aceaudio').click(function (e) {
        var ruta = $("#daudio select").val();
        var numero = $('#daudio').attr("numero");
        var o = "<audio controls=''><source id='aud-" + numero +"' src='" + ruta + "' type='audio/mpeg'></audio>"
        $('#aud-' + numero).parent().replaceWith(o);
        $('#daudio').addClass('hid');
        return false;
    });
    
    $('#canaudio').click(function (e) {
        $('#daudio').addClass('hid');
        return false;
    });
        

    nro_preguntas = $("#preguntas div.pregunta").length +10;    
    
     $("#btnNuevaPregunta").click(function (e) {
         nro_preguntas += 1;
         
         var pregclone = $('#preg-clone').clone();
         
         
         pregclone.attr("id","preg-" + nro_preguntas);
         pregclone.find("div.opciones").attr("id","preg-" + nro_preguntas + "-opc");
         pregclone.find("div.opcion").attr("id","preg-" + nro_preguntas + "-opc-1");

         $("#preguntas").append(pregclone);

         pregclone.removeClass('hid');
       
         return false;
    });  
    
    
    $('#crudsave').click(function (e){
        var data = {};
        
        data.codigo=$('#codigo').val();
        data.titulo=$('#titulo').val();
        data.descripcion=$('#descripcion').val();
        data.creditos=$('#creditos').val();

        data.paginas = [];
        var msg = "";
        $.each($('#pag-contenido div.pagina'), function (i,v){
            var dpag = [];
    
            if(isNaN(parseInt($(v).find('.pg').val() ,10))){
                msg = "Debe ingresar el numero de pagina";
                return false;
            }
            dpag.push(parseInt($(v).find('.pg').val() ,10));

            if($(v).find('.hst').val()===""){
                msg = "Debe ingresar la historia de la pagina";
                return false;
            }
            dpag.push($(v).find('.hst').val().trim());
            
            dpag.push($(v).find('img').attr('src'));
            
            dpag.push($(v).find('audio source').attr('src'));

            data.paginas.push(dpag);
        });
        
        if(msg){
            alert(msg);
            return false;
        }
        
        //alert(JSON.stringify(data));
        
        data.preguntas = [];
        data.opciones = [];
        msg = "";
        $.each($('#preguntas div.pregunta'), function (i,v){
            var dpreg = [];
            if(isNaN(parseInt($(v).find('.num').val() ,10))){
                msg = "Debe ingresar el numero de pregunta";
                return false;
            }
            dpreg.push($(v).find('.num').val());

            if($(v).find('.nmb').val()===""){
                msg = "Debe ingresar la pregunta.";
                return false;
            }            
            dpreg.push($(v).find('.nmb').val());
            
            if($(v).find('.resp').val()===""){
                msg = "Debe ingresar la respuesta.";
                return false;
            }            
            dpreg.push($(v).find('.resp').val());
            
            data.preguntas.push(dpreg);

            $.each($(v).find('div.opcion'), function(j,w){  
            
                if($(w).find('input').val()===""){
                    msg = "Debe ingresar la opcion.";
                    return false;
                }            
                data.opciones.push([$(v).find('.num').val()
                                    , $(w).find('.lbl').text().replace("Opcion # ","")
                                    , $(w).find('input').val()]);    
            });

            if(msg){
                return false;
            }
        });

        if(msg){
            alert(msg);
            return false;
        }
        
        alert(JSON.stringify(data.preguntas));
        alert(JSON.stringify(data.opciones));

        
        var request = $.ajax({
          url: "cuentosGuardar",
          method: "POST",
          data: data,
          dataType: "json"
        });

        request.done(function( msg ) {
            alert(msg.msg);
        });

        request.fail(function( jqXHR, textStatus ) {
          alert( "Request failed: " + textStatus );
        });
        
        return false;
        
    });

    
    
//    $('#crudsave').click(function (e){
//        var data = {};
//        
//        data.codigo=$('#codigo').val();
//        data.titulo=$('#titulo').val();
//        data.descripcion=$('#descripcion').val();
//        data.creditos=$('#creditos').val();
//
//        data.paginas = [];
//        $.each($('#pag-contenido div.pagina'), function (i,v){
//            var dpag ={};
//            dpag.numero = $(v).find('.pg').val();
//            dpag.historia = $(v).find('.hst').val();
//            dpag.foto_ruta = $(v).find('img').attr('src');
//            dpag.audio_ruta = $(v).find('audio source').attr('src');
//            data.paginas.push(dpag);
//        });
//        
//        data.preguntas = [];
//        $.each($('#preguntas div.pregunta'), function (i,v){
//            var dpreg ={};
//            dpreg.numero = $(v).find('.num').val();
//            dpreg.nombre_pregunta = $(v).find('.nmb').val();
//            dpreg.respuesta = $(v).find('.resp').val();
//            
//            dpreg.opciones = [];
//            $.each($(v).find('div.opcion'), function(j,w){  
//                dpreg.opciones.push($(w).find('input').val());    
//            });
//            
//            data.preguntas.push(dpreg);
//            
//        });
//        
//        
//        var request = $.ajax({
//          url: "cuentosGuardar",
//          method: "POST",
//          data: data,
//          dataType: "json"
//        });
//
//        request.done(function( msg ) {
//            alert(msg.msg);
//        });
//
//        request.fail(function( jqXHR, textStatus ) {
//          alert( "Request failed: " + textStatus );
//        });
//        
//        return false;
//        
//    });
    
    
});

var evento_seleccionar_foto = function (e) {
           $(e.target).after($('#dfoto'));
           $('#dfoto').attr("numero",$(e.target).attr("pagCuento"));
           $('#dfoto').removeClass('hid');
            return false;
        }

var evento_seleccionar_audio = function (e) {
           $(e.target).after($('#daudio'));
           $('#daudio').attr("numero",$(e.target).attr("pagCuento"));
           $('#daudio').removeClass('hid');
            return false;
        }


