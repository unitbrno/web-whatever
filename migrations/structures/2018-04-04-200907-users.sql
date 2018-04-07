CREATE TABLE `users` (
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
