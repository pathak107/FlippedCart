create table Customer(							
    cust_id integer primary key,
    UserName varchar(100),
    Password varchar(100),
    Address varchar(500),
    contact varchar(12),
    accountNumber varchar(50)	
);
select * from Customer;
create table Category
( cat_id integer primary key,
  Category varchar(100)
);

create table Products								
(   p_id integer primary key,
    name varchar(100),
    cost integer,
    DescriptionShort varchar(1000),
    DescriptionLong text,
    image varhcar(100),	
    cat_id integer,
    foreign key(cat_id) references Category(cat_id)
);

create table Cart
(
cart_id integer primary key,
cust_id integer,
p_id integer,
foreign key(p_id) references Products(p_id),
foreign key(cust_id) references Customer(cust_id)
);

create table orders(
o_id integer primary key,
cust_id integer,
p_id integer,
orderDate text default (datetime('now', 'localtime')),
orderStatus varchar(100) default "processing order",
foreign key (cust_id) references Customer(cust_id),
foreign key (p_id) references Products(p_id)
);

select name,cost,image from Products natural join CartItem where cust_id= 3 and Products.p_id = CartItem.p_id;



insert into Category(Category) values ("Mobile");
insert into Category(Category) values ("Tshirt");
insert into Category(Category) values ("Laptop");
insert into Category(Category) values ("Book");
insert into Category(Category) values ("Shoes");
insert into Category(Category) values ("Watch");

select * from Products;

insert into Products(name,cost,DescriptionShort,DescriptionLong,image,cat_id)
values (
    "Black t shirt",
    450,
    "Black plane t shirt.Perfect fit, high quality material",
    "Black plane t shirt, a must have in your wardrobe.Also it has a perfect fit, available in all sizes and has the best quality material",
    "img_1.jpeg",
    2
);
insert into Products(name,cost,DescriptionShort,DescriptionLong,image,cat_id)
values (
    "Blue t shirt",
    500,
    "Blue plane t shirt.Perfect fit, high quality material",
    "Blue plane t shirt, a must have in your wardrobe.Also it has a perfect fit, available in all sizes and has the best quality material",
    "img_2.jpeg",
    2
);

insert into Products(name,cost,DescriptionShort,DescriptionLong,image,cat_id)
values (
    "Titan watch",
    17495,
    "Black Dial titan watch",
    "Black Dial Chronograph Watch with Steel & ceramic Strap.It comes with a 5 year warranty. Classic watch to enhance your style and go from average to best look. Show the best version of yourself with this limited edition waterproof black dial watch",
    "img_3.jpeg",
    5
);

insert into Products(name,cost,DescriptionShort,DescriptionLong,image,cat_id)
values (
    "Titan Octane watch",
    17495,
    "Blue Dial titan watch",
    "Titan's Octane Blue Dial Chronograph Watch with Steel & ceramic Strap.It comes with a 5 year warranty. Classic watch to enhance your style and go from average to best look. Show the best version of yourself with this limited edition waterproof black dial watch",
    "img_4.jpeg",
    5
);
insert into Products(name,cost,DescriptionShort,DescriptionLong,image,cat_id)
values (
    "Samsung Galaxy Fold",
    138600,
    "Samsung Galaxy fold is a foldable phone",
    "Samsung Galaxy fold is a remarkable innovation in terms of foldable touch phones. Although its very sensitive phone but its features can't be nelected. Performance, versatility,big screen, Fragile body",
    "img_6.jpeg",
    1
);
insert into Products(name,cost,DescriptionShort,DescriptionLong,image,cat_id)
values (
    "Iphone 11 pro and pro max",
    94430,
    "Iphone 11 pro and pro max.Ameero ka mobile",
    "Iphone 11 pro and pro max. As always to purchase this phone it will require you to sell all your properties , both of your kidneys and some more organs. Works like any other phone only advantage is processor and camera. But totally not worth it",
    "img_5.jpeg",
    1
);

insert into Products(name,cost,DescriptionShort,DescriptionLong,image,cat_id)
values (
    "Apple Macbook pro",
    159990,
    "Its the best laptop ever",
    "Apple macbook pro is the best laptop ever. If you're a developer and want to code smoothly without any lag and interruption then this is the laptop for you, features- 8GB ram,512GB hdd, intel core i5 8th gen 13.5inches",
    "img_7.jpeg",
    3
);

delete from Products where p_id=3;

SELECT * from Category;








