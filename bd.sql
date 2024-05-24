use restaurante;

CREATE TABLE pedidos (
    id_pedido INT PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    Nom_pedido VARCHAR(50),
    cantidad VARCHAR(30),
    FOREIGN KEY (user_id) REFERENCES admin(user_id)
) ENGINE=InnoDB;

CREATE TABLE Compra (
    id_compra INT PRIMARY KEY NOT NULL,
    id_pedido INT NOT NULL,
    Nom_pedido VARCHAR(50),
    Cant_Pagar VARCHAR(30),
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido)
) ENGINE=InnoDB;
ALTER TABLE admin
ADD COLUMN password VARCHAR(255) NOT NULL;


