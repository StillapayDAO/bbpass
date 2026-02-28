CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organizerId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(64) NOT NULL DEFAULT 'general',
	`imageUrl` text,
	`venue` varchar(255),
	`address` text,
	`city` varchar(128),
	`country` varchar(128),
	`startDate` bigint NOT NULL,
	`endDate` bigint,
	`ticketPrice` decimal(10,2) NOT NULL DEFAULT '0.00',
	`capacity` int NOT NULL DEFAULT 100,
	`ticketsSold` int NOT NULL DEFAULT 0,
	`status` enum('draft','published','cancelled','completed') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`eventId` int NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`unitPrice` decimal(10,2) NOT NULL,
	`totalAmount` decimal(10,2) NOT NULL,
	`status` enum('pending','confirmed','cancelled','refunded') NOT NULL DEFAULT 'pending',
	`billingName` varchar(255),
	`billingEmail` varchar(320),
	`cardLast4` varchar(4),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`eventId` int NOT NULL,
	`userId` int NOT NULL,
	`ticketCode` varchar(32) NOT NULL,
	`status` enum('valid','used','cancelled') NOT NULL DEFAULT 'valid',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tickets_id` PRIMARY KEY(`id`),
	CONSTRAINT `tickets_ticketCode_unique` UNIQUE(`ticketCode`)
);
