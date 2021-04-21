create database vacationsWebsite;

use vacationsWebsite;

create table users (
ID int not null auto_increment,
firstName varchar(20) not null,
lastName varchar(20) not null,
userName varchar(20) not null,
password varchar(100) not null,
isAdmin TINYINT NOT NULL DEFAULT 0,
primary key (ID)
);

insert into users (firstName, lastName, userName, password, isAdmin)
value ('firstName','lastName', 'admin','$2b$10$96.I/.94c/s0.m8a4T4jd.rtSDVdCj4jkycRusy3tuxdnEyroCy1i', 1);

create table vacations (
ID INT not null auto_increment,
Description VARCHAR(200) not null,
Destination VARCHAR(200) not null,
Picture VARCHAR(255) not null,
StarDate dateTime not null,
EndDate dateTime not null,
Price VARCHAR(200) not null,
NumOfFollowers INT NOT NULL default 0,
primary key (ID)
);

create table userVacations (
ID INT not null auto_increment,
UserId INT NOT NULL,
VacationId INT NOT NULL,
isFollow TINYINT NOT NULL DEFAULT 1,
primary key (ID)
);

insert into vacations (Description, Destination, Picture, StarDate, EndDate, Price, NumOfFollowers)
value ('Some description','Amsterdam', 'https://shorttermrentalz.com/wp-content/uploads/2020/03/amsterdam-court.jpg','2020-06-18', '2020-06-30', '3000', '0');
insert into vacations (Description, Destination, Picture, StarDate, EndDate, Price, NumOfFollowers)
value ('Some description','Berlin', 'https://www.berlin.de/binaries/asset/image_assets/5719603/ratio_2_1/1560241983/624x312/','2020-07-20', '2020-08-05', '3500', '0');
insert into vacations (Description, Destination, Picture, StarDate, EndDate, Price, NumOfFollowers)
value ('Some description','Los Angeles', 'https://media.timeout.com/images/105550552/750/422/image.jpg','2020-09-20', '2020-11-20', '15000', '0');
insert into vacations (Description, Destination, Picture, StarDate, EndDate, Price, NumOfFollowers)
value ('Some description','Eilat', 'https://www.beinharimtours.com/wwwroot/uploads/articles/temp/521c93be-9486-4e30-b80c-2055d43bccd6.jpg','2020-08-15', '2020-08-20', '600', '0');
insert into vacations (Description, Destination, Picture, StarDate, EndDate, Price, NumOfFollowers)
value ('Some description','New York', 'https://pesweb.azureedge.net/spimg/geographicimages/newyork.jpg?scale=downscaleonly&encoder=freeimage&progressive=true&quality=50&w=480&h=480&mode=crop','2020-10-15', '2020-12-20', '20000', '0');
insert into vacations (Description, Destination, Picture, StarDate, EndDate, Price, NumOfFollowers)
value ('Some description','Tel Aviv', 'https://www.smartcitiesworld.net/AcuCustom/Sitename/DAM/017/Tel_Aviv_Adobe.jpg','2021-01-18', '2021-02-01', '2500', '0');
insert into vacations (Description, Destination, Picture, StarDate, EndDate, Price, NumOfFollowers)
value ('Some description','Sydney', 'https://media.radissonhotels.net/image/destination-pages/localattraction/16256-118729-f63224546_3xl.jpg?impolicy=HomeHero','2021-01-05', '2021-02-15', '9000', '0');
insert into vacations (Description, Destination, Picture, StarDate, EndDate, Price, NumOfFollowers)
value ('Some description','Honk Kong', 'https://geab.eu/wp-content/uploads/2019/09/hongkong-800x533.jpg','2021-03-05', '2021-04-15', '18000', '0');
insert into vacations (Description, Destination, Picture, StarDate, EndDate, Price, NumOfFollowers)
value ('Some description','Tokyo', 'https://www.gotokyo.org/en/plan/tokyo-outline/images/main.jpg','2021-05-05', '2021-06-25', '22000', '0');