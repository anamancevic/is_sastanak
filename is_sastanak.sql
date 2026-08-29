/*
SQLyog Community v13.3.0 (64 bit)
MySQL - 10.4.32-MariaDB : Database - is_sastanak
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`is_sastanak` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;

USE `is_sastanak`;

/*Table structure for table `kategorija_sastanka` */

DROP TABLE IF EXISTS `kategorija_sastanka`;

CREATE TABLE `kategorija_sastanka` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `naziv` varchar(80) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `naziv` (`naziv`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `kategorija_sastanka` */

insert  into `kategorija_sastanka`(`id`,`naziv`) values 
(6,'analize'),
(7,'kolegijumi'),
(5,'komisije'),
(4,'radni_timovi'),
(1,'referisanja'),
(2,'saveti'),
(3,'sluzbeni_razgovori');

/*Table structure for table `korisnik` */

DROP TABLE IF EXISTS `korisnik`;

CREATE TABLE `korisnik` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organizaciona_celina_id` int(11) NOT NULL,
  `ime` varchar(100) NOT NULL,
  `ime_oca` varchar(100) DEFAULT NULL,
  `prezime` varchar(100) NOT NULL,
  `jmbg` varchar(13) NOT NULL,
  `radno_mesto` varchar(150) DEFAULT NULL,
  `kontakt_telefon_posao` varchar(30) DEFAULT NULL,
  `mobilni_telefon` varchar(30) DEFAULT NULL,
  `mejl` varchar(150) DEFAULT NULL,
  `korisnicko_ime` varchar(50) NOT NULL,
  `lozinka_hash` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `jmbg` (`jmbg`),
  UNIQUE KEY `korisnicko_ime` (`korisnicko_ime`),
  KEY `organizaciona_celina_id` (`organizaciona_celina_id`),
  CONSTRAINT `korisnik_ibfk_1` FOREIGN KEY (`organizaciona_celina_id`) REFERENCES `organizaciona_celina` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `korisnik` */

insert  into `korisnik`(`id`,`organizaciona_celina_id`,`ime`,`ime_oca`,`prezime`,`jmbg`,`radno_mesto`,`kontakt_telefon_posao`,`mobilni_telefon`,`mejl`,`korisnicko_ime`,`lozinka_hash`) values 
(1,1,'Admin',NULL,'Administrator','0000000000000',NULL,NULL,NULL,NULL,'admin','$2a$10$3FZVklCtYQFr3AkZIhZ18ey8JSysw5iwB4nZpRHtlKwTXzqx5JH/G'),
(2,1,'Marko','Petar','Marković','1234567890123','Programer','011/123-456','060/1234567','marko@firma.rs','marko','$2a$10$VmmGO0qYWLcmchQiIliOmunbwnRy/1ErpENMPaGRubavO9jzDI7we'),
(4,1,'Ana','Srdjan','Mancevic','3101002715300','Programer','','0653323496','anamancevic@gmail.com','ana','$2a$10$mVOoEg9WUtO26bIXeajct.XpPeQXTwk2IJ3Yn2/.PDlNpCUYMoMvq');

/*Table structure for table `korisnik_uloga` */

DROP TABLE IF EXISTS `korisnik_uloga`;

CREATE TABLE `korisnik_uloga` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `korisnik_id` int(11) NOT NULL,
  `uloga_id` int(11) NOT NULL,
  `organizaciona_celina_id` int(11) NOT NULL,
  `tip` enum('STALNA','PRIVREMENA') NOT NULL,
  `napomena` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `korisnik_id` (`korisnik_id`,`uloga_id`,`organizaciona_celina_id`),
  KEY `uloga_id` (`uloga_id`),
  KEY `organizaciona_celina_id` (`organizaciona_celina_id`),
  CONSTRAINT `korisnik_uloga_ibfk_1` FOREIGN KEY (`korisnik_id`) REFERENCES `korisnik` (`id`),
  CONSTRAINT `korisnik_uloga_ibfk_2` FOREIGN KEY (`uloga_id`) REFERENCES `uloga` (`id`),
  CONSTRAINT `korisnik_uloga_ibfk_3` FOREIGN KEY (`organizaciona_celina_id`) REFERENCES `organizaciona_celina` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `korisnik_uloga` */

insert  into `korisnik_uloga`(`id`,`korisnik_id`,`uloga_id`,`organizaciona_celina_id`,`tip`,`napomena`) values 
(1,1,1,1,'STALNA','Glavni administrator sistema'),
(2,2,2,1,'STALNA','Rukovodilac sektora'),
(3,4,2,1,'STALNA','Rukovodilac u sektoru za razvoj');

/*Table structure for table `obavestenje` */

DROP TABLE IF EXISTS `obavestenje`;

CREATE TABLE `obavestenje` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `korisnik_id` int(11) NOT NULL,
  `izazvao_korisnik_id` int(11) DEFAULT NULL,
  `sadrzaj` varchar(500) NOT NULL,
  `datum_vreme` datetime NOT NULL,
  `procitano` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `korisnik_id` (`korisnik_id`),
  KEY `izazvao_korisnik_id` (`izazvao_korisnik_id`),
  CONSTRAINT `obavestenje_ibfk_1` FOREIGN KEY (`korisnik_id`) REFERENCES `korisnik` (`id`),
  CONSTRAINT `obavestenje_ibfk_2` FOREIGN KEY (`izazvao_korisnik_id`) REFERENCES `korisnik` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `obavestenje` */

insert  into `obavestenje`(`id`,`korisnik_id`,`izazvao_korisnik_id`,`sadrzaj`,`datum_vreme`,`procitano`) values 
(1,2,NULL,'Dodati ste kao ucesnik na sastanak: Kvartalni pregled razvoja','2026-08-24 14:35:17',1);

/*Table structure for table `organizaciona_celina` */

DROP TABLE IF EXISTS `organizaciona_celina`;

CREATE TABLE `organizaciona_celina` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `naziv` varchar(150) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `organizaciona_celina` */

insert  into `organizaciona_celina`(`id`,`naziv`) values 
(1,'Sektor za razvoj'),
(2,'Pravna služba'),
(3,'Finansijska sluzba');

/*Table structure for table `predlog` */

DROP TABLE IF EXISTS `predlog`;

CREATE TABLE `predlog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sastanak_id` int(11) NOT NULL,
  `tacka_id` int(11) NOT NULL,
  `korisnik_id` int(11) DEFAULT NULL,
  `spoljni_ucesnik_id` int(11) DEFAULT NULL,
  `tekst` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sastanak_id` (`sastanak_id`),
  KEY `tacka_id` (`tacka_id`),
  KEY `korisnik_id` (`korisnik_id`),
  KEY `spoljni_ucesnik_id` (`spoljni_ucesnik_id`),
  CONSTRAINT `predlog_ibfk_1` FOREIGN KEY (`sastanak_id`) REFERENCES `sastanak` (`id`) ON DELETE CASCADE,
  CONSTRAINT `predlog_ibfk_2` FOREIGN KEY (`tacka_id`) REFERENCES `tacka_dnevnog_reda` (`id`) ON DELETE CASCADE,
  CONSTRAINT `predlog_ibfk_3` FOREIGN KEY (`korisnik_id`) REFERENCES `korisnik` (`id`),
  CONSTRAINT `predlog_ibfk_4` FOREIGN KEY (`spoljni_ucesnik_id`) REFERENCES `spoljni_ucesnik` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `predlog` */

insert  into `predlog`(`id`,`sastanak_id`,`tacka_id`,`korisnik_id`,`spoljni_ucesnik_id`,`tekst`) values 
(1,1,1,2,NULL,'Predlazem da se budzet poveca za 10%'),
(2,1,2,2,NULL,'Pomeriti rok isporuke za dve nedelje'),
(3,1,2,2,NULL,'Uvesti nedeljne izveštaje o napretku');

/*Table structure for table `prisustvo` */

DROP TABLE IF EXISTS `prisustvo`;

CREATE TABLE `prisustvo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sastanak_id` int(11) NOT NULL,
  `korisnik_id` int(11) DEFAULT NULL,
  `spoljni_ucesnik_id` int(11) DEFAULT NULL,
  `status` enum('PRISUTAN','ODSUTAN') NOT NULL,
  `planiran` tinyint(1) NOT NULL DEFAULT 1,
  `zamena_za_korisnik_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sastanak_id` (`sastanak_id`),
  KEY `korisnik_id` (`korisnik_id`),
  KEY `spoljni_ucesnik_id` (`spoljni_ucesnik_id`),
  KEY `zamena_za_korisnik_id` (`zamena_za_korisnik_id`),
  CONSTRAINT `prisustvo_ibfk_1` FOREIGN KEY (`sastanak_id`) REFERENCES `sastanak` (`id`) ON DELETE CASCADE,
  CONSTRAINT `prisustvo_ibfk_2` FOREIGN KEY (`korisnik_id`) REFERENCES `korisnik` (`id`),
  CONSTRAINT `prisustvo_ibfk_3` FOREIGN KEY (`spoljni_ucesnik_id`) REFERENCES `spoljni_ucesnik` (`id`),
  CONSTRAINT `prisustvo_ibfk_4` FOREIGN KEY (`zamena_za_korisnik_id`) REFERENCES `korisnik` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `prisustvo` */

insert  into `prisustvo`(`id`,`sastanak_id`,`korisnik_id`,`spoljni_ucesnik_id`,`status`,`planiran`,`zamena_za_korisnik_id`) values 
(2,1,2,NULL,'PRISUTAN',1,NULL),
(3,2,4,NULL,'PRISUTAN',1,NULL);

/*Table structure for table `sastanak` */

DROP TABLE IF EXISTS `sastanak`;

CREATE TABLE `sastanak` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tema` varchar(200) NOT NULL,
  `datum_odrzavanja` datetime NOT NULL,
  `kategorija_id` int(11) NOT NULL,
  `rukovodilac_id` int(11) NOT NULL,
  `zapisnicar_id` int(11) DEFAULT NULL,
  `organizaciona_celina_id` int(11) NOT NULL,
  `prostorija` varchar(100) DEFAULT NULL,
  `tip` enum('STALNI','VANREDNI') NOT NULL,
  `status` enum('ZAKAZAN','ODRZAN','ODLOZEN','NEODRZAN') NOT NULL DEFAULT 'ZAKAZAN',
  `obrazlozenje` varchar(500) DEFAULT NULL,
  `zakljucak` text DEFAULT NULL,
  `akt_delovodni_broj` varchar(50) DEFAULT NULL,
  `akt_datum` date DEFAULT NULL,
  `akt_organizacija` varchar(150) DEFAULT NULL,
  `ucestalost` enum('DNEVNI','NEDELJNI','MESECNI','TROMESECNI','SESTOMESECNI','GODISNJI') DEFAULT NULL,
  `dan_odrzavanja` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `kategorija_id` (`kategorija_id`),
  KEY `rukovodilac_id` (`rukovodilac_id`),
  KEY `zapisnicar_id` (`zapisnicar_id`),
  KEY `organizaciona_celina_id` (`organizaciona_celina_id`),
  CONSTRAINT `sastanak_ibfk_1` FOREIGN KEY (`kategorija_id`) REFERENCES `kategorija_sastanka` (`id`),
  CONSTRAINT `sastanak_ibfk_2` FOREIGN KEY (`rukovodilac_id`) REFERENCES `korisnik` (`id`),
  CONSTRAINT `sastanak_ibfk_3` FOREIGN KEY (`zapisnicar_id`) REFERENCES `korisnik` (`id`),
  CONSTRAINT `sastanak_ibfk_4` FOREIGN KEY (`organizaciona_celina_id`) REFERENCES `organizaciona_celina` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `sastanak` */

insert  into `sastanak`(`id`,`tema`,`datum_odrzavanja`,`kategorija_id`,`rukovodilac_id`,`zapisnicar_id`,`organizaciona_celina_id`,`prostorija`,`tip`,`status`,`obrazlozenje`,`zakljucak`,`akt_delovodni_broj`,`akt_datum`,`akt_organizacija`,`ucestalost`,`dan_odrzavanja`) values 
(1,'Kvartalni pregled razvoja','2026-09-15 10:00:00',1,1,NULL,1,'Sala 1','VANREDNI','ODRZAN',NULL,'Sastanak je odrzan, dogovoreni su rokovi za sledeci kvartal.',NULL,NULL,NULL,NULL,NULL),
(2,'Kvartalni pregled razvoja softvera','2026-09-16 16:15:00',7,1,NULL,1,'Sala za sastanke 1','VANREDNI','ZAKAZAN',NULL,NULL,NULL,NULL,NULL,NULL,NULL);

/*Table structure for table `sastanak_ucesnik` */

DROP TABLE IF EXISTS `sastanak_ucesnik`;

CREATE TABLE `sastanak_ucesnik` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sastanak_id` int(11) NOT NULL,
  `korisnik_id` int(11) DEFAULT NULL,
  `spoljni_ucesnik_id` int(11) DEFAULT NULL,
  `planiran` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `sastanak_id` (`sastanak_id`),
  KEY `korisnik_id` (`korisnik_id`),
  KEY `spoljni_ucesnik_id` (`spoljni_ucesnik_id`),
  CONSTRAINT `sastanak_ucesnik_ibfk_1` FOREIGN KEY (`sastanak_id`) REFERENCES `sastanak` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sastanak_ucesnik_ibfk_2` FOREIGN KEY (`korisnik_id`) REFERENCES `korisnik` (`id`),
  CONSTRAINT `sastanak_ucesnik_ibfk_3` FOREIGN KEY (`spoljni_ucesnik_id`) REFERENCES `spoljni_ucesnik` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `sastanak_ucesnik` */

insert  into `sastanak_ucesnik`(`id`,`sastanak_id`,`korisnik_id`,`spoljni_ucesnik_id`,`planiran`) values 
(1,1,2,NULL,1),
(2,2,4,NULL,1),
(3,1,2,NULL,1);

/*Table structure for table `spoljni_ucesnik` */

DROP TABLE IF EXISTS `spoljni_ucesnik`;

CREATE TABLE `spoljni_ucesnik` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ime` varchar(100) NOT NULL,
  `prezime` varchar(100) NOT NULL,
  `radno_mesto` varchar(150) DEFAULT NULL,
  `organizacija` varchar(150) DEFAULT NULL,
  `zemlja` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `spoljni_ucesnik` */

/*Table structure for table `tacka_dnevnog_reda` */

DROP TABLE IF EXISTS `tacka_dnevnog_reda`;

CREATE TABLE `tacka_dnevnog_reda` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sastanak_id` int(11) NOT NULL,
  `redni_broj` int(11) NOT NULL,
  `sadrzaj` varchar(500) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sastanak_id` (`sastanak_id`,`redni_broj`),
  CONSTRAINT `tacka_dnevnog_reda_ibfk_1` FOREIGN KEY (`sastanak_id`) REFERENCES `sastanak` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `tacka_dnevnog_reda` */

insert  into `tacka_dnevnog_reda`(`id`,`sastanak_id`,`redni_broj`,`sadrzaj`) values 
(1,1,1,'Pregled napretka projekta'),
(2,1,2,'Planiranje sledećeg kvartala'),
(3,2,1,'Pregled realizacije zadataka u prethodnom kvartalu'),
(4,2,2,'Analiza tekućih problema u razvoju'),
(5,2,3,'Planiranje prioriteta za naredni kvartal'),
(6,2,4,'Raspodela zaduženja članovima tima');

/*Table structure for table `uloga` */

DROP TABLE IF EXISTS `uloga`;

CREATE TABLE `uloga` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `naziv` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `naziv` (`naziv`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `uloga` */

insert  into `uloga`(`id`,`naziv`) values 
(1,'administrator'),
(2,'rukovodilac'),
(4,'ucesnik'),
(3,'zapisnicar');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
