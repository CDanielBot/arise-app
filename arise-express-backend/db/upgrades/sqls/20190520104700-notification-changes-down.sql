ALTER TABLE NotificationsBroadcast CHANGE COLUMN `RelatedPostId` `RelatedEntityId` int(11);
ALTER TABLE NotificationsBroadcast ADD COLUMN `RelatedEntityTable` varchar(50) NOT NULL;
ALTER TABLE Notifications DROP COLUMN `RelatedPostId`;