use flipcart;

create table customer
(
custID int,
custName varchar(50),
userName varchar(50),
pass varchar(50),
Address varchar(50),
city varchar(50),
contactNo int ,
primary key(custID)

);

create table Category
(
catID int,
Category varchar(50),
primary key(catID)
);

create table Products
(
PID int,
productName varchar(50),
productCost int ,
descShort varchar(50),
descLong varchar(500),
catID int,
image varchar(50),

primary key(PID),
foreign key(catID) references Category(catID)
);

create table Cart
(
custID int,
PID int,
primary key(PID,custID),
foreign key(PID) references Products(PID),
foreign key(custID) references customer(custID)
);

create table orders(
custID int,
PID int,
orderDate date,
DeliveryDate date,
primary key(custID,PID),
foreign key (custID) references customer(custID),
foreign key (PID) references Products(PID)
);











