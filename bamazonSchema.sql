# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.18)
# Database: bamazon
# Generation Time: 2017-08-28 22:16:41 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP DATABASE IF EXISTS `Bamazon`;
CREATE DATABASE Bamazon;
USE `Bamazon`;

# Dump of table departments
# ------------------------------------------------------------

DROP TABLE IF EXISTS `departments`;

CREATE TABLE `departments` (
  `department_id` float NOT NULL AUTO_INCREMENT,
  `department_name` varchar(30) DEFAULT NULL,
  `overhead_costs` float unsigned DEFAULT NULL,
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;

INSERT INTO `departments` (`department_id`, `department_name`, `overhead_costs`)
VALUES
	(1,'electronics',10000),
	(2,'sports/outdoors',2000),
	(3,'essentials',3000),
	(4,'car/auto',5000),
	(5,'books/education',500),
	(6,'food',1000),
	(7,'clothing',5000);

/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table products
# ------------------------------------------------------------

DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `item_id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `product_name` varchar(60) NOT NULL,
  `department_name` varchar(30) DEFAULT NULL,
  `price` float DEFAULT NULL,
  `stock_quantity` smallint(5) unsigned DEFAULT NULL,
  `product_sales` float unsigned DEFAULT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;

INSERT INTO `products` (`item_id`, `product_name`, `department_name`, `price`, `stock_quantity`, `product_sales`)
VALUES
	(1,'portable battery','electronics',19.99,200,399.8),
	(2,'water bottle','sports/outdoors',9.99,199,399.6),
	(3,'sunglasses','sports/outdoors',15.27,500,1527),
	(4,'bluetooth headphones','electronics',84.99,80,8499),
	(5,'shaving cream','essentials',5.99,5000,1797),
	(6,'USB-C 6 ft charging wire','electronics',13.99,1000,419.7),
	(7,'car port USB charger','electronics',9.99,1000,999),
	(8,'windshield wipers 21 in','car/auto',19.99,100,0),
	(9,'tableau book','books/education',24.99,4,249.9),
	(10,'foam earplugs','essentials',4,2000,200),
	(11,'blanket','essentials',19.99,500,59.97),
	(13,'cheerios','food',2.99,5,59.8),
	(14,'fruit loops','food',2.99,96,29.9),
	(16,'bananas','food',0.99,5000,9900);

/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
