CREATE TABLE prenotazioni (
  email_utente VARCHAR(100),
  password_utente VARCHAR(255),
  nome_corso VARCHAR(100),
  data_prenotazione DATETIME,
  PRIMARY KEY (email_utente, nome_corso),
  FOREIGN KEY (email_utente) REFERENCES utenti (email),
  FOREIGN KEY (nome_corso) REFERENCES corsi (nome_corso)
);



