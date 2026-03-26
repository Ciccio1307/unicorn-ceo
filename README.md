# 🦄 UNICORN.CEO

👉 **[Gioca ora alla Live Demo](https://unicorn-ceo.netlify.app)** 

Un videogioco gestionale a turni basato su swipe (stile *Reigns*), dove vesti i panni del CEO di una startup tech in rapida crescita. Scegli il tuo mercato, imposta la difficoltà, sopravvivi per 60 mesi e punta alla campanella di Wall Street (IPO) o a una Exit milionaria.

---

## 🎮 Meccaniche di Gioco

Il gioco offre un'esperienza altamente rigiocabile grazie alla combinazione di tre mercati, tre difficoltà e un mazzo di eventi dinamico.

### 🏢 1. Scegli la tua Startup
All'inizio della partita, dovrai scegliere il tuo "Vertical":
* **📱 Social:** Crescita virale, network effect ed economia dei creator.
* **🏢 B2B SaaS:** Vendite enterprise, contratti lunghi e basso churn.
* **💳 Fintech:** Compliance, regolatori e il Trust come metrica di sopravvivenza.

### ⚡ 2. Livelli di Difficoltà
Il gioco adatta dinamicamente le statistiche iniziali e la composizione del mazzo in base alla difficoltà scelta:
* 🌱 **EASY:** Cash iniziale a 150K, K-factor positivo (0.9) e metriche di base alte. Perfetto per imparare a bilanciare la crescita.
* ⚡ **NORMAL:** Il percorso classico. 100K di Cash iniziale e decisioni difficili.
* 💀 **HARD:** Solo per veri founder. Cash iniziale a 70K, Trust e Churn in crisi (35), e un pool di carte riempito di trappole ed eventi letali.

### 📈 3. Le Tre Fasi (60 Turni)
Il gameplay si sviluppa in 60 mesi, suddivisi in tre fasi aziendali:
1. **Bootstrapping** (Mesi 1-18): Trova il product-market fit e sopravvivi con poche risorse.
2. **Growth Hacking** (Mesi 19-42): Scala aggressivamente, ma attento ai regolatori e al debito tecnico.
3. **Scale & Defend** (Mesi 43-60): Struttura l'azienda, difenditi dalle Big Tech e preparati per l'IPO.

* **Swipe a Sinistra o Destra** per prendere decisioni strategiche.
* Ogni decisione impatta i tuoi **KPI**: Cash, Utenti, Churn, Trust, Ecosistema, Valore.
* **Condizione di Sconfitta:** Se il tuo `Cash` scende a 0, vai in bancarotta.
* **Condizione di Vittoria:** Sopravvivi fino al mese 60 per l'IPO, oppure accetta una "Strategic Exit" (Acquisizione).

---

## 🛠️ Stack Tecnologico & Architettura

Questo progetto è una Single Page Application (SPA) sviluppata con un'architettura a componenti pulita e una logica basata su Macchina a Stati Finiti (FSM).

* **Framework Core:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
* **State Management:** `useReducer` per gestire in modo prevedibile il loop di gioco (`MENU`, `PLAYING`, `GAME_OVER`, `VICTORY`) e l'avanzamento dei turni.
* **Animazioni & Fisica:** [Framer Motion](https://www.framer.com/motion/) per la gestione fluida del drag & drop delle carte.
* **Styling & UI:** [TailwindCSS](https://tailwindcss.com/) per un design Mobile-First in Glassmorphism, con UI reattiva che riflette i colori della difficoltà scelta.
* **Deck Builder Logic:** Algoritmo custom (`deckBuilder.js`) che estrae 60 carte bilanciate da un pool JSON in base al mercato e inietta percentuali specifiche di "Hard Cards" se si gioca a difficoltà massima.

## 🚀 Installazione e Sviluppo Locale

Per far girare il gioco sul tuo computer localmente:

Per far girare il gioco sul tuo computer, assicurati di avere [Node.js](https://nodejs.org/) installato, poi segui questi step:

1. Clona o scarica questa repository.
2. Apri il terminale nella cartella del progetto.
3. Installa le dipendenze:
   ```bash
   npm install
4. Avvia il server di sviluppo:
   ```bash
      npm run dev
5. Apri il browser all'indirizzo http://localhost:5173.
