var express = require('express');
var express_handlebars = require('express3-handlebars')
var express_handlebars_sections = require('express-handlebars-sections');
var fs = require('fs');
var mysql = require('mysql');

var app = express();

app.use(require('body-parser')());

app.disable('x-powered-by');

app.set('port', process.env.PORT || 8081);

app.use(express.static(__dirname + '/public'));

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
  password : 'root',
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

app.get('/', function(req, res){
    res.redirect(303, '/index.html');
});
app.get('/index', function(req, res){
    res.redirect(303, '/index.html');
});
app.get('/index.html', function(req, res){
    serveStaticFile(res, '/views/index.html', 'text/html');
});

/*LISTA CUENTOS*/
var listaCuentos = function (res){
     connection.query('SELECT * from kiara.cuento', function(err, rows, fields) {
      if (!err){          
            console.log('Los datos son', rows);
            var context = {items:rows};
            res.render('listaCuentos',context);
      }
        else
        console.log('Error while performing Query.');
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
     connection.query('SELECT * from kiara.cuento', function(err, rows, fields) {
      if (!err){          
            console.log('Los datos son', rows);
            var context = {items:rows};
            res.render('administradorCuentos',context);
      }
        else
        console.log('Error while performing Query.');
    }); 
}

app.get('/administradorCuentos', function(req, res){
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
    console.log("Body:" + JSON.stringify (req.body));

     
        connection.query('SELECT * from cuento WHERE id_cuento=?', [req.body.codigo], function(err, rows, fields) {
            if (!err){          
    
                if(rows.length === 0){ // nuevo cuento
                    console.log('nuevo cuento'); 
                    connection.query('SELECT coalesce(max(id_cuento),0) + 1 as maxcuento from cuento', function(err, rows, fields) {
                        if (!err){ 
                            var maxcuento = rows[0].maxcuento;
                            console.log(maxcuento);

                            connection.query('insert into cuento (id_cuento, descripcion, titulo, creditos, numero_paginas) values (?,?,?,?,?)', [maxcuento, req.body.descripcion, req.body.titulo, req.body.creditos, 4], function(err, rows, fields) {
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
                                                            connection.query('insert into cuento (id_cuento, descripcion, titulo, creditos, numero_paginas) values (?,?,?,?,?)', [req.body.codigo, req.body.descripcion, req.body.titulo, req.body.creditos, 4], function(err, rows, fields) {
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
    
    
    res.set('content-type', 'application/json');
    
    
    var context = new Object();
    
    var msg = {};
    msg.msg="Se ha grabado con éxito.";
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