ALTER TABLE Users ADD COLUMN FacebookId bigint(20) NOT NULL DEFAULT '0';
ALTER TABLE Users DROP COLUMN FirebaseUid;