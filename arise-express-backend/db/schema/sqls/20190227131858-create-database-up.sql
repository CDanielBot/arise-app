SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE `Comments` (
  `CommentId` int(11) UNSIGNED NOT NULL,
  `UserId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `RelatedPostId` int(11) UNSIGNED NOT NULL,
  `RelatedPostTable` varchar(50) NOT NULL DEFAULT '',
  `RelatedCommentId` int(11) UNSIGNED NOT NULL DEFAULT '0' COMMENT '0 - comment, != 0 - reply',
  `Name` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Comment` text CHARACTER SET utf8 NOT NULL,
  `UserMediaUrl` text NOT NULL,
  `Visibility` tinyint(4) UNSIGNED NOT NULL DEFAULT '1' COMMENT '0 - not visibile, 1 - visible, 2 - visible only for the user who posted the post',
  `CreationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


CREATE TABLE `Devices` (
  `DeviceId` int(11) UNSIGNED NOT NULL,
  `UserId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `DeviceToken` varchar(255) DEFAULT NULL,
  `CreationDate` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


CREATE TABLE `EvangelismRequests` (
  `EvangelismRequestsId` int(11) UNSIGNED NOT NULL,
  `UserId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `ApplicantName` varchar(255) NOT NULL,
  `ApplicantEmail` varchar(255) NOT NULL,
  `ApplicantPhone` varchar(50) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Phone` varchar(50) NOT NULL,
  `Address` varchar(255) NOT NULL,
  `Age` tinyint(3) UNSIGNED NOT NULL,
  `Occupation` varchar(255) NOT NULL,
  `EducationLevel` varchar(20) NOT NULL,
  `Religion` varchar(255) NOT NULL,
  `AttitudeTowardsChristianity` varchar(20) NOT NULL,
  `OtherDetails` text NOT NULL,
  `Stage` varchar(50) NOT NULL,
  `StageChangeDate` datetime NOT NULL,
  `CreationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `Notifications` (
  `NotificationId` int(11) UNSIGNED NOT NULL,
  `UserId` int(11) UNSIGNED NOT NULL,
  `RelatedEntityId` int(11) UNSIGNED NOT NULL,
  `RelatedEntityTable` varchar(50) NOT NULL,
  `Action` varchar(50) NOT NULL,
  `TargetDeviceId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `TargetUserId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `Seen` tinyint(4) UNSIGNED NOT NULL DEFAULT '0' COMMENT '0 - unseen; 1 - seen',
  `CreationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


CREATE TABLE `Posts` (
  `PostId` int(11) UNSIGNED NOT NULL,
  `RelatedPostId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `UserId` int(11) UNSIGNED NOT NULL,
  `MediaCollectionId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `MediaId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `ResourceId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `CategoryId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `GroupId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `Type` varchar(50) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Title_en` varchar(255) NOT NULL,
  `Description` text NOT NULL,
  `Description_en` text NOT NULL,
  `Post` longtext NOT NULL,
  `Post_en` longtext NOT NULL,
  `Author` varchar(1500) NOT NULL DEFAULT '',
  `Details` varchar(255) NOT NULL,
  `Date` datetime DEFAULT NULL,
  `PublishOnDate` tinyint(4) UNSIGNED NOT NULL DEFAULT '0' COMMENT '0 - publish now, 1 - publish on date',
  `Visibility` tinyint(4) UNSIGNED NOT NULL DEFAULT '1' COMMENT '0 - not visibile, 1 - visible',
  `CreationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `Reactions` (
  `ReactionId` int(11) UNSIGNED NOT NULL,
  `UserId` int(11) UNSIGNED DEFAULT NULL,
  `RelatedPostId` int(11) UNSIGNED NOT NULL,
  `RelatedPostTable` varchar(50) NOT NULL DEFAULT '',
  `Name` varchar(561) DEFAULT NULL,
  `Reaction` varchar(50) NOT NULL,
  `UserMediaUrl` varchar(1000) NOT NULL DEFAULT '',
  `CreationDate` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


CREATE TABLE `Users` (
  `UserId` int(11) NOT NULL,
  `FacebookId` bigint(20) NOT NULL DEFAULT '0',
  `FirstName` varchar(255) DEFAULT NULL,
  `LastName` varchar(255) DEFAULT NULL,
  `Mobile` varchar(255) NOT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `User` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Description` text NOT NULL,
  `Type` tinyint(4) NOT NULL DEFAULT '1' COMMENT '0 - admin, 1 - user, 2-evangelist, 3 - prayer team',
  `Zone` varchar(250) NOT NULL,
  `Country` varchar(250) NOT NULL,
  `Logged` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0 - not logged, 1 - logged',
  `LoggedInApp` tinyint(4) NOT NULL DEFAULT '0',
  `LastLogin` datetime NOT NULL,
  `Banned` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0 - not banned, 1 - banned',
  `Language` varchar(255) DEFAULT NULL,
  `MediaUrl` varchar(1000) NOT NULL DEFAULT '',
  `CreationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `Media` (
  `MediaId` int(11) NOT NULL,
  `MediaCollectionId` int(11) NOT NULL DEFAULT '0',
  `Type` varchar(255) NOT NULL,
  `Title` varchar(512) NOT NULL,
  `Title_en` varchar(512) NOT NULL,
  `Description` text NOT NULL,
  `Description_en` text NOT NULL,
  `Tags` varchar(512) NOT NULL,
  `Url` varchar(512) NOT NULL,
  `Url_en` varchar(512) NOT NULL,
  `EmbedCode` text NOT NULL,
  `EmbedCode_en` text NOT NULL,
  `CreationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `Contacts` (
  `ContactId` int(11) UNSIGNED NOT NULL,
  `UserId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `ContactUserId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `Type` varchar(50) NOT NULL DEFAULT '' COMMENT '1-contact; 2-evangelist; 3-evangelism-request; 4-act-conference',
  `Name` varchar(255) NOT NULL DEFAULT '',
  `Email` varchar(255) NOT NULL DEFAULT '',
  `Mobile` varchar(50) NOT NULL DEFAULT '',
  `Address` varchar(255) NOT NULL DEFAULT '',
  `Details` text NOT NULL,
  `Stage` varchar(50) NOT NULL DEFAULT '' COMMENT '1-new; 2-in progress; 3-done',
  `LastUpdated` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `CreationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE `Notes` (
  `NoteId` int(11) UNSIGNED NOT NULL,
  `RelatedEntityId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `RelatedEntityType` varchar(50) NOT NULL,
  `UserId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `Type` varchar(50) NOT NULL DEFAULT '' COMMENT '1-note; 2-call; 3-email; 4-chat; 5-meeting;',
  `Note` text NOT NULL,
  `Private` tinyint(4) NOT NULL DEFAULT '1' COMMENT '0 - visible only for user who added the note; 1- visible for every user',
  `CreationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


ALTER TABLE `Comments`
  ADD PRIMARY KEY (`CommentId`),
  ADD KEY `UserId` (`UserId`),
  ADD KEY `RelatedContentId` (`RelatedPostId`),
  ADD KEY `RelatedContentTable` (`RelatedPostTable`);

ALTER TABLE `Devices`
  ADD PRIMARY KEY (`DeviceId`),
  ADD KEY `UserId` (`UserId`);

ALTER TABLE `EvangelismRequests`
  ADD PRIMARY KEY (`EvangelismRequestsId`),
  ADD KEY `UserId` (`UserId`);

ALTER TABLE `Notifications`
  ADD PRIMARY KEY (`NotificationId`),
  ADD KEY `RelatedContentId` (`RelatedEntityId`),
  ADD KEY `RelatedEntityTable` (`RelatedEntityTable`),
  ADD KEY `Type` (`Action`),
  ADD KEY `UserId` (`UserId`),
  ADD KEY `TargetDeviceId` (`TargetDeviceId`),
  ADD KEY `TargetUserId` (`TargetUserId`);

ALTER TABLE `Posts`
  ADD PRIMARY KEY (`PostId`),
  ADD KEY `Type` (`Type`,`UserId`,`MediaCollectionId`,`MediaId`,`CategoryId`,`Date`,`Visibility`),
  ADD KEY `ResourceId` (`ResourceId`),
  ADD KEY `GroupId` (`GroupId`);

ALTER TABLE `Reactions`
  ADD PRIMARY KEY (`ReactionId`),
  ADD KEY `UserId` (`UserId`),
  ADD KEY `Reaction` (`Reaction`),
  ADD KEY `RelatedContentId` (`RelatedPostId`),
  ADD KEY `RelatedContentTable` (`RelatedPostTable`);

ALTER TABLE `Users`
  ADD PRIMARY KEY (`UserId`);

ALTER TABLE `Comments`
  MODIFY `CommentId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=518;

ALTER TABLE `Devices`
  MODIFY `DeviceId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

ALTER TABLE `EvangelismRequests`
  MODIFY `EvangelismRequestsId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

ALTER TABLE `Notifications`
  MODIFY `NotificationId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=941;

ALTER TABLE `Posts`
  MODIFY `PostId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=564;

ALTER TABLE `Reactions`
  MODIFY `ReactionId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=793;

ALTER TABLE `Users`
  MODIFY `UserId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=253;

ALTER TABLE `Contacts`
  ADD PRIMARY KEY (`ContactId`);

ALTER TABLE `Contacts`
  MODIFY `ContactId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=540;

ALTER TABLE `Notes`
  ADD PRIMARY KEY (`NoteId`);

ALTER TABLE `Notes`
  MODIFY `NoteId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=411;