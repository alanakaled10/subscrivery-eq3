-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 24/12/2025 às 01:08
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `subscrivery`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `assinatura`
--

CREATE TABLE `assinatura` (
  `id_assinatura` int(11) NOT NULL,
  `proxima_entrega` date DEFAULT NULL,
  `status` enum('ativa','pausada','cancelada') DEFAULT 'ativa',
  `data_inicio` datetime DEFAULT current_timestamp(),
  `fk_usuario_id_usuario` int(11) NOT NULL,
  `fk_plano_id_plano` int(11) NOT NULL,
  `fk_frequencia_id_frequencia` int(11) NOT NULL,
  `fk_fornecedor_id_fornecedor` int(11) NOT NULL,
  `endereco_entrega` text NOT NULL,
  `forma_pagamento` enum('cartão de crédito','cartão de débito') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `categoria`
--

CREATE TABLE `categoria` (
  `id_categoria` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `descricao` text DEFAULT NULL,
  `cor_fundo` varchar(255) DEFAULT NULL,
  `imagem` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `categoria`
--

INSERT INTO `categoria` (`id_categoria`, `nome`, `descricao`, `cor_fundo`, `imagem`) VALUES
(1, 'Alimentação', 'Produtos de supermercado e mercearia', NULL, NULL),
(2, 'Higiene', 'Produtos de limpeza e cuidado pessoal', NULL, NULL),
(3, 'Pet', 'Ração e itens para animais de estimação', NULL, NULL),
(4, 'Bebidas', 'Águas, sucos, refrigerantes e outros', NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `endereco`
--

CREATE TABLE `endereco` (
  `id_endereco` int(11) NOT NULL,
  `logradouro` varchar(150) NOT NULL,
  `numero` varchar(20) DEFAULT NULL,
  `complemento` varchar(100) DEFAULT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `cep` varchar(15) DEFAULT NULL,
  `fk_usuario_id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `fornecedor`
--

CREATE TABLE `fornecedor` (
  `id_fornecedor` int(11) NOT NULL,
  `cnpj` varchar(18) DEFAULT NULL,
  `nome_fantasia` varchar(150) NOT NULL,
  `razao_social` varchar(150) DEFAULT NULL,
  `status` enum('ativo','inativo') DEFAULT 'ativo',
  `cidade` varchar(100) NOT NULL,
  `bairro` varchar(100) DEFAULT NULL,
  `logradouro` varchar(255) DEFAULT NULL,
  `id_categoria` int(11) DEFAULT NULL,
  `senha` varchar(255) NOT NULL,
  `email` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `fornecedor`
--

INSERT INTO `fornecedor` (`id_fornecedor`, `cnpj`, `nome_fantasia`, `razao_social`, `status`, `cidade`, `bairro`, `logradouro`, `id_categoria`, `senha`, `email`) VALUES
(1, '12.345.678/0001-01', 'Supermercado Central', NULL, 'ativo', 'São Paulo', 'Centro', NULL, 1, '', ''),
(2, '23.456.789/0001-02', 'Pet Shop Amigão', NULL, 'ativo', 'São Paulo', 'Pinheiros', NULL, 3, '', ''),
(3, '34.567.890/0001-03', 'Farmácia Saúde', NULL, 'ativo', 'Rio de Janeiro', 'Copacabana', NULL, 2, '', ''),
(4, NULL, 'alana caled', NULL, 'ativo', '', NULL, NULL, NULL, '123456987', 'alana@gamaill.com'),
(5, NULL, 'ivone santana', NULL, 'ativo', '', NULL, NULL, NULL, '$2b$10$2lGtusOaCdiVo4ZO8qfrXOmrVumEsLe27IW59oBsJRcUD99IdgMP6', 'ivone@gmail.com'),
(6, NULL, 'kaled ltda', NULL, 'ativo', '', NULL, NULL, NULL, '$2b$10$GUWTfOneKuHwRRw6XB.bGOKBw/zhlKkGyBF/oqE4da.9WVMXq/DIu', 'lta@gmil.com');

-- --------------------------------------------------------

--
-- Estrutura para tabela `frequencia`
--

CREATE TABLE `frequencia` (
  `id_frequencia` int(11) NOT NULL,
  `frequencia` varchar(50) NOT NULL,
  `dias_intervalo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `itens_pedido`
--

CREATE TABLE `itens_pedido` (
  `id_item_pedido` int(11) NOT NULL,
  `quantidade` int(11) NOT NULL DEFAULT 1,
  `preco_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `fk_pedidos_id_pedidos` int(11) NOT NULL,
  `fk_products_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `pagamento`
--

CREATE TABLE `pagamento` (
  `id_pagamento` int(11) NOT NULL,
  `forma_pagamento` enum('credito','debito') NOT NULL,
  `valor_total` decimal(10,2) NOT NULL,
  `fk_pedidos_id_pedidos` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `pedidos`
--

CREATE TABLE `pedidos` (
  `id_pedidos` int(11) NOT NULL,
  `fk_fornecedor_id_fornecedor` int(11) NOT NULL,
  `data_compra` date NOT NULL,
  `data_entrega` date DEFAULT NULL,
  `valor_total` decimal(10,2) DEFAULT 0.00,
  `status` enum('pendente','processando','enviado','entregue','cancelado') DEFAULT 'pendente',
  `observacoes` text DEFAULT NULL,
  `fk_assinatura_id_assinatura` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `plano`
--

CREATE TABLE `plano` (
  `id_plano` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `descricao` text DEFAULT NULL,
  `valor_mensal` decimal(10,2) NOT NULL,
  `limite_produtos_valor` decimal(10,2) NOT NULL,
  `duracao_meses` int(11) DEFAULT 1,
  `entrega_rapida` tinyint(1) DEFAULT 0,
  `beneficios_especiais` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `plano`
--

INSERT INTO `plano` (`id_plano`, `nome`, `descricao`, `valor_mensal`, `limite_produtos_valor`, `duracao_meses`, `entrega_rapida`, `beneficios_especiais`) VALUES
(1, 'Básico', 'Acesso padrão e entregas programadas.', 49.90, 200.00, 1, 0, 'Cupons mensais básicos.'),
(2, 'Intermediário', 'Melhor custo-benefício com maior limite de produtos.', 89.90, 400.00, 1, 0, 'Cupons premium e 1 frete grátis/mês.'),
(3, 'Premium', 'Acesso total com entregas rápidas e prioridade.', 149.90, 700.00, 1, 1, 'Suporte 24h e cupons exclusivos.'),
(4, 'Avulso', 'Pague apenas o frete por pedido pontual.', 0.00, 0.00, 1, 0, 'Ideal para novos usuários conhecerem a plataforma.');

-- --------------------------------------------------------

--
-- Estrutura para tabela `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nome` varchar(255) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descricao` text DEFAULT NULL,
  `imagem` varchar(2048) DEFAULT NULL,
  `quantidade` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `valor` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `status_pedidos`
--

CREATE TABLE `status_pedidos` (
  `id_status` int(11) NOT NULL,
  `status` varchar(50) NOT NULL,
  `data_evento` timestamp NOT NULL DEFAULT current_timestamp(),
  `fk_pedidos_id_pedidos` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nome_completo` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `cpf` varchar(14) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `senha_hash` text NOT NULL,
  `email_validado` tinyint(1) DEFAULT 0,
  `token_validacao` varchar(255) DEFAULT NULL,
  `token_recuperacao` varchar(255) DEFAULT NULL,
  `data_expiracao_token` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nome_completo`, `email`, `cpf`, `telefone`, `senha_hash`, `email_validado`, `token_validacao`, `token_recuperacao`, `data_expiracao_token`) VALUES
(1, 'mel manu', 'melmanu@gmail.com', NULL, '789654123', '$2b$10$1lIHn6gsdi1vaRcKD/STXO2hFIt14NLgcvBtqte/SFixBybeoURx.', 0, NULL, NULL, NULL),
(2, 'alana caled', 'alana@alana.com', NULL, '0147852369', '$2b$10$kllDNwBBj0yTjSbM/VQ/DOUa7ETqX00ERg5xanm7NI5B/hT1FSadi', 0, NULL, NULL, NULL),
(4, 'alana caled borges ', 'marcos@alana.com', NULL, '77991251756', '$2b$10$Eb1h2.MS4RNQmjgToQCXPutwMV9BFiaoGDaaeZraWCGHSMCIsczSK', 0, NULL, NULL, NULL),
(5, 'esquipe 3', 'usuario@usuario.com', NULL, '789456123', '$2b$10$IOuOS1TqYPNsAQhQXjikSuoluJGTe.qtL/kwl3K0nkyRO6aTIcrMG', 0, NULL, '2a5a21a6e66acce79af86a4cc161e72374c09e92', '2025-12-20 19:02:55'),
(6, 'marcos henrique', 'marcoshenrique@gmail.com', NULL, '78954562123', '$2b$10$KskELHbi4OmSqym6yHbzxexVVhbUW7nLU.dcDy4PK8to4T9oHymh2', 0, NULL, NULL, NULL),
(7, 'tste teste', 'teste@teste.com', NULL, '25256321456', '$2b$10$m3CdEXSNYr0FfmVrmJWuJeGw.MKsIPm64OMmLOrDyemROwhWjFK7a', 0, NULL, NULL, NULL),
(8, 'João Silva', 'joao@email.com', '12345678900', '11999999999', '$2b$10$qQakxS/bfKuU9vp9mIAEH.UsrPl.VNeFmBKdcO/MSEKBt.vIXN1ra', 0, NULL, NULL, NULL);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `assinatura`
--
ALTER TABLE `assinatura`
  ADD PRIMARY KEY (`id_assinatura`),
  ADD KEY `fk_usuario_id_usuario` (`fk_usuario_id_usuario`),
  ADD KEY `fk_plano_id_plano` (`fk_plano_id_plano`),
  ADD KEY `fk_frequencia_id_frequencia` (`fk_frequencia_id_frequencia`),
  ADD KEY `fk_fornecedor_id_fornecedor` (`fk_fornecedor_id_fornecedor`);

--
-- Índices de tabela `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Índices de tabela `endereco`
--
ALTER TABLE `endereco`
  ADD PRIMARY KEY (`id_endereco`),
  ADD KEY `fk_usuario_id_usuario` (`fk_usuario_id_usuario`);

--
-- Índices de tabela `fornecedor`
--
ALTER TABLE `fornecedor`
  ADD PRIMARY KEY (`id_fornecedor`),
  ADD UNIQUE KEY `cnpj` (`cnpj`),
  ADD KEY `fk_fornecedor_categoria` (`id_categoria`);

--
-- Índices de tabela `frequencia`
--
ALTER TABLE `frequencia`
  ADD PRIMARY KEY (`id_frequencia`);

--
-- Índices de tabela `itens_pedido`
--
ALTER TABLE `itens_pedido`
  ADD PRIMARY KEY (`id_item_pedido`),
  ADD KEY `fk_itens_pedido_pedido` (`fk_pedidos_id_pedidos`),
  ADD KEY `fk_itens_pedido_products` (`fk_products_id`);

--
-- Índices de tabela `pagamento`
--
ALTER TABLE `pagamento`
  ADD PRIMARY KEY (`id_pagamento`),
  ADD KEY `fk_pedidos_id_pedidos` (`fk_pedidos_id_pedidos`);

--
-- Índices de tabela `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id_pedidos`),
  ADD KEY `fk_assinatura_id_assinatura` (`fk_assinatura_id_assinatura`),
  ADD KEY `fk_pedido_fornecedor` (`fk_fornecedor_id_fornecedor`);

--
-- Índices de tabela `plano`
--
ALTER TABLE `plano`
  ADD PRIMARY KEY (`id_plano`);

--
-- Índices de tabela `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_nome` (`nome`),
  ADD KEY `idx_titulo` (`titulo`);

--
-- Índices de tabela `status_pedidos`
--
ALTER TABLE `status_pedidos`
  ADD PRIMARY KEY (`id_status`),
  ADD KEY `fk_pedidos_id_pedidos` (`fk_pedidos_id_pedidos`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `cpf` (`cpf`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `assinatura`
--
ALTER TABLE `assinatura`
  MODIFY `id_assinatura` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `endereco`
--
ALTER TABLE `endereco`
  MODIFY `id_endereco` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `fornecedor`
--
ALTER TABLE `fornecedor`
  MODIFY `id_fornecedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `frequencia`
--
ALTER TABLE `frequencia`
  MODIFY `id_frequencia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `itens_pedido`
--
ALTER TABLE `itens_pedido`
  MODIFY `id_item_pedido` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `pagamento`
--
ALTER TABLE `pagamento`
  MODIFY `id_pagamento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id_pedidos` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `plano`
--
ALTER TABLE `plano`
  MODIFY `id_plano` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `status_pedidos`
--
ALTER TABLE `status_pedidos`
  MODIFY `id_status` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `assinatura`
--
ALTER TABLE `assinatura`
  ADD CONSTRAINT `assinatura_ibfk_1` FOREIGN KEY (`fk_usuario_id_usuario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `assinatura_ibfk_2` FOREIGN KEY (`fk_plano_id_plano`) REFERENCES `plano` (`id_plano`),
  ADD CONSTRAINT `assinatura_ibfk_3` FOREIGN KEY (`fk_frequencia_id_frequencia`) REFERENCES `frequencia` (`id_frequencia`),
  ADD CONSTRAINT `assinatura_ibfk_4` FOREIGN KEY (`fk_fornecedor_id_fornecedor`) REFERENCES `fornecedor` (`id_fornecedor`);

--
-- Restrições para tabelas `endereco`
--
ALTER TABLE `endereco`
  ADD CONSTRAINT `endereco_ibfk_1` FOREIGN KEY (`fk_usuario_id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Restrições para tabelas `fornecedor`
--
ALTER TABLE `fornecedor`
  ADD CONSTRAINT `fk_fornecedor_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`);

--
-- Restrições para tabelas `itens_pedido`
--
ALTER TABLE `itens_pedido`
  ADD CONSTRAINT `fk_itens_pedido_pedido` FOREIGN KEY (`fk_pedidos_id_pedidos`) REFERENCES `pedidos` (`id_pedidos`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_itens_pedido_products` FOREIGN KEY (`fk_products_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `pagamento`
--
ALTER TABLE `pagamento`
  ADD CONSTRAINT `pagamento_ibfk_1` FOREIGN KEY (`fk_pedidos_id_pedidos`) REFERENCES `pedidos` (`id_pedidos`);

--
-- Restrições para tabelas `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `fk_pedido_fornecedor` FOREIGN KEY (`fk_fornecedor_id_fornecedor`) REFERENCES `fornecedor` (`id_fornecedor`),
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`fk_assinatura_id_assinatura`) REFERENCES `assinatura` (`id_assinatura`);

--
-- Restrições para tabelas `status_pedidos`
--
ALTER TABLE `status_pedidos`
  ADD CONSTRAINT `status_pedidos_ibfk_1` FOREIGN KEY (`fk_pedidos_id_pedidos`) REFERENCES `pedidos` (`id_pedidos`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
