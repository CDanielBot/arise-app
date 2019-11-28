CREATE TABLE `NotificationsBroadcast` (
  `NotificationId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `RelatedEntityId` int(11) UNSIGNED NOT NULL,
  `RelatedEntityTable` varchar(50) NOT NULL,
  `Action` varchar(50) NOT NULL,
  `CreationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`NotificationId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `NotificationsBroadcastSeen` (
  `Id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `NotificationId` int(11) UNSIGNED NOT NULL ,
  `UserId` varchar(50) NOT NULL,
  `CreationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  FOREIGN KEY (`NotificationId`) REFERENCES NotificationsBroadcast(NotificationId)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;