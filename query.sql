create database turim;

create table filhos(
	id serial primary key,
	pessoas_id int,
	nome varchar(15)
);

create table pessoas(
	id serial primary key,
	nome varchar(15)
);