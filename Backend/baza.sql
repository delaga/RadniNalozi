use master;
go
drop database if exists RadniNalozi;
go
create database RadniNalozi collate Croatian_CI_AS;
go
use RadniNalozi;
go

create table djelatnici (
	sifra int not null PRIMARY KEY IDENTITY(1,1),
	ime varchar(50) not null,
	prezime varchar(50) not null,
	telefon varchar(50),
	email varchar(80),
	brutto2Placa decimal(18,2) not null
);

create table poslovi (
	sifra int not null PRIMARY KEY IDENTITY(1,1),
	nazivPosla varchar(50) not null,
	vrijednost decimal(18,2) not null
	);

create table klijenti(
	sifra int not null PRIMARY KEY IDENTITY(1,1),
	Naziv varchar(50) not null,
	oib char(11),
	adresa varchar (100),
	email varchar (100),
	odgovornaOsoba varchar(100)
);

create table radniNalozi (
	sifra int not null PRIMARY KEY IDENTITY(1,1),
	djelatnik int not null references djelatnici(sifra),
	klijent int not null references klijenti(sifra),
	vrijemePocetka datetime,
	vrijemeZavrsetka datetime,
	radnihSati decimal (18,2),
	napomena text
);

create table posao_radniNalog (
	posao int not null references poslovi(sifra),
	radniNalog int not null references radniNalozi(sifra)
);


create table vrstaTroskova(
	sifra int not null PRIMARY KEY IDENTITY(1,1),
	naziv varchar(100) not null,
);

create table troskovi(
	sifra int not null PRIMARY KEY IDENTITY(1,1),
	naziv varchar(100) not null,
	vrsta int not null references vrstaTroskova(sifra),
	radniNalog int not null references radniNalozi(sifra),
	kolicina decimal(18,2) not null,
	cijena decimal(18,2) not null
);

create table radniSatiPoMjesecu(
	sifra int not null PRIMARY KEY IDENTITY(1,1),
	godina int not null,
	mjesec char(2) not null,
	sati int not null
);

insert into djelatnici(ime,prezime,brutto2Placa) values
('Rade','Janković',1000),('Dino','Dizdarević',1000),('Milan','Drača',1000),('Mirza','Delagić',1000);

insert into klijenti(naziv,oib,adresa,email,odgovornaOsoba) values
('Murder Inc.','98765432155','Tamo nekud bb','uf@uf.com','Vrlo neodgovorna osoba'),
('Lopuže d.d.','12345678901','Prva desno 10a','mail@mail.hr','Neki HDZovac');

insert into poslovi(nazivPosla,vrijednost) values
('Postavljanje nosača',99.99),
('Programiranje HomeAssistant',249.99);

insert into radniNalozi(djelatnik,klijent,vrijemePocetka,vrijemeZavrsetka,radnihSati,napomena) values
(1,1,'2024-10-02 08:00:00','2024-12-03 10:00:00',40,'Nosač postavljen po uputi ISP-a');

insert into vrstaTroskova(naziv) values
('Cestarina'),
('Sitni potrošni materijal'),
('Kabliranje');

insert into posao_radniNalog(posao, radniNalog) values

(1,1);


insert into troskovi(naziv,vrsta,radniNalog,kolicina,cijena) values
('Osijek-SB',1,1,2,3.60),
('UTP CAt6',3,1,50,1.22),
('Izolirka',2,1,3,1.99);

insert into radniSatiPoMjesecu(godina,mjesec,sati) values
(2024,01,176),
(2024,02,168),
(2024,03,168),
(2024,04,168),
(2024,05,168),
(2024,06,160),
(2024,07,184),
(2024,08,160),
(2024,09,168),
(2024,10,184),
(2024,11,152),
(2024,12,160),

(2025,01,168),
(2025,02,160),
(2025,03,168),
(2025,04,168),
(2025,05,160),
(2025,06,160),
(2025,07,184),
(2025,08,152),
(2025,09,176),
(2025,10,184),
(2025,11,152),
(2025,12,168)
;

select * from djelatnici;
select * from radniNalozi;
select * from klijenti;
select * from poslovi;
select * from vrstaTroskova;
select * from troskovi;
select * from posao_radniNalog;
select * from radniSatiPoMjesecu;
