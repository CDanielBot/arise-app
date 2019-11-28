UPDATE Posts SET Type_Mobile = 'article' WHERE Type = 'article';
UPDATE Posts SET Type_Mobile = 'event' WHERE Type = 'event';
UPDATE Posts SET Type_Mobile = 'video' WHERE Type IN ('post', 'media') AND Post like '%iframe%www.youtube.com/embed%';
UPDATE Posts SET Type_Mobile = 'prayer' WHERE Type_Mobile <> 'video' AND Type = 'post';

