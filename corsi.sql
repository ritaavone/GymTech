CREATE TABLE corsi (
  nome_corso TEXT NOT NULL,
  posti_totali INTEGER NOT NULL,
  posti_disponibili INTEGER NOT NULL,
  PRIMARY KEY (nome_corso)
);

INSERT INTO corsi (nome_corso, posti_totali, posti_disponibili)
VALUES
  ('Zumba', 15, 15),
  ('Yoga', 15, 15),
  ('Sala Attrezzi', 15, 15),
  ('Pilates', 15, 15);
