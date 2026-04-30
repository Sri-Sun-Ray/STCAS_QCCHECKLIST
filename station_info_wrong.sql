-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 30, 2026 at 08:04 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `station_info`
--

-- --------------------------------------------------------

--
-- Table structure for table `dc_convertor`
--

CREATE TABLE `dc_convertor` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gps_gsm_antenna`
--

CREATE TABLE `gps_gsm_antenna` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `id` int(11) NOT NULL,
  `entity_type` varchar(100) NOT NULL,
  `s_no` varchar(50) NOT NULL,
  `station_id` varchar(50) DEFAULT NULL,
  `image_path` varchar(5000) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `row_key` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `images`
--

INSERT INTO `images` (`id`, `entity_type`, `s_no`, `station_id`, `image_path`, `created_at`, `updated_at`, `row_key`) VALUES
(7, 'verification_of_equipment_serial_numbers', '1.50', '657554', 'uploads/img_69f09656706a80.23282809.png', '2026-04-28 11:14:19', '2026-04-30 06:02:45', 'next-gen-radio-2'),
(8, 'verification_of_equipment_serial_numbers', '1.51', '657554', 'uploads/img_69f0965f3480c6.25760526.png', '2026-04-28 11:14:19', '2026-04-30 06:02:45', 'rs-232-conv-rtu-1'),
(9, 'verification_of_equipment_serial_numbers', '1.53', '657554', 'uploads/img_69f096695a2778.96132756.png', '2026-04-28 11:14:19', '2026-04-28 11:14:19', NULL),
(10, 'verification_of_equipment_serial_numbers', '1.53', '657554', 'uploads/img_69f09671997ac7.31951044.png', '2026-04-28 11:14:19', '2026-04-30 06:02:45', 'riu'),
(11, 'verification_of_equipment_serial_numbers', '1.53', '657554', 'uploads/img_69f0967a770197.57887626.png', '2026-04-28 11:14:19', '2026-04-30 06:02:45', 'riu'),
(12, 'verification_of_equipment_serial_numbers', '1.53', '657554', 'uploads/img_69f096892aa282.55233746.png', '2026-04-28 11:14:19', '2026-04-30 06:02:45', 'riu'),
(13, 'verification_of_equipment_serial_numbers', '1.61', '657554', 'uploads/img_69f09576e5c6c9.08135077.png', '2026-04-28 11:14:19', '2026-04-28 11:14:19', NULL),
(14, 'verification_of_equipment_serial_numbers', '1.62', '657554', 'uploads/img_69f09580ad3dd7.88372226.png', '2026-04-28 11:14:19', '2026-04-28 11:14:19', NULL),
(15, 'verification_of_equipment_serial_numbers', '1.53', '657554', 'uploads/img_69f095a396b972.83981879.png', '2026-04-28 11:14:19', '2026-04-30 06:02:45', 'riu'),
(16, 'verification_of_equipment_serial_numbers', '1.53', '657554', 'uploads/img_69f095b03241f2.88343145.png', '2026-04-28 11:14:19', '2026-04-30 06:02:45', 'riu'),
(17, 'verification_of_equipment_serial_numbers', '1.69', '657554', 'uploads/img_69f095bb6e78d6.23823433.png', '2026-04-28 11:14:19', '2026-04-30 06:02:45', 'template_row_1'),
(18, 'verification_of_equipment_serial_numbers', '1.69', '657554', 'uploads/img_69f095cbd92621.97963557.png', '2026-04-28 11:14:19', '2026-04-30 06:02:45', 'template_row_1');

-- --------------------------------------------------------

--
-- Table structure for table `installation_of_kavach_equipment`
--

CREATE TABLE `installation_of_kavach_equipment` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ips`
--

CREATE TABLE `ips` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `laying_of_sectional_ofc_cable`
--

CREATE TABLE `laying_of_sectional_ofc_cable` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `loginpage`
--

CREATE TABLE `loginpage` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `employee_name` varchar(255) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `password` varchar(50) NOT NULL,
  `role` enum('admin','user') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `loginpage`
--

INSERT INTO `loginpage` (`id`, `username`, `employee_name`, `phone_number`, `password`, `role`) VALUES
(1, '52447', 'sushma', '8074138452', '52447', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `networking_rack`
--

CREATE TABLE `networking_rack` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `outdoor_cabling`
--

CREATE TABLE `outdoor_cabling` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pdu`
--

CREATE TABLE `pdu` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `relay_rack`
--

CREATE TABLE `relay_rack` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `report`
--

CREATE TABLE `report` (
  `id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `upload_date` timestamp NULL DEFAULT current_timestamp(),
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `report`
--

INSERT INTO `report` (`id`, `file_name`, `upload_date`, `user_id`) VALUES
(1, 'Seven_2026-04-28_Report_NotCompleted_Version-1.pdf', '2026-04-28 10:41:52', 52447),
(2, 'Vcfthh_2026-04-28_Report_NotCompleted_Version-1.pdf', '2026-04-28 11:15:36', 52447);

-- --------------------------------------------------------

--
-- Table structure for table `report_versions`
--

CREATE TABLE `report_versions` (
  `id` int(11) NOT NULL,
  `station_id` int(11) NOT NULL,
  `latest_version` int(11) DEFAULT 1,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `report_versions`
--

INSERT INTO `report_versions` (`id`, `station_id`, `latest_version`, `last_updated`) VALUES
(1, 77777, 1, '2026-04-28 10:41:52'),
(2, 657554, 1, '2026-04-28 11:15:36');

-- --------------------------------------------------------

--
-- Table structure for table `rfid_tags`
--

CREATE TABLE `rfid_tags` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rf_antennas`
--

CREATE TABLE `rf_antennas` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `riu`
--

CREATE TABLE `riu` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `row_templates`
--

CREATE TABLE `row_templates` (
  `id` int(11) NOT NULL,
  `section_id` varchar(50) NOT NULL,
  `s_no` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `row_templates`
--

INSERT INTO `row_templates` (`id`, `section_id`, `s_no`, `description`, `created_at`) VALUES
(1, '2_0', '1.69', 'riuuuu', '2026-04-28 11:07:17'),
(2, '2_0', '1.70', 'riuuuuuuuuu_2', '2026-04-28 11:07:41');

-- --------------------------------------------------------

--
-- Table structure for table `rtu`
--

CREATE TABLE `rtu` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `smocip`
--

CREATE TABLE `smocip` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `station`
--

CREATE TABLE `station` (
  `station_id` int(11) NOT NULL,
  `station_name` varchar(255) NOT NULL,
  `railway_zone` varchar(255) NOT NULL,
  `division` varchar(255) NOT NULL,
  `section_name` varchar(255) NOT NULL,
  `initial_date` varchar(255) NOT NULL,
  `updated_date` date NOT NULL,
  `id` int(11) NOT NULL,
  `start_time` datetime DEFAULT NULL,
  `completed_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `station`
--

INSERT INTO `station` (`station_id`, `station_name`, `railway_zone`, `division`, `section_name`, `initial_date`, `updated_date`, `id`, `start_time`, `completed_time`) VALUES
(576355, 'Snuff', 'CR', 'Mumbai', 'Mumbai', '2026-04-16', '2026-04-16', 1, '2026-04-16 16:27:42', '2026-04-16 16:27:42'),
(53546474, 'Station', 'WCR', 'Bhopal', 'Bhopal', '2026-04-27', '2026-04-27', 2, '2026-04-27 17:50:57', '2026-04-27 17:50:57'),
(77777, 'Seven', 'WR', 'Bajva - Ahmedabad', 'Bajva - Ahmedabad', '2026-04-28', '2026-04-28', 3, '2026-04-28 15:42:58', '2026-04-28 16:11:51'),
(657554, 'Vcfthh', 'CR', 'Pune', 'Pune', '2026-04-28', '2026-04-28', 4, '2026-04-28 16:36:07', '2026-04-28 16:45:35');

-- --------------------------------------------------------

--
-- Table structure for table `tag_to_tag_distance`
--

CREATE TABLE `tag_to_tag_distance` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tower`
--

CREATE TABLE `tower` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `verification_of_equipment_serial_numbers`
--

CREATE TABLE `verification_of_equipment_serial_numbers` (
  `id` int(11) NOT NULL,
  `station_id` int(11) DEFAULT NULL,
  `S_no` varchar(255) NOT NULL,
  `barcode_kavach_main_unit` varchar(255) DEFAULT NULL,
  `observation_text` text NOT NULL,
  `requirement_text` text DEFAULT NULL,
  `remarks` text NOT NULL,
  `image_path` varchar(1000) DEFAULT NULL,
  `observation_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `row_key` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `verification_of_equipment_serial_numbers`
--

INSERT INTO `verification_of_equipment_serial_numbers` (`id`, `station_id`, `S_no`, `barcode_kavach_main_unit`, `observation_text`, `requirement_text`, `remarks`, `image_path`, `observation_status`, `created_at`, `updated_at`, `row_key`) VALUES
(1, 657554, '1.1', '', 'Stationary Kavach Unit', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'stationary-kavach-unit'),
(2, 657554, '1.2', '', 'Peripheral Processing Card 1', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'ppc_1'),
(3, 657554, '1.3', '', 'Peripheral Processing Card 2', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'ppc_2'),
(4, 657554, '1.4', '', 'Vital Computer Card -1', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'vcc_1'),
(5, 657554, '1.5', '', 'Vital Computer Card -2', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'vcc-2'),
(6, 657554, '1.6', '', 'Vital Computer Card -3', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'vcc-3'),
(7, 657554, '1.7', '', 'Voter Card -1', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'vc-1'),
(8, 657554, '1.8', '', 'Voter Card -2', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'vc-2'),
(9, 657554, '1.9', '', 'Vital Gateway Card 1 (S2S)', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'vgc-1'),
(10, 657554, '1.10', '', 'Vital Gateway Card 2 (S2S)', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'vgc-2'),
(11, 657554, '1.11', '', 'Vital Gateway Card 3 (NMS)', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'vgc-3'),
(12, 657554, '1.12', '', 'EI Gateway-1', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'eig-1'),
(13, 657554, '1.13', '', 'EI Gateway-2', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'eig-2'),
(14, 657554, '1.14', '', 'Field Scanner Card 1', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-28 11:14:19', NULL),
(15, 657554, '1.15', '', 'Field Scanner Card 2', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-28 11:14:19', NULL),
(16, 657554, '1.16', '', 'Field Scanner Card 3', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-28 11:14:19', NULL),
(17, 657554, '1.17', '', 'Field Scanner Card 4', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-28 11:14:19', NULL),
(18, 657554, '1.18', '', 'Field Scanner Card 5', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-28 11:14:19', NULL),
(19, 657554, '1.19', '', 'Field Scanner Card 6', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-28 11:14:19', NULL),
(20, 657554, '1.20', '', 'Field Scanner Card 777777', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-28 11:14:19', NULL),
(21, 657554, '1.21', '', 'Field Scanner Card 8', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-28 11:14:19', NULL),
(22, 657554, '1.22', '', 'RIU communication card 1-Host', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'riu-comm-1'),
(23, 657554, '1.23', '', 'RIU communication card 2-Host', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'riu-comm-2'),
(24, 657554, '1.24', '', 'RS 232-OFC converter 1 (STATION)', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'rs-232-conv-1'),
(25, 657554, '1.25', '', 'RS 232-OFC converter 2 (STATION)', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'rs-232-conv-2'),
(26, 657554, '1.26', '', 'RS 485-OFC converter (STATION)', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'rs-485-conv'),
(27, 657554, '1.27', '', 'FIU Termination Card 1', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'fiu-term-1'),
(28, 657554, '1.28', '', 'FIU Termination Card 2', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'fiu-term-2'),
(29, 657554, '1.29', '', 'FIU Termination Card 3', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'fiu-term-3'),
(30, 657554, '1.30', '', 'FIU Termination Card 4', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'fiu-term-4'),
(31, 657554, '1.31', '', 'FIU Termination Card 5', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'fiu-term-5'),
(32, 657554, '1.32', '', 'FIU Termination Card 6', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'fiu-term-6'),
(33, 657554, '1.33', '', 'FIU Termination Card 7', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'fiu-term-7'),
(34, 657554, '1.34', '', 'FIU Termination Card 8', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'fiu-term-8'),
(35, 657554, '1.35', '', 'DPS Card 1', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'dps-1'),
(36, 657554, '1.36', '', 'DPS Card 2', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'dps-2'),
(37, 657554, '1.37', '', 'GPS &amp; GSM Antenna-1', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'gps-gsm-1'),
(38, 657554, '1.38', '', 'GPS &amp; GSM Antenna-2', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'gps-gsm-2'),
(39, 657554, '1.39', '', 'SMOCIP Unit', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'smocip'),
(40, 657554, '1.40', '', 'SMOCIP Termination Panel', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'smocip-term'),
(41, 657554, '1.41', '', 'Station Termination Panel', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'station-term-panel'),
(42, 657554, '1.42', '', 'Stationary PDU Box', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'station-pdu-box'),
(43, 657554, '1.43', '', 'IPS PDU Box', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'ips-pdu'),
(44, 657554, '1.44', '', 'DC-DC Converter (Relay racks)', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'dc-dc-conv'),
(45, 657554, '1.45', '', 'RTU-1', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'rtu-1'),
(46, 657554, '1.46', '', 'RTU-2', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'rtu-2'),
(47, 657554, '1.47', '', 'Station Radio Power Supply card-1', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'station-radio-1'),
(48, 657554, '1.48', '', 'Station Radio Power Supply card-2', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'station-radio-2'),
(49, 657554, '1.49', '', 'Next Gen/. Cal Amp Radio Modem-1', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'next-gen-radio-1'),
(50, 657554, '1.50', '86858756887', 'Next Gen/. Cal Amp Radio Modem-2 86858756887', '', '', NULL, 'Matching', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'next-gen-radio-2'),
(51, 657554, '1.51', '76865964#34698', 'RS 232-OFC converter 1 (RTU-1) 76865964#34698', '', '', NULL, 'Not Applicable', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'rs-232-conv-rtu-1'),
(52, 657554, '1.52', '76786579778', 'RS 232-OFC converter 2 (RTU-2) 76786579778', '', '', NULL, 'Not Matching', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'rs-232-conv-rtu-2'),
(53, 657554, '1.53', '87897589878', 'RS 485-OFC converter (SM-OCIP) 87897589878', '', '', NULL, 'Matching', '2026-04-28 11:13:17', '2026-04-28 11:14:19', NULL),
(54, 657554, '1.53', '98776546887', 'RIU 98776546887', '', '', NULL, 'Not Matching', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'riu'),
(55, 657554, '1.53', '977557445677', 'RIU Power Supply Card-1 977557445677', '', '', NULL, 'Matching', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'riu'),
(56, 657554, '1.53', '65774688', 'RIU Power Supply Card-2 65774688', '', '', NULL, 'Not Matching', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'riu'),
(57, 657554, '1.53', '64587788766', 'RIU communication card 1-Remote 64587788766', '', '', NULL, 'Matching', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'riu'),
(58, 657554, '1.53', '', 'RIU communication card 2-Remote', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'riu'),
(59, 657554, '1.59', '', 'Field Scanner Card 1', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-28 11:14:19', NULL),
(60, 657554, '1.60', '', 'Field Scanner Card 2', '', '', NULL, 'Select', '2026-04-28 11:13:17', '2026-04-28 11:14:19', NULL),
(61, 657554, '1.61', '54674785567', 'Field Scanner Card 3 54674785567', '', '', NULL, 'Not Matching', '2026-04-28 11:13:17', '2026-04-28 11:14:19', NULL),
(62, 657554, '1.62', '7576478754', 'Field Scanner Card 4 7576478754', '', '', NULL, 'Matching', '2026-04-28 11:13:17', '2026-04-28 11:14:19', NULL),
(63, 657554, '1.53', '8567457888', 'RIU Battery Charge Cum Filter-1 8567457888', '', '', NULL, 'Not Matching', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'riu'),
(64, 657554, '1.53', '858964467', 'RIU Battery Charge Cum Filter-2 858964467', '', '', NULL, 'Matching', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'riu'),
(65, 657554, '1.69', '758558858756', 'riuuuu<br> 758558858756', '', '', NULL, 'Not Matching', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'template_row_1'),
(66, 657554, '1.69', '68766778666', 'riuuuuuuuuu_2<br> 68766778666', '', '', NULL, 'Matching', '2026-04-28 11:13:17', '2026-04-30 06:02:45', 'template_row_1'),
(67, 657554, '1.14', NULL, '', NULL, '', NULL, NULL, '2026-04-30 06:02:45', '2026-04-30 06:02:45', 'fiu-1'),
(68, 657554, '1.15', NULL, '', NULL, '', NULL, NULL, '2026-04-30 06:02:45', '2026-04-30 06:02:45', 'fiu-2'),
(69, 657554, '1.16', NULL, '', NULL, '', NULL, NULL, '2026-04-30 06:02:45', '2026-04-30 06:02:45', 'fiu-3'),
(70, 657554, '1.17', NULL, '', NULL, '', NULL, NULL, '2026-04-30 06:02:45', '2026-04-30 06:02:45', 'fiu-4'),
(71, 657554, '1.18', NULL, '', NULL, '', NULL, NULL, '2026-04-30 06:02:45', '2026-04-30 06:02:45', 'fiu-5'),
(72, 657554, '1.19', NULL, '', NULL, '', NULL, NULL, '2026-04-30 06:02:45', '2026-04-30 06:02:45', 'fiu-6'),
(73, 657554, '1.20', NULL, '', NULL, '', NULL, NULL, '2026-04-30 06:02:45', '2026-04-30 06:02:45', 'fiu-7'),
(74, 657554, '1.21', NULL, '', NULL, '', NULL, NULL, '2026-04-30 06:02:45', '2026-04-30 06:02:45', 'fiu-8'),
(75, 657554, '1.54', NULL, '', NULL, '', NULL, NULL, '2026-04-30 06:02:45', '2026-04-30 06:02:45', 'riu-power-1'),
(76, 657554, '1.55', NULL, '', NULL, '', NULL, NULL, '2026-04-30 06:02:45', '2026-04-30 06:02:45', 'riu-power-2'),
(77, 657554, '1.56', NULL, '', NULL, '', NULL, NULL, '2026-04-30 06:02:45', '2026-04-30 06:02:45', 'riu-comm-remote-1'),
(78, 657554, '1.57', NULL, '', NULL, '', NULL, NULL, '2026-04-30 06:02:45', '2026-04-30 06:02:45', 'riu-comm-remote-2'),
(79, 657554, '1.58', NULL, '', NULL, '', NULL, NULL, '2026-04-30 06:02:45', '2026-04-30 06:02:45', 'fiu-scan-1'),
(80, 657554, '1.59', NULL, '', NULL, '', NULL, NULL, '2026-04-30 06:02:45', '2026-04-30 06:02:45', 'fiu-scan-2'),
(81, 657554, '1.60', NULL, '', NULL, '', NULL, NULL, '2026-04-30 06:02:45', '2026-04-30 06:02:45', 'fiu-scan-3'),
(82, 657554, '1.61', NULL, '', NULL, '', NULL, NULL, '2026-04-30 06:02:45', '2026-04-30 06:02:45', 'fiu-scan-4'),
(83, 657554, '1.62', NULL, '', NULL, '', NULL, NULL, '2026-04-30 06:02:45', '2026-04-30 06:02:45', 'riu-battery-1'),
(84, 657554, '1.63', NULL, '', NULL, '', NULL, NULL, '2026-04-30 06:02:45', '2026-04-30 06:02:45', 'riu-battery-2'),
(85, 657554, '1.64', NULL, '', NULL, '', NULL, NULL, '2026-04-30 06:02:45', '2026-04-30 06:02:45', 'riu-emi-1'),
(86, 657554, '1.65', NULL, '', NULL, '', NULL, NULL, '2026-04-30 06:02:45', '2026-04-30 06:02:45', 'riu-emi-2'),
(87, 657554, '1.66', NULL, '', NULL, '', NULL, NULL, '2026-04-30 06:02:45', '2026-04-30 06:02:45', 'tcas-emi-1'),
(88, 657554, '1.67', NULL, '', NULL, '', NULL, NULL, '2026-04-30 06:02:45', '2026-04-30 06:02:45', 'tcas-emi-2'),
(89, 657554, '1.68', NULL, '', NULL, '', NULL, NULL, '2026-04-30 06:02:45', '2026-04-30 06:02:45', 'tcas-cable-extender');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dc_convertor`
--
ALTER TABLE `dc_convertor`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gps_gsm_antenna`
--
ALTER TABLE `gps_gsm_antenna`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `installation_of_kavach_equipment`
--
ALTER TABLE `installation_of_kavach_equipment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ips`
--
ALTER TABLE `ips`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `laying_of_sectional_ofc_cable`
--
ALTER TABLE `laying_of_sectional_ofc_cable`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `loginpage`
--
ALTER TABLE `loginpage`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `networking_rack`
--
ALTER TABLE `networking_rack`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `outdoor_cabling`
--
ALTER TABLE `outdoor_cabling`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pdu`
--
ALTER TABLE `pdu`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `relay_rack`
--
ALTER TABLE `relay_rack`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `report_versions`
--
ALTER TABLE `report_versions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rfid_tags`
--
ALTER TABLE `rfid_tags`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rf_antennas`
--
ALTER TABLE `rf_antennas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `riu`
--
ALTER TABLE `riu`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `row_templates`
--
ALTER TABLE `row_templates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rtu`
--
ALTER TABLE `rtu`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `smocip`
--
ALTER TABLE `smocip`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `station`
--
ALTER TABLE `station`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `station_id` (`station_id`),
  ADD UNIQUE KEY `unique_station_combo` (`station_id`,`railway_zone`,`division`);

--
-- Indexes for table `tag_to_tag_distance`
--
ALTER TABLE `tag_to_tag_distance`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tower`
--
ALTER TABLE `tower`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `verification_of_equipment_serial_numbers`
--
ALTER TABLE `verification_of_equipment_serial_numbers`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dc_convertor`
--
ALTER TABLE `dc_convertor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gps_gsm_antenna`
--
ALTER TABLE `gps_gsm_antenna`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `installation_of_kavach_equipment`
--
ALTER TABLE `installation_of_kavach_equipment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ips`
--
ALTER TABLE `ips`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `laying_of_sectional_ofc_cable`
--
ALTER TABLE `laying_of_sectional_ofc_cable`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `loginpage`
--
ALTER TABLE `loginpage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `networking_rack`
--
ALTER TABLE `networking_rack`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `outdoor_cabling`
--
ALTER TABLE `outdoor_cabling`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pdu`
--
ALTER TABLE `pdu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `relay_rack`
--
ALTER TABLE `relay_rack`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `report`
--
ALTER TABLE `report`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `report_versions`
--
ALTER TABLE `report_versions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `rfid_tags`
--
ALTER TABLE `rfid_tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rf_antennas`
--
ALTER TABLE `rf_antennas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `riu`
--
ALTER TABLE `riu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `row_templates`
--
ALTER TABLE `row_templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `rtu`
--
ALTER TABLE `rtu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `smocip`
--
ALTER TABLE `smocip`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `station`
--
ALTER TABLE `station`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tag_to_tag_distance`
--
ALTER TABLE `tag_to_tag_distance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tower`
--
ALTER TABLE `tower`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `verification_of_equipment_serial_numbers`
--
ALTER TABLE `verification_of_equipment_serial_numbers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
