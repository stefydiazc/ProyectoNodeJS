    var idxCuento = "";

/*Funcion inicial al cargar la pagina*/
$(function () {
    
    mostrar();

    nuevo();
    
    $("#nuevo").click(function (e) {
        nuevo();
        return false;
    });

    $("#guardar").click(function (e) {
        var obj;
        if (idxCuento === "") {
            obj = new Object();
        } else {
            obj = objJSON.contenido[0].cuento[idxCuento];
        }

        obj.codigo = $("#codigo").val();
        obj.titulo = $("#titulo").val();
        obj.descripcion = $("#descripcion").val();
        obj.creditos = $("#creditos").val();

        if ($("#estadoA").prop("checked"))
            obj.estado = "A";
        else
            obj.estado = "I";

        var paginas = [];
        $.each($("#paginas div"), function (i, v) {
            var pagina = new Object();
            pagina.id = "";
            pagina.historia = $(v).find("textarea").val();
            pagina.foto = $(v).find("img").attr("src");
            pagina.audio = $(v).find("source").attr("src");

            paginas.push(pagina);
        });

        obj.paginas = paginas;


        var preguntas = [];
        $.each($("#preguntas div"), function (i, v) {
            var pregunta = new Object();
            pregunta.id = "";
            pregunta.pregunta = $(v).find("input.pre").val();
            pregunta.opciones = [];
            $.each($(v).find("input.opc"), function (j, w) {
                var opc = new Object();
                opc.opcion = $(w).val();
                pregunta.opciones.push(opc);
            });
            pregunta.respuesta = $(v).find("input.res").val();

            preguntas.push(pregunta);
        });

        obj.preguntas = preguntas;


        if (!(obj.codigo)) {
            alert("Debe ingresar el código del cuento.");
            return;
        }

        if (obj.estado === "A") {
            // Validaciones
            if (paginas.length === 0) {
                alert("Debe ingresar las paginas");
                return false;
            }
        }

        if (idxCuento === "") {
            objJSON.contenido[0].cuento.push(obj);
        }

        grabarArchivoJSON(objJSON);

        mostrar();

        nuevo();

        return false;
    });

    $("#cancelar").click(function (e) {
        nuevo();
        return false;
    });

    $("#exportar").click(function (e) {
        exportJSON();
        return false;
    });


    $("#btnNuevaPagina").click(function (e) {
        var i = $("#paginas div").length;
        var v = new Object();
        v.historia = "";
        v.foto = "";
        v.audio = "";

        visualizarPagina(i, v);
    });

    $("#btnNuevaPregunta").click(function (e) {
        var i = $("#preguntas div").length;
        var v = new Object();
        v.pregunta = "";
        v.opciones = [];
        v.opciones.push(new Object());
        v.opciones.push(new Object());
        v.opciones.push(new Object());
        v.opciones[0].opcion = "";
        v.opciones[1].opcion = "";
        v.opciones[2].opcion = "";
        v.respuesta = "";
        visualizarPregunta(i, v);
    });

});



var mostrar = function () {
    $.each($("#tabs a"), function (i, v) {
        $(v).click(function (e) {
            var tabindex = $(e.target).attr("tabindex");
            $(".tab:not(hid)").addClass("hid");
            $("#tab-" + tabindex).removeClass("hid");
            return false;
        });
    });

    var stefaniaTable = "";

    $.each(objJSON.contenido[0].cuento, function (index, value) { //"<td>" + "</td>"
        stefaniaTable += "<tr id='c" + index + "'><td>" + value.codigo + "</td>" + "<td>" + value.titulo + "</td>" + "<td>" + value.descripcion + "</td>" + "<td>" + value.creditos + "</td>" +
			"<td><a href='#' class='edt' value='" + index + "'>Editar</a></td><td><a href='#' class='del' value='" + index + "'>Eliminar</a></td><tr>";
    });

    $("#demo tbody").html("");
    $("#demo tbody").append(stefaniaTable);

    $.each($("#demo tbody a.edt"), function (i, v) {
        $(v).click(function (e) {
            var id = $(e.target).attr("value");
            idxCuento = id;

            var cuento = objJSON.contenido[0].cuento[id];
            $("#codigo").val(cuento.codigo);
            $("#titulo").val(cuento.titulo);
            $("#creditos").val(cuento.creditos);
            $("#descripcion").val(cuento.descripcion);


            if (cuento.estado) {
                if (cuento.estado === "A")
                    $("#estadoA").prop("checked", "checked");
                else
                    $("#estadoI").prop("checked", "checked");
            } else {
                $("#estadoI").prop("checked", "checked");
            }

            $("#paginas").html("");
            $.each(cuento.paginas, function (i, v) {
                visualizarPagina(i, v);
            });

            $("#preguntas").html("");
            $.each(cuento.preguntas, function (i, v) {
                visualizarPregunta(i, v);
            });

            return false;
        });
    });

    $("#demo tbody a.del").click(function (e) {
        var id = $(e.target).attr("value");
        idxCuento = id;

        //var cuento = objJSON.contenido[0].cuento[id];
        objJSON.contenido[0].cuento.splice(id, 1);

        grabarArchivoJSON(objJSON);

        mostrar();

        return false;
    });
}

var visualizarPagina = function (i,v) {
    var lst = [];
    lst.push("<div>");
    lst.push("<label>Pagina #</label> <input type='text' value='" + (i + 1) + "' /><br />");
    lst.push("<label>Historia</label> <textarea class='hst'>");
    lst.push(v.historia);
    lst.push("</textarea><br />");

    lst.push("<label>Imagen</label> <select img='img-" + i + "'>");
    $.each(jsonImagenes.archivos, function (i, w) {
        lst.push("<option value='");
        lst.push(jsonImagenes.urlBase + w);
        lst.push("'");
        if (v.foto === (jsonImagenes.urlBase + w)) {
            lst.push("selected='selected'");
        }
        lst.push(">");
        lst.push(w);
        lst.push("</option>");
    });
    lst.push("</select>");
    lst.push("<img id='img-" + i + "' class='img' src='");
    lst.push(v.foto);
    lst.push("' /><br />");

    lst.push("<label>Audio</label> <select aud='aud-" + i + "'>");
    $.each(jsonAudio.archivos, function (i, w) {
        lst.push("<option value='");
        lst.push(jsonAudio.urlBase + w);
        lst.push("'");
        if (v.audio === (jsonAudio.urlBase + w)) {
            lst.push("selected='selected'");
        }
        lst.push(">");
        lst.push(w);
        lst.push("</option>");
    });
    lst.push("</select>");

    lst.push("<audio controls=''><source id='aud-" + i + "' src='");
    lst.push(v.audio);
    lst.push("' type='audio/mpeg'></audio>");

    lst.push("</div><br />");

    lst.push("<hr />");

    var pag = $(lst.join(""));
    $("#paginas").append(pag);

    $.each(pag.find("select"), function (i, v) {
        $(v).change(function (e) {
            var img = $(e.target).attr("img");
            if (typeof img !== "undefined") {
                $("#" + img).attr("src", $(e.target).val())
            }

            var aud = $(e.target).attr("aud");
            if (typeof aud !== "undefined") {
                var pd = $("#" + aud).parents("audio");

                var lst = [];
                lst.push("<audio controls=''><source id='" + aud + "' src='");
                lst.push($(e.target).val());
                lst.push("' type='audio/mpeg'></audio>");
                pd.replaceWith($(lst.join("")));
            }
        });
    });
};

var nuevo = function () {
    idxCuento = "";
    $("#codigo").val("");
    $("#titulo").val("");
    $("#descripcion").val("");
    $("#creditos").val("");
    $("#paginas").html("");
    $("#preguntas").html("");
};


var visualizarPregunta = function (i, v) {
    var lst = [];
    lst.push("<div>");
    lst.push("<label>Pregunta#</label> <input type='text' class='npre' value='" + (i + 1) + "' /><br />");
    lst.push("<label>Pregunta</label> <input type='text' class='pre' value='");
    lst.push(v.pregunta);
    lst.push("'/><br />");

    lst.push("<label>Opciones:</label>");
    lst.push("<br />");
    lst.push("<input type='text' class='opc' value='" + v.opciones[0].opcion + "'/>");
    lst.push("<br />");
    lst.push("<input type='text' class='opc' value='" + v.opciones[1].opcion + "'/>");
    lst.push("<br />");
    lst.push("<input type='text' class='opc' value='" + v.opciones[2].opcion + "'/>");
    lst.push("<br />");
    lst.push("<br />");
    lst.push("<label>Respuesta:</label>");
    lst.push("<input type='text' class='res' value='" + v.respuesta + "'/>");

    lst.push("</div><br />");

    lst.push("<hr />");

    var pag = $(lst.join(""));
    $("#preguntas").append(pag);

};