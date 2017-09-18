-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema kiara
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema kiara
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `kiara` DEFAULT CHARACTER SET utf8 ;
USE `kiara` ;

-- -----------------------------------------------------
-- Table `kiara`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kiara`.`usuarios` (
  `id_usuario` INT(11) NOT NULL AUTO_INCREMENT,
  `nick_usuario` VARCHAR(45) NOT NULL,
  `nombre_usuario` VARCHAR(45) NOT NULL,
  `correo` VARCHAR(265) NOT NULL,
  `clave` VARCHAR(512) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE INDEX `id_usuario_UNIQUE` (`id_usuario` ASC),
  UNIQUE INDEX `nick_usuario_UNIQUE` (`nick_usuario` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `kiara`.`cuento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kiara`.`cuento` (
  `id_cuento` INT(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` INT NOT NULL,
  `titulo` VARCHAR(255) NOT NULL,
  `descripcion` LONGTEXT NOT NULL,
  `creditos` VARCHAR(225) NOT NULL,
  `numero_paginas` INT(11) NOT NULL,
  PRIMARY KEY (`id_cuento`),
  UNIQUE INDEX `id_UNIQUE` (`id_cuento` ASC),
  INDEX `id_usuario_idx` (`id_usuario` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `kiara`.`libreriaaudio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kiara`.`libreriaaudio` (
  `ruta_libreriaaudio` VARCHAR(200) NOT NULL,
  `nombre_audio` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`ruta_libreriaaudio`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `kiara`.`libreriafoto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kiara`.`libreriafoto` (
  `ruta_libreriafoto` VARCHAR(200) NOT NULL,
  `nombre_foto` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`ruta_libreriafoto`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `kiara`.`preguntas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kiara`.`preguntas` (
  `id_pregunta` INT(11) NOT NULL AUTO_INCREMENT,
  `id_cuento` INT(11) NOT NULL,
  `numero` INT(11) NOT NULL,
  `nombre_pregunta` VARCHAR(255) NOT NULL,
  `respuesta` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id_pregunta`),
  UNIQUE INDEX `id_pregunta_UNIQUE` (`id_pregunta` ASC),
  INDEX `fk_preguntas_cuento1_idx1` (`id_cuento` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `kiara`.`opciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kiara`.`opciones` (
  `id_opcion` INT(11) NOT NULL AUTO_INCREMENT,
  `id_pregunta` INT(11) NOT NULL,
  `numero_opcion` VARCHAR(100) NOT NULL,
  `texto_opcion` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id_opcion`),
  UNIQUE INDEX `id_opcion_UNIQUE` (`id_opcion` ASC),
  INDEX `fk_opciones_preguntas1_idx1` (`id_pregunta` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `kiara`.`paginas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kiara`.`paginas` (
  `id_pagina` INT(11) NOT NULL AUTO_INCREMENT,
  `id_cuento` INT(11) NOT NULL,
  `numero` INT(11) NOT NULL,
  `historia` LONGTEXT NOT NULL,
  `foto_ruta` VARCHAR(2000) NOT NULL,
  `audio_ruta` VARCHAR(2000) NOT NULL,
  PRIMARY KEY (`id_pagina`),
  UNIQUE INDEX `id_pagina_UNIQUE` (`id_pagina` ASC),
  INDEX `fk_paginas_cuento_idx1` (`id_cuento` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

insert into usuarios(nick_usuario, nombre_usuario, correo, clave) values ('stefy','Stefy Diaz','geesdiaz@espol.edu.ec','1234');
insert into usuarios(nick_usuario, nombre_usuario, correo, clave) values ('gaby','Gabriela Requena','margareq@espol.edu.ec','1234');
insert into usuarios(nick_usuario, nombre_usuario, correo, clave) values ('jaqui','Jaqueline Mejia','jmejia@espol.edu.ec','1234');

insert into cuento(id_usuario, titulo, descripcion, creditos, numero_paginas) values(1,'La Hormiga Trabajadora', 'Ver la necesidad del otro y compartir. Ser solidario con los demás.', ' creado por: Mariana Morales', 4);
insert into cuento(id_usuario, titulo, descripcion, creditos, numero_paginas) values(1,'Los Ratoncitos Desobedientes', 'Ver la importancia de la obediencia.', ' creado por: Manuel Mendieta', 4);
insert into cuento(id_usuario, titulo, descripcion, creditos, numero_paginas) values(2,'Los Ositos Reboltosos', 'Ver la importancia del respeto y la disciplina.', ' creado por: Eva Moreno Montilla', 4);

-- ---------------------------------------------------

-- ---------------------------------------------------

insert into paginas(id_cuento, numero , historia, foto_ruta, audio_ruta) values(1, 1,'Érase una hormiga llamada Lucia que lo único que hacía todo el día era trabajar, trabajar y solo trabajar.','\\recursos\\imagenes\\cuento1_pagina1.jpg', '\\recursos\\audio\\cuento1_audio1.mp3');
insert into paginas(id_cuento, numero , historia, foto_ruta, audio_ruta) values(1, 2,'Un día la hormiga se perdió y no sabía regresar. Se sentó con un grupo de grillos que estaban tumbados cantando; esos grillos sólo cantaban y cantaban, la hormiga les preguntó que si no recogían comida para el invierno.','\\recursos\\imagenes\\cuento1_pagina2.jpg', '\\recursos\\audio\\cuento1_audio2.mp3');
insert into paginas(id_cuento, numero,  historia, foto_ruta, audio_ruta) values(1, 3,'Los grillos le dijeron que no, que pasaban; entonces la hormiga hizo un trato con los grillos. El trato era: si ustedes me cobijáis en vuestra casa todo el invierno yo os cogeré comida para todo el invierno.','\\recursos\\imagenes\\cuento1_pagina3.jpg', '\\recursos\\audio\\cuento1_audio3.mp3');
insert into paginas(id_cuento, numero,  historia, foto_ruta, audio_ruta) values(1, 4,'"Llegando el invierno la hormiga les hacía de comer todo el día. Estuvieron todo el invierno pasándoselo bien y la hormiga comprendió que, aparte de trabajar, también era necesario divertirse y los grillos aprendieron que era necesario recoger comida durante todo el verano.','\\recursos\\imagenes\\cuento1_pagina4.jpg', '\\recursos\\audio\\cuento1_audio4.mp3');

-- ---------------------------------------------------
insert into paginas(id_cuento, numero,  historia, foto_ruta, audio_ruta) values(2, 1,'Una vez, estaban dos Ratoncitos que eran hermanos muy unidos. Ellos salieron a pasear sin permiso de su mamá que siempre les recomendaba no alejarse mucho de su hogar, pero ellos lo olvidaron y tras caminar buen rato, se alejaron demasiado de su casa y ya era de noche.','\\recursos\\imagenes\\cuento2_pagina1.jpg', '\\recursos\\audio\\cuento2_audio1.mp3');
insert into paginas(id_cuento,numero,   historia, foto_ruta, audio_ruta) values(2, 2,'La Ratoncita asustada, dijo a su hermano en voz baja: Hermanito, ¿escuchaste ese ruido?, ¿crees que sea un Gato?, tengo miedo!. Tras esto, los dos se abrazaron muy asustados temiendo lo peor. Derrepente, escucharon una voz familiar','\\recursos\\imagenes\\cuento2_pagina2.jpg', '\\recursos\\audio\\cuento2_audio2.mp3');
insert into paginas(id_cuento,numero,   historia, foto_ruta, audio_ruta) values(2, 3,'¡Hijos míos, soy yo! ¿donde están?, ¿por qué se alejaron tanto? Si, era su Papa, y sin demora, ellos corrieron muy felices para abrazarla. Luego todos regresaron al hogar nuevamente. Cuando ya estaban seguros, el Papa les dijo:','\\recursos\\imagenes\\cuento2_pagina3.jpg', '\\recursos\\audio\\cuento2_audio3.mp3');
insert into paginas(id_cuento, numero,  historia, foto_ruta, audio_ruta) values(2, 4,' Prométanme que nunca más se alejarán sin mi permiso del hogar. Afuera hay mucho peligro para ustedes. Los dos Ratoncitos muy arrepentidos dijeron a su Papa: ¡Papito, papito, perdónanos por favor! Gracias por ir en nuestra ayuda. Que bueno es estar en casa nuevamente a tu lado.','\\recursos\\imagenes\\cuento2_pagina4.jpg', '\\recursos\\audio\\cuento2_audio4.mp3');

-- ---------------------------------------------------
insert into paginas(id_cuento, numero,  historia, foto_ruta, audio_ruta) values(3, 1,'Osete y Osito vivían en un hermoso bosque donde había colmenas cargadas de panales de rica miel y un río de aguas cristalinas donde bañarse y jugar con los peces.Pero eran muy traviesos los dos ositos y más de una vez se perdían mientras perseguían a alguna mariposa, por eso la mamá de Osete y Osito, mami Osa, les castigaba sin poder ir a bañarse o jugar con los demás ositos.','\\recursos\\imagenes\\cuento3_pagina1.jpg', '\\recursos\\audio\\cuento3_audio1.mp3');
insert into paginas(id_cuento,numero,   historia, foto_ruta, audio_ruta) values(3, 2,'Cuando los ratoncillos del bosque estaban descuidados tomando el sol, solían correr detrás de ellos, obligándoles a huir temblando de miedo.En una ocasión los traviesos ositos quisieron coger un panal de miel de lo alto de un árbol.Mientras Osete miraba lo que hacía su hermano, Osito trataba de subir a las ramas. Se acercó y se acercó al panal y alzando las zarpas dio a la colmena con gran fuerza.','\\recursos\\imagenes\\cuento3_pagina2.jpg', '\\recursos\\audio\\cuento3_audio2.mp3');
insert into paginas(id_cuento,numero,   historia, foto_ruta, audio_ruta) values(3, 3,'Estaba oscureciendo en el bosque y recordaron que mami Osa les reprendería si llegaban tarde a cenar. Pero de camino a casa se encontraron con primo Osón que dormía plácidamente sobre la hierba mientras agarraba con la zarpa un gran salmón recién pescado.Se acercaron en silencio para coger el rico alimento. Conteniendo la respiración llegaron junto a él... Pero en ese preciso instante despertó y con un potente rugido hizo que Osete y Osito se cayeran de espaldas por causa de la sorpresa.','\\recursos\\imagenes\\cuento3_pagina3.jpg', '\\recursos\\audio\\cuento3_audio3.mp3');
insert into paginas(id_cuento, numero,  historia, foto_ruta, audio_ruta) values(3, 4,'Llegaron a casa y después de hacer los deberes, bañarse y cenar se pusieron a jugar armando tanto alboroto que mami Osa decidió darles un escarmiento por tanta travesura.Osete y Osito, atados el uno al otro por sus colas hubieron de permanecer en un rincón, mientras los ratones y el primo Osón que se asomaban a través de la ventana celebraban con sus risas el castigo de los ositos revoltosos.','\\recursos\\imagenes\\cuento3_pagina4.jpg', '\\recursos\\audio\\cuento3_audio4.mp3');





-- ---------------------------------------------------


insert into preguntas(id_cuento, numero, nombre_pregunta, respuesta) values(1, 1,'¿Como se llamaba la hormiga?','Lucia');
insert into preguntas(id_cuento, numero, nombre_pregunta, respuesta) values(1, 2,'¿Cual era el trato?','Si protegen a la hormiga, llegando el invierno la hormiga les hacía de comer todo el día');

insert into opciones(id_pregunta, numero_opcion, texto_opcion) values (1, 1, 'Lucia');
insert into opciones(id_pregunta, numero_opcion, texto_opcion) values (1, 2, 'Maria');
insert into opciones(id_pregunta, numero_opcion, texto_opcion) values (1, 3, 'Pepita');


insert into opciones(id_pregunta, numero_opcion, texto_opcion) values (2, 1, 'Si protegen a la hormiga, llegando el invierno la hormiga les hacía de comer todo el día');
insert into opciones(id_pregunta, numero_opcion, texto_opcion) values (2, 2, 'Estudiar todo el dia');
insert into opciones(id_pregunta, numero_opcion, texto_opcion) values (2, 3, 'Viajar por el mundo con los grillos');

-- ---------------------------------------------------
insert into preguntas(id_cuento, numero, nombre_pregunta, respuesta) values(2, 1,'¿Los ratoncitos le pidieron permiso al papa y la mama?','No');
insert into preguntas(id_cuento, numero, nombre_pregunta, respuesta) values(2, 2,'¿Cual fue la promesa?','No alejarse sin mi permiso del hogar');

insert into opciones(id_pregunta, numero_opcion, texto_opcion) values (3, 1, 'Si');
insert into opciones(id_pregunta, numero_opcion, texto_opcion) values (3, 2, 'No');
insert into opciones(id_pregunta, numero_opcion, texto_opcion) values (3, 3, 'Talvez');


insert into opciones(id_pregunta, numero_opcion, texto_opcion) values (4, 1, 'No hacer caso');
insert into opciones(id_pregunta, numero_opcion, texto_opcion) values (4, 2, 'Jugar todo el dia');
insert into opciones(id_pregunta, numero_opcion, texto_opcion) values (4, 3, 'No alejarse sin mi permiso del hogar');
-- ---------------------------------------------------

insert into preguntas(id_cuento, numero, nombre_pregunta, respuesta) values(3,1,'¿Donde vivian los ositos?','En un lindo bosque');
insert into preguntas(id_cuento, numero, nombre_pregunta, respuesta) values(3,2,'¿Que hacen los ratoncitos por la ventana cuando llegaron los ositos a su casa?','Reirse porque los ositos estan castigados');


insert into opciones(id_pregunta, numero_opcion, texto_opcion) values (5, 1, 'En un lindo bosque');
insert into opciones(id_pregunta, numero_opcion, texto_opcion) values (5,2, 'En una linda playa');
insert into opciones(id_pregunta, numero_opcion, texto_opcion) values (5,3,'En la ciudad');

insert into opciones(id_pregunta, numero_opcion, texto_opcion) values (6, 1, 'Dormir en el bosque');
insert into opciones(id_pregunta, numero_opcion, texto_opcion) values (6, 2, 'Reirse porque los ositos estan castigados');
insert into opciones(id_pregunta, numero_opcion, texto_opcion) values (6, 3, 'Saltar por todo el bosque');

-- ---------------------------------------------------
insert into libreriaaudio(ruta_libreriaaudio, nombre_audio) values ('\\recursos\\audio\\cuento1_audio1.mp3', 'cuento1_audio1');
insert into libreriaaudio(ruta_libreriaaudio, nombre_audio) values ('\\recursos\\audio\\cuento1_audio2.mp3', 'cuento1_audio2');
insert into libreriaaudio(ruta_libreriaaudio, nombre_audio) values ('\\recursos\\audio\\cuento1_audio3.mp3', 'cuento1_audio3');
insert into libreriaaudio(ruta_libreriaaudio, nombre_audio) values ('\\recursos\\audio\\cuento1_audio4.mp3', 'cuento1_audio4');

insert into libreriaaudio(ruta_libreriaaudio, nombre_audio) values ('\\recursos\\audio\\cuento2_audio1.mp3', 'cuento2_audio1');
insert into libreriaaudio(ruta_libreriaaudio, nombre_audio) values ('\\recursos\\audio\\cuento2_audio2.mp3', 'cuento2_audio2');
insert into libreriaaudio(ruta_libreriaaudio, nombre_audio) values ('\\recursos\\audio\\cuento2_audio3.mp3', 'cuento2_audio3');
insert into libreriaaudio(ruta_libreriaaudio, nombre_audio) values ('\\recursos\\audio\\cuento2_audio4.mp3', 'cuento2_audio4');

insert into libreriaaudio(ruta_libreriaaudio, nombre_audio) values ('\\recursos\\audio\\cuento3_audio1.mp3', 'cuento3_audio1');
insert into libreriaaudio(ruta_libreriaaudio, nombre_audio) values ('\\recursos\\audio\\cuento3_audio2.mp3', 'cuento3_audio2');
insert into libreriaaudio(ruta_libreriaaudio, nombre_audio) values ('\\recursos\\audio\\cuento3_audio3.mp3', 'cuento3_audio3');
insert into libreriaaudio(ruta_libreriaaudio, nombre_audio) values ('\\recursos\\audio\\cuento3_audio4.mp3', 'cuento3_audio4');

-- ---------------------------------------------------

insert into libreriafoto(ruta_libreriafoto, nombre_foto) values ('\\recursos\\imagenes\\cuento1_pagina1.jpg', 'cuento1_pagina1');
insert into libreriafoto(ruta_libreriafoto, nombre_foto) values ('\\recursos\\imagenes\\cuento1_pagina2.jpg', 'cuento1_pagina2');
insert into libreriafoto(ruta_libreriafoto, nombre_foto) values ('\\recursos\\imagenes\\cuento1_pagina3.jpg', 'cuento1_pagina3');
insert into libreriafoto(ruta_libreriafoto, nombre_foto) values ('\\recursos\\imagenes\\cuento1_pagina4.jpg', 'cuento1_pagina4');

insert into libreriafoto(ruta_libreriafoto, nombre_foto) values ('\\recursos\\imagenes\\cuento2_pagina1.jpg', 'cuento2_pagina1');
insert into libreriafoto(ruta_libreriafoto, nombre_foto) values ('\\recursos\\imagenes\\cuento2_pagina2.jpg', 'cuento2_pagina2');
insert into libreriafoto(ruta_libreriafoto, nombre_foto) values ('\\recursos\\imagenes\\cuento2_pagina3.jpg', 'cuento2_pagina3');
insert into libreriafoto(ruta_libreriafoto, nombre_foto) values ('\\recursos\\imagenes\\cuento2_pagina4.jpg', 'cuento2_pagina4');

insert into libreriafoto(ruta_libreriafoto, nombre_foto) values ('\\recursos\\imagenes\\cuento3_pagina1.jpg', 'cuento3_pagina1');
insert into libreriafoto(ruta_libreriafoto, nombre_foto) values ('\\recursos\\imagenes\\cuento3_pagina2.jpg', 'cuento3_pagina2');
insert into libreriafoto(ruta_libreriafoto, nombre_foto) values ('\\recursos\\imagenes\\cuento3_pagina3.jpg', 'cuento3_pagina3');
insert into libreriafoto(ruta_libreriafoto, nombre_foto) values ('\\recursos\\imagenes\\cuento3_pagina4.jpg', 'cuento3_pagina4');

