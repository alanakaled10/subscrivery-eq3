CREATE DATABASE subscrivery
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    cpf VARCHAR(14) UNIQUE,
    telefone VARCHAR(20)
);


CREATE TABLE endereco (
    id_endereco INT AUTO_INCREMENT PRIMARY KEY,
    logradouro VARCHAR(150) NOT NULL,
    numero VARCHAR(20),
    complemento VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(50),
    cep VARCHAR(15),

    fk_usuario_id_usuario INT NOT NULL,
    FOREIGN KEY (fk_usuario_id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE
);


CREATE TABLE plano (
    id_plano INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    descricao TEXT,
    valor_mensal DECIMAL(10,2) NOT NULL
);


CREATE TABLE frequencia (
    id_frequencia INT AUTO_INCREMENT PRIMARY KEY,
    frequencia VARCHAR(50) NOT NULL,
    dias_intervalo INT NOT NULL
);


CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT
);

CREATE TABLE fornecedor (
    id_fornecedor INT AUTO_INCREMENT PRIMARY KEY,
    cnpj VARCHAR(18) UNIQUE,
    nome_fantasia VARCHAR(150) NOT NULL,
    razao_social VARCHAR(150),
    status ENUM('ativo', 'inativo') DEFAULT 'ativo'
);


CREATE TABLE fornecedor_categoria (
    fk_categoria_id_categoria INT NOT NULL,
    fk_fornecedor_id_fornecedor INT NOT NULL,

    PRIMARY KEY (fk_categoria_id_categoria, fk_fornecedor_id_fornecedor),

    FOREIGN KEY (fk_categoria_id_categoria)
        REFERENCES categoria(id_categoria)
        ON DELETE CASCADE,

    FOREIGN KEY (fk_fornecedor_id_fornecedor)
        REFERENCES fornecedor(id_fornecedor)
        ON DELETE CASCADE
);


CREATE TABLE assinatura (
    id_assinatura INT AUTO_INCREMENT PRIMARY KEY,
    proxima_entrega DATE,
    status ENUM('ativa', 'pausada', 'cancelada') DEFAULT 'ativa',
    data_inicio DATE NOT NULL,

    fk_usuario_id_usuario INT NOT NULL,
    fk_plano_id_plano INT NOT NULL,
    fk_frequencia_id_frequencia INT NOT NULL,
    fk_fornecedor_id_fornecedor INT NOT NULL,

    FOREIGN KEY (fk_usuario_id_usuario)
        REFERENCES usuario(id_usuario),

    FOREIGN KEY (fk_plano_id_plano)
        REFERENCES plano(id_plano),

    FOREIGN KEY (fk_frequencia_id_frequencia)
        REFERENCES frequencia(id_frequencia),

    FOREIGN KEY (fk_fornecedor_id_fornecedor)
        REFERENCES fornecedor(id_fornecedor)
);


CREATE TABLE pedidos (
    id_pedidos INT AUTO_INCREMENT PRIMARY KEY,
    data_compra DATE NOT NULL,
    data_entrega DATE,

    fk_assinatura_id_assinatura INT NOT NULL,
    FOREIGN KEY (fk_assinatura_id_assinatura)
        REFERENCES assinatura(id_assinatura)
);


CREATE TABLE status_pedidos (
    id_status INT AUTO_INCREMENT PRIMARY KEY,
    status VARCHAR(50) NOT NULL,
    data_evento DATETIME NOT NULL,

    fk_pedidos_id_pedidos INT NOT NULL,
    FOREIGN KEY (fk_pedidos_id_pedidos)
        REFERENCES pedidos(id_pedidos)
        ON DELETE CASCADE
);


CREATE TABLE pagamento (
    id_pagamento INT AUTO_INCREMENT PRIMARY KEY,
    forma_pagamento ENUM('credito', 'debito') NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,

    fk_pedidos_id_pedidos INT NOT NULL,
    FOREIGN KEY (fk_pedidos_id_pedidos)
        REFERENCES pedidos(id_pedidos)
);
