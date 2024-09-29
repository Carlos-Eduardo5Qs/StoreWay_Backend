CREATE DATABASE storeway CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE storeway;

CREATE TABLE user_profile (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  status_ ENUM('online', 'offline') DEFAULT 'offline',
  nick VARCHAR(60) NOT NULL,
  user_name VARCHAR(60) NOT NULL,
  email VARCHAR(60) NOT NULL,
  password_ VARCHAR(100) NOT NULL,
  phone CHAR(9),
  cpf CHAR(11),
  sex VARCHAR(50),
  birth DATE,
  img_url VARCHAR(255),
  access_level ENUM('adm', 'client') DEFAULT 'client',
  config_2FA ENUM('yes', 'no') DEFAULT 'no'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE products (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  name VARCHAR(60) NOT NULL,
  image VARCHAR(255),
  image_id VARCHAR(255),
  image_filename VARCHAR(255),
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(300) NOT NULL,
  brand VARCHAR(50) NOT NULL,
  stock INT NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE avaliation (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  review TEXT,
  stars INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profile(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE photoAvaliation (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  avaliation_id INT NOT NULL,
  image varchar(255),
  image_id varchar(255),
  image_filename varchar(255),
  FOREIGN KEY (avaliation_id) REFERENCES avaliation(id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

DELIMITER //

CREATE TRIGGER update_avaliation_timestamp
AFTER UPDATE ON photoAvaliation
FOR EACH ROW
BEGIN
  UPDATE avaliation
  SET updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.avaliation_id;
END //

DELIMITER ;
