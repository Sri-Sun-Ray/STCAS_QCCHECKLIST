-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 22, 2026 at 08:18 AM
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

--
-- Dumping data for table `dc_convertor`
--

INSERT INTO `dc_convertor` (`id`, `station_id`, `S_no`, `observation_text`, `requirement_text`, `remarks`, `image_path`, `observation_status`, `created_at`, `updated_at`) VALUES
(1, 676576, '8.1', 'Installation', '1.Relay rack shall be installed as per approved Floor Plan drawing.\n2)Relay rack shall be mounted on insulators and secured to the floor by grouting.', '', NULL, 'Yes', '2026-01-22 04:49:08', '2026-01-22 04:49:10'),
(2, 676576, '8.2', 'Wiring', '1)Labeling sleeve shall be used to identify wiring with rack number, row number, relay number & 1.contact type.\n2.Labelling shall be provided to relay contact wires at FTC PCBA of Station Kavach.\n3.Inputs shall be connected from the top and outputs from the bottom.\n4.Direction of wiring shall be maintained consistently from top to bottom.\n5.Black wires shall be used for negative supply.\n6.For EI Stations, verify all connections as per the approved EI Interface Diagrams.\n7.WAGO terminal details shall be as per interface circuit diagram.\n(Ref. Drawing : 521490685)', '', NULL, 'Select', '2026-01-22 04:49:08', '2026-01-22 04:49:10'),
(3, 676576, '8.3', 'Continuity Test / Bell Test', 'Completed Station Analyser and Bell Test reports shall be available.', '', NULL, 'Select', '2026-01-22 04:49:08', '2026-01-22 04:49:10'),
(4, 676576, '8.4', 'Earthing', 'Relay rack shall be connected to ring earth using a 10 sq.mm green/yellow earthing wire with torque marking', '', NULL, 'Select', '2026-01-22 04:49:08', '2026-01-22 04:49:10'),
(5, 34545454, '8.1', 'Installation', '1.Relay rack shall be installed as per approved Floor Plan drawing.\n2)Relay rack shall be mounted on insulators and secured to the floor by grouting.', '', NULL, 'Yes', '2026-01-22 06:57:47', '2026-01-22 06:57:51'),
(6, 34545454, '8.2', 'Wiring', '1)Labeling sleeve shall be used to identify wiring with rack number, row number, relay number &amp; 1.contact type.\n2.Labelling shall be provided to relay contact wires at FTC PCBA of Station Kavach.\n3.Inputs shall be connected from the top and outputs from the bottom.\n4.Direction of wiring shall be maintained consistently from top to bottom.\n5.Black wires shall be used for negative supply.\n6.For EI Stations, verify all connections as per the approved EI Interface Diagrams.\n7.WAGO terminal details shall be as per interface circuit diagram. (Ref. Drawing : 521490685)', '', NULL, 'Yes', '2026-01-22 06:57:47', '2026-01-22 06:57:51'),
(7, 34545454, '8.3', 'Continuity Test / Bell Test', 'Completed Station Analyser and Bell Test reports shall be available.', '', NULL, 'Yes', '2026-01-22 06:57:47', '2026-01-22 06:57:51'),
(8, 34545454, '8.4', 'Earthing', 'Relay rack shall be connected to ring earth using a 10 sq.mm green/yellow earthing wire with torque marking', '', NULL, 'Yes', '2026-01-22 06:57:47', '2026-01-22 06:57:51');

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

--
-- Dumping data for table `gps_gsm_antenna`
--

INSERT INTO `gps_gsm_antenna` (`id`, `station_id`, `S_no`, `observation_text`, `requirement_text`, `remarks`, `image_path`, `observation_status`, `created_at`, `updated_at`) VALUES
(1, 56545, '11.1', 'Cable route plan for OFC &amp;amp; Power cable (Relay Room to Tower)', 'Railway-approved outdoor signalling cable route plan shall be available, if applicable.', '', NULL, 'Yes', '2026-01-22 06:08:46', '2026-01-22 06:09:13'),
(2, 56545, '11.2', 'Cable route markers', 'Route markers shall be installed and clearly visible.', '', NULL, 'Yes', '2026-01-22 06:08:46', '2026-01-22 06:09:13'),
(3, 56545, '11.3', 'Cable route markers', 'Where contractually required, underground RFID markers shall be installed and verified.', 'yyg', NULL, 'Yes', '2026-01-22 06:08:46', '2026-01-22 06:09:13'),
(4, 57767, '11.1', 'Cable route plan for OFC &amp;amp; Power cable (Relay Room to Tower)', 'Railway-approved outdoor signalling cable route plan shall be available, if applicable.', '', NULL, 'Yes', '2026-01-22 06:29:38', '2026-01-22 06:29:38'),
(5, 57767, '11.2', 'Cable route markers', 'Route markers shall be installed and clearly visible.', '', NULL, 'Yes', '2026-01-22 06:29:38', '2026-01-22 06:29:38'),
(6, 57767, '11.3', 'Cable route markers', 'Where contractually required, underground RFID markers shall be installed and verified.', '', NULL, 'Yes', '2026-01-22 06:29:38', '2026-01-22 06:29:38'),
(7, 34545454, '11.1', 'Cable route plan for OFC &amp;amp; Power cable (Relay Room to Tower)', 'Railway-approved outdoor signalling cable route plan shall be available, if applicable.', '', NULL, 'Yes', '2026-01-22 06:58:20', '2026-01-22 07:01:11'),
(8, 34545454, '11.2', 'Cable route markers', 'Route markers shall be installed and clearly visible.', '', NULL, 'Yes', '2026-01-22 06:58:20', '2026-01-22 07:01:11'),
(9, 34545454, '11.3', 'Cable route markers', 'Where contractually required, underground RFID markers shall be installed and verified.', '', NULL, 'Yes', '2026-01-22 06:58:20', '2026-01-22 07:01:11');

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

--
-- Dumping data for table `images`
--

INSERT INTO `images` (`id`, `entity_type`, `s_no`, `station_id`, `image_path`, `created_at`, `updated_at`) VALUES
(95, 'verification_of_equipment_serial_numbers', '1.1', '43554', 'uploads/img_697068ad613f29.59061045.jpg', '2026-01-21 05:48:30', '2026-01-21 05:48:30'),
(99, 'verification_of_equipment_serial_numbers', '1.4', '536565', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/4QAuRXhpZgAATU0AKgAAAAgAAkAAAAMAAAABAFEAAEABAAEAAAABAAAAAAAAAAD/2wBDAAoHBwkHBgoJCAkLCwoMDxkQDw4ODx4WFxIZJCAmJSMgIyIoLTkwKCo2KyIjMkQyNjs9QEBAJjBGS0U+Sjk/QD3/2wBDAQsLCw8NDx0QEB09KSMpPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT3/wAARCACWAVADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2WiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKq32pWWmQedf3lvaxZ2755VRc+mScZpLHUrLVITNp95b3UQO0vBKrgH0yDjNAFuiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigApCQASegpaKAPPo7z7La6Tr1xe6dbXusAyPe6im9baJkMiQp86BQBhTgjcQWIyasTTSXGk6h4hRbf+0NKLNFf2sRjS/gVVkZQCSSjAlM5YBhuXkAC1DG2hzadZ3qXC2unsy2k8MDypJEVKqjlRmNlBAJYYbAIOSQsccDX9vfaHpy3D6ZcuQ8kts8UdrAww8cZbHmFju27RtQP1wqqwB2SkOAw6EcUtAGOKKACiiigAooooAKKKKACiiigBD0rwaL4heKTErf2w+SAT/o8P/xFe818xw/6mP8A3R/KhnVhoxd7q503/CwfFH/QYk/8B4f/AIij/hYPij/oMSf+A8P/AMRXOUUrnXyR7L7jo/8AhYPij/oMSf8AgPD/APEVs+EPGWv6n4rsLS91NpreVn3oYYlBAViOQoPUDvXB10PgH/keNM/33/8AQGoInTjyvRbHq/jfULrSvCN7e2MxguIzHtkADYzIqnggjoT2ryn/AIWB4n/6DD/+A8X/AMRXp/xI/wCRE1H6xf8Ao1K8OoZjhoRcW2up0f8AwsHxR/0GJP8AwHh/+Io/4WD4o/6DEn/gPD/8RXOUUXOnkj2X3HR/8LB8Uf8AQYf/AMB4v/iK7b4a+IdW12bUl1S8a5EIiKZjRdu7dn7qjPQda8mr0j4O/wDHzq/+5D/N6aMa8IqDaSOv8c6hdaV4RvLzT5jBcRtEFcANjMiqeCCOhPavKv8AhYHij/oMP/4Dxf8AxFenfEz/AJELUP8Aeh/9HJXh9JkYeEXC7XU6P/hYPij/AKDEn/gPD/8AEUf8LB8Uf9BiT/wHh/8AiK5yii508keyOj/4WD4o/wCgxJ/4Dw//ABFH/CwfFH/QYk/8B4f/AIiucoouHJHsjo/+Fg+KP+gxJ/4Dw/8AxFSRfEXxPE4ZtTEoH8LwRYP5KD+tcxRQL2ceyO5g+LetJIPtFrYyxjqqq6Mf+BbiB+VdVoHxM0vVZVgvUawuWPy+YwaNuuAH4wfqAMnAJrxyii5EqEGtrH01RXnnwv8AEst9BLpF25aS2QPAxJJMecEH/dJH4EDtXoXY1RwTi4yszxTWPHXiS21zUYIdVaOKK7ljRBBF8qq7ADJUk8Adaqf8LB8Uf9BiT/wHh/8AiKy9e/5GXVv+v64/9GNVCpPRhCPKtEdH/wALB8Uf9BiT/wAB4f8A4ij/AIWD4o/6DEn/AIDw/wDxFc5RRcrkj2X3HRf8LB8Uf9Bh/wDwHi/+Ir1TwLqV3q/hS2vNQnM9w7SBnKhcgOwHAAHQDtXhNe3fDL/kRrP/AH5f/Q2oRzYiEYxul1OsooopnGFFFFABRRRQAUUUUAFFFFABRRRQA0+nrXlHin4dab4c8MXGoWt3fSSQGNVWVkIOWVecKD0PrXrNcp8Sv+REv/8Aeh/9GpTNKMmpJJ7s8QoooqT0wr1L4f8AgyxNppviDz7r7UNzeXlfL/iXptz09+teW1694I8T6NYeE7G2u9Rt4Zo1bcjvgr8zHn8DQjDEN8uh1Ou6LBr+kzadcySxxS7ctEQGG1gwxkEdVHavGfGnh638M63HY2ks8qNbrMWmYE5LOMcKBj5R2r1z/hNPD/8A0F7T/v5Xl3xI1O01bxPFPY3EdxEtoiF4zkZDOSPyI/OhmGH5lKz2OTooooO4t6Xapf6vZ2khYJcXEcLMhAIDMFJGQRnB9K9s8L+DbPwqblrO4upTcBQ3nFTjbnGMKP7xrxjw7/yM2k/9fsH/AKMWvoimjjxMmmktjN17RIPEGkS6ddSSxxSlSzREBhtYMMZBHVR2ryzxx4JsvC1hbT2lxdTNNKUImZTgbSeMKPSvZ688+L3/ACCNP/6+D/6CaGZ0JNSSvoeUUUUUj0BCcIT7V7tbeCfDzW0RbSrckoOSD6V4S/KH6V7/AG/ijQ1tow2s6aCEAIN0nHH1oRy4m+ljH1H4Z6DdW8otoJLOdh8skcjsFPb5SduPUDH1FeO3UElleT2su3zIJWjfB43KxU4PpkGvc7/xxoFjavN/adtcED/V20olYn6A8fU4HqRXh99dG+1C6u2UI1xM8xUHIUsxYjPfGabHhnN3uQUUUdKR0nT/AA5llj8cWIizslEqSYH8Oxm5/wCBKK9yx1rzX4W+Gri2aTW7uNoxJGYrdGH3lJBL46gHAA9Rk9CK9Lpo87ESUp6HCah8LdJurq7vWvb8SzyPMyqyAAsxY4+XOMn1rx8HIB9RX0rcf8e8v+6f5V81J9wfQUmb4aTad2LRRRQdR2ngfwTY+KdPubi7uLqJoZfLAhZRkbQecqfWvUtA0ODw/pMWn2sk0kUZYhpSCx3MWOcADqfSuR+EH/IFv/8Ar6/9lWvQqaPPrzbk1fQKKKKDAKKKKACiiigAooooAKKKKACiiigArlPiV/yId/8A70P/AKNSurrlPiV/yId//vQ/+jUpl0vjR4hRRRUnqBRRXUaR8PNY1vTIb+1lsRDOCVEkjqRgkcgKR1HrQTJxjrJnL0V23/CpvEH/AD303/v8/wD8RXOa9oF34b1BbK+aFpWiEgMLEjBLAckDnKntQTGpCTsmZlFFFBoaHh3/AJGbSf8Ar9g/9GLX0UO1fOvh3/kZtJ/6/YP/AEYtfRQ7UI4cV8SCvPPi/wD8giw/6+T/AOgmvQ688+L/APyCLD/r5P8A6CaZnR+NHlFFFFI9IKKQnAJ9K9Hi+EMssKv/AG0q7gDj7Ie//A6CJzjDdnnNFegXvwj1CGMNZ6jb3DDqskZi49iC3P1x9a4O5tpbW5kt7mNo5Y2KurdiO1AQqRnsyOuz8F3XhG3nibVYplvAQVluyGgVunGAAPXLA7f71cZRQOceZWufS6OrqCpBUjgg0+vG/h54vm0zUYdKvJWayuWCRZ58qQnAx6Kx4x0BIPHzZ9kpnnVIODsyKf8A495f90/yr5pT7g+gr6WuP+PeX/dP8q+aU+4PoKTOjC7MWiiig6z1j4Qf8gW//wCvr/2Va9Crz74Qf8gS/wD+vn/2Va9BpnmVfjYUVl6zrth4fto7jU5jDHJIIlYIXJYgnGFBPRT+VZH/AAsvwz/z/t/4DS//ABNBKhJrRHVc0tc5pvjjQtWv4bGzvGkuJSdimF1zhSx5KgdAa6OmJprRoKKKKQgooooAKKKKACiiigBtct8Sm/4oW/8A96L/ANGpXVV89X/iLVr+GS2u9QnmgZvmjduDg5H5EChm1CDlK66GXRRRSPRCvdPh5z4G03/df/0Nq8Lrr/AGtaiPE2macLyb7HuceRn5cbWbp9eaEY4iDlHToe11438WP+Ruh/68k/8AQ5K9A8eXtzYeDr24s5ngmQx7ZEPIzIoOPwJFeJX+pXepzie+uJLiUKFDyHkKCSB9Mk/nQznw0G3zFaiiig7jQ8O/8jNpP/X7B/6MWvokc180xTSW80c0LskkbB0YdVYHII+hFepfC7WtQ1WfUxqF5NciNYjGJDnbkvnH5D8qEcmJpt+8eiYrz34v/wDIG0//AK+D/wCgmt/x5qFzpng68urCYwzo0QV1xkZkVT19iRXjWpeINU1qNI9RvZbhI2LKGAAz0zwBQzOhTbfN0RnUUUUHeI/3D9DX0ra/8esP+4P5V81EZBHrXaR/FTXokVFg00qoAyYX7f8AA6Ec9enKdrHs9eFfEOSGTxvfmEcgIshJ6sEXp+GB9QasXvxL8RXkexZre19Wt4sE+2WLY/DBrk3dpHZ3Z', '2026-01-21 06:02:33', '2026-01-21 06:02:33'),
(100, 'verification_of_equipment_serial_numbers', '1.4', '536565', 'uploads/img_69706bf9c86b03.05025612.jpg', '2026-01-21 06:02:33', '2026-01-21 06:02:33'),
(104, 'tower', '2.1', '45544', 'uploads/img_6971a9278276b8.50931330.jpg', '2026-01-22 04:38:53', '2026-01-22 04:38:53');

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

--
-- Dumping data for table `installation_of_kavach_equipment`
--

INSERT INTO `installation_of_kavach_equipment` (`id`, `station_id`, `S_no`, `observation_text`, `requirement_text`, `remarks`, `image_path`, `observation_status`, `created_at`, `updated_at`) VALUES
(1, 5665, '5.1.1', 'Installation', 'Kavach Unit shall be installed as per approved Floor Plan diagram and mounted on insulators, secured by grouting. No unused cable entries left open.', '', NULL, 'Ok', '2026-01-21 06:47:01', '2026-01-21 06:47:01'),
(2, 5665, '5.1.2', 'Cabling', 'All external cables shall enter through cable glands only.', '', NULL, 'Ok', '2026-01-21 06:47:01', '2026-01-21 06:47:01'),
(3, 5665, '5.1.3', 'Earthing', 'Unit shall be connected to the ring earth using a 10 sq.mm green/yellow wire proper torque marking. Cabinet doors (front &amp; rear) earthed using copper braid', '', NULL, 'Select', '2026-01-21 06:47:01', '2026-01-21 06:47:01'),
(4, 5665, '5.1.4', 'Termination Unit', 'This termination unit shall be wall-mounted near Kavach Unit with insulators. Power and OFC cables for SMOCIP and RTU shall be terminated as per drawing 5 16 76 0045. OFC splicing as per 5 16 49 0559', '', NULL, 'Select', '2026-01-21 06:47:01', '2026-01-21 06:47:01'),
(5, 34545454, '5.1.1', 'Installation', 'Kavach Unit shall be installed as per approved Floor Plan diagram and mounted on insulators, secured by grouting. No unused cable entries left open.', '', NULL, 'Yes', '2026-01-22 06:56:48', '2026-01-22 06:56:48'),
(6, 34545454, '5.1.2', 'Cabling', 'All external cables shall enter through cable glands only.', '', NULL, 'Yes', '2026-01-22 06:56:48', '2026-01-22 06:56:48'),
(7, 34545454, '5.1.3', 'Earthing', 'Unit shall be connected to the ring earth using a 10 sq.mm green/yellow wire proper torque marking. Cabinet doors (front &amp; rear) earthed using copper braid', '', NULL, 'Yes', '2026-01-22 06:56:48', '2026-01-22 06:56:48'),
(8, 34545454, '5.1.4', 'Termination Unit', 'This termination unit shall be wall-mounted near Kavach Unit with insulators. Power and OFC cables for SMOCIP and RTU shall be terminated as per drawing 5 16 76 0045. OFC splicing as per 5 16 49 0559', '', NULL, 'Yes', '2026-01-22 06:56:48', '2026-01-22 06:56:48'),
(9, 34545454, '5.2.1', 'Installation', 'SMOCIP shall be installed in Station Master’s room only and mounted at ergonomic height and easily accessible to SM. Panel shall be securely fixed and ensure no vibration or loose mounting (Ref: 5 16 76 0049).', '', NULL, 'Yes', '2026-01-22 06:56:58', '2026-01-22 06:56:58'),
(10, 34545454, '5.2.2', 'Termination Unit', 'Wall-mounted near SMOCIP. Power and OFC cables from Kavach termination unit shall be terminated as per drawings. (Installation Ref drawing:5 16 76 0046) (OFC Splicing Ref drawing: 5 16 49 0559)', '', NULL, 'Yes', '2026-01-22 06:56:58', '2026-01-22 06:56:58'),
(11, 34545454, '5.2.3', 'Earthing', 'SMOCIP shall be Connected to earth using a 10 sq.mm green/yellow wire with torque marking.', '', NULL, 'Yes', '2026-01-22 06:56:58', '2026-01-22 06:56:58'),
(12, 34545454, '5.2.4', 'Functionality', 'Check the mechanical Counter increments correctly and push buttons function correctly.', '', NULL, 'Yes', '2026-01-22 06:56:58', '2026-01-22 06:56:58'),
(13, 34545454, '5.2.5', 'Checksum', 'Verify the checksums as per the FAT certificate.', '', NULL, 'Yes', '2026-01-22 06:56:58', '2026-01-22 06:56:58'),
(14, 34545454, '5.3.1', 'Installation', '1)Two antennas shall be installed 5 m apart on the Kavach Room roof-top and grouted firmly (Ref: 5 16 67 0039).\n2)No obstruction above antennas like tree branches, sun-shades etc.\n3)No water accumulation around antennas or cable conduits.\n4)Weather-proofing at connectors', '', NULL, 'Yes', '2026-01-22 06:57:04', '2026-01-22 06:57:04'),
(15, 34545454, '5.3.2', 'Cabling', '1)Antenna cables shall be routed via diverse paths.\n2)Separate conduits shall be used.\n3)Roof conduits shall be sealed against dust, water, and insects.\n4)In each antenna, the GSM and GPS cables shall be connected to their respective connectors as per the labels provided on the antenna.', '', NULL, 'Yes', '2026-01-22 06:57:04', '2026-01-22 06:57:04'),
(16, 34545454, '5.4.1', 'Installation', 'RIU shall be installed as per approved drawing and secured with insulators. Default &amp; standby OFC paths verified.', '', NULL, 'Yes', '2026-01-22 06:57:11', '2026-01-22 06:57:11'),
(17, 34545454, '5.4.2', 'Cabling', '1)All external cables entering into the RIU unit shall pass through cable glands and ensure no cable entry opening shall be used without a cable gland. OFC patch cords shall be properly tagged to identify default and standby links.', '', NULL, 'Yes', '2026-01-22 06:57:11', '2026-01-22 06:57:11'),
(18, 34545454, '5.4.3', 'Earthing', '1)RIU unit shall be Connected to ring earth using 10 sq.mm green/yellow wire.\n2)Bolts shall be tightened with appropriate torque, and torque marking shall be visible.', '', NULL, 'Yes', '2026-01-22 06:57:11', '2026-01-22 06:57:11'),
(19, 34545454, '5.4.4', 'FDMS Box installation', 'FDMS Box shall be installed on wall with insulators and OFC cables terminated as per network drawing.', '', NULL, 'Yes', '2026-01-22 06:57:11', '2026-01-22 06:57:11');

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

--
-- Dumping data for table `ips`
--

INSERT INTO `ips` (`id`, `station_id`, `S_no`, `observation_text`, `requirement_text`, `remarks`, `image_path`, `observation_status`, `created_at`, `updated_at`) VALUES
(1, 897878, '7.1', 'Installation', 'a)Network rack shall be installed as per approved floor plan drawing and ensure rack doors shall be fully closed and locked.\nb)Patch cord routing shall be neat & bend radius to be maintained.\nc)Network diagram shall be pasted inside the rack', '', NULL, 'Yes', '2026-01-22 04:43:55', '2026-01-22 04:43:57'),
(2, 897878, '7.2', 'Cabling', '1)All external cables entering the network rack shall pass through cable glands only.\n2)OFC cables shall be marked using naming tie-tags for easy identification of default and standby links.', '', NULL, 'Select', '2026-01-22 04:43:55', '2026-01-22 04:43:57'),
(3, 897878, '7.3', 'Earthing', '1)All networking modules inside the rack shall be connected to the rack chassis using 2.5 sq.mm green/yellow earthing wire.\n2)Network rack shall be connected to ring earth using a 10 sq.mm green/yellow earthing wire.\n3)Bolts shall be tightened with appropriate torque and torque marking shall be visible.', '', NULL, 'Select', '2026-01-22 04:43:55', '2026-01-22 04:43:57'),
(4, 897878, '7.4', 'FDMS Box Installation in Network Rack', '1)1) OFC cables shall be terminated in the FDMS box as per network drawing.\n2)All OFC connections shall be properly tightened.\n3)FDMS boxes shall be clearly marked to identify default and standby links.', '', NULL, 'Select', '2026-01-22 04:43:55', '2026-01-22 04:43:57'),
(5, 897878, '7.5', 'OFC cable continuity check, after splicing', 'OTDR test reports shall be available.', '', NULL, 'Select', '2026-01-22 04:43:55', '2026-01-22 04:43:57'),
(6, 676576, '7.1', 'Installation', 'a)Network rack shall be installed as per approved floor plan drawing and ensure rack doors shall be fully closed and locked.\nb)Patch cord routing shall be neat & bend radius to be maintained.\nc)Network diagram shall be pasted inside the rack', '', NULL, 'Yes', '2026-01-22 04:53:19', '2026-01-22 04:53:20'),
(7, 676576, '7.2', 'Cabling', '1)All external cables entering the network rack shall pass through cable glands only.\n2)OFC cables shall be marked using naming tie-tags for easy identification of default and standby links.', '', NULL, 'Select', '2026-01-22 04:53:19', '2026-01-22 04:53:20'),
(8, 676576, '7.3', 'Earthing', '1)All networking modules inside the rack shall be connected to the rack chassis using 2.5 sq.mm green/yellow earthing wire.\n2)Network rack shall be connected to ring earth using a 10 sq.mm green/yellow earthing wire.\n3)Bolts shall be tightened with appropriate torque and torque marking shall be visible.', '', NULL, 'Select', '2026-01-22 04:53:19', '2026-01-22 04:53:20'),
(9, 676576, '7.4', 'FDMS Box Installation in Network Rack', '1)1) OFC cables shall be terminated in the FDMS box as per network drawing.\n2)All OFC connections shall be properly tightened.\n3)FDMS boxes shall be clearly marked to identify default and standby links.', '', NULL, 'Select', '2026-01-22 04:53:19', '2026-01-22 04:53:20'),
(10, 676576, '7.5', 'OFC cable continuity check, after splicing', 'OTDR test reports shall be available.', '', NULL, 'Select', '2026-01-22 04:53:19', '2026-01-22 04:53:20'),
(11, 56545, '7.1', 'Installation', 'a)Network rack shall be installed as per approved floor plan drawing and ensure rack doors shall be fully closed and locked.\nb)Patch cord routing shall be neat & bend radius to be maintained.\nc)Network diagram shall be pasted inside the rack', 'HJ', NULL, 'Yes', '2026-01-22 05:18:05', '2026-01-22 05:18:17'),
(12, 56545, '7.2', 'Cabling', '1)All external cables entering the network rack shall pass through cable glands only.\n2)OFC cables shall be marked using naming tie-tags for easy identification of default and standby links.', '', NULL, 'Yes', '2026-01-22 05:18:05', '2026-01-22 05:18:17'),
(13, 56545, '7.3', 'Earthing', '1)All networking modules inside the rack shall be connected to the rack chassis using 2.5 sq.mm green/yellow earthing wire.\n2)Network rack shall be connected to ring earth using a 10 sq.mm green/yellow earthing wire.\n3)Bolts shall be tightened with appropriate torque and torque marking shall be visible.', '', NULL, 'Yes', '2026-01-22 05:18:05', '2026-01-22 05:18:17'),
(14, 56545, '7.4', 'FDMS Box Installation in Network Rack', '1)1) OFC cables shall be terminated in the FDMS box as per network drawing.\n2)All OFC connections shall be properly tightened.\n3)FDMS boxes shall be clearly marked to identify default and standby links.', '', NULL, 'Yes', '2026-01-22 05:18:05', '2026-01-22 05:18:17'),
(15, 56545, '7.5', 'OFC cable continuity check, after splicing', 'OTDR test reports shall be available.', '', NULL, 'Select', '2026-01-22 05:18:05', '2026-01-22 05:18:17'),
(16, 34545454, '7.1', 'Installation', 'a)Network rack shall be installed as per approved floor plan drawing and ensure rack doors shall be fully closed and locked.\nb)Patch cord routing shall be neat &amp; bend radius to be maintained.\nc)Network diagram shall be pasted inside the rack', '', NULL, 'Yes', '2026-01-22 06:57:38', '2026-01-22 06:58:55'),
(17, 34545454, '7.2', 'Cabling', '1)All external cables entering the network rack shall pass through cable glands only. 2)OFC cables shall be marked using naming tie-tags for easy identification of default and standby links.', '', NULL, 'Yes', '2026-01-22 06:57:38', '2026-01-22 06:58:55'),
(18, 34545454, '7.3', 'Earthing', '1)All networking modules inside the rack shall be connected to the rack chassis using 2.5 sq.mm green/yellow earthing wire.\n2)Network rack shall be connected to ring earth using a 10 sq.mm green/yellow earthing wire.\n3)Bolts shall be tightened with appropriate torque and torque marking shall be visible.', '', NULL, 'Yes', '2026-01-22 06:57:38', '2026-01-22 06:58:55'),
(19, 34545454, '7.4', 'FDMS Box Installation in Network Rack', '1)1) OFC cables shall be terminated in the FDMS box as per network drawing.\n2)All OFC connections shall be properly tightened.\n3)FDMS boxes shall be clearly marked to identify default and standby links.', '', NULL, 'Yes', '2026-01-22 06:57:38', '2026-01-22 06:58:55'),
(20, 34545454, '7.5', 'OFC cable continuity check, after splicing', 'OTDR test reports shall be available.', 'c', NULL, 'Yes', '2026-01-22 06:57:38', '2026-01-22 06:58:55');

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
(9, '52447', 'sushma', '8074138452', '52447', 'admin');

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

--
-- Dumping data for table `networking_rack`
--

INSERT INTO `networking_rack` (`id`, `station_id`, `S_no`, `observation_text`, `requirement_text`, `remarks`, `image_path`, `observation_status`, `created_at`, `updated_at`) VALUES
(1, 676576, '6.1.1', 'RTU fixing', 'Both RTUs shall be firmly secured to the tower platform using bolts as per diagram.\nEnsure RTU doors shall be fully closed and locked.', '', NULL, 'No', '2026-01-22 04:57:50', '2026-01-22 04:57:51'),
(2, 676576, '6.1.2', 'RTU earthing', ') RTU shall be properly earthed by connecting a 35 sq.mm green/yellow earthing conductor from the RTU earthing bolt to the designated earth pit. \n(Ref. Drawing: 521760043)\n2) The earthing conductor shall be routed inside a GI pipe and firmly secured to the tower structure by welding.', '', NULL, 'Select', '2026-01-22 04:57:50', '2026-01-22 04:57:51'),
(3, 676576, '6.1.3', 'OFC cable termination', 'OFC cable from the Relay Room shall be spliced and terminated in the splice holder inside the RTU. \n(Ref. Drawing: 5 16 49 0559)', '', NULL, 'Select', '2026-01-22 04:57:50', '2026-01-22 04:57:51'),
(4, 676576, '6.1.4', '110V Power cable termination', '1) Cable glands used for 110 V DC power cable entry into RTU shall be firmly tightened.', '', NULL, 'Select', '2026-01-22 04:57:50', '2026-01-22 04:57:51'),
(5, 676576, '6.1.5', '110V Power cable termination', '1) 110 V DC power cables shall be terminated inside RTU as per approved drawing.\n2) Inter-connection cable between RTUs shall be installed and terminated as per approved drawing.\n3) Check the 110V DC +/-', '', NULL, 'Select', '2026-01-22 04:57:50', '2026-01-22 04:57:51'),
(6, 676576, '6.1.6', 'Cabiling', 'LMR 600 connection with proper routing and clamping shall be done per Tower SOP 5 xx xx xxxx', '', NULL, 'Select', '2026-01-22 04:57:50', '2026-01-22 04:57:51'),
(7, 56545, '6.1.1', 'RTU fixing', 'Both RTUs shall be firmly secured to the tower platform using bolts as per diagram.\nEnsure RTU doors shall be fully closed and locked.', '', NULL, 'Yes', '2026-01-22 05:18:25', '2026-01-22 06:20:08'),
(8, 56545, '6.1.2', 'RTU earthing', ') RTU shall be properly earthed by connecting a 35 sq.mm green/yellow earthing conductor from the RTU earthing bolt to the designated earth pit. \n(Ref. Drawing: 521760043)\n2) The earthing conductor shall be routed inside a GI pipe and firmly secured to the tower structure by welding.', '', NULL, 'Yes', '2026-01-22 05:18:25', '2026-01-22 06:20:08'),
(9, 56545, '6.1.3', 'OFC cable termination', 'OFC cable from the Relay Room shall be spliced and terminated in the splice holder inside the RTU. \n(Ref. Drawing: 5 16 49 0559)', 'JH', NULL, 'Yes', '2026-01-22 05:18:25', '2026-01-22 06:20:08'),
(10, 56545, '6.1.4', '110V Power cable termination', '1) Cable glands used for 110 V DC power cable entry into RTU shall be firmly tightened.', 'fg', NULL, 'Yes', '2026-01-22 05:18:25', '2026-01-22 06:20:08'),
(11, 56545, '6.1.5', '110V Power cable termination', '1) 110 V DC power cables shall be terminated inside RTU as per approved drawing.\n2) Inter-connection cable between RTUs shall be installed and terminated as per approved drawing.\n3) Check the 110V DC +/-', '', NULL, 'Select', '2026-01-22 05:18:25', '2026-01-22 06:20:08'),
(12, 56545, '6.1.6', 'Cabiling', 'LMR 600 connection with proper routing and clamping shall be done per Tower SOP 5 xx xx xxxx', '', NULL, 'Select', '2026-01-22 05:18:25', '2026-01-22 06:20:08'),
(13, 34545454, '6.1.1', 'RTU fixing', 'Both RTUs shall be firmly secured to the tower platform using bolts as per diagram. Ensure RTU doors shall be fully closed and locked.', '', NULL, 'Yes', '2026-01-22 06:57:23', '2026-01-22 06:57:23'),
(14, 34545454, '6.1.2', 'RTU earthing', ') RTU shall be properly earthed by connecting a 35 sq.mm green/yellow earthing conductor from the RTU earthing bolt to the designated earth pit. (Ref. Drawing: 521760043)\n2) The earthing conductor shall be routed inside a GI pipe and firmly secured to the tower structure by welding.', '', NULL, 'Yes', '2026-01-22 06:57:23', '2026-01-22 06:57:23'),
(15, 34545454, '6.1.3', 'OFC cable termination', 'OFC cable from the Relay Room shall be spliced and terminated in the splice holder inside the RTU. (Ref. Drawing: 5 16 49 0559)', '', NULL, 'Yes', '2026-01-22 06:57:23', '2026-01-22 06:57:23'),
(16, 34545454, '6.1.4', '110V Power cable termination', '1) Cable glands used for 110 V DC power cable entry into RTU shall be firmly tightened.', '', NULL, 'Yes', '2026-01-22 06:57:23', '2026-01-22 06:57:23'),
(17, 34545454, '6.1.5', '110V Power cable termination', '1) 110 V DC power cables shall be terminated inside RTU as per approved drawing.\n2) Inter-connection cable between RTUs shall be installed and terminated as per approved drawing.\n3) Check the 110V DC +/-', '', NULL, 'Yes', '2026-01-22 06:57:23', '2026-01-22 06:57:23'),
(18, 34545454, '6.1.6', 'Cabiling', 'LMR 600 connection with proper routing and clamping shall be done per Tower SOP 5 xx xx xxxx', '', NULL, 'Yes', '2026-01-22 06:57:23', '2026-01-22 06:57:23'),
(19, 34545454, '6.2.1', 'RF antenna installation and Audit', '1) RF antenna installation audit report from the installation contractor shall be available in WFMS.\n2) There shall be no open points in the audit report', '', NULL, 'Yes', '2026-01-22 06:57:31', '2026-01-22 06:57:31');

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

--
-- Dumping data for table `pdu`
--

INSERT INTO `pdu` (`id`, `station_id`, `S_no`, `observation_text`, `requirement_text`, `remarks`, `image_path`, `observation_status`, `created_at`, `updated_at`) VALUES
(1, 45544, '9.1', 'Installation', 'Earth pit shall be constructed as per standard drawing', '', NULL, 'Yes', '2026-01-22 04:36:07', '2026-01-22 04:36:09'),
(2, 45544, '9.2', 'Electrode Installation', 'All joints shall be mechanically and electrically sound. Exothermic welding shall be used where specified for permanent joints.', '', NULL, 'Yes', '2026-01-22 04:36:07', '2026-01-22 04:36:09'),
(3, 45544, '9.3', 'Earth Resistance Measurement', 'Earth resistance shall be measured using a calibrated earth resistance tester. The measured value shall be ≤ 1 Ohm.', '', NULL, 'Select', '2026-01-22 04:36:07', '2026-01-22 04:36:09'),
(4, 45544, '9.4', 'Test Reports', 'Earth resistance test reports shall be available.', '', NULL, 'Select', '2026-01-22 04:36:07', '2026-01-22 04:36:09'),
(5, 45544, '9.5', 'Labeling', 'All earth pits, earthing conductors, and earth points shall be clearly labelled and identifiable.', '', NULL, 'Select', '2026-01-22 04:36:07', '2026-01-22 04:36:09'),
(6, 56545, '9.1', 'Installation', 'Earth pit shall be constructed as per standard drawing', '', NULL, 'Yes', '2026-01-22 05:52:29', '2026-01-22 05:52:41'),
(7, 56545, '9.2', 'Electrode Installation', 'All joints shall be mechanically and electrically sound. Exothermic welding shall be used where specified for permanent joints.', 'zx', NULL, 'Yes', '2026-01-22 05:52:29', '2026-01-22 05:52:41'),
(8, 56545, '9.3', 'Earth Resistance Measurement', 'Earth resistance shall be measured using a calibrated earth resistance tester. The measured value shall be ≤ 1 Ohm.', '', NULL, 'Select', '2026-01-22 05:52:29', '2026-01-22 05:52:41'),
(9, 56545, '9.4', 'Test Reports', 'Earth resistance test reports shall be available.', '', NULL, 'Select', '2026-01-22 05:52:29', '2026-01-22 05:52:41'),
(10, 56545, '9.5', 'Labeling', 'All earth pits, earthing conductors, and earth points shall be clearly labelled and identifiable.', '', NULL, 'Select', '2026-01-22 05:52:29', '2026-01-22 05:52:41'),
(11, 57767, '9.1', 'Installation', 'Earth pit shall be constructed as per standard drawing', '', NULL, 'Yes', '2026-01-22 06:29:18', '2026-01-22 06:29:28'),
(12, 57767, '9.2', 'Electrode Installation', 'All joints shall be mechanically and electrically sound. Exothermic welding shall be used where specified for permanent joints.', '', NULL, 'Yes', '2026-01-22 06:29:18', '2026-01-22 06:29:28'),
(13, 57767, '9.3', 'Earth Resistance Measurement', 'Earth resistance shall be measured using a calibrated earth resistance tester. The measured value shall be ≤ 1 Ohm.', 'j', NULL, 'No', '2026-01-22 06:29:18', '2026-01-22 06:29:28'),
(14, 57767, '9.4', 'Test Reports', 'Earth resistance test reports shall be available.', '', NULL, 'Select', '2026-01-22 06:29:18', '2026-01-22 06:29:28'),
(15, 57767, '9.5', 'Labeling', 'All earth pits, earthing conductors, and earth points shall be clearly labelled and identifiable.', '', NULL, 'Select', '2026-01-22 06:29:18', '2026-01-22 06:29:28'),
(16, 34545454, '9.1', 'Installation', 'Earth pit shall be constructed as per standard drawing', '', NULL, 'Yes', '2026-01-22 06:58:04', '2026-01-22 06:58:04'),
(17, 34545454, '9.2', 'Electrode Installation', 'All joints shall be mechanically and electrically sound. Exothermic welding shall be used where specified for permanent joints.', '', NULL, 'Yes', '2026-01-22 06:58:04', '2026-01-22 06:58:04'),
(18, 34545454, '9.3', 'Earth Resistance Measurement', 'Earth resistance shall be measured using a calibrated earth resistance tester. The measured value shall be ≤ 1 Ohm.', '', NULL, 'Yes', '2026-01-22 06:58:04', '2026-01-22 06:58:04'),
(19, 34545454, '9.4', 'Test Reports', 'Earth resistance test reports shall be available.', '', NULL, 'Yes', '2026-01-22 06:58:04', '2026-01-22 06:58:04'),
(20, 34545454, '9.5', 'Labeling', 'All earth pits, earthing conductors, and earth points shall be clearly labelled and identifiable.', '', NULL, 'Yes', '2026-01-22 06:58:04', '2026-01-22 06:58:04');

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

--
-- Dumping data for table `relay_rack`
--

INSERT INTO `relay_rack` (`id`, `station_id`, `S_no`, `observation_text`, `requirement_text`, `remarks`, `image_path`, `observation_status`, `created_at`, `updated_at`) VALUES
(1, 34545454, '12.1', 'Visual Inspection', 'Verify visual inspection, No gaps, No play, Tags shall be placing centre of the sleeper and Duplicate tag spacing (3–5 m)', '', NULL, 'Yes', '2026-01-22 06:54:34', '2026-01-22 06:54:44'),
(2, 34545454, '12.2', 'RFID Tags installation', 'RFID placement verification report shall be available and confirm placement within ±5 m of design location.', 'ddf', NULL, 'Yes', '2026-01-22 06:54:34', '2026-01-22 06:54:44'),
(3, 34545454, '12.3', 'RFID Tag data Validation and Placement verification', 'System-generated RFID data validation report and Placement verification report shall available.', '', NULL, 'Yes', '2026-01-22 06:54:34', '2026-01-22 06:54:44');

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
(22, '536565_2026-01-21_Report_NotCompleted_Version-3.pdf', '2026-01-21 06:27:35', 52447),
(23, '43554666_2026-01-21_Report_NotCompleted_Version-1.pdf', '2026-01-21 12:40:56', 52447),
(24, '43554666_2026-01-21_Report_NotCompleted_Version-2.pdf', '2026-01-21 13:02:11', 52447),
(25, '45544_2026-01-22_Report_NotCompleted_Version-1.pdf', '2026-01-22 04:38:16', 52447),
(26, '45544_2026-01-22_Report_NotCompleted_Version-2.pdf', '2026-01-22 04:39:06', 52447),
(27, '56545_2026-01-22_Report_NotCompleted_Version-1.pdf', '2026-01-22 05:21:06', 52447),
(28, '56545_2026-01-22_Report_NotCompleted_Version-2.pdf', '2026-01-22 06:18:21', 52447),
(29, '57767_2026-01-22_Report_NotCompleted_Version-1.pdf', '2026-01-22 06:29:55', 52447),
(30, '57767_2026-01-22_Report_NotCompleted_Version-2.pdf', '2026-01-22 06:31:02', 52447),
(31, '34545454_2026-01-22_Report_NotCompleted_Version-1.pdf', '2026-01-22 06:54:55', 52447),
(32, '34545454_2026-01-22_Report_Completed_Version-2.pdf', '2026-01-22 07:08:33', 52447),
(33, '34545454_2026-01-22_Report_Completed_Version-3.pdf', '2026-01-22 07:16:29', 52447);

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
(22, 536565, 3, '2026-01-21 06:27:35'),
(23, 43554666, 2, '2026-01-21 13:02:11'),
(24, 45544, 2, '2026-01-22 04:39:06'),
(25, 56545, 2, '2026-01-22 06:18:21'),
(26, 57767, 2, '2026-01-22 06:31:02'),
(27, 34545454, 3, '2026-01-22 07:16:29');

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

--
-- Dumping data for table `rf_antennas`
--

INSERT INTO `rf_antennas` (`id`, `station_id`, `S_no`, `observation_text`, `requirement_text`, `remarks`, `image_path`, `observation_status`, `created_at`, `updated_at`) VALUES
(1, 545656, '4.1.1', 'Installation', '1)IPS unit shall be installed as per approved floor plan drawing.\n2)IPS unit shall be mounted on insulators and secured to the floor by grouting.', '', NULL, 'Yes', '2026-01-21 04:56:59', '2026-01-21 04:56:59'),
(2, 545656, '4.1.2', 'Cabling', 'All external cables entering the IPS unit shall pass through cable glands and ensure no cable entry shall be left open without a cable gland.', '', NULL, 'Select', '2026-01-21 04:56:59', '2026-01-21 04:56:59'),
(3, 545656, '4.1.3', 'Earthing', '1)IPS unit shall be connected to the ring earth conductor using a 10 sq.mm green/yellow earthing wire.\n2)Bolts shall be tightened with appropriate torque and torque marking shall be visible.', '', NULL, 'Select', '2026-01-21 04:56:59', '2026-01-21 04:56:59'),
(4, 545656, '4.1.4', 'Functionality', '110VDC +/-1% output shall be in the range of 108.9 V DC to 111.1 V DC.', '', NULL, 'Select', '2026-01-21 04:56:59', '2026-01-21 04:56:59'),
(5, 536565, '4.1.1', 'Installation', '1)IPS unit shall be installed as per approved floor plan drawing.\n2)IPS unit shall be mounted on insulators and secured to the floor by grouting.', '', NULL, 'Yes', '2026-01-21 06:11:35', '2026-01-21 06:11:35'),
(6, 536565, '4.1.2', 'Cabling', 'All external cables entering the IPS unit shall pass through cable glands and ensure no cable entry shall be left open without a cable gland.', '', NULL, 'Select', '2026-01-21 06:11:35', '2026-01-21 06:11:35'),
(7, 536565, '4.1.3', 'Earthing', '1)IPS unit shall be connected to the ring earth conductor using a 10 sq.mm green/yellow earthing wire.\n2)Bolts shall be tightened with appropriate torque and torque marking shall be visible.', '', NULL, 'Select', '2026-01-21 06:11:35', '2026-01-21 06:11:35'),
(8, 536565, '4.1.4', 'Functionality', '110VDC +/-1% output shall be in the range of 108.9 V DC to 111.1 V DC.', '', NULL, 'Select', '2026-01-21 06:11:35', '2026-01-21 06:11:35'),
(9, 5665, '4.1.1', 'Installation', '1)IPS unit shall be installed as per approved floor plan drawing.\n2)IPS unit shall be mounted on insulators and secured to the floor by grouting.', '', NULL, 'Yes', '2026-01-21 06:41:06', '2026-01-21 06:41:06'),
(10, 5665, '4.1.2', 'Cabling', 'All external cables entering the IPS unit shall pass through cable glands and ensure no cable entry shall be left open without a cable gland.', '', NULL, 'Yes', '2026-01-21 06:41:06', '2026-01-21 06:41:06'),
(11, 5665, '4.1.3', 'Earthing', '1)IPS unit shall be connected to the ring earth conductor using a 10 sq.mm green/yellow earthing wire.\n2)Bolts shall be tightened with appropriate torque and torque marking shall be visible.', '', NULL, 'Select', '2026-01-21 06:41:06', '2026-01-21 06:41:06'),
(12, 5665, '4.1.4', 'Functionality', '110VDC +/-1% output shall be in the range of 108.9 V DC to 111.1 V DC.', '', NULL, 'Select', '2026-01-21 06:41:06', '2026-01-21 06:41:06'),
(13, 5665, '4.2.1', 'Installation', '1.One PDU shall be installed near IPS and a second PDU shall be installed close to Stationary Kavach unit (Ref: Power supply diagram and Load Calculations).\n2.PDU units shall be mounted on insulators and secured to the wall by grouting.\n3.MCB and Fuse ratings shall be verified as per load calculation (Ref: Power supply diagram and Load Calculations)', '', NULL, 'Ok', '2026-01-21 07:15:43', '2026-01-21 07:15:43'),
(14, 5665, '4.2.2', 'Cabling', '1)All external cables entering the PDU shall pass through cable glands and ensure no cable entry opening shall be used without a cable gland.\n2) Output connections shall be maintained as per the Station PDU schematic (Ref drawing: 5 16 49 0671)', '', NULL, 'Ok', '2026-01-21 07:15:43', '2026-01-21 07:15:43'),
(15, 5665, '4.2.3', 'Earthing', '1)PDU units shall be connected to the ring-earth conductor by using a 10 sq.mm green/yellow earthing wire.\n2)Bolts shall be tightened with appropriate torque, and torque marking shall be visible.', '', NULL, 'Select', '2026-01-21 07:15:43', '2026-01-21 07:15:43'),
(16, 5665, '4.2.4', 'Functionality', 'Functional testing shall be performed as per the PDU test procedure 5 xx xx xxxx.', '', NULL, 'Select', '2026-01-21 07:15:43', '2026-01-21 07:15:43'),
(17, 5665, '4.3.1', 'Installation', '1.One PDU shall be installed near IPS and a second PDU shall be installed close to Stationary Kavach unit (Ref: Power supply diagram and Load Calculations).\n2.PDU units shall be mounted on insulators and secured to the wall by grouting.\n3.MCB and Fuse ratings shall be verified as per load calculation (Ref: Power supply diagram and Load Calculations)', '', NULL, 'Ok', '2026-01-21 07:15:48', '2026-01-21 07:15:48'),
(18, 5665, '4.3.2', 'Cabling', 'All external cables entering the unit shall pass through cable glands and ensure no cable entry opening shall be used without a cable gland.', '', NULL, 'Ok', '2026-01-21 07:15:48', '2026-01-21 07:15:48'),
(19, 5665, '4.3.3', 'Earthing', 'Unit shall be connected to the ring earth conductor using a 10 sq.mm green/yellow earthing wire and bolts shall be tightened with appropriate torque marking.', '', NULL, 'Select', '2026-01-21 07:15:48', '2026-01-21 07:15:48'),
(20, 5665, '4.3.4', 'Functionality', 'DC-DC converter output voltage shall be minimum 24 V DC, +/-1% VDC Input voltage range shall be verified 110V', '', NULL, 'Select', '2026-01-21 07:15:48', '2026-01-21 07:15:48'),
(21, 43554666, '4.1.1', 'Installation', '1)IPS unit shall be installed as per approved floor plan drawing.\n2)IPS unit shall be mounted on insulators and secured to the floor by grouting.', '', NULL, 'Yes', '2026-01-22 04:30:02', '2026-01-22 04:30:02'),
(22, 43554666, '4.1.2', 'Cabling', 'All external cables entering the IPS unit shall pass through cable glands and ensure no cable entry shall be left open without a cable gland.', '', NULL, 'Yes', '2026-01-22 04:30:02', '2026-01-22 04:30:02'),
(23, 43554666, '4.1.3', 'Earthing', '1)IPS unit shall be connected to the ring earth conductor using a 10 sq.mm green/yellow earthing wire.\n2)Bolts shall be tightened with appropriate torque and torque marking shall be visible.', '', NULL, 'Select', '2026-01-22 04:30:02', '2026-01-22 04:30:02'),
(24, 43554666, '4.1.4', 'Functionality', '110VDC +/-1% output shall be in the range of 108.9 V DC to 111.1 V DC.', '', NULL, 'Select', '2026-01-22 04:30:02', '2026-01-22 04:30:02'),
(25, 34545454, '4.1.1', 'Installation', '1)IPS unit shall be installed as per approved floor plan drawing.\n2)IPS unit shall be mounted on insulators and secured to the floor by grouting.', '', NULL, 'Yes', '2026-01-22 06:56:24', '2026-01-22 06:56:24'),
(26, 34545454, '4.1.2', 'Cabling', 'All external cables entering the IPS unit shall pass through cable glands and ensure no cable entry shall be left open without a cable gland.', '', NULL, 'Yes', '2026-01-22 06:56:24', '2026-01-22 06:56:24'),
(27, 34545454, '4.1.3', 'Earthing', '1)IPS unit shall be connected to the ring earth conductor using a 10 sq.mm green/yellow earthing wire.\n2)Bolts shall be tightened with appropriate torque and torque marking shall be visible.', '', NULL, 'Yes', '2026-01-22 06:56:24', '2026-01-22 06:56:24'),
(28, 34545454, '4.1.4', 'Functionality', '110VDC +/-1% output shall be in the range of 108.9 V DC to 111.1 V DC.', '', NULL, 'Yes', '2026-01-22 06:56:24', '2026-01-22 06:56:24'),
(29, 34545454, '4.2.1', 'Installation', '1.One PDU shall be installed near IPS and a second PDU shall be installed close to Stationary Kavach unit (Ref: Power supply diagram and Load Calculations).\n2.PDU units shall be mounted on insulators and secured to the wall by grouting.\n3.MCB and Fuse ratings shall be verified as per load calculation (Ref: Power supply diagram and Load Calculations)', '', NULL, 'Yes', '2026-01-22 06:56:31', '2026-01-22 06:56:31'),
(30, 34545454, '4.2.2', 'Cabling', '1)All external cables entering the PDU shall pass through cable glands and ensure no cable entry opening shall be used without a cable gland.\n2) Output connections shall be maintained as per the Station PDU schematic (Ref drawing: 5 16 49 0671)', '', NULL, 'Yes', '2026-01-22 06:56:31', '2026-01-22 06:56:31'),
(31, 34545454, '4.2.3', 'Earthing', '1)PDU units shall be connected to the ring-earth conductor by using a 10 sq.mm green/yellow earthing wire.\n2)Bolts shall be tightened with appropriate torque, and torque marking shall be visible.', '', NULL, 'Yes', '2026-01-22 06:56:31', '2026-01-22 06:56:31'),
(32, 34545454, '4.2.4', 'Functionality', 'Functional testing shall be performed as per the PDU test procedure 5 xx xx xxxx.', '', NULL, 'Yes', '2026-01-22 06:56:31', '2026-01-22 06:56:31'),
(33, 34545454, '4.3.1', 'Installation', '1.One PDU shall be installed near IPS and a second PDU shall be installed close to Stationary Kavach unit (Ref: Power supply diagram and Load Calculations).\n2.PDU units shall be mounted on insulators and secured to the wall by grouting.\n3.MCB and Fuse ratings shall be verified as per load calculation (Ref: Power supply diagram and Load Calculations)', '', NULL, 'Yes', '2026-01-22 06:56:40', '2026-01-22 06:56:40'),
(34, 34545454, '4.3.2', 'Cabling', 'All external cables entering the unit shall pass through cable glands and ensure no cable entry opening shall be used without a cable gland.', '', NULL, 'Yes', '2026-01-22 06:56:40', '2026-01-22 06:56:40'),
(35, 34545454, '4.3.3', 'Earthing', 'Unit shall be connected to the ring earth conductor using a 10 sq.mm green/yellow earthing wire and bolts shall be tightened with appropriate torque marking.', '', NULL, 'Yes', '2026-01-22 06:56:40', '2026-01-22 06:56:40'),
(36, 34545454, '4.3.4', 'Functionality', 'DC-DC converter output voltage shall be minimum 24 V DC, +/-1% VDC Input voltage range shall be verified 110V', '', NULL, 'Yes', '2026-01-22 06:56:40', '2026-01-22 06:56:40');

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

--
-- Dumping data for table `rtu`
--

INSERT INTO `rtu` (`id`, `station_id`, `S_no`, `observation_text`, `requirement_text`, `remarks`, `image_path`, `observation_status`, `created_at`, `updated_at`) VALUES
(1, 536565, '3.1', 'Installation Location', 'Installation shall be at the approved Cable Route Plan', '', NULL, 'Yes', '2026-01-21 06:03:23', '2026-01-21 06:11:06'),
(2, 536565, '3.2', 'Soil test', 'Soil test report shall be available for the location.', '', NULL, 'Yes', '2026-01-21 06:03:23', '2026-01-21 06:11:06'),
(3, 536565, '3.3', 'Foundation work as per the SBC report', 'Foundation design shall be as per the SBC specified in the soil test report.', '', NULL, 'Select', '2026-01-21 06:03:23', '2026-01-21 06:11:06'),
(4, 536565, '3.4', 'Erection of Tower', '1) Verticality test shall be conducted as per RDSO drawing specifications.\n2) Lightning protection rods and aviation lamp shall be installed at the top of the tower as per diagram 5 16 67 0983.\n3) Aviation lamp shall glow during night time only.', '', NULL, 'Select', '2026-01-21 06:03:23', '2026-01-21 06:11:06'),
(5, 536565, '3.5', 'Tower Painting.', 'One coat of yellow primer coating and two coats of orange and white color bands on each segment of tower.', '', NULL, 'Select', '2026-01-21 06:03:23', '2026-01-21 06:11:06'),
(6, 536565, '3.6', 'Earthing', 'Tower earthing shall be done per drawing: 5 16 76 0043.', '', NULL, 'Select', '2026-01-21 06:03:23', '2026-01-21 06:11:06'),
(7, 43554666, '3.1', 'Installation Location', 'Installation shall be at the approved Cable Route Plan', '', NULL, 'Yes', '2026-01-22 04:29:47', '2026-01-22 04:29:47'),
(8, 43554666, '3.2', 'Soil test', 'Soil test report shall be available for the location.', '', NULL, 'Yes', '2026-01-22 04:29:47', '2026-01-22 04:29:47'),
(9, 43554666, '3.3', 'Foundation work as per the SBC report', 'Foundation design shall be as per the SBC specified in the soil test report.', '', NULL, 'Select', '2026-01-22 04:29:47', '2026-01-22 04:29:47'),
(10, 43554666, '3.4', 'Erection of Tower', '1) Verticality test shall be conducted as per RDSO drawing specifications.\n2) Lightning protection rods and aviation lamp shall be installed at the top of the tower as per diagram 5 16 67 0983.\n3) Aviation lamp shall glow during night time only.', '', NULL, 'Select', '2026-01-22 04:29:47', '2026-01-22 04:29:47'),
(11, 43554666, '3.5', 'Tower Painting.', 'One coat of yellow primer coating and two coats of orange and white color bands on each segment of tower.', '', NULL, 'Select', '2026-01-22 04:29:47', '2026-01-22 04:29:47'),
(12, 43554666, '3.6', 'Earthing', 'Tower earthing shall be done per drawing: 5 16 76 0043.', '', NULL, 'Select', '2026-01-22 04:29:47', '2026-01-22 04:29:47'),
(13, 78879, '3.1', 'Installation Location', 'Installation shall be at the approved Cable Route Plan', '', NULL, 'Yes', '2026-01-22 04:40:32', '2026-01-22 04:40:34'),
(14, 78879, '3.2', 'Soil test', 'Soil test report shall be available for the location.', '', NULL, 'Yes', '2026-01-22 04:40:32', '2026-01-22 04:40:34'),
(15, 78879, '3.3', 'Foundation work as per the SBC report', 'Foundation design shall be as per the SBC specified in the soil test report.', '', NULL, 'Select', '2026-01-22 04:40:32', '2026-01-22 04:40:34'),
(16, 78879, '3.4', 'Erection of Tower', '1) Verticality test shall be conducted as per RDSO drawing specifications.\n      2) Lightning protection rods and aviation lamp shall be installed at the top of the tower as per diagram 5 16 67 0983.\n      3) Aviation lamp shall glow during night time only.', '', NULL, 'Select', '2026-01-22 04:40:32', '2026-01-22 04:40:34'),
(17, 78879, '3.5', 'Tower Painting.', 'One coat of yellow primer coating and two coats of orange and white color bands on each segment of tower.', '', NULL, 'Select', '2026-01-22 04:40:32', '2026-01-22 04:40:34'),
(18, 78879, '3.6', 'Earthing', 'Tower earthing shall be done per drawing: 5 16 76 0043.', '', NULL, 'Select', '2026-01-22 04:40:32', '2026-01-22 04:40:34'),
(19, 56545, '3.1', 'Installation Location', 'Installation shall be at the approved Cable Route Plan', '', NULL, 'Yes', '2026-01-22 05:08:05', '2026-01-22 05:08:06'),
(20, 56545, '3.2', 'Soil test', 'Soil test report shall be available for the location.', '', NULL, 'Select', '2026-01-22 05:08:05', '2026-01-22 05:08:06'),
(21, 56545, '3.3', 'Foundation work as per the SBC report', 'Foundation design shall be as per the SBC specified in the soil test report.', '', NULL, 'Select', '2026-01-22 05:08:05', '2026-01-22 05:08:06'),
(22, 56545, '3.4', 'Erection of Tower', '1) Verticality test shall be conducted as per RDSO drawing specifications.\n      2) Lightning protection rods and aviation lamp shall be installed at the top of the tower as per diagram 5 16 67 0983.\n      3) Aviation lamp shall glow during night time only.', '', NULL, 'Select', '2026-01-22 05:08:05', '2026-01-22 05:08:06'),
(23, 56545, '3.5', 'Tower Painting.', 'One coat of yellow primer coating and two coats of orange and white color bands on each segment of tower.', '', NULL, 'Select', '2026-01-22 05:08:05', '2026-01-22 05:08:06'),
(24, 56545, '3.6', 'Earthing', 'Tower earthing shall be done per drawing: 5 16 76 0043.', '', NULL, 'Select', '2026-01-22 05:08:05', '2026-01-22 05:08:06'),
(25, 3444345, '3.1', 'Installation Location', 'Installation shall be at the approved Cable Route Plan', '', NULL, 'Yes', '2026-01-22 06:53:09', '2026-01-22 06:54:06'),
(26, 3444345, '3.2', 'Soil test', 'Soil test report shall be available for the location.', '', NULL, 'Yes', '2026-01-22 06:53:09', '2026-01-22 06:54:06'),
(27, 3444345, '3.3', 'Foundation work as per the SBC report', 'Foundation design shall be as per the SBC specified in the soil test report.', '', NULL, 'Yes', '2026-01-22 06:53:09', '2026-01-22 06:54:06'),
(28, 3444345, '3.4', 'Erection of Tower', '1) Verticality test shall be conducted as per RDSO drawing specifications.\n2) Lightning protection rods and aviation lamp shall be installed at the top of the tower as per diagram 5 16 67 0983.\n3) Aviation lamp shall glow during night time only.', 'fre', NULL, 'Yes', '2026-01-22 06:53:09', '2026-01-22 06:54:06'),
(29, 3444345, '3.5', 'Tower Painting.', 'One coat of yellow primer coating and two coats of orange and white color bands on each segment of tower.', '', NULL, 'Select', '2026-01-22 06:53:09', '2026-01-22 06:54:06'),
(30, 3444345, '3.6', 'Earthing', 'Tower earthing shall be done per drawing: 5 16 76 0043.', '', NULL, 'Select', '2026-01-22 06:53:09', '2026-01-22 06:54:06'),
(31, 34545454, '3.1', 'Installation Location', 'Installation shall be at the approved Cable Route Plan', '', NULL, 'Yes', '2026-01-22 06:56:16', '2026-01-22 06:56:16'),
(32, 34545454, '3.2', 'Soil test', 'Soil test report shall be available for the location.', '', NULL, 'Yes', '2026-01-22 06:56:16', '2026-01-22 06:56:16'),
(33, 34545454, '3.3', 'Foundation work as per the SBC report', 'Foundation design shall be as per the SBC specified in the soil test report.', '', NULL, 'Yes', '2026-01-22 06:56:16', '2026-01-22 06:56:16'),
(34, 34545454, '3.4', 'Erection of Tower', '1) Verticality test shall be conducted as per RDSO drawing specifications.\n2) Lightning protection rods and aviation lamp shall be installed at the top of the tower as per diagram 5 16 67 0983.\n3) Aviation lamp shall glow during night time only.', '', NULL, 'Yes', '2026-01-22 06:56:16', '2026-01-22 06:56:16'),
(35, 34545454, '3.5', 'Tower Painting.', 'One coat of yellow primer coating and two coats of orange and white color bands on each segment of tower.', '', NULL, 'Yes', '2026-01-22 06:56:16', '2026-01-22 06:56:16'),
(36, 34545454, '3.6', 'Earthing', 'Tower earthing shall be done per drawing: 5 16 76 0043.', '', NULL, 'Yes', '2026-01-22 06:56:16', '2026-01-22 06:56:16');

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

--
-- Dumping data for table `smocip`
--

INSERT INTO `smocip` (`id`, `station_id`, `S_no`, `observation_text`, `requirement_text`, `remarks`, `image_path`, `observation_status`, `created_at`, `updated_at`) VALUES
(1, 56545, '10.1', 'Workmanship', 'Cables shall be laid in conduits, trays, or cable truffes and properly secured. Segregation of power &amp; communication cables', '', NULL, 'Yes', '2026-01-22 06:01:19', '2026-01-22 06:01:20'),
(2, 56545, '10.2', 'Redundant cabling', 'Cabeling shall be done as per Power Supply diagram and Load Calulation Segregation of power &amp; communication cables', '', NULL, 'Select', '2026-01-22 06:01:19', '2026-01-22 06:01:20'),
(3, 56545, '10.3', 'SMOCIP', 'CAT-6 armoured cable used for communication', '', NULL, 'Select', '2026-01-22 06:01:19', '2026-01-22 06:01:20'),
(4, 56545, '10.4', 'No Joints', 'No joints permitted except inside junction boxes or panels.', '', NULL, 'Select', '2026-01-22 06:01:19', '2026-01-22 06:01:20'),
(5, 56545, '10.5', 'Color Coding', 'Colour codes shall be followed for phase, neutral, and earth.', '', NULL, 'Select', '2026-01-22 06:01:19', '2026-01-22 06:01:20'),
(6, 56545, '10.6', 'Support &amp;amp; securing', 'Cables shall be properly fastened with adequate slack for termination.', '', NULL, 'Select', '2026-01-22 06:01:19', '2026-01-22 06:01:20'),
(7, 56545, '10.7', 'Tagging/Labeling', 'Cables shall be tagged at both ends.', '', NULL, 'Select', '2026-01-22 06:01:19', '2026-01-22 06:01:20'),
(8, 56545, '10.8', 'Termination &amp;amp; Connection', 'Proper lugs/ferrules shall be used and terminals tightened correctly.', '', NULL, 'Select', '2026-01-22 06:01:19', '2026-01-22 06:01:20'),
(9, 34545454, '10.1', 'Workmanship', 'Cables shall be laid in conduits, trays, or cable truffes and properly secured. Segregation of power &amp; communication cables', '', NULL, 'Yes', '2026-01-22 06:58:16', '2026-01-22 06:58:16'),
(10, 34545454, '10.2', 'Redundant cabling', 'Cabeling shall be done as per Power Supply diagram and Load Calulation Segregation of power &amp; communication cables', '', NULL, 'Yes', '2026-01-22 06:58:16', '2026-01-22 06:58:16'),
(11, 34545454, '10.3', 'SMOCIP', 'CAT-6 armoured cable used for communication', '', NULL, 'Yes', '2026-01-22 06:58:16', '2026-01-22 06:58:16'),
(12, 34545454, '10.4', 'No Joints', 'No joints permitted except inside junction boxes or panels.', '', NULL, 'Yes', '2026-01-22 06:58:16', '2026-01-22 06:58:16'),
(13, 34545454, '10.5', 'Color Coding', 'Colour codes shall be followed for phase, neutral, and earth.', '', NULL, 'Yes', '2026-01-22 06:58:16', '2026-01-22 06:58:16'),
(14, 34545454, '10.6', 'Support &amp;amp; securing', 'Cables shall be properly fastened with adequate slack for termination.', '', NULL, 'Yes', '2026-01-22 06:58:16', '2026-01-22 06:58:16'),
(15, 34545454, '10.7', 'Tagging/Labeling', 'Cables shall be tagged at both ends.', '', NULL, 'Yes', '2026-01-22 06:58:16', '2026-01-22 06:58:16'),
(16, 34545454, '10.8', 'Termination &amp;amp; Connection', 'Proper lugs/ferrules shall be used and terminals tightened correctly.', '', NULL, 'Yes', '2026-01-22 06:58:16', '2026-01-22 06:58:16');

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
(5465, 'fgfgfg', 'ECR', 'Pt Deendayal Upadhy - Pradhankhnta', 'Pt Deendayal Upadhy - Pradhankhnta', '2026-01-21', '2026-01-21', 25, '2026-01-21 10:21:00', '2026-01-21 10:21:00'),
(545656, 'vdxgg', 'ER', 'Howrah-COO', 'Howrah-COO', '2026-01-21', '2026-01-21', 26, '2026-01-21 10:26:28', '2026-01-21 10:26:28'),
(43554, 'fdfdfd', 'ER', 'Howrah-COO', 'Howrah-COO', '2026-01-21', '2026-01-21', 27, '2026-01-21 11:18:08', '2026-01-21 11:21:37'),
(536565, 'gfhhghgf', 'ER', 'Howrah-COO', 'Howrah-COO', '2026-01-21', '2026-01-21', 28, '2026-01-21 11:31:08', '2026-01-21 11:57:35'),
(5665, 'gfcb', 'ECR', 'Pt Deendayal Upadhy - Pradhankhnta', 'Pt Deendayal Upadhy - Pradhankhnta', '2026-01-21', '2026-01-21', 29, '2026-01-21 12:07:23', '2026-01-21 12:07:23'),
(6575876, 'jhjhgj', 'ER', 'Howrah-COO', 'Howrah-COO', '2026-01-21', '2026-01-21', 30, '2026-01-21 14:57:32', '2026-01-21 14:57:32'),
(34534, 'rfdfg', 'ER', 'Howrah-COO', 'Howrah-COO', '2026-01-21', '2026-01-21', 31, '2026-01-21 15:29:02', '2026-01-21 15:29:02'),
(7785, 'jgujf', 'ECR', 'Pt Deendayal Upadhy - Pradhankhnta', 'Pt Deendayal Upadhy - Pradhankhnta', '2026-01-21', '2026-01-21', 32, '2026-01-21 15:46:33', '2026-01-21 15:46:33'),
(435565, 'tggfbbb', 'CR', 'Mumbai', 'Mumbai', '2026-01-21', '2026-01-21', 33, '2026-01-21 16:24:43', '2026-01-21 16:24:43'),
(43554666, 'hgnvbvc', 'ECR', 'Pt Deendayal Upadhy - Pradhankhnta', 'Pt Deendayal Upadhy - Pradhankhnta', '2026-01-21', '2026-01-21', 34, '2026-01-21 16:25:44', '2026-01-21 18:32:11'),
(45544, 'trfg', 'ER', 'Howrah-COO', 'Howrah-COO', '2026-01-22', '2026-01-22', 35, '2026-01-22 10:05:21', '2026-01-22 10:09:06'),
(78879, 'hjjhkjkh', 'ER', 'Howrah-COO', 'Howrah-COO', '2026-01-22', '2026-01-22', 36, '2026-01-22 10:09:54', '2026-01-22 10:09:54'),
(897878, 'jjhkhj', 'ER', 'Howrah-COO', 'Howrah-COO', '2026-01-22', '2026-01-22', 37, '2026-01-22 10:13:45', '2026-01-22 10:13:45'),
(676576, 'hgnb', 'CR', 'Nagpur', 'Nagpur', '2026-01-22', '2026-01-22', 38, '2026-01-22 10:19:00', '2026-01-22 10:19:00'),
(56545, 'fggf', 'CR', 'Mumbai', 'Mumbai', '2026-01-22', '2026-01-22', 39, '2026-01-22 10:37:42', '2026-01-22 11:48:21'),
(57767, 'njkgjhf', 'ER', 'Howrah-COO', 'Howrah-COO', '2026-01-22', '2026-01-22', 40, '2026-01-22 11:59:11', '2026-01-22 12:01:02'),
(3444345, 'fredfr', 'ER', 'Howrah-COO', 'Howrah-COO', '2026-01-22', '2026-01-22', 41, '2026-01-22 12:23:01', '2026-01-22 12:23:01'),
(34545454, 'fddd', 'ER', 'Howrah-COO', 'Howrah-COO', '2026-01-22', '2026-01-22', 42, '2026-01-22 12:24:26', '2026-01-22 12:46:28');

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

--
-- Dumping data for table `tower`
--

INSERT INTO `tower` (`id`, `station_id`, `S_no`, `observation_text`, `requirement_text`, `remarks`, `image_path`, `observation_status`, `created_at`, `updated_at`) VALUES
(1, 545656, '2.1', 'Dimensions of building (LxWxH)', 'Building shall be constructed as per approved Building Diagram', '', NULL, 'Yes', '2026-01-21 04:56:50', '2026-01-21 04:56:50'),
(2, 545656, '2.2', 'Construction Quality', 'Walls and steps shall be free from cracks.', '', NULL, 'Select', '2026-01-21 04:56:50', '2026-01-21 04:56:50'),
(3, 545656, '2.3', 'Floor Quality', '1) Floor surface shall be levelled properly.\n2) Tiles shall be laid after completion of concrete flooring.', '', NULL, 'Select', '2026-01-21 04:56:50', '2026-01-21 04:56:50'),
(4, 545656, '2.4', 'Door Arrangement', 'Doors and Door locks shall be provided as per tender requirement', '', NULL, 'Select', '2026-01-21 04:56:50', '2026-01-21 04:56:50'),
(5, 545656, '2.5', 'Ventilation', 'Adequate ventilation / exhaust fan provided as per tender.', '', NULL, 'Select', '2026-01-21 04:56:50', '2026-01-21 04:56:50'),
(6, 545656, '2.6', 'Fire safety', 'Fire extinguisher provided', '', NULL, 'Select', '2026-01-21 04:56:50', '2026-01-21 04:56:50'),
(7, 545656, '2.7', 'Cable entry sealing', 'All wall/floor cable entries sealed with fire-retardant compound', '', NULL, 'Select', '2026-01-21 04:56:50', '2026-01-21 04:56:50'),
(8, 43554, '2.1', 'Dimensions of building (LxWxH)', 'Building shall be constructed as per approved Building Diagram', 'fdgf', NULL, 'Yes', '2026-01-21 05:49:11', '2026-01-21 05:49:11'),
(9, 43554, '2.2', 'Construction Quality', 'Walls and steps shall be free from cracks.', 'fgggggggffg', NULL, 'Yes', '2026-01-21 05:49:11', '2026-01-21 05:49:11'),
(10, 43554, '2.3', 'Floor Quality', '1) Floor surface shall be levelled properly.\n2) Tiles shall be laid after completion of concrete flooring.', '', NULL, 'Select', '2026-01-21 05:49:11', '2026-01-21 05:49:11'),
(11, 43554, '2.4', 'Door Arrangement', 'Doors and Door locks shall be provided as per tender requirement', '', NULL, 'Select', '2026-01-21 05:49:11', '2026-01-21 05:49:11'),
(12, 43554, '2.5', 'Ventilation', 'Adequate ventilation / exhaust fan provided as per tender.', '', NULL, 'Select', '2026-01-21 05:49:11', '2026-01-21 05:49:11'),
(13, 43554, '2.6', 'Fire safety', 'Fire extinguisher provided', '', NULL, 'Select', '2026-01-21 05:49:11', '2026-01-21 05:49:11'),
(14, 43554, '2.7', 'Cable entry sealing', 'All wall/floor cable entries sealed with fire-retardant compound', '', NULL, 'Select', '2026-01-21 05:49:11', '2026-01-21 05:49:11'),
(15, 536565, '2.1', 'Dimensions of building (LxWxH)', 'Building shall be constructed as per approved Building Diagram', 'hfgg', NULL, 'No', '2026-01-21 06:03:03', '2026-01-21 06:11:24'),
(16, 536565, '2.2', 'Construction Quality', 'Walls and steps shall be free from cracks.', 'ghhhhhhhhhhhhhhh', NULL, 'Yes', '2026-01-21 06:03:03', '2026-01-21 06:11:24'),
(17, 536565, '2.3', 'Floor Quality', '1) Floor surface shall be levelled properly.\n2) Tiles shall be laid after completion of concrete flooring.', '', NULL, 'Yes', '2026-01-21 06:03:03', '2026-01-21 06:11:24'),
(18, 536565, '2.4', 'Door Arrangement', 'Doors and Door locks shall be provided as per tender requirement', '', NULL, 'Select', '2026-01-21 06:03:03', '2026-01-21 06:11:24'),
(19, 536565, '2.5', 'Ventilation', 'Adequate ventilation / exhaust fan provided as per tender.', '', NULL, 'Select', '2026-01-21 06:03:03', '2026-01-21 06:11:24'),
(20, 536565, '2.6', 'Fire safety', 'Fire extinguisher provided', '', NULL, 'Select', '2026-01-21 06:03:03', '2026-01-21 06:11:24'),
(21, 536565, '2.7', 'Cable entry sealing', 'All wall/floor cable entries sealed with fire-retardant compound', '', NULL, 'Select', '2026-01-21 06:03:03', '2026-01-21 06:11:24'),
(22, 5665, '2.1', 'Dimensions of building (LxWxH)', 'Building shall be constructed as per approved Building Diagram', '', NULL, 'Yes', '2026-01-21 06:40:37', '2026-01-21 06:40:49'),
(23, 5665, '2.2', 'Construction Quality', 'Walls and steps shall be free from cracks.', '', NULL, 'Yes', '2026-01-21 06:40:37', '2026-01-21 06:40:49'),
(24, 5665, '2.3', 'Floor Quality', '1) Floor surface shall be levelled properly.\n2) Tiles shall be laid after completion of concrete flooring.', '', NULL, 'Yes', '2026-01-21 06:40:37', '2026-01-21 06:40:49'),
(25, 5665, '2.4', 'Door Arrangement', 'Doors and Door locks shall be provided as per tender requirement', '', NULL, 'Select', '2026-01-21 06:40:37', '2026-01-21 06:40:49'),
(26, 5665, '2.5', 'Ventilation', 'Adequate ventilation / exhaust fan provided as per tender.', '', NULL, 'Select', '2026-01-21 06:40:37', '2026-01-21 06:40:49'),
(27, 5665, '2.6', 'Fire safety', 'Fire extinguisher provided', '', NULL, 'Select', '2026-01-21 06:40:37', '2026-01-21 06:40:49'),
(28, 5665, '2.7', 'Cable entry sealing', 'All wall/floor cable entries sealed with fire-retardant compound', '', NULL, 'Select', '2026-01-21 06:40:37', '2026-01-21 06:40:49'),
(29, 43554666, '2.1', 'Dimensions of building (LxWxH)', 'Building shall be constructed as per approved Building Diagram', '', NULL, 'Yes', '2026-01-22 04:29:28', '2026-01-22 04:29:28'),
(30, 43554666, '2.2', 'Construction Quality', 'Walls and steps shall be free from cracks.', '', NULL, 'Yes', '2026-01-22 04:29:28', '2026-01-22 04:29:28'),
(31, 43554666, '2.3', 'Floor Quality', '1) Floor surface shall be levelled properly.\n2) Tiles shall be laid after completion of concrete flooring.', '', NULL, 'Select', '2026-01-22 04:29:28', '2026-01-22 04:29:28'),
(32, 43554666, '2.4', 'Door Arrangement', 'Doors and Door locks shall be provided as per tender requirement', '', NULL, 'Select', '2026-01-22 04:29:28', '2026-01-22 04:29:28'),
(33, 43554666, '2.5', 'Ventilation', 'Adequate ventilation / exhaust fan provided as per tender.', '', NULL, 'Select', '2026-01-22 04:29:28', '2026-01-22 04:29:28'),
(34, 43554666, '2.6', 'Fire safety', 'Fire extinguisher provided', '', NULL, 'Select', '2026-01-22 04:29:28', '2026-01-22 04:29:28'),
(35, 43554666, '2.7', 'Cable entry sealing', 'All wall/floor cable entries sealed with fire-retardant compound', '', NULL, 'Select', '2026-01-22 04:29:28', '2026-01-22 04:29:28'),
(36, 45544, '2.1', 'Dimensions of building (LxWxH)', 'Building shall be constructed as per approved Building Diagram', 'hggn', NULL, '', '2026-01-22 04:35:46', '2026-01-22 04:38:53'),
(37, 45544, '2.2', 'Construction Quality', 'Walls and steps shall be free from cracks.', 'nhvnhb', NULL, '', '2026-01-22 04:35:46', '2026-01-22 04:38:53'),
(38, 45544, '2.3', 'Floor Quality', '1) Floor surface shall be levelled properly.\n      2) Tiles shall be laid after completion of concrete flooring.', '', NULL, '', '2026-01-22 04:35:46', '2026-01-22 04:38:53'),
(39, 45544, '2.4', 'Door Arrangement', 'Doors and Door locks shall be provided as per tender requirement', '', NULL, 'Matching', '2026-01-22 04:35:46', '2026-01-22 04:38:53'),
(40, 45544, '2.5', 'Ventilation', 'Adequate ventilation / exhaust fan provided as per tender.', '', NULL, 'Matching', '2026-01-22 04:35:46', '2026-01-22 04:38:53'),
(41, 45544, '2.6', 'Fire safety', 'Fire extinguisher provided', 'l;l;', NULL, 'Matching', '2026-01-22 04:35:46', '2026-01-22 04:38:53'),
(42, 45544, '2.7', 'Cable entry sealing', 'All wall/floor cable entries sealed with fire-retardant compound', '', NULL, 'Matching', '2026-01-22 04:35:46', '2026-01-22 04:38:53'),
(43, 78879, '2.1', 'Dimensions of building (LxWxH)', 'Building shall be constructed as per approved Building Diagram', '', NULL, 'Yes', '2026-01-22 04:40:01', '2026-01-22 04:40:13'),
(44, 78879, '2.2', 'Construction Quality', 'Walls and steps shall be free from cracks.', '', NULL, 'Yes', '2026-01-22 04:40:01', '2026-01-22 04:40:13'),
(45, 78879, '2.3', 'Floor Quality', '1) Floor surface shall be levelled properly.\n      2) Tiles shall be laid after completion of concrete flooring.', '', NULL, 'Yes', '2026-01-22 04:40:01', '2026-01-22 04:40:13'),
(46, 78879, '2.4', 'Door Arrangement', 'Doors and Door locks shall be provided as per tender requirement', '', NULL, 'Yes', '2026-01-22 04:40:01', '2026-01-22 04:40:13'),
(47, 78879, '2.5', 'Ventilation', 'Adequate ventilation / exhaust fan provided as per tender.', '', NULL, 'Yes', '2026-01-22 04:40:01', '2026-01-22 04:40:13'),
(48, 78879, '2.6', 'Fire safety', 'Fire extinguisher provided', '', NULL, 'Yes', '2026-01-22 04:40:01', '2026-01-22 04:40:13'),
(49, 78879, '2.7', 'Cable entry sealing', 'All wall/floor cable entries sealed with fire-retardant compound', '', NULL, 'Yes', '2026-01-22 04:40:01', '2026-01-22 04:40:13'),
(50, 56545, '2.1', 'Dimensions of building (LxWxH)', 'Building shall be constructed as per approved Building Diagram', '', NULL, 'Yes', '2026-01-22 05:07:47', '2026-01-22 05:19:52'),
(51, 56545, '2.2', 'Construction Quality', 'Walls and steps shall be free from cracks.', '', NULL, 'Yes', '2026-01-22 05:07:47', '2026-01-22 05:19:52'),
(52, 56545, '2.3', 'Floor Quality', '1) Floor surface shall be levelled properly.\n      2) Tiles shall be laid after completion of concrete flooring.', 'FFF', NULL, 'Select', '2026-01-22 05:07:47', '2026-01-22 05:19:52'),
(53, 56545, '2.4', 'Door Arrangement', 'Doors and Door locks shall be provided as per tender requirement', 'GFGFGF', NULL, 'Select', '2026-01-22 05:07:47', '2026-01-22 05:19:52'),
(54, 56545, '2.5', 'Ventilation', 'Adequate ventilation / exhaust fan provided as per tender.', '', NULL, 'Select', '2026-01-22 05:07:47', '2026-01-22 05:19:52'),
(55, 56545, '2.6', 'Fire safety', 'Fire extinguisher provided', '', NULL, 'Select', '2026-01-22 05:07:47', '2026-01-22 05:19:52'),
(56, 56545, '2.7', 'Cable entry sealing', 'All wall/floor cable entries sealed with fire-retardant compound', '', NULL, 'Select', '2026-01-22 05:07:47', '2026-01-22 05:19:52'),
(57, 34545454, '2.1', 'Dimensions of building (LxWxH)', 'Building shall be constructed as per approved Building Diagram', '', NULL, 'Yes', '2026-01-22 06:56:04', '2026-01-22 06:56:04'),
(58, 34545454, '2.2', 'Construction Quality', 'Walls and steps shall be free from cracks.', '', NULL, 'Yes', '2026-01-22 06:56:04', '2026-01-22 06:56:04'),
(59, 34545454, '2.3', 'Floor Quality', '1) Floor surface shall be levelled properly.\n2) Tiles shall be laid after completion of concrete flooring.', '', NULL, 'Yes', '2026-01-22 06:56:04', '2026-01-22 06:56:04'),
(60, 34545454, '2.4', 'Door Arrangement', 'Doors and Door locks shall be provided as per tender requirement', '', NULL, 'Yes', '2026-01-22 06:56:04', '2026-01-22 06:56:04'),
(61, 34545454, '2.5', 'Ventilation', 'Adequate ventilation / exhaust fan provided as per tender.', '', NULL, 'Yes', '2026-01-22 06:56:04', '2026-01-22 06:56:04'),
(62, 34545454, '2.6', 'Fire safety', 'Fire extinguisher provided', '', NULL, 'Yes', '2026-01-22 06:56:04', '2026-01-22 06:56:04'),
(63, 34545454, '2.7', 'Cable entry sealing', 'All wall/floor cable entries sealed with fire-retardant compound', '', NULL, 'Yes', '2026-01-22 06:56:04', '2026-01-22 06:56:04');

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

--
-- Dumping data for table `verification_of_equipment_serial_numbers`
--

INSERT INTO `verification_of_equipment_serial_numbers` (`id`, `station_id`, `S_no`, `barcode_kavach_main_unit`, `observation_text`, `requirement_text`, `remarks`, `image_path`, `observation_status`, `created_at`, `updated_at`) VALUES
(1, 545656, '1.1', NULL, 'Stationary Kavach Unit', '', '', NULL, 'Select', '2026-01-21 04:56:33', '2026-01-21 04:56:33'),
(2, 545656, '1.2', NULL, 'Peripheral Processing Card 1', '', '', NULL, 'Matching', '2026-01-21 04:56:33', '2026-01-21 04:56:33'),
(3, 545656, '1.3', NULL, 'Peripheral Processing Card 2', '', '', NULL, 'Select', '2026-01-21 04:56:33', '2026-01-21 04:56:33'),
(4, 545656, '1.4', NULL, 'Vital Computer Card -1', '', '', NULL, 'Select', '2026-01-21 04:56:33', '2026-01-21 04:56:33'),
(5, 545656, '1.5', NULL, 'Vital Computer Card -2', '', '', NULL, 'Select', '2026-01-21 04:56:33', '2026-01-21 04:56:33'),
(6, 545656, '1.6', NULL, 'Vital Computer Card -3', '', '', NULL, 'Select', '2026-01-21 04:56:33', '2026-01-21 04:56:33'),
(7, 545656, '1.7', NULL, 'Voter Card -1', '', '', NULL, 'Select', '2026-01-21 04:56:33', '2026-01-21 04:56:33'),
(8, 545656, '1.8', NULL, 'Voter Card -2', '', '', NULL, 'Select', '2026-01-21 04:56:33', '2026-01-21 04:56:33'),
(9, 545656, '1.9', NULL, 'Vital Gateway Card 1', '', '', NULL, 'Select', '2026-01-21 04:56:33', '2026-01-21 04:56:33'),
(10, 545656, '1.10', NULL, 'Vital Gateway Card 2', '', '', NULL, 'Select', '2026-01-21 04:56:33', '2026-01-21 04:56:33'),
(11, 545656, '1.11', NULL, 'Vital Gateway Card 3 (NMS)', '', '', NULL, 'Select', '2026-01-21 04:56:33', '2026-01-21 04:56:33'),
(12, 545656, '1.12', NULL, 'Field Scanner Card 1', '', '', NULL, 'Select', '2026-01-21 04:56:33', '2026-01-21 04:56:33'),
(13, 545656, '1.13', NULL, 'Field Scanner Card 2', '', '', NULL, 'Select', '2026-01-21 04:56:33', '2026-01-21 04:56:33'),
(14, 545656, '1.14', NULL, 'Field Scanner Card 3', '', '', NULL, 'Select', '2026-01-21 04:56:33', '2026-01-21 04:56:33'),
(15, 545656, '1.15', NULL, 'Field Scanner Card 4', '', '', NULL, 'Select', '2026-01-21 04:56:33', '2026-01-21 04:56:33'),
(16, 545656, '1.16', NULL, 'Station Radio Power Supply card-1', '', '', NULL, 'Select', '2026-01-21 04:56:33', '2026-01-21 04:56:33'),
(17, 545656, '1.17', NULL, 'Next Gen/. Cal Amp Radio Modem', '', '', NULL, 'Select', '2026-01-21 04:56:33', '2026-01-21 04:56:33'),
(18, 545656, '1.18', NULL, 'GPS &amp;amp; GSM Antenna-1', '', '', NULL, 'Select', '2026-01-21 04:56:33', '2026-01-21 04:56:33'),
(19, 545656, '1.19', NULL, 'Field Scanner Card 6', '', '', NULL, 'Select', '2026-01-21 04:56:33', '2026-01-21 04:56:33'),
(20, 545656, '1.20', NULL, 'SMOCIP Unit', '', '', NULL, 'Select', '2026-01-21 04:56:33', '2026-01-21 04:56:33'),
(21, 545656, '1.21', NULL, 'SMOCIP Termination Box', '', '', NULL, 'Select', '2026-01-21 04:56:33', '2026-01-21 04:56:33'),
(22, 545656, '1.22', NULL, 'PDU Box', '', '', NULL, 'Select', '2026-01-21 04:56:33', '2026-01-21 04:56:33'),
(23, 545656, '1.23', NULL, 'RTU 1', '', '', NULL, 'Select', '2026-01-21 04:56:33', '2026-01-21 04:56:33'),
(24, 545656, '1.24', NULL, 'RTU-2', '', '', NULL, 'Select', '2026-01-21 04:56:33', '2026-01-21 04:56:33'),
(25, 545656, '1.25', NULL, 'DC-DC Converter', '', '', NULL, 'Select', '2026-01-21 04:56:33', '2026-01-21 04:56:33'),
(26, 43554, '1.1', '43455454', 'Stationary Kavach Unit 43455454', '', 'fdv c', NULL, 'Matching', '2026-01-21 05:48:30', '2026-01-21 05:48:30'),
(27, 43554, '1.2', '455555555555553', 'Peripheral Processing Card 1 455555555555553', '', 'vcvcvcv', NULL, 'Matching', '2026-01-21 05:48:30', '2026-01-21 05:48:30'),
(28, 43554, '1.3', '', 'Peripheral Processing Card 2', '', '', NULL, 'Matching', '2026-01-21 05:48:30', '2026-01-21 05:48:30'),
(29, 43554, '1.4', '', 'Vital Computer Card -1', '', '', NULL, 'Select', '2026-01-21 05:48:30', '2026-01-21 05:48:30'),
(30, 43554, '1.5', '', 'Vital Computer Card -2', '', '', NULL, 'Select', '2026-01-21 05:48:30', '2026-01-21 05:48:30'),
(31, 43554, '1.6', '', 'Vital Computer Card -3', '', '', NULL, 'Select', '2026-01-21 05:48:30', '2026-01-21 05:48:30'),
(32, 43554, '1.7', '', 'Voter Card -1', '', '', NULL, 'Select', '2026-01-21 05:48:30', '2026-01-21 05:48:30'),
(33, 43554, '1.8', '', 'Voter Card -2', '', '', NULL, 'Select', '2026-01-21 05:48:30', '2026-01-21 05:48:30'),
(34, 43554, '1.9', '', 'Vital Gateway Card 1', '', '', NULL, 'Select', '2026-01-21 05:48:30', '2026-01-21 05:48:30'),
(35, 43554, '1.10', '', 'Vital Gateway Card 2', '', '', NULL, 'Select', '2026-01-21 05:48:30', '2026-01-21 05:48:30'),
(36, 43554, '1.11', '', 'Vital Gateway Card 3 (NMS)', '', '', NULL, 'Select', '2026-01-21 05:48:30', '2026-01-21 05:48:30'),
(37, 43554, '1.12', '', 'Field Scanner Card 1', '', '', NULL, 'Select', '2026-01-21 05:48:30', '2026-01-21 05:48:30'),
(38, 43554, '1.13', '', 'Field Scanner Card 2', '', '', NULL, 'Select', '2026-01-21 05:48:30', '2026-01-21 05:48:30'),
(39, 43554, '1.14', '', 'Field Scanner Card 3', '', '', NULL, 'Select', '2026-01-21 05:48:30', '2026-01-21 05:48:30'),
(40, 43554, '1.15', '', 'Field Scanner Card 4', '', '', NULL, 'Select', '2026-01-21 05:48:30', '2026-01-21 05:48:30'),
(41, 43554, '1.16', '', 'Station Radio Power Supply card-1', '', '', NULL, 'Select', '2026-01-21 05:48:30', '2026-01-21 05:48:30'),
(42, 43554, '1.17', '', 'Next Gen/. Cal Amp Radio Modem', '', '', NULL, 'Select', '2026-01-21 05:48:30', '2026-01-21 05:48:30'),
(43, 43554, '1.18', '', 'GPS &amp;amp; GSM Antenna-1', '', '', NULL, 'Select', '2026-01-21 05:48:30', '2026-01-21 05:48:30'),
(44, 43554, '1.19', '', 'Field Scanner Card 6', '', '', NULL, 'Select', '2026-01-21 05:48:30', '2026-01-21 05:48:30'),
(45, 43554, '1.20', '', 'SMOCIP Unit', '', '', NULL, 'Select', '2026-01-21 05:48:30', '2026-01-21 05:48:30'),
(46, 43554, '1.21', '', 'SMOCIP Termination Box', '', '', NULL, 'Select', '2026-01-21 05:48:30', '2026-01-21 05:48:30'),
(47, 43554, '1.22', '', 'PDU Box', '', '', NULL, 'Select', '2026-01-21 05:48:30', '2026-01-21 05:48:30'),
(48, 43554, '1.23', '', 'RTU 1', '', '', NULL, 'Select', '2026-01-21 05:48:30', '2026-01-21 05:48:30'),
(49, 43554, '1.24', '', 'RTU-2', '', '', NULL, 'Select', '2026-01-21 05:48:30', '2026-01-21 05:48:30'),
(50, 43554, '1.25', '', 'DC-DC Converter', '', '', NULL, 'Select', '2026-01-21 05:48:30', '2026-01-21 05:48:30'),
(51, 536565, '1.1', '', 'Stationary Kavach Unit 43455454', '', 'hhhfgggh', NULL, 'Select', '2026-01-21 06:01:36', '2026-01-21 06:02:33'),
(52, 536565, '1.2', '', 'Peripheral Processing Card 1 455555555555553', '', 'ghghhhghghg', NULL, 'Matching', '2026-01-21 06:01:36', '2026-01-21 06:02:33'),
(53, 536565, '1.3', '', 'Peripheral Processing Card 2', '', '', NULL, 'Matching', '2026-01-21 06:01:37', '2026-01-21 06:02:33'),
(54, 536565, '1.4', '', 'Vital Computer Card -1', '', '', NULL, 'Matching', '2026-01-21 06:01:37', '2026-01-21 06:02:33'),
(55, 536565, '1.5', '', 'Vital Computer Card -2', '', '', NULL, 'Select', '2026-01-21 06:01:37', '2026-01-21 06:02:33'),
(56, 536565, '1.6', '', 'Vital Computer Card -3', '', '', NULL, 'Select', '2026-01-21 06:01:37', '2026-01-21 06:02:33'),
(57, 536565, '1.7', '', 'Voter Card -1', '', '', NULL, 'Select', '2026-01-21 06:01:37', '2026-01-21 06:02:33'),
(58, 536565, '1.8', '', 'Voter Card -2', '', '', NULL, 'Select', '2026-01-21 06:01:37', '2026-01-21 06:02:33'),
(59, 536565, '1.9', '', 'Vital Gateway Card 1', '', '', NULL, 'Select', '2026-01-21 06:01:37', '2026-01-21 06:02:33'),
(60, 536565, '1.10', '', 'Vital Gateway Card 2', '', '', NULL, 'Select', '2026-01-21 06:01:37', '2026-01-21 06:02:33'),
(61, 536565, '1.11', '', 'Vital Gateway Card 3 (NMS)', '', '', NULL, 'Select', '2026-01-21 06:01:37', '2026-01-21 06:02:33'),
(62, 536565, '1.12', '', 'Field Scanner Card 1', '', '', NULL, 'Select', '2026-01-21 06:01:37', '2026-01-21 06:02:33'),
(63, 536565, '1.13', '', 'Field Scanner Card 2', '', '', NULL, 'Select', '2026-01-21 06:01:37', '2026-01-21 06:02:33'),
(64, 536565, '1.14', '', 'Field Scanner Card 3', '', '', NULL, 'Select', '2026-01-21 06:01:37', '2026-01-21 06:02:33'),
(65, 536565, '1.15', '', 'Field Scanner Card 4', '', '', NULL, 'Select', '2026-01-21 06:01:37', '2026-01-21 06:02:33'),
(66, 536565, '1.16', '', 'Station Radio Power Supply card-1', '', '', NULL, 'Select', '2026-01-21 06:01:37', '2026-01-21 06:02:33'),
(67, 536565, '1.17', '', 'Next Gen/. Cal Amp Radio Modem', '', '', NULL, 'Select', '2026-01-21 06:01:37', '2026-01-21 06:02:33'),
(68, 536565, '1.18', '', 'GPS & GSM Antenna-1', '', '', NULL, 'Select', '2026-01-21 06:01:37', '2026-01-21 06:02:33'),
(69, 536565, '1.19', '', 'Field Scanner Card 6', '', '', NULL, 'Select', '2026-01-21 06:01:37', '2026-01-21 06:02:33'),
(70, 536565, '1.20', '', 'SMOCIP Unit', '', '', NULL, 'Select', '2026-01-21 06:01:37', '2026-01-21 06:02:33'),
(71, 536565, '1.21', '', 'SMOCIP Termination Box', '', '', NULL, 'Select', '2026-01-21 06:01:37', '2026-01-21 06:02:33'),
(72, 536565, '1.22', '', 'PDU Box', '', '', NULL, 'Select', '2026-01-21 06:01:37', '2026-01-21 06:02:33'),
(73, 536565, '1.23', '', 'RTU 1', '', '', NULL, 'Select', '2026-01-21 06:01:37', '2026-01-21 06:02:33'),
(74, 536565, '1.24', '', 'RTU-2', '', '', NULL, 'Select', '2026-01-21 06:01:37', '2026-01-21 06:02:33'),
(75, 536565, '1.25', '', 'DC-DC Converter', '', '', NULL, 'Select', '2026-01-21 06:01:37', '2026-01-21 06:02:33'),
(76, 5665, '1.1', '', 'Stationary Kavach Unit', '', '', NULL, 'Matching', '2026-01-21 06:40:24', '2026-01-21 06:40:24'),
(77, 5665, '1.2', '', 'Peripheral Processing Card 1', '', '', NULL, 'Select', '2026-01-21 06:40:24', '2026-01-21 06:40:24'),
(78, 5665, '1.3', '', 'Peripheral Processing Card 2', '', '', NULL, 'Select', '2026-01-21 06:40:24', '2026-01-21 06:40:24'),
(79, 5665, '1.4', '', 'Vital Computer Card -1', '', '', NULL, 'Select', '2026-01-21 06:40:24', '2026-01-21 06:40:24'),
(80, 5665, '1.5', '', 'Vital Computer Card -2', '', '', NULL, 'Select', '2026-01-21 06:40:24', '2026-01-21 06:40:24'),
(81, 5665, '1.6', '', 'Vital Computer Card -3', '', '', NULL, 'Select', '2026-01-21 06:40:24', '2026-01-21 06:40:24'),
(82, 5665, '1.7', '', 'Voter Card -1', '', '', NULL, 'Select', '2026-01-21 06:40:24', '2026-01-21 06:40:24'),
(83, 5665, '1.8', '', 'Voter Card -2', '', '', NULL, 'Select', '2026-01-21 06:40:24', '2026-01-21 06:40:24'),
(84, 5665, '1.9', '', 'Vital Gateway Card 1', '', '', NULL, 'Select', '2026-01-21 06:40:24', '2026-01-21 06:40:24'),
(85, 5665, '1.10', '', 'Vital Gateway Card 2', '', '', NULL, 'Select', '2026-01-21 06:40:24', '2026-01-21 06:40:24'),
(86, 5665, '1.11', '', 'Vital Gateway Card 3 (NMS)', '', '', NULL, 'Select', '2026-01-21 06:40:24', '2026-01-21 06:40:24'),
(87, 5665, '1.12', '', 'Field Scanner Card 1', '', '', NULL, 'Select', '2026-01-21 06:40:24', '2026-01-21 06:40:24'),
(88, 5665, '1.13', '', 'Field Scanner Card 2', '', '', NULL, 'Select', '2026-01-21 06:40:24', '2026-01-21 06:40:24'),
(89, 5665, '1.14', '', 'Field Scanner Card 3', '', '', NULL, 'Select', '2026-01-21 06:40:24', '2026-01-21 06:40:24'),
(90, 5665, '1.15', '', 'Field Scanner Card 4', '', '', NULL, 'Select', '2026-01-21 06:40:24', '2026-01-21 06:40:24'),
(91, 5665, '1.16', '', 'Station Radio Power Supply card-1', '', '', NULL, 'Select', '2026-01-21 06:40:24', '2026-01-21 06:40:24'),
(92, 5665, '1.17', '', 'Next Gen/. Cal Amp Radio Modem', '', '', NULL, 'Select', '2026-01-21 06:40:24', '2026-01-21 06:40:24'),
(93, 5665, '1.18', '', 'GPS &amp;amp; GSM Antenna-1', '', '', NULL, 'Select', '2026-01-21 06:40:24', '2026-01-21 06:40:24'),
(94, 5665, '1.19', '', 'Field Scanner Card 6', '', '', NULL, 'Select', '2026-01-21 06:40:24', '2026-01-21 06:40:24'),
(95, 5665, '1.20', '', 'SMOCIP Unit', '', '', NULL, 'Select', '2026-01-21 06:40:24', '2026-01-21 06:40:24'),
(96, 5665, '1.21', '', 'SMOCIP Termination Box', '', '', NULL, 'Select', '2026-01-21 06:40:24', '2026-01-21 06:40:24'),
(97, 5665, '1.22', '', 'PDU Box', '', '', NULL, 'Select', '2026-01-21 06:40:24', '2026-01-21 06:40:24'),
(98, 5665, '1.23', '', 'RTU 1', '', '', NULL, 'Select', '2026-01-21 06:40:24', '2026-01-21 06:40:24'),
(99, 5665, '1.24', '', 'RTU-2', '', '', NULL, 'Select', '2026-01-21 06:40:24', '2026-01-21 06:40:24'),
(100, 5665, '1.25', '', 'DC-DC Converter', '', '', NULL, 'Select', '2026-01-21 06:40:24', '2026-01-21 06:40:24'),
(101, 6575876, '1.1', '', 'Stationary Kavach Unit', '', '', NULL, 'Select', '2026-01-21 09:28:29', '2026-01-21 09:31:04'),
(102, 6575876, '1.2', '', 'Peripheral Processing Card 1', '', '', NULL, 'Select', '2026-01-21 09:28:29', '2026-01-21 09:31:04'),
(103, 6575876, '1.3', '', 'Peripheral Processing Card 2', '', '', NULL, 'Select', '2026-01-21 09:28:29', '2026-01-21 09:31:04'),
(104, 6575876, '1.4', '', 'Vital Computer Card -1', '', '', NULL, 'Select', '2026-01-21 09:28:29', '2026-01-21 09:31:04'),
(105, 6575876, '1.5', '', 'Vital Computer Card -2', '', '', NULL, 'Select', '2026-01-21 09:28:29', '2026-01-21 09:31:04'),
(106, 6575876, '1.6', '', 'Vital Computer Card -3', '', '', NULL, 'Select', '2026-01-21 09:28:29', '2026-01-21 09:31:04'),
(107, 6575876, '1.7', '', 'Voter Card -1', '', '', NULL, 'Select', '2026-01-21 09:28:29', '2026-01-21 09:31:04'),
(108, 6575876, '1.8', '', 'Voter Card -2', '', '', NULL, 'Select', '2026-01-21 09:28:29', '2026-01-21 09:31:04'),
(109, 6575876, '1.9', '', 'Vital Gateway Card 1', '', '', NULL, 'Select', '2026-01-21 09:28:29', '2026-01-21 09:31:04'),
(110, 6575876, '1.10', '', 'Vital Gateway Card 2', '', '', NULL, 'Select', '2026-01-21 09:28:29', '2026-01-21 09:31:04'),
(111, 6575876, '1.11', '', 'Vital Gateway Card 3 (NMS)', '', '', NULL, 'Select', '2026-01-21 09:28:29', '2026-01-21 09:31:04'),
(112, 6575876, '1.12', '', 'Field Scanner Card 1', '', '', NULL, 'Select', '2026-01-21 09:28:29', '2026-01-21 09:31:04'),
(113, 6575876, '1.13', '', 'Field Scanner Card 2', '', '', NULL, 'Select', '2026-01-21 09:28:29', '2026-01-21 09:31:04'),
(114, 6575876, '1.14', '', 'Field Scanner Card 3', '', '', NULL, 'Select', '2026-01-21 09:28:29', '2026-01-21 09:31:04'),
(115, 6575876, '1.15', '', 'Field Scanner Card 4', '', '', NULL, 'Select', '2026-01-21 09:28:29', '2026-01-21 09:31:04'),
(116, 6575876, '1.16', '', 'Station Radio Power Supply card-1', '', '', NULL, 'Select', '2026-01-21 09:28:29', '2026-01-21 09:31:04'),
(117, 6575876, '1.17', '', 'Next Gen/. Cal Amp Radio Modem', '', '', NULL, 'Select', '2026-01-21 09:28:29', '2026-01-21 09:31:04'),
(118, 6575876, '1.18', '', 'GPS & GSM Antenna-1', '', '', NULL, 'Select', '2026-01-21 09:28:29', '2026-01-21 09:31:04'),
(119, 6575876, '1.19', '', 'Field Scanner Card 6', '', '', NULL, 'Select', '2026-01-21 09:28:29', '2026-01-21 09:31:04'),
(120, 6575876, '1.20', '', 'SMOCIP Unit', '', '', NULL, 'Select', '2026-01-21 09:28:29', '2026-01-21 09:31:04'),
(121, 6575876, '1.21', '', 'SMOCIP Termination Box', '', '', NULL, 'Select', '2026-01-21 09:28:29', '2026-01-21 09:31:04'),
(122, 6575876, '1.22', '', 'PDU Box', '', '', NULL, 'Select', '2026-01-21 09:28:29', '2026-01-21 09:31:04'),
(123, 6575876, '1.23', '', 'RTU 1', '', '', NULL, 'Select', '2026-01-21 09:28:29', '2026-01-21 09:31:04'),
(124, 6575876, '1.24', '', 'RTU-2', '', 'cx', NULL, 'Matching', '2026-01-21 09:28:29', '2026-01-21 09:31:04'),
(125, 6575876, '1.25', '', 'DC-DC Converter', '', 'sdzfds', NULL, 'Matching', '2026-01-21 09:28:29', '2026-01-21 09:31:04'),
(128, 7785, '1.1', '', 'Stationary Kavach Unit', '', '', NULL, 'Select', '2026-01-21 10:24:35', '2026-01-21 10:24:35'),
(129, 7785, '1.2', '', 'Peripheral Processing Card 1', '', '', NULL, 'Select', '2026-01-21 10:24:35', '2026-01-21 10:24:35'),
(130, 7785, '1.3', '', 'Peripheral Processing Card 2', '', '', NULL, 'Select', '2026-01-21 10:24:35', '2026-01-21 10:24:35'),
(131, 7785, '1.4', '', 'Vital Computer Card -1', '', '', NULL, 'Select', '2026-01-21 10:24:35', '2026-01-21 10:24:35'),
(132, 7785, '1.5', '', 'Vital Computer Card -2', '', '', NULL, 'Select', '2026-01-21 10:24:35', '2026-01-21 10:24:35'),
(133, 7785, '1.6', '', 'Vital Computer Card -3', '', '', NULL, 'Select', '2026-01-21 10:24:35', '2026-01-21 10:24:35'),
(134, 7785, '1.7', '', 'Voter Card -1', '', '', NULL, 'Select', '2026-01-21 10:24:35', '2026-01-21 10:24:35'),
(135, 7785, '1.8', '', 'Voter Card -2', '', '', NULL, 'Select', '2026-01-21 10:24:35', '2026-01-21 10:24:35'),
(136, 7785, '1.9', '', 'Vital Gateway Card 1', '', '', NULL, 'Select', '2026-01-21 10:24:35', '2026-01-21 10:24:35'),
(137, 7785, '1.10', '', 'Vital Gateway Card 2', '', '', NULL, 'Select', '2026-01-21 10:24:35', '2026-01-21 10:24:35'),
(138, 7785, '1.11', '', 'Vital Gateway Card 3 (NMS)', '', '', NULL, 'Select', '2026-01-21 10:24:35', '2026-01-21 10:24:35'),
(139, 7785, '1.12', '', 'Field Scanner Card 1', '', '', NULL, 'Select', '2026-01-21 10:24:35', '2026-01-21 10:24:35'),
(140, 7785, '1.13', '', 'Field Scanner Card 2', '', '', NULL, 'Select', '2026-01-21 10:24:35', '2026-01-21 10:24:35'),
(141, 7785, '1.14', '', 'Field Scanner Card 3', '', '', NULL, 'Select', '2026-01-21 10:24:35', '2026-01-21 10:24:35'),
(142, 7785, '1.15', '', 'Field Scanner Card 4', '', '', NULL, 'Select', '2026-01-21 10:24:35', '2026-01-21 10:24:35'),
(143, 7785, '1.16', '', 'Station Radio Power Supply card-1', '', '', NULL, 'Select', '2026-01-21 10:24:35', '2026-01-21 10:24:35'),
(144, 7785, '1.17', '', 'Next Gen/. Cal Amp Radio Modem', '', '', NULL, 'Select', '2026-01-21 10:24:35', '2026-01-21 10:24:35'),
(145, 7785, '1.18', '', 'GPS &amp;amp; GSM Antenna-1', '', '', NULL, 'Select', '2026-01-21 10:24:35', '2026-01-21 10:24:35'),
(146, 7785, '1.19', '', 'Field Scanner Card 6', '', '', NULL, 'Select', '2026-01-21 10:24:35', '2026-01-21 10:24:35'),
(147, 7785, '1.20', '', 'SMOCIP Unit', '', '', NULL, 'Select', '2026-01-21 10:24:35', '2026-01-21 10:24:35'),
(148, 7785, '1.21', '', 'SMOCIP Termination Box', '', '', NULL, 'Select', '2026-01-21 10:24:35', '2026-01-21 10:24:35'),
(149, 7785, '1.22', '', 'PDU Box', '', '', NULL, 'Select', '2026-01-21 10:24:35', '2026-01-21 10:24:35'),
(150, 7785, '1.23', '', 'RTU 1', '', '', NULL, 'Select', '2026-01-21 10:24:35', '2026-01-21 10:24:35'),
(151, 7785, '1.24', '', 'RTU-2', '', '', NULL, 'Select', '2026-01-21 10:24:35', '2026-01-21 10:24:35'),
(152, 7785, '1.25', '', 'DC-DC Converter', '', '', NULL, 'Select', '2026-01-21 10:24:35', '2026-01-21 10:24:35'),
(154, 43554666, '1.1', '', 'Stationary Kavach Unit', '', '', NULL, 'Select', '2026-01-21 11:03:05', '2026-01-21 11:43:37'),
(155, 43554666, '1.2', '', 'Peripheral Processing Card 1', '', '', NULL, 'Select', '2026-01-21 11:03:05', '2026-01-21 11:43:37'),
(156, 43554666, '1.3', '', 'Peripheral Processing Card 2', '', '', NULL, 'Select', '2026-01-21 11:03:05', '2026-01-21 11:43:37'),
(157, 43554666, '1.4', '', 'Vital Computer Card -1', '', '', NULL, 'Select', '2026-01-21 11:03:05', '2026-01-21 11:43:37'),
(158, 43554666, '1.5', '', 'Vital Computer Card -2', '', '', NULL, 'Select', '2026-01-21 11:03:05', '2026-01-21 11:43:37'),
(159, 43554666, '1.6', '', 'Vital Computer Card -3', '', '', NULL, 'Select', '2026-01-21 11:03:05', '2026-01-21 11:43:37'),
(160, 43554666, '1.7', '', 'Voter Card -1', '', '', NULL, 'Select', '2026-01-21 11:03:05', '2026-01-21 11:43:37'),
(161, 43554666, '1.8', '', 'Voter Card -2', '', '', NULL, 'Select', '2026-01-21 11:03:05', '2026-01-21 11:43:37'),
(162, 43554666, '1.9', '', 'Vital Gateway Card 1', '', '', NULL, 'Select', '2026-01-21 11:03:05', '2026-01-21 11:43:37'),
(163, 43554666, '1.10', '', 'Vital Gateway Card 2', '', '', NULL, 'Select', '2026-01-21 11:03:05', '2026-01-21 11:43:37'),
(164, 43554666, '1.11', '', 'Vital Gateway Card 3 (NMS)', '', '', NULL, 'Select', '2026-01-21 11:03:05', '2026-01-21 11:43:37'),
(165, 43554666, '1.12', '', 'Field Scanner Card 1', '', '', NULL, 'Select', '2026-01-21 11:03:05', '2026-01-21 11:43:37'),
(166, 43554666, '1.13', '', 'Field Scanner Card 2', '', '', NULL, 'Select', '2026-01-21 11:03:05', '2026-01-21 11:43:37'),
(167, 43554666, '1.14', '', 'Field Scanner Card 3', '', '', NULL, 'Select', '2026-01-21 11:03:05', '2026-01-21 11:43:37'),
(168, 43554666, '1.15', '', 'Field Scanner Card 4', '', '', NULL, 'Select', '2026-01-21 11:03:05', '2026-01-21 11:43:37'),
(169, 43554666, '1.16', '', 'Station Radio Power Supply card-1', '', '', NULL, 'Select', '2026-01-21 11:03:05', '2026-01-21 11:43:37'),
(170, 43554666, '1.17', '', 'Next Gen/. Cal Amp Radio Modem', '', '', NULL, 'Select', '2026-01-21 11:03:05', '2026-01-21 11:43:37'),
(171, 43554666, '1.18', '', 'GPS & GSM Antenna-1', '', '', NULL, 'Select', '2026-01-21 11:03:05', '2026-01-21 11:43:37'),
(172, 43554666, '1.19', '', 'Field Scanner Card 6', '', '', NULL, 'Select', '2026-01-21 11:03:05', '2026-01-21 11:43:37'),
(173, 43554666, '1.20', '', 'SMOCIP Unit', '', '', NULL, 'Select', '2026-01-21 11:03:05', '2026-01-21 11:43:37'),
(174, 43554666, '1.21', '', 'SMOCIP Termination Box', '', '', NULL, 'Select', '2026-01-21 11:03:05', '2026-01-21 11:43:37'),
(175, 43554666, '1.22', '', 'PDU Box', '', '', NULL, 'Select', '2026-01-21 11:03:05', '2026-01-21 11:43:37'),
(176, 43554666, '1.23', '', 'RTU 1', '', '', NULL, 'Select', '2026-01-21 11:03:05', '2026-01-21 11:43:37'),
(177, 43554666, '1.24', '', 'RTU-2', '', 'asa', NULL, 'Not Matching', '2026-01-21 11:03:05', '2026-01-21 11:43:37'),
(178, 43554666, '1.25', '', 'DC-DC Converter', '', 'xzxc', NULL, 'Matching', '2026-01-21 11:03:05', '2026-01-21 11:43:37'),
(180, 676576, '1.1', '', 'Stationary Kavach Unit', '', '', NULL, 'Matching', '2026-01-22 04:53:29', '2026-01-22 04:57:38'),
(181, 676576, '1.2', '', 'Peripheral Processing Card 1', '', 'jk', NULL, 'Matching', '2026-01-22 04:53:29', '2026-01-22 04:57:38'),
(182, 676576, '1.3', '', 'Peripheral Processing Card 2', '', '', NULL, 'Not Matching', '2026-01-22 04:53:29', '2026-01-22 04:57:38'),
(183, 676576, '1.4', '', 'Vital Computer Card -1', '', '', NULL, 'Select', '2026-01-22 04:53:29', '2026-01-22 04:57:38'),
(184, 676576, '1.5', '', 'Vital Computer Card -2', '', '', NULL, 'Select', '2026-01-22 04:53:29', '2026-01-22 04:57:38'),
(185, 676576, '1.6', '', 'Vital Computer Card -3', '', '', NULL, 'Select', '2026-01-22 04:53:29', '2026-01-22 04:57:38'),
(186, 676576, '1.7', '', 'Voter Card -1', '', '', NULL, 'Select', '2026-01-22 04:53:29', '2026-01-22 04:57:38'),
(187, 676576, '1.8', '', 'Voter Card -2', '', '', NULL, 'Select', '2026-01-22 04:53:29', '2026-01-22 04:57:38'),
(188, 676576, '1.9', '', 'Vital Gateway Card 1', '', '', NULL, 'Select', '2026-01-22 04:53:29', '2026-01-22 04:57:39'),
(189, 676576, '1.10', '', 'Vital Gateway Card 2', '', '', NULL, 'Select', '2026-01-22 04:53:29', '2026-01-22 04:57:39'),
(190, 676576, '1.11', '', 'Vital Gateway Card 3 (NMS)', '', '', NULL, 'Select', '2026-01-22 04:53:29', '2026-01-22 04:57:39'),
(191, 676576, '1.12', '', 'Field Scanner Card 1', '', '', NULL, 'Select', '2026-01-22 04:53:29', '2026-01-22 04:57:39'),
(192, 676576, '1.13', '', 'Field Scanner Card 2', '', '', NULL, 'Select', '2026-01-22 04:53:29', '2026-01-22 04:57:39'),
(193, 676576, '1.14', '', 'Field Scanner Card 3', '', '', NULL, 'Select', '2026-01-22 04:53:29', '2026-01-22 04:57:39'),
(194, 676576, '1.15', '', 'Field Scanner Card 4', '', '', NULL, 'Select', '2026-01-22 04:53:29', '2026-01-22 04:57:39'),
(195, 676576, '1.16', '', 'Station Radio Power Supply card-1', '', '', NULL, 'Select', '2026-01-22 04:53:29', '2026-01-22 04:57:39'),
(196, 676576, '1.17', '', 'Next Gen/. Cal Amp Radio Modem', '', '', NULL, 'Select', '2026-01-22 04:53:29', '2026-01-22 04:57:39'),
(197, 676576, '1.18', '', 'GPS & GSM Antenna-1', '', '', NULL, 'Select', '2026-01-22 04:53:29', '2026-01-22 04:57:39'),
(198, 676576, '1.19', '', 'Field Scanner Card 6', '', '', NULL, 'Select', '2026-01-22 04:53:29', '2026-01-22 04:57:39'),
(199, 676576, '1.20', '', 'SMOCIP Unit', '', '', NULL, 'Select', '2026-01-22 04:53:29', '2026-01-22 04:57:39'),
(200, 676576, '1.21', '', 'SMOCIP Termination Box', '', '', NULL, 'Select', '2026-01-22 04:53:29', '2026-01-22 04:57:39'),
(201, 676576, '1.22', '', 'PDU Box', '', '', NULL, 'Select', '2026-01-22 04:53:29', '2026-01-22 04:57:39'),
(202, 676576, '1.23', '', 'RTU 1', '', '', NULL, 'Select', '2026-01-22 04:53:29', '2026-01-22 04:57:39'),
(203, 676576, '1.24', '', 'RTU-2', '', '', NULL, 'Select', '2026-01-22 04:53:29', '2026-01-22 04:57:39'),
(204, 676576, '1.25', '', 'DC-DC Converter', '', '', NULL, 'Select', '2026-01-22 04:53:29', '2026-01-22 04:57:39'),
(205, 676576, '1.27 🗑️', '', 'hiii&lt;br&gt;', '', '', NULL, 'Select', '2026-01-22 04:53:29', '2026-01-22 04:53:29'),
(207, 676576, '1.27  🗑️', '', 'hiii<br>', '', '', NULL, 'Select', '2026-01-22 04:57:39', '2026-01-22 04:57:39'),
(208, 56545, '1.1', '', 'Stationary Kavach Unit', '', '', NULL, 'Select', '2026-01-22 05:32:35', '2026-01-22 06:02:54'),
(209, 56545, '1.2', '', 'Peripheral Processing Card 1', '', '', NULL, 'Select', '2026-01-22 05:32:35', '2026-01-22 06:02:54'),
(210, 56545, '1.3', '', 'Peripheral Processing Card 2', '', '', NULL, 'Select', '2026-01-22 05:32:35', '2026-01-22 06:02:54'),
(211, 56545, '1.4', '', 'Vital Computer Card -1', '', '', NULL, 'Select', '2026-01-22 05:32:35', '2026-01-22 06:02:54'),
(212, 56545, '1.5', '', 'Vital Computer Card -2', '', '', NULL, 'Select', '2026-01-22 05:32:35', '2026-01-22 06:02:54'),
(213, 56545, '1.6', '', 'Vital Computer Card -3', '', '', NULL, 'Select', '2026-01-22 05:32:35', '2026-01-22 06:02:54'),
(214, 56545, '1.7', '', 'Voter Card -1', '', '', NULL, 'Select', '2026-01-22 05:32:35', '2026-01-22 06:02:54'),
(215, 56545, '1.8', '', 'Voter Card -2', '', '', NULL, 'Select', '2026-01-22 05:32:35', '2026-01-22 06:02:54'),
(216, 56545, '1.9', '', 'Vital Gateway Card 1', '', '', NULL, 'Select', '2026-01-22 05:32:35', '2026-01-22 06:02:54'),
(217, 56545, '1.10', '', 'Vital Gateway Card 2', '', '', NULL, 'Select', '2026-01-22 05:32:35', '2026-01-22 05:32:52'),
(218, 56545, '1.11', '', 'Vital Gateway Card 3 (NMS)', '', '', NULL, 'Select', '2026-01-22 05:32:35', '2026-01-22 06:02:54'),
(219, 56545, '1.12', '', 'Field Scanner Card 1', '', '', NULL, 'Select', '2026-01-22 05:32:35', '2026-01-22 06:02:54'),
(220, 56545, '1.13', '', 'Field Scanner Card 2', '', '', NULL, 'Select', '2026-01-22 05:32:35', '2026-01-22 06:02:54'),
(221, 56545, '1.14', '', 'Field Scanner Card 3', '', '', NULL, 'Select', '2026-01-22 05:32:35', '2026-01-22 06:02:54'),
(222, 56545, '1.15', '', 'Field Scanner Card 4', '', '', NULL, 'Select', '2026-01-22 05:32:35', '2026-01-22 06:02:54'),
(223, 56545, '1.16', '', 'Station Radio Power Supply card-1', '', '', NULL, 'Select', '2026-01-22 05:32:35', '2026-01-22 06:02:54'),
(224, 56545, '1.17', '', 'Next Gen/. Cal Amp Radio Modem', '', '', NULL, 'Select', '2026-01-22 05:32:36', '2026-01-22 06:02:54'),
(225, 56545, '1.18', '', 'GPS & GSM Antenna-1', '', '', NULL, 'Select', '2026-01-22 05:32:36', '2026-01-22 06:02:54'),
(226, 56545, '1.19', '', 'Field Scanner Card 6', '', '', NULL, 'Select', '2026-01-22 05:32:36', '2026-01-22 06:02:54'),
(227, 56545, '1.20', '', 'SMOCIP Unit', '', '', NULL, 'Select', '2026-01-22 05:32:36', '2026-01-22 05:32:52'),
(228, 56545, '1.21', '', 'SMOCIP Termination Box', '', '', NULL, 'Select', '2026-01-22 05:32:36', '2026-01-22 06:02:54'),
(229, 56545, '1.22', '', 'PDU Box', '', '', NULL, 'Select', '2026-01-22 05:32:36', '2026-01-22 06:02:54'),
(230, 56545, '1.23', '', 'RTU 1', '', '', NULL, 'Select', '2026-01-22 05:32:36', '2026-01-22 06:02:54'),
(231, 56545, '1.24', '', 'RTU-2', '', 'ccc', NULL, 'Matching', '2026-01-22 05:32:36', '2026-01-22 06:02:54'),
(232, 56545, '1.25', '', 'DC-DC Converter', '', '', NULL, 'Not Matching', '2026-01-22 05:32:36', '2026-01-22 06:02:54'),
(237, 34545454, '1.1', '', 'Stationary Kavach Unit', '', '', NULL, 'Matching', '2026-01-22 06:55:51', '2026-01-22 06:55:51'),
(238, 34545454, '1.2', '', 'Peripheral Processing Card 1', '', '', NULL, 'Matching', '2026-01-22 06:55:51', '2026-01-22 06:55:51'),
(239, 34545454, '1.3', '', 'Peripheral Processing Card 2', '', '', NULL, 'Matching', '2026-01-22 06:55:51', '2026-01-22 06:55:51'),
(240, 34545454, '1.4', '', 'Vital Computer Card -1', '', '', NULL, 'Matching', '2026-01-22 06:55:51', '2026-01-22 06:55:51'),
(241, 34545454, '1.5', '', 'Vital Computer Card -2', '', '', NULL, 'Matching', '2026-01-22 06:55:51', '2026-01-22 06:55:51'),
(242, 34545454, '1.6', '', 'Vital Computer Card -3', '', '', NULL, 'Matching', '2026-01-22 06:55:51', '2026-01-22 06:55:51'),
(243, 34545454, '1.7', '', 'Voter Card -1', '', '', NULL, 'Matching', '2026-01-22 06:55:51', '2026-01-22 06:55:51'),
(244, 34545454, '1.8', '', 'Voter Card -2', '', '', NULL, 'Matching', '2026-01-22 06:55:51', '2026-01-22 06:55:51'),
(245, 34545454, '1.9', '', 'Vital Gateway Card 1', '', '', NULL, 'Matching', '2026-01-22 06:55:51', '2026-01-22 06:55:51'),
(246, 34545454, '1.10', '', 'Vital Gateway Card 2', '', '', NULL, 'Matching', '2026-01-22 06:55:51', '2026-01-22 06:55:51'),
(247, 34545454, '1.11', '', 'Vital Gateway Card 3 (NMS)', '', '', NULL, 'Matching', '2026-01-22 06:55:51', '2026-01-22 06:55:51'),
(248, 34545454, '1.12', '', 'Field Scanner Card 1', '', '', NULL, 'Matching', '2026-01-22 06:55:51', '2026-01-22 06:55:51'),
(249, 34545454, '1.13', '', 'Field Scanner Card 2', '', '', NULL, 'Matching', '2026-01-22 06:55:51', '2026-01-22 06:55:51'),
(250, 34545454, '1.14', '', 'Field Scanner Card 3', '', '', NULL, 'Matching', '2026-01-22 06:55:51', '2026-01-22 06:55:51'),
(251, 34545454, '1.15', '', 'Field Scanner Card 4', '', '', NULL, 'Matching', '2026-01-22 06:55:51', '2026-01-22 06:55:51'),
(252, 34545454, '1.16', '', 'Station Radio Power Supply card-1', '', '', NULL, 'Matching', '2026-01-22 06:55:51', '2026-01-22 06:55:51'),
(253, 34545454, '1.17', '', 'Next Gen/. Cal Amp Radio Modem', '', '', NULL, 'Matching', '2026-01-22 06:55:51', '2026-01-22 06:55:51'),
(254, 34545454, '1.18', '', 'GPS &amp;amp; GSM Antenna-1', '', '', NULL, 'Matching', '2026-01-22 06:55:51', '2026-01-22 06:55:51'),
(255, 34545454, '1.19', '', 'Field Scanner Card 6', '', '', NULL, 'Matching', '2026-01-22 06:55:51', '2026-01-22 06:55:51'),
(256, 34545454, '1.20', '', 'SMOCIP Unit', '', '', NULL, 'Matching', '2026-01-22 06:55:51', '2026-01-22 06:55:51'),
(257, 34545454, '1.21', '', 'SMOCIP Termination Box', '', '', NULL, 'Matching', '2026-01-22 06:55:51', '2026-01-22 06:55:51'),
(258, 34545454, '1.22', '', 'PDU Box', '', '', NULL, 'Matching', '2026-01-22 06:55:51', '2026-01-22 06:55:51'),
(259, 34545454, '1.23', '', 'RTU 1', '', '', NULL, 'Matching', '2026-01-22 06:55:51', '2026-01-22 06:55:51'),
(260, 34545454, '1.24', '', 'RTU-2', '', '', NULL, 'Matching', '2026-01-22 06:55:51', '2026-01-22 06:55:51'),
(261, 34545454, '1.25', '', 'DC-DC Converter', '', '', NULL, 'Matching', '2026-01-22 06:55:51', '2026-01-22 06:55:51');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `gps_gsm_antenna`
--
ALTER TABLE `gps_gsm_antenna`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT for table `installation_of_kavach_equipment`
--
ALTER TABLE `installation_of_kavach_equipment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `ips`
--
ALTER TABLE `ips`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `laying_of_sectional_ofc_cable`
--
ALTER TABLE `laying_of_sectional_ofc_cable`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `loginpage`
--
ALTER TABLE `loginpage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `networking_rack`
--
ALTER TABLE `networking_rack`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `outdoor_cabling`
--
ALTER TABLE `outdoor_cabling`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pdu`
--
ALTER TABLE `pdu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `relay_rack`
--
ALTER TABLE `relay_rack`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `report`
--
ALTER TABLE `report`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `report_versions`
--
ALTER TABLE `report_versions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `rfid_tags`
--
ALTER TABLE `rfid_tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rf_antennas`
--
ALTER TABLE `rf_antennas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `riu`
--
ALTER TABLE `riu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `row_templates`
--
ALTER TABLE `row_templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `rtu`
--
ALTER TABLE `rtu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `smocip`
--
ALTER TABLE `smocip`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `station`
--
ALTER TABLE `station`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `tag_to_tag_distance`
--
ALTER TABLE `tag_to_tag_distance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tower`
--
ALTER TABLE `tower`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `verification_of_equipment_serial_numbers`
--
ALTER TABLE `verification_of_equipment_serial_numbers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=262;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
