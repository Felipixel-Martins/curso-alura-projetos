document.addEventListener('DOMContentLoaded', function() {
    // Calendar functionality
    const currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    // Sample events data
    const events = [
        {
            id: 1,
            title: 'Reunião com equipe',
            date: '2023-05-15',
            startTime: '10:00',
            endTime: '11:30',
            location: 'Sala de reuniões',
            description: 'Reunião semanal para alinhamento de projetos',
            category: 'work',
            reminder: true,
            reminderTime: 15,
            recurring: false
        },
        {
            id: 2,
            title: 'Consulta médica',
            date: '2023-05-20',
            startTime: '15:00',
            endTime: '16:00',
            location: 'Clínica Saúde',
            description: 'Consulta de rotina com cardiologista',
            category: 'health',
            reminder: true,
            reminderTime: 30,
            recurring: false
        }
    ];
    
    // Initialize calendar
    updateCalendar();
    
    // Event listeners for navigation
    document.getElementById('prev-month').addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar();
    });
    
    document.getElementById('next-month').addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar();
    });
    
    document.getElementById('today-btn').addEventListener('click', function() {
        const today = new Date();
        currentMonth = today.getMonth();
        currentYear = today.getFullYear();
        updateCalendar();
    });
    
    // View options
    const viewOptions = document.querySelectorAll('.view-option');
    viewOptions.forEach(option => {
        option.addEventListener('click', function() {
            viewOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            const views = document.querySelectorAll('.calendar-view');
            views.forEach(view => view.classList.remove('active'));
            
            const viewId = this.getAttribute('data-view') + '-view';
            document.getElementById(viewId).classList.add('active');
        });
    });
    
    // New event button
    document.getElementById('new-event-btn').addEventListener('click', function() {
        openEventModal();
    });
    
    // Modal functionality
    const modal = document.getElementById('event-modal');
    const closeModal = document.querySelector('.close-modal');
    
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Event form
    const eventForm = document.getElementById('event-form');
    eventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveEvent();
    });
    
    // Reminder checkbox
    document.getElementById('event-reminder').addEventListener('change', function() {
        document.getElementById('reminder-time').disabled = !this.checked;
    });
    
    // Recurring checkbox
    document.getElementById('event-recurring').addEventListener('change', function() {
        document.getElementById('recurring-type').disabled = !this.checked;
    });
    
    function updateCalendar() {
        const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        
        // Update month/year display
        document.getElementById('current-month').textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        // Generate month view
        generateMonthView();
        
        // Generate mini calendar
        generateMiniCalendar();
    }
    
    function generateMonthView() {
        const monthView = document.getElementById('month-view');
        monthView.innerHTML = '';
        
        // Create day headers
        const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const headerRow = document.createElement('div');
        headerRow.className = 'calendar-row header-row';
        
        dayNames.forEach(day => {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-cell header-cell';
            dayCell.textContent = day;
            headerRow.appendChild(dayCell);
        });
        
        monthView.appendChild(headerRow);
        
        // Get first day of month and total days
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        let date = 1;
        for (let i = 0; i < 6; i++) {
            // Create a row for each week
            if (date > daysInMonth) break;
            
            const weekRow = document.createElement('div');
            weekRow.className = 'calendar-row';
            
            // Create cells for each day of the week
            for (let j = 0; j < 7; j++) {
                const dayCell = document.createElement('div');
                dayCell.className = 'calendar-cell';
                
                if (i === 0 && j < firstDay) {
                    // Empty cell before first day of month
                    dayCell.textContent = '';
                } else if (date > daysInMonth) {
                    // Empty cell after last day of month
                    dayCell.textContent = '';
                } else {
                    // Cell with date
                    dayCell.textContent = date;
                    
                    // Highlight today
                    const today = new Date();
                    if (date === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                        dayCell.classList.add('today');
                    }
                    
                    // Add events to the day
                    const currentDate = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
                    const dayEvents = events.filter(event => event.date === currentDate);
                    
                    if (dayEvents.length > 0) {
                        const eventsContainer = document.createElement('div');
                        eventsContainer.className = 'day-events';
                        
                        dayEvents.forEach(event => {
                            const eventElement = document.createElement('div');
                            eventElement.className = `calendar-event ${event.category}`;
                            eventElement.textContent = `${event.startTime} ${event.title}`;
                            eventElement.addEventListener('click', () => openEventModal(event));
                            eventsContainer.appendChild(eventElement);
                        });
                        
                        dayCell.appendChild(eventsContainer);
                    }
                    
                    date++;
                }
                
                weekRow.appendChild(dayCell);
            }
            
            monthView.appendChild(weekRow);
        }
    }
    
    function generateMiniCalendar() {
        const miniCalendar = document.getElementById('mini-calendar');
        miniCalendar.innerHTML = '';
        
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                          'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        
        const header = document.createElement('div');
        header.className = 'mini-calendar-header';
        header.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        miniCalendar.appendChild(header);
        
        const dayNames = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
        const daysRow = document.createElement('div');
        daysRow.className = 'mini-calendar-days';
        
        dayNames.forEach(day => {
            const dayCell = document.createElement('span');
            dayCell.textContent = day;
            daysRow.appendChild(dayCell);
        });
        
        miniCalendar.appendChild(daysRow);
        
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        const datesGrid = document.createElement('div');
        datesGrid.className = 'mini-calendar-dates';
        
        let date = 1;
        for (let i = 0; i < 6; i++) {
            if (date > daysInMonth) break;
            
            for (let j = 0; j < 7; j++) {
                const dateCell = document.createElement('span');
                
                if (i === 0 && j < firstDay) {
                    dateCell.textContent = '';
                } else if (date > daysInMonth) {
                    dateCell.textContent = '';
                } else {
                    dateCell.textContent = date;
                    
                    // Highlight today
                    const today = new Date();
                    if (date === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                        dateCell.classList.add('today');
                    }
                    
                    date++;
                }
                
                datesGrid.appendChild(dateCell);
            }
        }
        
        miniCalendar.appendChild(datesGrid);
    }
    
    function openEventModal(event = null) {
        const modal = document.getElementById('event-modal');
        const form = document.getElementById('event-form');
        const deleteBtn = document.getElementById('delete-event');
        
        if (event) {
            // Editing existing event
            document.getElementById('modal-title').textContent = 'Editar Compromisso';
            document.getElementById('event-title').value = event.title;
            document.getElementById('event-date').value = event.date;
            document.getElementById('event-start').value = event.startTime;
            document.getElementById('event-end').value = event.endTime;
            document.getElementById('event-location').value = event.location || '';
            document.getElementById('event-description').value = event.description || '';
            document.getElementById('event-category').value = event.category;
            document.getElementById('event-reminder').checked = event.reminder || false;
            document.getElementById('reminder-time').disabled = !event.reminder;
            if (event.reminder) {
                document.getElementById('reminder-time').value = event.reminderTime;
            }
            document.getElementById('event-recurring').checked = event.recurring || false;
            document.getElementById('recurring-type').disabled = !event.recurring;
            if (event.recurring) {
                document.getElementById('recurring-type').value = event.recurringType;
            }
            
            deleteBtn.style.display = 'inline-block';
            deleteBtn.onclick = function() {
                if (confirm('Tem certeza que deseja excluir este compromisso?')) {
                    deleteEvent(event.id);
                    modal.style.display = 'none';
                }
            };
            
            form.dataset.eventId = event.id;
        } else {
            // Creating new event
            document.getElementById('modal-title').textContent = 'Novo Compromisso';
            form.reset();
            deleteBtn.style.display = 'none';
            delete form.dataset.eventId;
            
            // Set default date to selected date if available
            const today = new Date();
            document.getElementById('event-date').value = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
        }
        
        modal.style.display = 'block';
    }
    
    function saveEvent() {
        const form = document.getElementById('event-form');
        const eventId = form.dataset.eventId;
        
        const event = {
            id: eventId || Date.now(), // Use existing ID or generate new one
            title: document.getElementById('event-title').value,
            date: document.getElementById('event-date').value,
            startTime: document.getElementById('event-start').value,
            endTime: document.getElementById('event-end').value,
            location: document.getElementById('event-location').value,
            description: document.getElementById('event-description').value,
            category: document.getElementById('event-category').value,
            reminder: document.getElementById('event-reminder').checked,
            reminderTime: document.getElementById('event-reminder').checked ? 
                parseInt(document.getElementById('reminder-time').value) : null,
            recurring: document.getElementById('event-recurring').checked,
            recurringType: document.getElementById('event-recurring').checked ? 
                document.getElementById('recurring-type').value : null
        };
        
        if (eventId) {
            // Update existing event
            const index = events.findIndex(e => e.id == eventId);
            if (index !== -1) {
                events[index] = event;
            }
        } else {
            // Add new event
            events.push(event);
        }
        
        updateCalendar();
        document.getElementById('event-modal').style.display = 'none';
        app.showNotification('Compromisso salvo com sucesso!', 'success');
    }
    
    function deleteEvent(id) {
        const index = events.findIndex(event => event.id == id);
        if (index !== -1) {
            events.splice(index, 1);
            updateCalendar();
            app.showNotification('Compromisso excluído', 'success');
        }
    }
});