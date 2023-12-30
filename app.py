from flask import Flask, request, send_from_directory, session
from flask_cors import CORS
import mysql.connector
from datetime import datetime

app = Flask(__name__, static_url_path='', static_folder='')
CORS(app, origins="*")
app.secret_key = "MariaRita.2001"

def get_db_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='MariaRita.2001',
        database='gymtech'
    )

def check_user_credentials(email, password, conn):
    try:
        if not conn.is_connected():
            conn.reconnect()

        cursor = conn.cursor()
        cursor.execute("SELECT * FROM utenti WHERE email = %s AND password = %s", (email, password))
        user = cursor.fetchone()
        cursor.close()

        if user:
            print(f"Credenziali valide per l'utente con email {email}")
            session['user_email'] = email
            session['user_email_password'] = password
            return '1'
        else:
            print(f"Credenziali non valide per l'utente con email {email}")
            return '0'

    except Exception as e:
        print(f"Errore durante la verifica delle credenziali: {str(e)}")
        return '0'


def is_user_already_booked(email, nome_corso, conn):
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM prenotazioni WHERE email_utente = %s AND nome_corso = %s", (email, nome_corso))
            existing_booking = cursor.fetchone()
            return existing_booking is not None
    except Exception as e:
        print(f"Errore durante la verifica della prenotazione: {str(e)}")
        return False

# Modifica la funzione di cancellazione nel file Python
def cancel_booking(email, nome_corso, conn):
    try:
        with conn.cursor() as cursor:
            
            # Prova ad eliminare la prenotazione
            cursor.execute("DELETE FROM prenotazioni WHERE email_utente = %s AND nome_corso = %s", (email, nome_corso))
            
            if cursor.rowcount == 0:
                # Nessuna riga è stata cancellata, la prenotazione non è presente
                return '0'
            
            # Recupera il numero attuale di posti disponibili
            cursor.execute("SELECT posti_disponibili FROM corsi WHERE nome_corso = %s", (nome_corso,))
            posti_disponibili_attuali = cursor.fetchone()[0]

            # Incrementa i posti disponibili e assicurati che non superino il massimo
            posti_disponibili_attuali = min(posti_disponibili_attuali + 1, 15)

            # Aggiorna i posti disponibili
            cursor.execute("UPDATE corsi SET posti_disponibili = %s WHERE nome_corso = %s", (posti_disponibili_attuali, nome_corso))

            conn.commit()
            print(f"Prenotazione annullata per l'utente con email {email} e corso {nome_corso}")
            return '1'
    except Exception as e:
        print(f"Errore durante l'annullamento della prenotazione: {str(e)}")
        return '-1'

def book_course(email, nome_corso, conn):
    try:
        data_prenotazione = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"Debug: {email}, {nome_corso}, {data_prenotazione}")

        # Verifica le credenziali dell'utente
        password = session.get('user_email_password')
        if not password:
            print("La password è mancante o nulla.")
            return 'La password è mancante o nulla.', 500

        auth_result = check_user_credentials(email, password, conn)

        if auth_result == '1':
            # Verifica se l'utente ha già prenotato questo corso
            if is_user_already_booked(email, nome_corso, conn):
                print(f"L'utente con email {email} ha già prenotato il corso {nome_corso}")
                return 'Utente già prenotato', 409

            # Inserisci l'utente nella tabella prenotazioni
            with conn.cursor() as cursor:
                
                # Recupera il numero attuale di posti disponibili
                cursor.execute("SELECT posti_disponibili FROM corsi WHERE nome_corso = %s", (nome_corso,))
                posti_disponibili_attuali = cursor.fetchone()[0]

                # Verifica se ci sono posti disponibili
                if posti_disponibili_attuali > 0:
                # Decrementa i posti disponibili e assicurati che siano almeno 0
                    posti_disponibili_attuali = max(posti_disponibili_attuali - 1, 0)

                # Aggiorna i posti disponibili
                cursor.execute("UPDATE corsi SET posti_disponibili = %s WHERE nome_corso = %s", (posti_disponibili_attuali, nome_corso))

                # Inserisci l'utente nella tabella prenotazioni
                cursor.execute("INSERT INTO prenotazioni (email_utente, password_utente, nome_corso, data_prenotazione) VALUES (%s, %s, %s, %s)",
                               (email, password, nome_corso, data_prenotazione))
               
            conn.commit()
            print(f"Debug: Prenotazione effettuata per l'utente con email {email}")
            return 'Prenotazione effettuata con successo', 200
        else:
            print(f"Credenziali non valide per l'utente con email {email}")
            return 'Credenziali non valide', 401

    except Exception as e:
        print(f"Errore durante la prenotazione: {str(e)}")
        return 'Errore durante la prenotazione', 500



@app.route('/check_user_credentials', methods=['POST'])
def check_user_credentials_route():
    try:
        email = request.form.get('email')
        password = request.form.get('password')

        auth_result = check_user_credentials(email, password, get_db_connection())

        if auth_result == '1':
            print(f"Credenziali valide per l'utente con email {email}")
            session['user_email'] = email
            return '1', 200
        else:
            print(f"Credenziali non valide per l'utente con email {email}")
            return '0', 401

    except Exception as e:
        print(f"Errore durante la verifica delle credenziali: {str(e)}")
        return '0', 500

@app.route('/cancel_booking', methods=['POST'])
def cancel_booking_route():
    try:
        email = session.get('user_email')  # Ottieni l'email dall'oggetto di sessione
        nome_corso = request.form.get('nome_corso')

        result = cancel_booking(email, nome_corso, get_db_connection())  # Chiamare la funzione corretta

        if result == '1':
            return 'Prenotazione annullata con successo', 200
        elif result == '0':
            return 'Prenotazione già annullata o non trovata', 200
        else:
            return 'Errore durante l\'annullamento della prenotazione', 500

    except Exception as e:
        print(f"Errore durante l'annullamento della prenotazione: {str(e)}")
        return 'Errore durante l\'annullamento della prenotazione', 500


@app.route('/book_course', methods=['POST'])
def book_course_route():
    try:
        if 'user_email' not in session or 'user_email_password' not in session:
            return 'Credenziali non valide', 401
        
        # Ottieni il parametro nome_corso dalla query string
        nome_corso = request.form.get('nome_corso')

        # Verifica le credenziali dell'utente
        auth_result = check_user_credentials(session.get('user_email'), session.get('user_email_password'), get_db_connection())

        if auth_result == '1':
            # Verifica se l'utente ha già prenotato questo corso
            if is_user_already_booked(session.get('user_email'), nome_corso, get_db_connection()):
                print(f"L'utente con email {session.get('user_email')} ha già prenotato il corso {nome_corso}")
                return 'Utente già prenotato', 409

            # Inserisci l'utente nella tabella prenotazioni
            if book_course(session.get('user_email'), nome_corso, get_db_connection()):
                return 'Prenotazione effettuata con successo', 200
            else:
                return 'Errore durante la prenotazione', 500
        else:
            return 'Credenziali non valide', 401

    except Exception as e:
        print(f"Errore durante la prenotazione: {str(e)}")
        return 'Errore durante la prenotazione', 500


@app.route('/get_available_seats', methods=['GET'])
def get_available_seats_route():
    try:
        nome_corso = request.args.get('nome_corso')

        if not nome_corso:
            return 'Il parametro nome_corso è mancante', 400

        conn = get_db_connection()

        # Ottieni i posti totali e disponibili dal database per il corso specificato
        with conn.cursor() as cursor:
            cursor.execute("SELECT posti_totali, posti_disponibili FROM corsi WHERE nome_corso = %s", (nome_corso,))
            result = cursor.fetchone()

        conn.close()

        if result:
            posti_totali, posti_disponibili = result
            return f'Posti totali: {posti_totali}, Posti disponibili: {posti_disponibili}', 200
        else:
            return 'Corso non trovato', 404

    except Exception as e:
        print(f"Errore durante il recupero dei posti disponibili: {str(e)}")
        return 'Errore durante il recupero dei posti disponibili', 500


@app.route('/prenota_corso', methods=['POST'])
def prenota_corso():
    try:
        print("Debug: Richiesta ricevuta su /prenota_corso")

        email = request.form.get('email')
        password = request.form.get('password')
        nome_corso = request.form.get('nome_corso')

        print(f"Debug: Prenotazione richiesta per l'utente con email {email}")

        auth_result = check_user_credentials(email, password, get_db_connection())

        if auth_result == '1':
            print(f"Credenziali valide per l'utente con email {email}")

            cancel_result = cancel_booking(email, nome_corso, get_db_connection())

            if cancel_result == '1' or cancel_result == '0':
                book_result = book_course(email, nome_corso)

                if book_result:
                    print(f"Prenotazione effettuata per l'utente con email {email}")
                    return 'Prenotazione effettuata con successo', 200
                else:
                    print(f"Errore durante la prenotazione per l'utente con email {email}")
                    return 'Errore durante la prenotazione', 500

            elif cancel_result == '-1':
                print(f"Errore durante l'annullamento della prenotazione per l'utente con email {email}")
                return 'Errore durante l\'annullamento della prenotazione', 500

        else:
            print(f"Credenziali non valide per l'utente con email {email}")
            return 'Credenziali non valide', 401

    except Exception as e:
        print(f"Errore durante la prenotazione: {str(e)}")
        return 'Errore durante la prenotazione', 500

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    app.run(debug=True, host="localhost", port=5000)
