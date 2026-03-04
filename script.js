let currentUser = null;

const teams = [
    "Manchester United", "Liverpool", "Chelsea", "Arsenal",
    "Manchester City", "Tottenham", "Leicester", "Everton"
];

let events = [];

// Створюємо матчі з таймерами
function generateEvents() {
    events = [];
    for(let i=0; i<5; i++) {
        const home = teams[Math.floor(Math.random() * teams.length)];
        let away = teams[Math.floor(Math.random() * teams.length)];
        while(away === home) away = teams[Math.floor(Math.random() * teams.length)];
        events.push({
            id: i+1,
            home: home,
            away: away,
            odds: (Math.random()*1 + 1.2).toFixed(2),
            time: Math.floor(Math.random()*60)+1, // хвилини до кінця матчу
            homeGoals: 0,
            awayGoals: 0
        });
    }
}

function register() {
    const username = document.getElementById("username").value;
    if(!username) return alert("Введіть ім'я користувача!");
    if(localStorage.getItem(username)) return alert("Користувач вже існує!");
    const user = { balance: 200 };
    localStorage.setItem(username, JSON.stringify(user));
    alert("Користувач зареєстрований! Баланс $200");
}

function login() {
    const username = document.getElementById("username").value;
    const userData = localStorage.getItem(username);
    if(!userData) return alert("Користувача не знайдено!");
    currentUser = username;
    document.getElementById("user-name").textContent = currentUser;
    document.getElementById("balance").textContent = JSON.parse(userData).balance;
    document.getElementById("auth").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    generateEvents();
    renderEvents();
    startTimers();
}

function logout() {
    currentUser = null;
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("auth").style.display = "block";
}

function renderEvents() {
    const container = document.getElementById("events");
    container.innerHTML = "";
    events.forEach((event, index) => {
        const div = document.createElement("div");
        div.className = "event";
        div.style.animationDelay = `${index*0.2}s`;
        div.innerHTML = `
            <strong>${event.home} ${event.homeGoals} - ${event.awayGoals} ${event.away}</strong>
            <div class="timer" id="timer-${event.id}">Матч починається через ${event.time} хв.</div>
            <input type="number" id="bet-${event.id}" placeholder="Ставка">
            <button class="btn" onclick="placeBet(${event.id})">Ставити</button>
        `;
        container.appendChild(div);
    });
}

function placeBet(eventId) {
    const betInput = document.getElementById(`bet-${eventId}`);
    const betAmount = parseFloat(betInput.value);
    if(!betAmount || betAmount <=0) return alert("Введіть ставку!");
    const userData = JSON.parse(localStorage.getItem(currentUser));
    if(betAmount > userData.balance) return alert("Недостатньо балансу!");
    const event = events.find(e => e.id === eventId);
    const result = Math.random() < 0.5; // 50% шанс виграти
    if(result){
        userData.balance += betAmount*(event.odds-1);
        alert(`Ви виграли $${(betAmount*(event.odds-1)).toFixed(2)}!`);
    } else {
        userData.balance -= betAmount;
        alert("Ви програли!");
    }
    localStorage.setItem(currentUser, JSON.stringify(userData));
    document.getElementById("balance").textContent = userData.balance.toFixed(2);
    betInput.value = "";
}

// Таймери матчів і голи
function startTimers() {
    setInterval(() => {
        events.forEach(event => {
            if(event.time > 0) {
                event.time--;
                // Рандомні голи
                if(Math.random() < 0.05) event.homeGoals++;
                if(Math.random() < 0.05) event.awayGoals++;
                document.getElementById(`timer-${event.id}`).textContent = `Матч починається через ${event.time} хв.`;
                renderEvents(); // оновлюємо голи
            } else {
                document.getElementById(`timer-${event.id}`).textContent = "Матч завершено";
            }
        });
    }, 1000); // кожну секунду зменшуємо таймер (для демо)
}