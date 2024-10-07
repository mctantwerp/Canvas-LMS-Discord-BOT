/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP TABLE IF EXISTS `announcements`;
CREATE TABLE `announcements` (
  `canvas_id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `posted_at` timestamp NOT NULL,
  `course_id` bigint(20) NOT NULL,
  UNIQUE KEY `announcements_canvas_id_unique` (`canvas_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `assignments`;
CREATE TABLE `assignments` (
  `assignment_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `description` text,
  `due_at` date DEFAULT NULL,
  `course_id` bigint(20) NOT NULL,
  `is_reminded_3days` tinyint(1) NOT NULL DEFAULT '0',
  `is_reminded_1days` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`assignment_id`),
  KEY `assignments_course_id_foreign` (`course_id`),
  CONSTRAINT `assignments_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=213561 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `course_id` bigint(20) NOT NULL,
  `channeldiscord_id` varchar(255) NOT NULL,
  `api_url` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  UNIQUE KEY `courses_course_id_unique` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;