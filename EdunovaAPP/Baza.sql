-- Ovako se pi�u komentari


-- Zamjeniti db_a98acf_wp7 s imenom svoje baze

SELECT name, collation_name FROM sys.databases;
GO
ALTER DATABASE db_a98acf_wp7 SET SINGLE_USER WITH
ROLLBACK IMMEDIATE;
GO
ALTER DATABASE db_a98acf_wp7 COLLATE Latin1_General_100_CI_AI_SC_UTF8;
GO
ALTER DATABASE db_a98acf_wp7 SET MULTI_USER;
GO
SELECT name, collation_name FROM sys.databases;
GO

create table smjerovi(
sifra int not null primary key identity(1,1), -- ovo je primarni klju�
naziv varchar(50) not null,
cijena decimal(18,2),
vaucer bit,
izvodiseod datetime
);

create table polaznici(
sifra int not null primary key identity(1,1),
ime varchar(50) not null,
prezime varchar(50) not null,
oib char(11),
email varchar(100) not null
);

create table grupe(
sifra int not null primary key identity(1,1), 
naziv varchar(20) not null,
smjer int not null references smjerovi(sifra), -- ovo je vanjski klju�
predavac varchar(50)
);


create table clanovi(
grupa int not null references grupe(sifra),
polaznik int not null references polaznici(sifra)
);


-- 1 (Ovo je �ifra koju je dodjelila baza)
insert into smjerovi 
(naziv, cijena, vaucer, izvodiseod) values
('Web programiranje',1254.99,1,'2024-09-07 17:00:00');

insert into smjerovi(naziv) values
-- 2
('Java programer'),
-- 3
('Serviser'),
-- 4
('Knjigovodstvo');


insert into grupe (naziv, smjer) values
('WP6',1),
('WP7',1),
('JP27',2),
('K12',4);


INSERT INTO polaznici (ime, prezime, email) VALUES 
('Ante', 'Jankovi�', 'antejankovic86@gmail.com'),
('Stojan', 'Cari�', 'stojancaric8@gmail.com'),
('�eljko', 'Lu�an', 'lucko1987vk@gmail.com'),
('Petar', 'Gudelj', 'gudelj.petar2005@gmail.com'),
('Krunoslav', 'Popi�', 'kpopic@gmail.com'),
('Jurica', 'Ognjenovi�', 'ognjenovicjurica0610@gmail.com'),
('Lea', 'Barto�', 'talulea@gmail.com'),
('Tomislav', 'Na�', 'tomislav.nadj@gmail.com'),
('Martin', 'Galik', 'gale1508@gmail.com'),
('Ivan', 'Mi�i�', 'ivanmisic983@gmail.com'),
('Mirjam', 'Ko�ki', 'mir.jam975@gmail.com'),
('�eljko', 'Ko�ki', 'zeljko.koski@gmail.com'),
('Mirza', 'Delagi�', 'mirzadelagic@gmail.com'),
('Bruno', '�a�i�', 'bruno.cacic@gmail.com'),
('David', 'Na�', 'david08.nadj@gmail.com'),
('Antonio', 'Macanga', 'macanga.antonio@gmail.com'),
('Nina', 'Zrno', 'ninaradakovic1234@icloud.com'),
('Marko', 'Berberovi�', 'marko.berberovic@skole.hr'),
('Tomislav', 'Nebes', 'tomislav.nebes@gmail.com'),
('Klara', 'Na�', 'klara.nad@gmail.com'),
('Maja', '�teler', 'maja5steler@gmail.com'),
('Milan', 'Dra�a', 'milan.draca@gmail.com'),
('Marin', 'Vranje�', 'marinvranjes123@gmail.com'),
('Boris', 'Bukovec', 'botaosijek@gmail.com'),
('Luka', 'Jurak', 'jurakluka18@gmail.com'),
('Ivan', 'Strme�ki', 'ivan.strmecki8@gmail.com'),
('Bruno', 'Ba�i�', 'brunobasic031@gmail.com');


insert into clanovi (grupa,polaznik) values
(2,1),(2,2),(2,3),(2,4),(2,5),(2,6),
(2,7),(2,8),(2,9),(2,10),(2,11),(2,12),
(2,13),(2,14),(2,15),(2,16),(2,17),(2,18),
(2,19),(2,20),(2,21),(2,22),(2,23),(2,24),
(2,25),(2,26),(2,27),

(3,7),(3,17),(3,27);