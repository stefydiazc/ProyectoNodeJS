var express    = require('express');        // call express
var app        = express();                 
var bodyParser = require('body-parser');
var mysql = require('mysql');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var port = process.env.PORT || 3000; 


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


/* var whitelist = ['http://localhost:8081/', 'http://localhost:3000/']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}*/


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var router = express.Router();              

router.use(function(req, res, next) {
   
    next(); 
});



router.get('/', function(req, res) {
    res.json({ message: 'hooray! bienvenido a tu api!' });   
});


router.route('/validacion')
.get( function(req, res){
  console.log(req.query);

  connection.query('select id_usuario from usuarios where nick_usuario=? and clave=?' 
    ,[req.query.nick, req.query.clave]
    ,function (err, rows, filed) {
                    if (!err){
                        console.log(rows);
                        if(rows.length===0)
                            res.json({ message: 'Usuario invalido!' });
                        else
                            res.json({ message: 'Usuario validado!' });
                    } else {
                        res.send(err);
                        console.log(err);
                    }
            })
})

router.route('/usuarios')

    .post(function(req, res) {
        console.log([req.body]);
        console.log([req.body.nick, req.body.nombre, req.body.correo, req.body.clave]);
    
        connection.query('insert into usuarios (nick_usuario, nombre_usuario, correo, clave) values ?'
              ,[[[req.body.nick, req.body.nombre, req.body.correo,  (req.body.clave)]]]
              ,function(err, rows, fields) {
                if (!err){
                    res.json({ message: 'Usuario creado!' });
                } else {
                    res.send(err);
                    console.log(err);
                }
        });            
    })

    .get(function (req, res){
      connection.query('SELECT * from usuarios', function(err, rows, fields) {
          if (!err){          
                console.log(rows);
                res.json(rows);
          } else{
              res.send(err);  
              console.log('Error en la lista de los usuarios.');
        }
    }); 
});


// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/usuarios/:id_usuario')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
        console.log(req.params);
        connection.query('select nick_usuario from usuarios where id_usuario=?'
            ,[req.params.id_usuario]
            , function(err, rows, fields) {
              if (!err){          
                    console.log(rows);
                    res.json(rows);
              } else{
                  res.send(err);  
                  console.log('Error en la ejecucion del get.');
            }
        }); 
    })



    .put(function(req, res) {
        console.log(req.query);
        console.log(req.body);
        console.log(req.params);

        if (!req.body.clave){
            console.log("sin clave");

            connection.query('update usuarios set nick_usuario=?,  nombre_usuario=?, correo=?  where id_usuario=?'
                      ,[req.body.nick, req.body.nombre, req.body.correo, req.params.id_usuario]
                      ,function(err, rows, fields) {
                        if (!err){
                            console.log(rows);
                            res.json({ message: 'Usuario actualizado!' });
                        } else {
                            res.send(err);
                            console.log(err);
                        }

                });
        } else {
                connection.query('update usuarios set nick_usuario=?,  nombre_usuario=?, correo=?, clave=? where id_usuario=?'
                          ,[req.body.nick, req.body.nombre, req.body.correo, req.body.clave, req.params.id_usuario]
                          ,function(err, rows, fields) {
                            if (!err){
                                console.log(rows);
                                res.json({ message: 'Usuario actualizado!' });
                            } else {
                                res.send(err);
                                console.log(err);
                            }

                    });

            }
        })

    .delete(function(req, res) {
           
          connection.query('DELETE FROM usuarios WHERE id_usuario=?'
                  ,[req.params.id_usuario]
                  ,function(err, rows, fields) {
                    if (!err){
                        console.log(rows);
                        res.json({ message: 'Usuario borrado!' });
                    } else {
                        res.send(err);
                        console.log(err);
                    }

            }) 
        });


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);



// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
