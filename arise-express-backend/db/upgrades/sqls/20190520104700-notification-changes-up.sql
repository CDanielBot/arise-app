ALTER TABLE NotificationsBroadcast CHANGE COLUMN `RelatedEntityId` `RelatedPostId` int(11);
ALTER TABLE NotificationsBroadcast DROP COLUMN `RelatedEntityTable`;
ALTER TABLE Notifications ADD COLUMN `RelatedPostId` int(11) UNSIGNED NOT NULL;

UPDATE Notifications N SET N.RelatedPostId = N.RelatedEntityId WHERE N.RelatedEntityTable IN ('Posts', 'Reactions', 'Comments');
