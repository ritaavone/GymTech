/*
Questo codice JavaScript gestisce principalmente un menu di navigazione, la risposta allo scrolling della finestra e inizializza 
diversi slider Swiper per diverse sezioni del sito web. Le configurazioni degli slider sono simili, ma vengono applicate a sezioni 
diverse, consentendo diverse visualizzazioni delle slide in base alle dimensioni dello schermo.
*/

let isUserAuthenticated = false;
let userEmail = '';
let userPassword = '';
let userBookedCourses = [];  // Aggiunta della variabile per tenere traccia dei corsi prenotati dall'utente


// Dichiarazione della funzione check_user_credentials in JavaScript
function check_user_credentials(email, password, callback) {
  console.log('check_user_credentials function called');
  console.log('Email:', email);
  console.log('Password:', password);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:5000/check_user_credentials', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

   // Modifica qui per inviare email e password correttamente
   var params = 'email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(password);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log('Request completed');
      console.log('Response:', xhr.responseText);

      if (xhr.status === 200) {
        console.log('Status 200');
        console.log('Response Trimmed:', xhr.responseText.trim());

        // Rimuovi l'analisi JSON e ottieni direttamente la risposta come stringa
        var responseString = xhr.responseText.trim();

        if (responseString === '1') {
          isUserAuthenticated = true;
          userEmail = email;
          // Se le credenziali sono valide, chiama il callback con successo
          callback(true);
        } else {
          isUserAuthenticated = false;
          console.error('Credenziali non valide');
          callback(false);
        }
      } else {
        console.error('Errore nella risposta:', xhr.status);
        callback(false);
      }
    }
  };

  xhr.send(params);
  //xhr.send('email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(password));
}

// Utilizzo della funzione con un callback
document.getElementById('loginBtn').addEventListener('click', function () {
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  if(email && password){
  // Utilizza la funzione check_user_credentials con un callback
  check_user_credentials(email, password, function (result) {
    console.log('Result from check_user_credentials:', result);

    if (result) {
      isUserAuthenticated = true;
      console.log('Credenziali valide');
      alert('Accesso effettuato con successo!');
      // Puoi aggiungere ulteriori azioni o reindirizzamenti qui
    } else {
      isUserAuthenticated = false;
      console.log('Credenziali non valide');
      alert('Credenziali non valide. Riprova.');
    }
  });
  
}

});

// Funzione di login
function login() {
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  // Utilizza la funzione check_user_credentials con un callback
  check_user_credentials(email, password, function (result) {
    if (result) {
      isUserAuthenticated = true;
      userEmail = email;
      alert('Accesso effettuato con successo!');
      // Puoi aggiungere ulteriori azioni o reindirizzamenti qui
    } else {
      isUserAuthenticated = false;
      alert('Credenziali non valide. Riprova.');
    }
  });
}

function makeReservation(nomeCorso) {
  try {
    fetch('http://localhost:5000/book_course', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `nome_corso=${encodeURIComponent(nomeCorso)}&email=${encodeURIComponent(userEmail)}&password=${encodeURIComponent(userPassword)}`,
    })
      .then(response => {
        if (response.status === 409) {
          // Utente già prenotato
          console.log('L\'utente ha già prenotato il corso.');
          alert('L\'utente ha già prenotato il corso.');
          throw new Error('Utente già prenotato');
        }
        if (!response.ok) {
          throw new Error(`Errore durante la richiesta: ${response.statusText}`);
        }
        return response.text();
      })
      .then(data => {
        console.log('Debug: Risposta dalla chiamata al server', data);

     
if (data.includes('Prenotazione effettuata con successo')) {
  console.log('Prenotazione effettuata con successo!');
  alert(`Prenotazione effettuata con successo per il corso ${nomeCorso}!`);
  updateAvailableSeats(nomeCorso);
} else if (data === '0') {
  console.log('Nessuna prenotazione trovata.');
  alert('Nessuna prenotazione trovata.');
} else {
  console.log('Errore durante la prenotazione.');
  alert('Errore durante la prenotazione.');
  console.error('Dettagli dell\'errore:', data);
}
        
      })
      .catch(error => {
        if (error.message !== 'Utente già prenotato') {
          console.error('Errore durante la chiamata al server:', error);
          alert('Errore durante la chiamata al server.');
        }
      });
  } catch (error) {
    console.error('Errore durante la prenotazione:', error);
    alert('Errore durante la prenotazione.');
  }
}

function cancelReservation(nomeCorso) {
  try {
    fetch('http://localhost:5000/cancel_booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `nome_corso=${encodeURIComponent(nomeCorso)}&email=${encodeURIComponent(userEmail)}`,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Errore nella richiesta: ${response.status}`);
        }
        return response.text();
      })
      .then(data => {
        console.log('Debug: Risposta dalla chiamata al server', data);

        if (data.includes('Prenotazione annullata con successo')) {
          console.log('Prenotazione annullata con successo!');
          alert(`Prenotazione annullata con successo per il corso ${nomeCorso}!`);
          const prenotaButton = document.querySelector(`.prenota-btn[data-corso-id="${nomeCorso}"]`);
          prenotaButton.innerText = 'Prenota';
          prenotaButton.classList.remove('booked');
          updateAvailableSeats(nomeCorso);
        } else if (data.includes('Utente già annullato')) {
          console.log('L\'utente ha già annullato la prenotazione.');
          alert('L\'utente ha già annullato la prenotazione.');
        } else if (data.includes('Nessuna prenotazione trovata')) {
          console.log('Nessuna prenotazione trovata.');
          alert('Nessuna prenotazione trovata.');
        } else {
          console.log('Errore durante l\'annullamento della prenotazione o la risposta non contiene il messaggio atteso.');
          console.log('Data ricevuta:', data);
          alert(`Errore durante l'annullamento della prenotazione: ${data}`);
        }
      })
      .catch(error => {
        console.error('Errore durante la chiamata al server:', error);
        alert('Errore durante la chiamata al server.');
      });
  } catch (error) {
    console.error('Errore durante l\'annullamento della prenotazione:', error);
    alert('Errore durante l\'annullamento della prenotazione.');
  }
}


function updateAvailableSeats(nomeCorso) {
  if (!nomeCorso) {
    console.error('Il nome del corso non è definito.');
    return;
  }

  fetch(`http://localhost:5000/get_available_seats?nome_corso=${nomeCorso}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Errore nella richiesta di posti disponibili.');
      }
      return response.text();
    })
    .then(data => {
      console.log('Debug: Risposta dalla chiamata al server', data);

      const match = data.match(/Posti disponibili: (\d+)/);
      if (match) {
        const postiDisponibili = parseInt(match[1], 10);
        console.log(`Posti disponibili per ${nomeCorso}: ${postiDisponibili}`);
        alert(`Posti disponibili per ${nomeCorso}: ${postiDisponibili}`);
      } else {
        throw new Error('Formato non valido per i posti disponibili.');
      }
    })
    .catch(error => {
      console.error('Errore durante la chiamata al server:', error);
      // Gestisci l'errore, ad esempio mostrando un messaggio all'utente o facendo altre azioni necessarie
    });
}


let isScrolling = false;

function toggleLoginSection() {
  if (!isScrolling) {
    isScrolling = true;

    var loginSection = document.getElementById('loginSection');
    loginSection.style.display = (loginSection.style.display === 'none' || loginSection.style.display === '') ? 'block' : 'none';

    // Disabilita il pulsante durante lo scrolling
    loginBtn.disabled = true;

    requestAnimationFrame(scrollToLoginSection);
  }
}


function cancelLogin() {
  var loginSection = document.getElementById('loginSection');
  loginSection.style.display = 'none';
  // Puoi anche reimpostare il contenuto degli input se necessario
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';
}

var loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener('click', function () {
  requestAnimationFrame(scrollToLoginSection);
});


function scrollToLoginSection() {
    var loginSection = document.getElementById('loginSection');
    loginSection.scrollIntoView({ behavior: 'smooth' });
     // Riabilita il pulsante una volta completato lo scrolling
  setTimeout(function() {
    isScrolling = false;
    loginBtn.disabled = false;
  }, 1000); // Imposta il timeout in base alla durata dello scrolling smooth

}

var cancelBtn = document.getElementById('cancelBtn');

cancelBtn.addEventListener('click', function () {
  cancelLogin();
  scrollToHomeSection();
});

function scrollToHomeSection() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function cancelAndScroll(sectionId) {
  hideLoginSection();
  scrollToHomeSection();
}


// For header

let menu = document.querySelector('#menu-btn'); //document.querySelector è un metodo che restituisce il primo elemento nel documento HTML che corrisponde al selettore specificato. In questo caso, viene selezionato l'elemento con l'id menu-btn e l'elemento 
let navbar = document.querySelector('.navbar'); //con la classe navbar. Questi elementi saranno utilizzati successivamente nel codice per aggiungere o rimuovere classi e gestire eventi.

// Ottieni il riferimento al link "Contatti" nell'header
let contactsLink = document.querySelector('a[href="#contacts"]');

// Aggiungi un gestore di eventi al link "Contatti" per lo scorrimento verso la sezione
contactsLink.addEventListener('click', (event) => {
  event.preventDefault(); // Impedisci il comportamento predefinito del link

  // Ottieni l'elemento della sezione "Contatti" usando l'ID
  let contactsSection = document.getElementById('contacts');

  // Esegui lo scorrimento animato alla sezione "Contatti"
  contactsSection.scrollIntoView({ behavior: 'smooth' });
});



// Ottieni il riferimento al link "About" nell'header
let aboutLink = document.querySelector('a[href="#about"]');

// Aggiungi un gestore di eventi al link "About" per lo scorrimento verso la sezione
aboutLink.addEventListener('click', (event) => {
  event.preventDefault(); // Impedisci il comportamento predefinito del link

  // Ottieni l'elemento della sezione "About" usando l'ID
  let aboutSection = document.getElementById('about');

  // Esegui lo scorrimento animato alla sezione "About"
  aboutSection.scrollIntoView({ behavior: 'smooth' });
});


// Ottieni il riferimento al link "Servizi" nell'header
let servicesLink = document.querySelector('a[href="#services"]');

// Aggiungi un gestore di eventi al link "Servizi" per lo scorrimento verso la sezione
servicesLink.addEventListener('click', (event) => {
  event.preventDefault(); // Impedisci il comportamento predefinito del link

  // Ottieni l'elemento della sezione "Servizi" usando l'ID
  let servicesSection = document.getElementById('services');

  // Esegui lo scorrimento animato alla sezione "Servizi"
  servicesSection.scrollIntoView({ behavior: 'smooth' });
});



menu.onclick = () =>{ //Questa parte del codice aggiunge un gestore di eventi di click all'elemento menu. uesto è tipicamente utilizzato per aprire e chiudere un menu di navigazione quando si fa clic sull'icona del menu
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
} 

// for window scroll 

window.onscroll = () =>{ //Il blocco di codice che hai indicato in JavaScript gestisce l'evento di scroll della finestra. Quando l'utente scorre la finestra del browser, questo codice si attiva e svolge una serie di azioni:
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');

    if(window.scrollY > 0){
        document.querySelector('.header').classList.add('active'); //questo codice controlla se l'utente ha scrollato verso il basso dalla cima della pagina. Se è così, viene aggiunta la classe active all'elemento .header, altrimenti viene rimossa la classe active quando l'utente è tornato in cima alla pagina.
    }else{
        document.querySelector('.header').classList.remove('active');
    }

}


window.onload = () =>{ //Questo assicura che tutto il contenuto della pagina sia pronto e accessibile prima di eseguire le istruzioni.
  if(window.scrollY > 0){
      document.querySelector('.header').classList.add('active');
  }else{
      document.querySelector('.header').classList.remove('active');
  }
}

// for home pages

var swiper = new Swiper(".home-slider", { //Questa linea di codice crea una nuova istanza di Swiper e la assegna alla variabile swiper
    spaceBetween: 20, //Imposta lo spazio in pixel tra le slide a 20 pixel. Le slide saranno distanziate di questo valore.
    effect: "fade", //Specifica l'effetto di transizione tra le slide. In questo caso, l'effetto è impostato su "fade", il che significa che le slide si dissolveranno una nell'altra durante la transizione.
    grabCursor: true, //Modifica l'aspetto del cursore del mouse quando è sopra lo slider in modo che appaia come un cursore a "presa".
    loop:true, //Abilita l'opzione loop, il che significa che lo slider continuerà a scorrere all'infinito da un'estremità all'altra, senza interruzioni.
    centeredSlides: true, // Centra le slide nello slider. Questa opzione assicura che la slide attualmente attiva sia sempre al centro dell'area visibile dello slider, con le slide adiacenti parzialmente visibili ai lati.
    autoplay: { //riproduzione automatica.b. Consiste nell'avviare automaticamente la transizione delle slide senza richiedere l'interazione dell'utente, permettendo alle slide di cambiare automaticamente a intervalli predefiniti.
      delay: 9500, //Imposta il ritardo tra le transizioni delle slide a 9500 millisecondi (9.5 secondi).
      disableOnInteraction: false, //Impedisce la disabilitazione dell'autoplay quando l'utente interagisce con lo slider (come cliccare su una slide).Impedisce la disabilitazione dell'autoplay quando l'utente interagisce con lo slider (come cliccare su una slide).
    },
  });

// For feature section

var swiper = new Swiper(".feature-slider", { //Crea un nuovo oggetto Swiper e lo associa agli elementi HTML con la classe .feature-slider(nei fogli di stile CSS o all'interno del codice HTML, questo tipo di selettore viene utilizzato per applicare stili specifici o identificare gli elementi HTML che condividono la stessa classe.)
    spaceBetween: 20,
    loop:true,
    grabCursor: true,
    centeredSlides: true,
    autoplay: {
        delay: 9500,
        disableOnInteraction: false,
      },
    breakpoints: { //Gestisce la reattività dello slider a diverse dimensioni dello schermo. Per differenti larghezze di finestra, specifica quante slide devono essere visualizzate contemporaneamente:
      0: {
        slidesPerView: 1, //Per finestre con larghezza minore o uguale a 0px(pixel) (0px rappresenta una dimensione specifica in termini di larghezza dello schermo), viene visualizzata una slide alla volta (slidesPerView: 1).
      },
      768: {
        slidesPerView: 2,
      },
      991: {
        slidesPerView: 3,
      },
    },
  });



// For trainers section

var swiper = new Swiper(".trainer-slider", { //Crea una nuova istanza di Swiper e la associa agli elementi HTML che hanno la classe .trainer-slider (presente nel CSS)
    spaceBetween: 20,
    loop:true,
    grabCursor: true,
    centeredSlides: true,
    autoplay: {
        delay: 9500,
        disableOnInteraction: false,
      },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      991: {
        slidesPerView: 3,
      },
    },
  });