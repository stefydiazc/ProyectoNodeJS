
/*https://www.js-tutorials.com/javascript-tutorial/nodejs-example-upload-store-image-mysql-express-js/*/

var express = require('express');
var express_handlebars = require('express3-handlebars')
var express_handlebars_sections = require('express-handlebars-sections');
//var validator = require('express-validator');
var querystring = require('querystring');
var fs = require('fs');
var mysql = require('mysql');
var cors = require('cors');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var https = require('http');
var request = require("request");
var  fileUpload = require('express-fileupload');
var app = express();

app.use(require('body-parser')());
//app.use(validator());
app.use(cors());
app.use(cookieParser());
app.use(fileUpload());


app.disable('x-powered-by');

app.set('port', process.env.PORT || 8081);

app.use(express.static(__dirname + '/public'));

app.use(session({secret: 'kiara'}));

var handlebars = express_handlebars.create({
    defaultLayout:'plantillacomun.handlebars'
});

express_handlebars_sections(handlebars);

app.engine('handlebars', handlebars.engine);

app.set('view engine', 'handlebars');


function serveStaticFile(res, path, contentType, responseCode) {
    if(!responseCode) responseCode = 200;
    fs.readFile(__dirname + path, function(err,data) {
        if(err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 - Internal Error');
        } else {
            res.writeHead(responseCode,
                          { 'Content-Type': contentType });
            res.end(data);
        }
    });
}

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'kiara'
});

connection.connect();

function handleDisconnect(connection) {
  connection.on('error', function(err) {
    if (!err.fatal) {
      return;
    }

    if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
      throw err;
    }

    console.log('Re-connecting lost connection: ' + err.stack);

    connection = mysql.createConnection(connection.config);
    handleDisconnect(connection);
    connection.connect();
  });
}

handleDisconnect(connection);


var sess;

//app.options('/', cors());
app.get('/', function(req, res){
    res.redirect(303, '/index.html');
});
app.get('/index', function(req, res){
    res.redirect(303, '/index.html');
});
app.get('/index.html', function(req, res){
    serveStaticFile(res, '/views/index.html', 'text/html');
});


/* LOGIN - BIENVENIDOS*/

app.get('/bienvenidos', function(req, res){
      
    res.render('bienvenidos');

});

app.get('/administradorMultimedia', function(req, res){
      
    res.render('administradorMultimedia');

});

app.post('/bienvenidos', function(req, res){
    sess = req.session;
    sess.yo = req.body.nick;

    connection.query('select id_usuario from usuarios where nick_usuario=?',[sess.yo]
        ,function (err, rows, filed) {
                    if (!err){
                        console.log(rows);
                        if(rows.length!==0){
                            sess.idusuario = rows[0].id_usuario;
                            res.redirect("/administradorCuentos");
                        } else
                            res.json({ message: 'Nick invalidado!' });
                    } else {
                        res.send(err);
                        console.log(err);
                    }
            });
    
});

app.get('/logout',function(req,res){
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});


app.get('/creaCuenta', function(req, res){
    res.render('creaCuenta');
});
         
app.post('/creaCuenta', function(req, res){
  console.log("creaCuenta post");
    console.log(req.query);
    console.log(req.body);
    

  connection.query('select id_usuario from usuarios where nick_usuario=?' 
    ,[req.body.nick]
    ,function (err, rows, filed) {
                    if (!err){
                        console.log(rows);
                        if(rows.length===0) {
                            
                          connection.query('insert into usuarios (nick_usuario, nombre_usuario, correo,  clave) values ?'
                              ,[[[req.body.nick, req.body.nombre_usuario,  req.body.correo, (req.body.clave)]]]
                              ,function(err, rows, fields) {
                                if (!err){
                                  //  res.redirect(303, '/bienvenidos');
                                    res.render('winMensaje',{titulo:"BIEVENIDOS",mensaje:"Ahora eres miembro de la gran familia de KIARA",href:"bienvenidosCuentos",texto:"Empieza a crear tu historia"});
                                } else {
                                    res.send(err);
                                    console.log(err);
                                }
                            });
                            
                        }
                        else
                            res.json({ message: 'Usuario invalido!' });
                    } else {
                        res.send(err);
                        console.log(err);
                    }
            });
  
//    crearCuenta(res);

});
/*Lista usuarios*/
var administradorUsuarios = function (res){
     connection.query('SELECT * from usuarios', function(err, rows, fields) {
      if (!err){          
            console.log('Los usuarios del cuento son', rows);
            var context = {usuarios:rows};
            res.render('administradorUsuarios',context);
      }
        else
        console.log('Error mientras se ejecuta lista Usuarios.');
    }); 
}

app.get('/administradorUsuarios', function(req, res){
     // administradorUsuarios(res);
    buscarUsuarios (res);
});


/*call server*/

function buscarUsuarios (res) {

    var query = querystring.stringify({
       
    });
//    var options = {
//        hostname: 'http://localhost:3000/',
//        path: '/api/usuarios/' + query
//    };
//
//    var req = https.request(options, function(res) {
//        console.log(res);
//        
//        if (!res) { 
//            wikiData = "An error occured!";
//            complete();
//        };
//
//        var body = '';
//        console.log("statusCode: ", res.statusCode);
//        res.setEncoding('utf8');
//
//        res.on('data', function(data) {
//            body += data;
//        });
//
//        res.on('end', function() {
//            wikiData = wikiDataParser( JSON.parse(body) );
//            complete();
//        });
//    });
//
//    req.end();
//    req.on('error', function (err) {
//        wikiData = "<h2>MediaWiki API is currently down.</h2>";
//        complete();
//    })

    request({
        url: 'http://localhost:3000/api/usuarios/' + query,
        json: true
    }, function (error, response, body) {
//        console.log(error);
//        console.log(response);
//        console.log(body);
       if (!error && response.statusCode === 200) {
            var usuarios = body;
       //     console.log(usuarios);

           var context = {usuarios:usuarios};
      //      console.log(context);
            res.render('administradorUsuarios',context);

            return usuarios;
        } else {
            console.log("Error connecting to the API: " + url);
            return;
        }
    });

};
/*Crud Usuarios*/

app.get('/crudUsuarios', function(req, res){
    var context = new Object();
    context.idusuario = req.query.idusuario;
    if(req.query.idusuario){
        connection.query('SELECT * from usuarios WHERE id_usuario=?', [req.query.idusuario], function(err, rows, fields) {
            if (!err){          
                context.usuarios = rows;
                if(rows.length === 0){
                    context.usuarios.push({});
                    context.usuarios[0].codigo_usuario="";
                    context.usuarios[0].nick_usuario="";
                    context.usuarios[0].nombre_usuario="";
                    context.usuarios[0].correo="";
                }
                //console.log('Los datos del cuento son', context);
                res.render("crudUsuarios",context);
            }
            else
                console.log('Error leyendo los usuarios del cuento.');
        }); 
    }else{
        res.set('Content-Type','text/plain');
        res.send("No ha indicado el usuario");
    }
});


app.post('/crudUsuarios', function(req,res){
    console.log("crudUsuarios post");
    console.log(req.query);
    console.log(req.body);
    console.log(req.params);
    console.log("Body:" + JSON.stringify (req.body));
    
    actualizarUsuario(req,res);
    //res.render('crudUsuarios');
});

function actualizarUsuario(req,res){
    console.log("actualizarUsuario");
    request({
        url: 'http://localhost:3000/api/usuarios/' + req.body.codigo_usuario,
        method:"PUT",
        json: true,
        form: {
            "nick": req.body.nick_usuario,
            "nombre": req.body.nombre_usuario,
            "correo": req.body.correo
            //"clave"
        }
    }, function (error, response, body) {
//        console.log(error);
//        console.log(response);
        console.log(body);
       if (!error && response.statusCode === 200) {
            var usuarios = body;
            console.log(usuarios);

            res.set('content-type', 'application/json');
            res.send(usuarios);
        } else {
            console.log("Error connecting to the API: " + url);
            return;
        }
    });
}

/*app.post('/usuariosGuardar',function(req,res){
    console.log("Body:" + JSON.stringify (req.body));
 
          
});
*/

/*LISTA CUENTOS*/
var listaCuentos = function (res){
     connection.query('SELECT * from kiara.cuento', function(err, rows, fields) {
      if (!err){          
            console.log('Los datos son', rows);
            var context = {items:rows};
            res.render('listaCuentos',context);
      }
        else
        console.log('Error mientras se ejecuta lista Cuentos.');
    }); 
}

app.get('/listaCuentos', function(req, res){
      listaCuentos(res);

});

/*MOSTRAR PRESENTAR CUENTO*/
app.get('/presentarCuentos', function(req, res){
    if(!(req.query.idcuento)){
        res.render('errorWin',{titulo:"",mensaje:"falta numero de cuento"});
        return;
    }

    var idxCuento = parseInt(req.query.idcuento ,10);

    var idxPagina = 1;
    if(req.query.idpagina){
        idxPagina = parseInt(req.query.idpagina ,10);
    }
    
    var lst =[];
    lst.push("SELECT * ");
    lst.push(" ,case anterior when 0 then 1 else 0   end as es_primero");
    lst.push(" ,case siguiente when 0 then 1 else 0 end as es_ultimo");
    lst.push(" FROM (");
    lst.push(" SELECT * , numero - 1 AS anterior");
    lst.push(" ,CASE WHEN numero + 1 > last THEN 0 ELSE numero + 1 END AS siguiente");
    lst.push(" FROM (");
    lst.push(" SELECT * ");
    lst.push(" ,(");
    lst.push(" SELECT max(numero)");
    lst.push(" FROM paginas ");
    lst.push(" where id_cuento=?");
    lst.push(" ) as last");
    lst.push(" FROM paginas");
    lst.push(" where numero=? and id_cuento=?");
    lst.push(" ) AS a");
    lst.push(" )as b");
       
    connection.query( lst.join (''),[idxCuento, idxPagina, idxCuento], function(err, rows, field){
        if (!err){
            var cuento = {pagina:rows};
            console.log(cuento);
            res.render('presentarCuentos',cuento);
        }else{
            res.render('errorWin',{titulo:"",mensaje:err});
        }
    });

});

/*MOSTRAR PREGUNTA*/
app.get('/mostrarPreguntas', function(req, res){
     if(!(req.query.idcuento)){
        res.render('errorWin',{titulo:"",mensaje:"falta numero de cuento"});
        return;
    }

    var idxCuento = parseInt(req.query.idcuento ,10);
    var idxNumero = parseInt(req.query.numero ,10);
    console.log(idxNumero);
    if(isNaN(idxNumero)) idxNumero = 1;
    console.log(idxNumero);
    var cuento;    
    connection.query('SELECT * FROM preguntas WHERE id_cuento=? AND numero=?',[idxCuento, idxNumero], 
                     function(err, rows, field){
        if (!err){
            cuento = {pregunta:rows,id_cuento:idxCuento,numero:idxNumero};
            console.log(cuento);

            connection.query('SELECT b.numero_opcion ,b.texto_opcion from preguntas as a inner join opciones as b on b.id_pregunta = a.id_pregunta where id_cuento=? AND numero =?;',
                             [idxCuento, idxNumero], 
                             function(err, rows, field){
                if (!err){
                    cuento.opciones = rows;
                    console.log(cuento);
                    res.render('mostrarPreguntas',cuento);
                }else{
                    res.render('errorWin',{titulo:"",mensaje:err});
                }
            });
        }else{
            res.render('errorWin',{titulo:"",mensaje:err});
        }
    });

});

/*MOSTRAR RESULTADO*/
var mostrarResultado = function(req, res){
    var toRender;
    var idxCuento = parseInt(req.query.idcuento ,10);
    var idxNumero = parseInt(req.query.numero , 10);
    var idxOpcion = parseInt(req.body.opciones ,10);
    
    var context;
    console.log(idxCuento);
    console.log(idxNumero);
    console.log(idxOpcion);

   if(isNaN(idxOpcion)){
       toRender = {mensaje:'Debe seleccionar una respuesta.'
                   ,boton:"Repetir pregunta"
                  ,id_cuento:idxCuento
                  ,numero:idxNumero};
       res.render('mostrarResultado',toRender);
       return;       
   }
    connection.query('SELECT respuesta,(SELECT max(numero) FROM preguntas WHERE id_cuento=?) as max_pregunta FROM preguntas WHERE id_cuento=? AND numero=?',[idxCuento, idxCuento, idxNumero], function(err, rows, fields) {
      if (!err){          
          
            context = {resultado:rows};
          
           connection.query('SELECT b.numero_opcion ,b.texto_opcion from preguntas as a inner join opciones as b on b.id_pregunta = a.id_pregunta WHERE id_cuento=? and numero=? and numero_opcion=?',[idxCuento, idxNumero, idxOpcion], function(err, rows, fields) {
              if (!err){          
                    context.opcion=rows;
                    console.log('La respuesta son', context);
                  
                  var idxNumero_next = idxNumero+1;
                  
                  var idxbackCuento = (idxNumero_next > context.resultado[0].max_pregunta);
                  
                  console.log(idxbackCuento);
                  
                  if(context.resultado[0].respuesta === context.opcion[0].texto_opcion){
                        toRender = {mensaje:'Felicidades!!!, respuesta correcta'
                            ,boton:"Siguiente pregunta"
                            ,id_cuento:idxCuento
                            ,numero:idxNumero_next
                            ,idxbackCuento:idxbackCuento };
                      
                  }else
                        toRender = {mensaje:'Te equivocaste, la respuesta correcta es : '+ context.resultado[0].respuesta
                            ,boton:"Siguiente pregunta"
                            ,id_cuento:idxCuento
                            ,numero:idxNumero_next
                            ,idxbackCuento:idxbackCuento};
                                    
                  res.render('mostrarResultado',toRender);

              }
                else
                console.log('Error while performing Query.');
            });  
      }
        else
        console.log('Error while performing Query.');
    }); 
}


app.post('/mostrarResultado', function(req, res){
  mostrarResultado(req, res);
});


/*ADMINISTRADOR CUENTOS*/
var administradorCuentos = function (res){
     connection.query('SELECT * from kiara.cuento where id_usuario in (select id_usuario from usuarios where nick_usuario=?)',[sess.yo],function(err, rows, fields) {
      if (!err){          
            console.log('Los datos son', rows);
            var context = {items:rows};
            res.render('administradorCuentos',context);
      }
        else
        console.log('Error mientras se ejecuta administrar contenido.');
    }); 
}

app.get('/administradorCuentos', function(req, res){
    sess = req.session;
    if (!(sess.yo)){
        console.log('No ha indiciado sesion.');
        res.render('errorWin',{titulo:"",mensaje:"No ha indicado sesion."});
        return;
    }
    
    if(req.query.idcuento){
        connection.query('delete from opciones where id_pregunta in (select id_pregunta from preguntas where id_cuento=?)', [req.query.idcuento], function(err, rows, fields) {
            if (!err){          
                connection.query('delete from preguntas where id_cuento=?', [req.query.idcuento], function(err, rows, fields) {
                    if (!err){          
                        connection.query('delete from paginas where id_cuento=?', [req.query.idcuento], function(err, rows, fields) {
                            if (!err){          
                                connection.query('delete from cuento where id_cuento=?', [req.query.idcuento], function(err, rows, fields) {
                                    if (!err){                                                                          
                                        console.log('Se borro exitosamente la fila');
                                    }
                                    else{
                                        console.log('Error c.');
                                    }
                                    administradorCuentos(res);
                                });
                            } else {
                                console.log('Error borrando paginas.');
                                administradorCuentos(res);
                            }
                        });
                    } else {
                        console.log('Error borrando preguntas.');
                        administradorCuentos(res);
                    }
                });
            } else {
                console.log('Error borrando opciones.');
                administradorCuentos(res);
            }
        });
    } else {
        console.log('No ha indicado el cuento a borrar.');
        administradorCuentos(res);
    }
});

/*CRUD CUENTOS*/
app.get('/crudCuentos', function(req, res){
    var context = new Object();
    if(req.query.idcuento){
        //console.log(req.query.idcuento);
        
        connection.query('SELECT * from cuento WHERE id_cuento=?', [req.query.idcuento], function(err, rows, fields) {
            if (!err){          
                context.items = rows;
                if(rows.length === 0){
                    context.items.push({});
                    context.items[0].codigo="";
                    context.items[0].titulo="";
                    context.items[0].descripcion="";
                    context.items[0].creditos="";
                }
                //console.log('Los datos del cuento son', context);
                
                connection.query('SELECT * from paginas WHERE id_cuento=?', [req.query.idcuento], function(err, rows, fields) {
                    if (!err){          
                        context.paginas = rows;
                        //console.log('Las paginas del cuento son', context);

                        connection.query('SELECT * from preguntas WHERE id_cuento=?', [req.query.idcuento], function(err, rows, fields) {
                            if (!err){          
                                context.preguntas = rows;
                                //console.log('Las preguntas del cuento son', context);
                            
                                connection.query('SELECT * from libreriafoto', function(err, rows, fields) {
                                    if (!err){          
                                        context.fotos = rows;
                                        //console.log('Las fotos del cuento son', context);

                                            connection.query('SELECT * from libreriaaudio', function(err, rows, fields) {
                                            if (!err){          
                                                context.audios = rows;
                                                //console.log('Los audios del cuento son', context);

                                                connection.query('select p.numero, numero_opcion, texto_opcion from opciones o, preguntas p where p.id_pregunta=o.id_pregunta and p.id_cuento=?', [req.query.idcuento], function(err, rows, fields) {
                                                if (!err){
                                                    //console.log('opciones', rows);
                                                    for (var i = 0, len = context.preguntas.length; i < len; i++) {
                                                        var e = context.preguntas[i];    
                                                        e.opcion = [];    
                                                        //console.log('e', e);
                                                            
                                                        for (var j = 0; j<rows.length; j++) {
                                                            opcion = rows[j];
                                                            //console.log('opcion', opcion);
                                                            if(opcion.numero === e.numero){
                                                                //console.log('e.numero', e.numero);
                                                                //console.log('opcion', opcion);
                                                                e.opcion.push(opcion);
                                                                //context.preguntas[i].opcion[e.opcion.length] = JSON.parse(JSON.stringify(opcion)) ;
                                                                //rows.remove(opcion);
                                                            }
                                                        }
                                                    }
                                                    
                                                    //context.opcion = rows;
                                                    //console.log('cotexto', context);

                                                    res.render('crudCuentos',context);
                                                }
                                                else
                                                    console.log('Error leyendo opciones.');
                                                });                                     
                                            }
                                            else
                                                console.log('Error leyendo libreriaaudios.');
                                        });                                  
 
                                    }
                                    else
                                        console.log('Error leyendo libreriafoto.');
                                });                                  
                            }
                            else
                                console.log('Error leyendo preguntas.');
                        }); 
                    }
                    else
                        console.log('Error leyendo paginas.');
                }); 
            }
            else
                console.log('Error leyendo el cuento.');
        }); 
    }else{
        res.set('Content-Type','text/plain');
        res.send("No ha indicado el cuento");
    }
});


app.post('/cuentosGuardar',function(req,res){
    sess = req.session;
    console.log("Body:" + JSON.stringify (req.body));

     
        connection.query('SELECT * from cuento WHERE id_cuento=?', [req.body.codigo], function(err, rows, fields) {
            if (!err){          
    
                if(rows.length === 0){ // nuevo cuento
                    console.log('nuevo cuento'); 
                    connection.query('SELECT coalesce(max(id_cuento),0) + 1 as maxcuento from cuento', function(err, rows, fields) {
                        if (!err){ 
                            var maxcuento = rows[0].maxcuento;
                            console.log(maxcuento);

                            connection.query('insert into cuento (id_cuento, descripcion, titulo, creditos, numero_paginas, id_usuario) values (?,?,?,?,?,?)'
                                             , [maxcuento, req.body.descripcion, req.body.titulo, req.body.creditos, 4 ,sess.idusuario]
                                             , function(err, rows, fields) {
                                if (!err){
                                    for(var icnt=0; icnt<req.body.paginas.length; icnt++){
                                        req.body.paginas[icnt].splice(0, 0, parseInt(maxcuento ,10));
                                    }
                                    console.log(req.body.paginas);

                                    connection.query('insert into paginas (id_cuento, numero, historia, foto_ruta, audio_ruta) values ?', [req.body.paginas], function(err, rows, fields) {
                                        if (!err){

                                            for(var icnt=0; icnt<req.body.preguntas.length; icnt++){
                                                req.body.preguntas[icnt].splice(0, 0, parseInt(maxcuento ,10));
                                            }
                                            console.log(req.body.preguntas);

                                            connection.query('insert into preguntas (id_cuento, numero, nombre_pregunta, respuesta) values ?'
                                                             , [req.body.preguntas]
                                                             , function(err, rows, fields) {
                                                if (!err){
                                                    // consultar preguntas
                                                    connection.query('SELECT id_pregunta, numero FROM preguntas WHERE id_cuento=?'
                                                                     , [maxcuento]
                                                                     , function(err, rows, fields) {
                                                        if (!err){
                                                            //console.log(rows);
                                                            // insertar id en arreglo
                                                            for(var icnt=0; icnt<req.body.opciones.length; icnt++){
                                                                for(var jcnt=0; jcnt<rows.length; jcnt++){
                                                                    if(rows[jcnt].numero===parseInt( req.body.opciones[icnt][0],10))
                                                                    req.body.opciones[icnt].splice(0, 1, parseInt(rows[jcnt].id_pregunta ,10));
                                                                }
                                                            }
                                                            console.log(req.body.opciones);

                                                            // insertar arreglo en db
                                                            connection.query('insert into opciones (id_pregunta, numero_opcion, texto_opcion) values ?'
                                                                             , [req.body.opciones]
                                                                             , function(err, rows, fields) {
                                                                if (!err){
                                                                    // consultar preguntas


                                                                } else {
                                                                    console.log(err);
                                                                }

                                                            });         


                                                        } else {
                                                            console.log(err);
                                                        }

                                                    });         


                                                } else {
                                                    console.log(err);
                                                }

                                            });         


                                        } else {
                                            console.log(err);
                                        }

                                    });         

                                } else {
                                    console.log(err);

                                }

                            });
                            
                        } else {
                            console.log(err);
                        }

                    });
                    
                    
                }
                else{ // cuento existente
                    console.log('cuento existente');
                    
                    connection.query('delete from opciones where id_pregunta in (select id_pregunta from preguntas where id_cuento=?)', [req.body.codigo], function(err, rows, fields) {
                        if (!err){          
                            connection.query('delete from preguntas where id_cuento=?', [req.body.codigo], function(err, rows, fields) {
                                if (!err){          
                                        connection.query('delete from paginas where id_cuento=?', [req.body.codigo], function(err, rows, fields) {
                                            if (!err){          
                                                connection.query('delete from cuento where id_cuento=?', [req.body.codigo], function(err, rows, fields) {
                                                     console.log('hasta aqui borre');
                                                        if (!err){                                                                          
                                                            connection.query('insert into cuento (id_cuento, descripcion, titulo, creditos, numero_paginas, id_usuario) values (?,?,?,?,?,?)'
                                                                             , [req.body.codigo, req.body.descripcion, req.body.titulo, req.body.creditos, 4 ,sess.idusuario]
                                                                             , function(err, rows, fields) {
                                                                if (!err){
                                                                    for(var icnt=0; icnt<req.body.paginas.length; icnt++){
                                                                        req.body.paginas[icnt].splice(0, 0, parseInt(req.body.codigo ,10));
                                                                    }
                                                                    console.log(req.body.paginas);
                                                                    
                                                                    connection.query('insert into paginas (id_cuento, numero, historia, foto_ruta, audio_ruta) values ?', [req.body.paginas], function(err, rows, fields) {
                                                                        if (!err){

                                                                            for(var icnt=0; icnt<req.body.preguntas.length; icnt++){
                                                                                req.body.preguntas[icnt].splice(0, 0, parseInt(req.body.codigo ,10));
                                                                            }
                                                                            console.log(req.body.preguntas);

                                                                            connection.query('insert into preguntas (id_cuento, numero, nombre_pregunta, respuesta) values ?'
                                                                                             , [req.body.preguntas]
                                                                                             , function(err, rows, fields) {
                                                                                if (!err){
                                                                                    // consultar preguntas
                                                                                    connection.query('SELECT id_pregunta, numero FROM preguntas WHERE id_cuento=?'
                                                                                                     , [req.body.codigo]
                                                                                                     , function(err, rows, fields) {
                                                                                        if (!err){
                                                                                            //console.log(rows);
                                                                                            // insertar id en arreglo
                                                                                            for(var icnt=0; icnt<req.body.opciones.length; icnt++){
                                                                                                for(var jcnt=0; jcnt<rows.length; jcnt++){
                                                                                                    if(rows[jcnt].numero===parseInt( req.body.opciones[icnt][0],10))
                                                                                                    req.body.opciones[icnt].splice(0, 1, parseInt(rows[jcnt].id_pregunta ,10));
                                                                                                }
                                                                                            }
                                                                                            console.log(req.body.opciones);

                                                                                            // insertar arreglo en db
                                                                                            connection.query('insert into opciones (id_pregunta, numero_opcion, texto_opcion) values ?'
                                                                                                             , [req.body.opciones]
                                                                                                             , function(err, rows, fields) {
                                                                                                if (!err){
                                                                                                    // consultar preguntas
                                                                                                    //res.redirect(303,"/administradorCuentos");

                                                                                                } else {
                                                                                                    console.log(err);
                                                                                                }

                                                                                            });         


                                                                                        } else {
                                                                                            console.log(err);
                                                                                        }

                                                                                    });         
                                                                                    
                                                                                    
                                                                                } else {
                                                                                    console.log(err);
                                                                                }

                                                                            });         
                                                                            
                                                                            
                                                                        } else {
                                                                            console.log(err);
                                                                        }

                                                                    });         

                                                                } else {
                                                                    console.log(err);
                                                                   
                                                                }

                                                            });


                                                        } else {
                                                            console.log(err);
                                                        }

                                                    });

                                            } else {
                                                console.log(err);
                                            }

                                        });

                                } else {
                                    console.log(err);
                                }

                            });

                        } else {
                            console.log(err);
                        }

                    });
                    
                }
            } else {
                console.log(err);
            }
            
        });
    
    
    
    
    var context = new Object();
    
    var msg = {};
    msg.msg="Se ha grabado con éxito.";

    res.set('content-type', 'application/json');
    res.send(msg);
});


// custom 404 page
app.use(function(req, res, next){
    res.status(404);
    res.render('errorWin',{titulo:"",mensaje:"404 - not found"});
});

// custom 500 page
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('errorWin',{titulo:"",mensaje:"500 - server error"});
  
});


app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
});