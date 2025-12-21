-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           10.4.32-MariaDB - mariadb.org binary distribution
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.14.0.7165
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para subscrivery
CREATE DATABASE IF NOT EXISTS `subscrivery` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `subscrivery`;

-- Copiando estrutura para tabela subscrivery.assinatura
CREATE TABLE IF NOT EXISTS `assinatura` (
  `id_assinatura` int(11) NOT NULL AUTO_INCREMENT,
  `proxima_entrega` date DEFAULT NULL,
  `status` enum('ativa','pausada','cancelada') DEFAULT 'ativa',
  `data_inicio` datetime DEFAULT current_timestamp(),
  `fk_usuario_id_usuario` int(11) NOT NULL,
  `fk_plano_id_plano` int(11) NOT NULL,
  `fk_frequencia_id_frequencia` int(11) NOT NULL,
  `fk_fornecedor_id_fornecedor` int(11) NOT NULL,
  `endereco_entrega` text NOT NULL,
  `forma_pagamento` enum('cartão de crédito','cartão de débito') NOT NULL,
  PRIMARY KEY (`id_assinatura`),
  KEY `fk_usuario_id_usuario` (`fk_usuario_id_usuario`),
  KEY `fk_plano_id_plano` (`fk_plano_id_plano`),
  KEY `fk_frequencia_id_frequencia` (`fk_frequencia_id_frequencia`),
  KEY `fk_fornecedor_id_fornecedor` (`fk_fornecedor_id_fornecedor`),
  CONSTRAINT `assinatura_ibfk_1` FOREIGN KEY (`fk_usuario_id_usuario`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `assinatura_ibfk_2` FOREIGN KEY (`fk_plano_id_plano`) REFERENCES `plano` (`id_plano`),
  CONSTRAINT `assinatura_ibfk_3` FOREIGN KEY (`fk_frequencia_id_frequencia`) REFERENCES `frequencia` (`id_frequencia`),
  CONSTRAINT `assinatura_ibfk_4` FOREIGN KEY (`fk_fornecedor_id_fornecedor`) REFERENCES `fornecedor` (`id_fornecedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela subscrivery.assinatura: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela subscrivery.categoria
CREATE TABLE IF NOT EXISTS `categoria` (
  `id_categoria` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `descricao` text DEFAULT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela subscrivery.categoria: ~4 rows (aproximadamente)
INSERT INTO `categoria` (`id_categoria`, `nome`, `descricao`) VALUES
	(1, 'Alimentação', 'Produtos de supermercado e mercearia'),
	(2, 'Higiene', 'Produtos de limpeza e cuidado pessoal'),
	(3, 'Pet', 'Ração e itens para animais de estimação'),
	(4, 'Bebidas', 'Águas, sucos, refrigerantes e outros');

-- Copiando estrutura para tabela subscrivery.endereco
CREATE TABLE IF NOT EXISTS `endereco` (
  `id_endereco` int(11) NOT NULL AUTO_INCREMENT,
  `logradouro` varchar(150) NOT NULL,
  `numero` varchar(20) DEFAULT NULL,
  `complemento` varchar(100) DEFAULT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `cep` varchar(15) DEFAULT NULL,
  `fk_usuario_id_usuario` int(11) NOT NULL,
  PRIMARY KEY (`id_endereco`),
  KEY `fk_usuario_id_usuario` (`fk_usuario_id_usuario`),
  CONSTRAINT `endereco_ibfk_1` FOREIGN KEY (`fk_usuario_id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela subscrivery.endereco: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela subscrivery.fornecedor
CREATE TABLE IF NOT EXISTS `fornecedor` (
  `id_fornecedor` int(11) NOT NULL AUTO_INCREMENT,
  `cnpj` varchar(18) DEFAULT NULL,
  `nome_fantasia` varchar(150) NOT NULL,
  `razao_social` varchar(150) DEFAULT NULL,
  `status` enum('ativo','inativo') DEFAULT 'ativo',
  `cidade` varchar(100) NOT NULL,
  `bairro` varchar(100) DEFAULT NULL,
  `logradouro` varchar(255) DEFAULT NULL,
  `id_categoria` int(11) DEFAULT NULL,
  `senha` varchar(255) NOT NULL,
  `email` varchar(150) NOT NULL,
  PRIMARY KEY (`id_fornecedor`),
  UNIQUE KEY `cnpj` (`cnpj`),
  KEY `fk_fornecedor_categoria` (`id_categoria`),
  CONSTRAINT `fk_fornecedor_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela subscrivery.fornecedor: ~3 rows (aproximadamente)
INSERT INTO `fornecedor` (`id_fornecedor`, `cnpj`, `nome_fantasia`, `razao_social`, `status`, `cidade`, `bairro`, `logradouro`, `id_categoria`, `senha`, `email`) VALUES
	(1, '12.345.678/0001-01', 'Supermercado Central', NULL, 'ativo', 'São Paulo', 'Centro', NULL, 1, '', ''),
	(2, '23.456.789/0001-02', 'Pet Shop Amigão', NULL, 'ativo', 'São Paulo', 'Pinheiros', NULL, 3, '', ''),
	(3, '34.567.890/0001-03', 'Farmácia Saúde', NULL, 'ativo', 'Rio de Janeiro', 'Copacabana', NULL, 2, '', ''),
	(4, NULL, 'alana caled', NULL, 'ativo', '', NULL, NULL, NULL, '123456987', 'alana@gamaill.com'),
	(5, NULL, 'ivone santana', NULL, 'ativo', '', NULL, NULL, NULL, '$2b$10$2lGtusOaCdiVo4ZO8qfrXOmrVumEsLe27IW59oBsJRcUD99IdgMP6', 'ivone@gmail.com'),
	(6, NULL, 'kaled ltda', NULL, 'ativo', '', NULL, NULL, NULL, '$2b$10$GUWTfOneKuHwRRw6XB.bGOKBw/zhlKkGyBF/oqE4da.9WVMXq/DIu', 'lta@gmil.com');

-- Copiando estrutura para tabela subscrivery.frequencia
CREATE TABLE IF NOT EXISTS `frequencia` (
  `id_frequencia` int(11) NOT NULL AUTO_INCREMENT,
  `frequencia` varchar(50) NOT NULL,
  `dias_intervalo` int(11) NOT NULL,
  PRIMARY KEY (`id_frequencia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela subscrivery.frequencia: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela subscrivery.pagamento
CREATE TABLE IF NOT EXISTS `pagamento` (
  `id_pagamento` int(11) NOT NULL AUTO_INCREMENT,
  `forma_pagamento` enum('credito','debito') NOT NULL,
  `valor_total` decimal(10,2) NOT NULL,
  `fk_pedidos_id_pedidos` int(11) NOT NULL,
  PRIMARY KEY (`id_pagamento`),
  KEY `fk_pedidos_id_pedidos` (`fk_pedidos_id_pedidos`),
  CONSTRAINT `pagamento_ibfk_1` FOREIGN KEY (`fk_pedidos_id_pedidos`) REFERENCES `pedidos` (`id_pedidos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela subscrivery.pagamento: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela subscrivery.pedidos
CREATE TABLE IF NOT EXISTS `pedidos` (
  `id_pedidos` int(11) NOT NULL AUTO_INCREMENT,
  `data_compra` date NOT NULL,
  `data_entrega` date DEFAULT NULL,
  `fk_assinatura_id_assinatura` int(11) NOT NULL,
  PRIMARY KEY (`id_pedidos`),
  KEY `fk_assinatura_id_assinatura` (`fk_assinatura_id_assinatura`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`fk_assinatura_id_assinatura`) REFERENCES `assinatura` (`id_assinatura`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela subscrivery.pedidos: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela subscrivery.plano
CREATE TABLE IF NOT EXISTS `plano` (
  `id_plano` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `descricao` text DEFAULT NULL,
  `valor_mensal` decimal(10,2) NOT NULL,
  `limite_produtos_valor` decimal(10,2) NOT NULL,
  `duracao_meses` int(11) DEFAULT 1,
  `entrega_rapida` tinyint(1) DEFAULT 0,
  `beneficios_especiais` text DEFAULT NULL,
  PRIMARY KEY (`id_plano`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela subscrivery.plano: ~4 rows (aproximadamente)
INSERT INTO `plano` (`id_plano`, `nome`, `descricao`, `valor_mensal`, `limite_produtos_valor`, `duracao_meses`, `entrega_rapida`, `beneficios_especiais`) VALUES
	(1, 'Básico', 'Acesso padrão e entregas programadas.', 49.90, 200.00, 1, 0, 'Cupons mensais básicos.'),
	(2, 'Intermediário', 'Melhor custo-benefício com maior limite de produtos.', 89.90, 400.00, 1, 0, 'Cupons premium e 1 frete grátis/mês.'),
	(3, 'Premium', 'Acesso total com entregas rápidas e prioridade.', 149.90, 700.00, 1, 1, 'Suporte 24h e cupons exclusivos.'),
	(4, 'Avulso', 'Pague apenas o frete por pedido pontual.', 0.00, 0.00, 1, 0, 'Ideal para novos usuários conhecerem a plataforma.');

-- Copiando estrutura para tabela subscrivery.status_pedidos
CREATE TABLE IF NOT EXISTS `status_pedidos` (
  `id_status` int(11) NOT NULL AUTO_INCREMENT,
  `status` varchar(50) NOT NULL,
  `data_evento` timestamp NOT NULL DEFAULT current_timestamp(),
  `fk_pedidos_id_pedidos` int(11) NOT NULL,
  PRIMARY KEY (`id_status`),
  KEY `fk_pedidos_id_pedidos` (`fk_pedidos_id_pedidos`),
  CONSTRAINT `status_pedidos_ibfk_1` FOREIGN KEY (`fk_pedidos_id_pedidos`) REFERENCES `pedidos` (`id_pedidos`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela subscrivery.status_pedidos: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela subscrivery.usuario
CREATE TABLE IF NOT EXISTS `usuario` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nome_completo` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `cpf` varchar(14) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `senha_hash` text NOT NULL,
  `email_validado` tinyint(1) DEFAULT 0,
  `token_validacao` varchar(255) DEFAULT NULL,
  `token_recuperacao` varchar(255) DEFAULT NULL,
  `data_expiracao_token` datetime DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `cpf` (`cpf`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela subscrivery.usuario: ~6 rows (aproximadamente)
INSERT INTO `usuario` (`id_usuario`, `nome_completo`, `email`, `cpf`, `telefone`, `senha_hash`, `email_validado`, `token_validacao`, `token_recuperacao`, `data_expiracao_token`) VALUES
	(1, 'mel manu', 'melmanu@gmail.com', NULL, '789654123', '$2b$10$1lIHn6gsdi1vaRcKD/STXO2hFIt14NLgcvBtqte/SFixBybeoURx.', 0, NULL, NULL, NULL),
	(2, 'alana caled', 'alana@alana.com', NULL, '0147852369', '$2b$10$kllDNwBBj0yTjSbM/VQ/DOUa7ETqX00ERg5xanm7NI5B/hT1FSadi', 0, NULL, NULL, NULL),
	(4, 'alana caled borges ', 'marcos@alana.com', NULL, '77991251756', '$2b$10$Eb1h2.MS4RNQmjgToQCXPutwMV9BFiaoGDaaeZraWCGHSMCIsczSK', 0, NULL, NULL, NULL),
	(5, 'esquipe 3', 'usuario@usuario.com', NULL, '789456123', '$2b$10$IOuOS1TqYPNsAQhQXjikSuoluJGTe.qtL/kwl3K0nkyRO6aTIcrMG', 0, NULL, '2a5a21a6e66acce79af86a4cc161e72374c09e92', '2025-12-20 19:02:55'),
	(6, 'marcos henrique', 'marcoshenrique@gmail.com', NULL, '78954562123', '$2b$10$KskELHbi4OmSqym6yHbzxexVVhbUW7nLU.dcDy4PK8to4T9oHymh2', 0, NULL, NULL, NULL),
	(7, 'tste teste', 'teste@teste.com', NULL, '25256321456', '$2b$10$m3CdEXSNYr0FfmVrmJWuJeGw.MKsIPm64OMmLOrDyemROwhWjFK7a', 0, NULL, NULL, NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
