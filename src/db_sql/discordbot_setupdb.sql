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
  `is_reminded` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`assignment_id`),
  KEY `assignments_course_id_foreign` (`course_id`),
  CONSTRAINT `assignments_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=209482 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `course_id` bigint(20) NOT NULL,
  `channeldiscord_id` bigint(20) NOT NULL,
  `api_url` varchar(255) NOT NULL,
  UNIQUE KEY `courses_course_id_unique` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `announcements` (`canvas_id`, `title`, `description`, `posted_at`, `course_id`) VALUES
(268220, 'Eerste les', '```Beste studenten\nIedereen wordt verwacht tijdens de eerste les van Philosophy of Life, nu maandag van 13.30 u. tot 15.30 u. De methode wordt dan uitgelegd en er worden groepsopdrachten verdeeld. De tweede les van nu maandag (vanaf 15.45) valt weg.\nTot maandag!\nLudwig Van Gelder\n```', '0000-00-00 00:00:00', 0);
INSERT INTO `announcements` (`canvas_id`, `title`, `description`, `posted_at`, `course_id`) VALUES
(270401, 'Eerste les MM Ambassadeur', '```Beste studenten\nNu maandag 23 september is de introductie van dit vak. Er is maar 1 les voorzien dit semester. Zorg dat je erbij bent!\nDe Canvas cursus zal tegen dan meer opgevuld zijn.\nTot dan!Koen```', '0000-00-00 00:00:00', 0);


INSERT INTO `assignments` (`assignment_id`, `name`, `description`, `due_at`, `course_id`, `is_reminded`) VALUES
(162055, 'Opleidingen Campus Zuid OEFENTOETS om je voor te bereiden op een digitaal examen 2324 - wachtwoord: CAMPUS- Requires Respondus LockDown Browser', '```Deze toets is bedoeld om te testen of je de Respondus Lockdown browser goed hebt geïnstalleerd en om de eerste stappen van het examen te doorlopen.Op die manier ben je al vertrouwd met de digitale toetsomgeving en kan je examen vlot verlopen.\nEr is een paswoord voor deze toets: CAMPUS\nJe hebt meerdere pogingen voor deze toets.\nAlle info over examens: https://studentkdg.sharepoint.com/sites/intranet-nl/sitepages/examen-en-evaluatie.aspx\nTechnische problemen met de oefentoets: stuur een mailtje met duidelijke omschrijving van je probleem naar servicedesk.ict@KdG.be```', NULL, 24333, 0);
INSERT INTO `assignments` (`assignment_id`, `name`, `description`, `due_at`, `course_id`, `is_reminded`) VALUES
(189573, 'Opleidingen Campus Zuid OEFENTOETS om je voor te bereiden op een digitaal examen 2324 - wachtwoord: CAMPUS- Requires Respondus LockDown Browser', '```Deze toets is bedoeld om te testen of je de Respondus Lockdown browser goed hebt geïnstalleerd en om de eerste stappen van het examen te doorlopen.Op die manier ben je al vertrouwd met de digitale toetsomgeving en kan je examen vlot verlopen.\nEr is een paswoord voor deze toets: CAMPUS\nJe hebt meerdere pogingen voor deze toets.\nAlle info over examens: https://studentkdg.sharepoint.com/sites/intranet-nl/sitepages/examen-en-evaluatie.aspx\nTechnische problemen met de oefentoets: stuur een mailtje met duidelijke omschrijving van je probleem naar servicedesk.ict@KdG.be```', NULL, 24333, 0);
INSERT INTO `assignments` (`assignment_id`, `name`, `description`, `due_at`, `course_id`, `is_reminded`) VALUES
(202037, 'Insturen logboek / materiaal / ...', '```Upload een PDF versie van je portfolio en presentatie.\nZorg ervoor dat (indien van toepassing) in je portfolio een download link (wetransfer, google drive, dropbox, ...) met al je assets (bvb als je tutorial video\'s hebt gemaakt of foto\'s hebt of what not.)Vermeld ook in je portfolio de links naar externe toepassingen zoals trello enz.. (indien van toepassing)\nKortom: een volledige verzameling van heel je journey en alle media/files hier rond.```', NULL, 49715, 0);
INSERT INTO `assignments` (`assignment_id`, `name`, `description`, `due_at`, `course_id`, `is_reminded`) VALUES
(202038, 'Insturen logboek / materiaal / ... (2de zit)', '```Upload een PDF versie van je portfolio en presentatie.\nZorg ervoor dat (indien van toepassing) in je portfolio een download link (wetransfer, google drive, dropbox, ...) met al je assets (bvb als je tutorial video\'s hebt gemaakt of foto\'s hebt of what not.)Vermeld ook in je portfolio de links naar externe toepassingen zoals trello enz.. (indien van toepassing)\nKortom: een volledige verzameling van heel je journey en alle media/files hier rond.\nNa inzenden materiaal stuur ik op discord voor afspreken presentatie momentje.```', NULL, 49715, 0),
(206538, 'Publieksvragen bij het thema \"Technologie en ethiek\"', '```Ga naar het document \"Technologie en ethiek\" bij modules en beantwoord de vragen van \'luik 1: publieksvragen\'```', '2024-09-30', 49719, 0),
(206539, 'Publieksvragen bij het thema \"God of geen god?\"', '```Ga naar het document \"God of geen god?\" bij modulesen beantwoord de vragen van \'luik 1: publieksvragen\'```', '2024-10-14', 49719, 0),
(206540, 'Publieksvragen bij het thema \"Racisme en woke-denken\" ', '```Ga naar het document \"Racisme en woke-denken\" bij modulesen beantwoord de vragen van \'luik 1: publieksvragen\'```', '2024-10-14', 49719, 0),
(206541, 'Publieksvragen bij het thema \"Euthanasie\"', '```Ga naar het document \"Euthanasie en abortus\" bijmodulesen beantwoord de vragen van \'luik 1: publieksvragen\'```', '2024-09-30', 49719, 0),
(206544, 'Publieksvragen bij het thema \"Evolutie en creationisme\"', '```Ga naar het document \"Evolutie en creationisme\" bijmodulesen beantwoord de vragen van \'luik 1: publieksvragen\'```', '2024-11-18', 49719, 0),
(206545, 'Publieksvragen bij het thema \"De relatie tussen mens en kosmos\" ', '```Ga naar het document \"De relatie tussen mens en kosmos\" bijmodulesen beantwoord de vragen van \'luik 1: publieksvragen\'```', '2024-11-18', 49719, 0),
(207795, 'Publieksvragen bij het thema \"De zin van het leven en de ervaring van geluk\"', '```Ga naar het document \"De zin van het leven en de ervaring van geluk\" modulesen beantwoord de vragen van \'luik 1: publieksvragen\'```', '2024-12-02', 49719, 0),
(207796, 'Publieksvragen bij het thema \"Media en ethiek\"', '```Ga naar het document \"Media en ethiek\" bijmodulesen beantwoord de vragen van \'luik 1: publieksvragen\'```', '2024-12-02', 49719, 0),
(207797, 'Publieksvragen bij het thema \"Kapitalisme en ethiek: maatschappelijk verantwoord ondernemen\" ', '```Ga naar het document \"Kapitalisme en ethiek: maatschappelijk verantwoord ondernemen\" bij modulesen beantwoord de vragen van \'luik 1: publieksvragen\'```', '2024-12-16', 49719, 0),
(209481, 'Inlevering van je PowerPoint presentatie', '``````', '2025-01-10', 49719, 0);

INSERT INTO `courses` (`course_id`, `channeldiscord_id`, `api_url`) VALUES
(24333, 0, 'courses/24333');
INSERT INTO `courses` (`course_id`, `channeldiscord_id`, `api_url`) VALUES
(49715, 0, 'courses/49715');
INSERT INTO `courses` (`course_id`, `channeldiscord_id`, `api_url`) VALUES
(49719, 0, 'courses/49719');
INSERT INTO `courses` (`course_id`, `channeldiscord_id`, `api_url`) VALUES
(49722, 0, 'courses/49722'),
(49725, 0, 'courses/49725'),
(49726, 0, 'courses/49726'),
(49729, 0, 'courses/49729');


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;