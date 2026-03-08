// Get elements
const form = document.getElementById('session-form');
const sessionList = document.getElementById('session-list');
const totalSessionsEl = document.getElementById('total-sessions');
const totalHoursEl = document.getElementById('total-hours');
const completedSessionsEl = document.getElementById('completed-sessions');

// Load sessions from localStorage
let sessions = JSON.parse(localStorage.getItem('sessions')) || [];

// Render on page load
document.addEventListener('DOMContentLoaded', () => {
    renderSessions();
    updateStats();
});

// Add session
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const session = {
        id: Date.now(),
        subject: document.getElementById('subject').value,
        date: document.getElementById('date').value,
        duration: parseFloat(document.getElementById('duration').value),
        notes: document.getElementById('notes').value,
        completed: false
    };

    sessions.push(session);
    saveToStorage();
    renderSessions();
    updateStats();
    form.reset();
});

// Render all sessions
function renderSessions() {
    sessionList.innerHTML = '';

    if (sessions.length === 0) {
        sessionList.innerHTML = '<p class="empty-state">No sessions yet. Add one above! 📝</p>';
        return;
    }

    sessions.forEach(session => {
        const card = document.createElement('div');
        card.className = `session-card ${session.completed ? 'completed' : ''}`;
        card.innerHTML = `
            <div class="session-info">
                <h3>${session.subject}</h3>
                <p>📅 ${session.date} &nbsp;|&nbsp; ⏱ ${session.duration} hrs</p>
                ${session.notes ? `<p>📝 ${session.notes}</p>` : ''}
            </div>
            <div class="session-actions">
                <button class="btn-complete" onclick="toggleComplete(${session.id})">
                    ${session.completed ? '↩ Undo' : '✓ Done'}
                </button>
                <button class="btn-delete" onclick="deleteSession(${session.id})">✕ Delete</button>
            </div>
        `;
        sessionList.appendChild(card);
    });
}

// Toggle complete
function toggleComplete(id) {
    sessions = sessions.map(s =>
        s.id === id ? { ...s, completed: !s.completed } : s
    );
    saveToStorage();
    renderSessions();
    updateStats();
}

// Delete session
function deleteSession(id) {
    sessions = sessions.filter(s => s.id !== id);
    saveToStorage();
    renderSessions();
    updateStats();
}

// Update stats
function updateStats() {
    totalSessionsEl.textContent = sessions.length;
    totalHoursEl.textContent = sessions.reduce((sum, s) => sum + s.duration, 0);
    completedSessionsEl.textContent = sessions.filter(s => s.completed).length;
}

// Save to localStorage
function saveToStorage() {
    localStorage.setItem('sessions', JSON.stringify(sessions));
}