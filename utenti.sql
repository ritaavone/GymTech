CREATE TABLE utenti (
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  nome TEXT NOT NULL,
  cognome TEXT NOT NULL,
  PRIMARY KEY (email, password)
);

INSERT INTO utenti (email, password, nome, cognome)
VALUES
('mario.rossi@gymtech.com', 'password1', 'Mario', 'Rossi'),
('laura.bianchi@gymtech.com', 'password2', 'Laura', 'Bianchi'),
('andrea.verdi@gymtech.com', 'password3', 'Andrea', 'Verdi'),
('sara.martinelli@gymtech.com', 'password4', 'Sara', 'Martinelli'),
('luca.rossi@gymtech.com', 'password5', 'Luca', 'Rossi'),
('giulia.ferrari@gymtech.com', 'password6', 'Giulia', 'Ferrari'),
('marco.colombo@gymtech.com', 'password7', 'Marco', 'Colombo'),
('alessia.conti@gymtech.com', 'password8', 'Alessia', 'Conti'),
('francesco.galli@gymtech.com', 'password9', 'Francesco', 'Galli'),
('elena.ricci@gymtech.com', 'password10', 'Elena', 'Ricci'),
('simone.moretti@gymtech.com', 'password11', 'Simone', 'Moretti'),
('fabio.rossi@gymtech.com', 'password11', 'Fabio', 'Rossi'),
('claudia.marini@gymtech.com', 'password12', 'Claudia', 'Marini'),
('paolo.ferri@gymtech.com', 'password13', 'Paolo', 'Ferri'),
('anna.bruno@gymtech.com', 'password14', 'Anna', 'Bruno'),
('giorgio.palumbo@gymtech.com', 'password15', 'Giorgio', 'Palumbo'),
('elisa.mazza@gymtech.com', 'password16', 'Elisa', 'Mazza'),
('marcello.marchetti@gymtech.com', 'password17', 'Marcello', 'Marchetti'),
('rosa.pellegrino@gymtech.com', 'password18', 'Rosa', 'Pellegrino'),
('stefano.monti@gymtech.com', 'password19', 'Stefano', 'Monti'),
('giada.bellini@gymtech.com', 'password20', 'Giada', 'Bellini'),
('roberto.moro@gymtech.com', 'password21', 'Roberto', 'Moro'),
('camilla.marchi@gymtech.com', 'password22', 'Camilla', 'Marchi'),
('davide.rossini@gymtech.com', 'password23', 'Davide', 'Rossini'),
('maria.colombo@gymtech.com', 'password24', 'Maria', 'Colombo'),
('luigi.romano@gymtech.com', 'password25', 'Luigi', 'Romano'),
('marta.damico@gymtech.com', 'password26', 'Marta', 'Amico'),
('giovanni.lombardi@gymtech.com', 'password27', 'Giovanni', 'Lombardi'),
('serena.palazzi@gymtech.com', 'password28', 'Serena', 'Palazzi'),
('andrea.ferretti@gymtech.com', 'password29', 'Andrea', 'Ferretti'),
('sabrina.belli@gymtech.com', 'password30', 'Sabrina', 'Belli'),
('elena.martinelli@gymtech.com', 'password31', 'Elena', 'Martinelli'),
('andrea.rossi@gymtech.com', 'password32', 'Andrea', 'Rossi'),
('valentina.pellegrini@gymtech.com', 'password33', 'Valentina', 'Pellegrini'),
('marco.ferri@gymtech.com', 'password34', 'Marco', 'Ferri'),
('sara.mazza@gymtech.com', 'password35', 'Sara', 'Mazza'),
('luigi.bruni@gymtech.com', 'password36', 'Luigi', 'Bruni'),
('francesca.verdi@gymtech.com', 'password37', 'Francesca', 'Verdi'),
('alessandro.conti@gymtech.com', 'password38', 'Alessandro', 'Conti'),
('giulia.palmieri@gymtech.com', 'password39', 'Giulia', 'Palmieri'),
('andrea.mariani@gymtech.com', 'password40', 'Andrea', 'Mariani'),
('elisabetta.mancini@gymtech.com', 'password41', 'Elisabetta', 'Mancini'),
('marco.gallo@gymtech.com', 'password42', 'Marco', 'Gallo'),
('serena.russo@gymtech.com', 'password43', 'Serena', 'Russo'),
('davide.rossi@gymtech.com', 'password44', 'Davide', 'Rossi'),
('valeria.monti@gymtech.com', 'password45', 'Valeria', 'Monti'),
('gianluca.greco@gymtech.com', 'password46', 'Gianluca', 'Greco'),
('elisa.ricci@gymtech.com', 'password47', 'Elisa', 'Ricci'),
('alessio.marini@gymtech.com', 'password48', 'Alessio', 'Marini'),
('francesca.bruno@gymtech.com', 'password49', 'Francesca', 'Bruno'),
('luca.ferretti@gymtech.com', 'password50', 'Luca', 'Ferretti'),
('alessandro.fabbri@gymtech.com', 'password51', 'Alessandro', 'Fabbri'),
('ludovica.mariani@gymtech.com', 'password52', 'Ludovica', 'Mariani'),
('andrea.russo@gymtech.com', 'password53', 'Andrea', 'Russo'),
('elisabetta.gallo@gymtech.com', 'password54', 'Elisabetta', 'Gallo'),
('marco.serra@gymtech.com', 'password55', 'Marco', 'Serra'),
('giorgia.palmieri@gymtech.com', 'password56', 'Giorgia', 'Palmieri'),
('michele.vitale@gymtech.com', 'password57', 'Michele', 'Vitale'),
('camilla.bruno@gymtech.com', 'password58', 'Camilla', 'Bruno'),
('daniele.piras@gymtech.com', 'password59', 'Daniele', 'Piras'),
('serena.santoro@gymtech.com', 'password60', 'Serena', 'Santoro'),
('alessio.marini@gymtech.com', 'password61', 'Alessio', 'Marini'),
('valeria.ricci@gymtech.com', 'password62', 'Valeria', 'Ricci'),
('gianluigi.colombo@gymtech.com', 'password63', 'Gianluigi', 'Colombo'),
('sara.battaglia@gymtech.com', 'password64', 'Sara', 'Battaglia'),
('marco.barone@gymtech.com', 'password65', 'Marco', 'Barone'),
('ilaria.monti@gymtech.com', 'password66', 'Ilaria', 'Monti'),
('francesco.leone@gymtech.com', 'password67', 'Francesco', 'Leone'),
('simona.rossi@gymtech.com', 'password68', 'Simona', 'Rossi'),
('lorenzo.mazzini@gymtech.com', 'password69', 'Lorenzo', 'Mazzini'),
('federica.bruni@gymtech.com', 'password70', 'Federica', 'Bruni'),
('stefano.verdi@gymtech.com', 'password71', 'Stefano', 'Verdi'),
('anna.gatti@gymtech.com', 'password72', 'Anna', 'Gatti'),
('marco.battaglia@gymtech.com', 'password73', 'Marco', 'Battaglia'),
('giulia.ricci@gymtech.com', 'password74', 'Giulia', 'Ricci'),
('andrea.bruno@gymtech.com', 'password75', 'Andrea', 'Bruno'),
('eleonora.moretti@gymtech.com', 'password76', 'Eleonora', 'Moretti'),
('luca.galli@gymtech.com', 'password77', 'Luca', 'Galli'),
('francesca.mancini@gymtech.com', 'password78', 'Francesca', 'Mancini'),
('davide.colombo@gymtech.com', 'password79', 'Davide', 'Colombo'),
('sara.palmieri@gymtech.com', 'password80', 'Sara', 'Palmieri'),
('andrea.rossi@gymtech.com', 'password81', 'Andrea', 'Rossi'),
('valentina.montagna@gymtech.com', 'password82', 'Valentina', 'Montagna'),
('luigi.mariani@gymtech.com', 'password83', 'Luigi', 'Mariani'),
('elisa.greco@gymtech.com', 'password84', 'Elisa', 'Greco'),
('marco.santoro@gymtech.com', 'password85', 'Marco', 'Santoro'),
('alessia.ferri@gymtech.com', 'password86', 'Alessia', 'Ferri'),
('riccardo.mazza@gymtech.com', 'password87', 'Riccardo', 'Mazza'),
('serena.romano@gymtech.com', 'password88', 'Serena', 'Romano'),
('giuseppe.fabbri@gymtech.com', 'password89', 'Giuseppe', 'Fabbri'),
('martina.caputo@gymtech.com', 'password90', 'Martina', 'Caputo'),
('linda.gatti@gymtech.com', 'password91', 'Linda', 'Gatti'),
('giorgio.bruni@gymtech.com', 'password92', 'Giorgio', 'Bruni'),
('elena.piras@gymtech.com', 'password93', 'Elena', 'Piras'),
('marco.bianchi@gymtech.com', 'password94', 'Marco', 'Bianchi'),
('chiara.ferraro@gymtech.com', 'password95', 'Chiara', 'Ferraro'),
('davide.mazzini@gymtech.com', 'password96', 'Davide', 'Mazzini'),
('simona.bruno@gymtech.com', 'password97', 'Simona', 'Bruno'),
('luca.ferretti@gymtech.com', 'password98', 'Luca', 'Ferretti'),
('martina.palumbo@gymtech.com', 'password99', 'Martina', 'Palumbo'),
('marco.conti@gymtech.com', 'password100', 'Marco', 'Conti');