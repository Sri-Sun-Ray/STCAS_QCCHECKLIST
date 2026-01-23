-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 19, 2025 at 09:25 AM
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
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `id` int(11) NOT NULL,
  `entity_type` varchar(100) NOT NULL,
  `s_no` varchar(50) NOT NULL,
  `station_id` varchar(50) DEFAULT NULL,
  `image_path` varchar(5000) NOT NULL,
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

-- --------------------------------------------------------

--
-- Indexes for dumped tables
--

ALTER TABLE `verification_of_equipment_serial_numbers`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `tower`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `rtu`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `rf_antennas`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `installation_of_kavach_equipment`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `networking_rack`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `ips`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `dc_convertor`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `pdu`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `smocip`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `gps_gsm_antenna`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `relay_rack`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `riu`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `laying_of_sectional_ofc_cable`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `outdoor_cabling`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `rfid_tags`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `tag_to_tag_distance`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `station`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `station_id` (`station_id`),
  ADD UNIQUE KEY `unique_station_combo` (`station_id`,`railway_zone`,`division`);

ALTER TABLE `images`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `loginpage`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `report`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `report_versions`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

ALTER TABLE `station`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

ALTER TABLE `images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=95;

ALTER TABLE `loginpage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

ALTER TABLE `report`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

ALTER TABLE `report_versions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

ALTER TABLE `verification_of_equipment_serial_numbers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `tower`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `rtu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `rf_antennas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `installation_of_kavach_equipment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `networking_rack`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `ips`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `dc_convertor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `pdu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `smocip`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `gps_gsm_antenna`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `relay_rack`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `riu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `laying_of_sectional_ofc_cable`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `outdoor_cabling`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `rfid_tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `tag_to_tag_distance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
