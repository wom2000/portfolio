const calendarDays = document.getElementById('calendar-days');
const monthYear = document.getElementById('month-year');
const prevMonth = document.getElementById('prev-month');
const nextMonth = document.getElementById('next-month');

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// Função para renderizar calendário
function renderCalendar(month, year) {
  calendarDays.innerHTML = "";
  monthYear.innerText = `${months[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  // Preencher dias vazios do começo do mês
  for (let i = 0; i < firstDay; i++) {
    const emptyDiv = document.createElement('div');
    calendarDays.appendChild(emptyDiv);
  }

  // Preencher dias do mês
  for (let day = 1; day <= lastDate; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.innerText = day;

    const dateKey = `${year}-${month + 1}-${day}`; // Chave para localStorage

    // Marcar dia atual
    if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      dayDiv.classList.add('today');
    }

    // Se houver evento, marcar
    if (localStorage.getItem(dateKey)) {
      dayDiv.classList.add('has-event');
    }

    // Clique no dia
    dayDiv.addEventListener('click', () => {
      const existingEvent = localStorage.getItem(dateKey) || "";
      const eventText = prompt(`Evento para ${day}/${month + 1}/${year}:`, existingEvent);
      if (eventText !== null && eventText.trim() !== "") {
        localStorage.setItem(dateKey, eventText);
        dayDiv.classList.add('has-event');
      } else {
        localStorage.removeItem(dateKey);
        dayDiv.classList.remove('has-event');
      }
    });

    calendarDays.appendChild(dayDiv);
  }
}

// Botões de navegação
prevMonth.addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentMonth, currentYear);
});

nextMonth.addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentMonth, currentYear);
});

// Inicializa calendário
renderCalendar(currentMonth, currentYear);
