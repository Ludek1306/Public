CREATE DATABASE music_player;
USE music_player;

CREATE TABLE `playlists` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`title` varchar(255) NOT NULL,		
	`system_rank` BIT NOT NULL DEFAULT 0,   
	PRIMARY KEY (`id`)
);

CREATE TABLE `music` (
	`music_id` INT NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL,		
	`artist` varchar(255) NOT NULL,
    `duration` INT NOT NULL,
    `path` varchar(255) NOT NULL,
    `album_cover` varchar(255) NOT NULL,
	PRIMARY KEY (`music_id`)
);

CREATE TABLE `playlist_tracks` (
	`playlist_id` INT NOT NULL,
	`track_id` INT NOT NULL,
	PRIMARY KEY (`playlist_id`, `track_id`),
	FOREIGN KEY (`playlist_id`) REFERENCES `playlists`(`id`),
	FOREIGN KEY (`track_id`) REFERENCES `music`(`music_id`)
);

INSERT INTO playlists (id, title, system_rank) VALUES
  ( 1, 'Favorites', 1 ),
  ( 2, 'Music for programming', 0 ),
  ( 3, 'Driving', 0 ),
  ( 4, 'Driving2', 0 ),
  ( 5, 'Dreaming', 0 );
  
  
  INSERT INTO music (music_id, name, artist, duration, path, album_cover) VALUES
  (1, 'Andromeda', 'CRUXORIUM', 228, 'assets/music/CRUXORIUM - Andromeda.mp3', 'assets/img/album-covers/CRUXORIUM - Anabiosis.jpg'),
  (2, 'Cryogenic', 'CRUXORIUM', 307, 'assets/music/CRUXORIUM - Cryogenic.mp3', 'assets/img/album-covers/CRUXORIUM - Anabiosis.jpg'),
  (3, 'Light of Altair', 'CRUXORIUM', 206, 'assets/music/CRUXORIUM - Light of Altair.mp3', 'assets/img/album-covers/CRUXORIUM - Anabiosis.jpg'),
  (4, 'Through the Stars', 'CRUXORIUM', 266, 'assets/music/CRUXORIUM - Through the Stars.mp3', 'assets/img/album-covers/CRUXORIUM - Anabiosis.jpg'),
  (5, 'Anime Theme', 'The Antti Jädertpolm Quartet', 344, 'assets/music/The Antti Jädertpolm Quartet - Anime Theme.mp3', 'assets/img/album-covers/The Antti Jädertpolm Quartet - Anime EP.jpg'),
  (6, 'Anime Opening', 'Uncan', 117, 'assets/music/Uncan - Anime Opening.mp3', 'assets/img/album-covers/Uncan - Daytime.jpg'),
  (7, 'Ocean Hotel', 'Uncan', 168, 'assets/music/Uncan - Ocean Hotel.mp3', 'assets/img/album-covers/Uncan - Third.jpg'),
  (8, 'Wave of the Synth', 'Uncan', 140, 'assets/music/Uncan - Wave of the Synth.mp3', ''),
  (9, 'Energetic Midtempo Cyberpunk  _ Hidden', 'Alex-Productions', 202, 'assets/music/Alex-Productions - Energetic Midtempo Cyberpunk  _ Hidden.mp3', 'assets/img/album-covers/Alex-Productions - Cyberattack.jpg');
  
  
  INSERT INTO `playlist_tracks` (`playlist_id`, `track_id`) VALUES 
  (1, 2),
  (2, 4),
  (2, 3),
  (3, 1),
  (3, 2),
  (3, 5),
  (3, 6),
  (4, 1);
      