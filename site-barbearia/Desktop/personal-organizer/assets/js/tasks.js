document.addEventListener('DOMContentLoaded', function() {
    // Sample tasks data
    const tasks = [
        {
            id: 1,
            title: 'Finalizar relatório mensal',
            description: 'Revisar e enviar relatório para o gerente',
            date: '2023-05-15',
            priority: 'high',
            category: 'work',
            completed: false,
            recurring: false,
            checklist: [
                { id: 1, text: 'Coletar dados de vendas', completed: true },
                { id: 2, text: 'Analisar métricas', completed: false },
                { id: 3, text: 'Escrever conclusões', completed: false }
            ],
            createdAt: new Date('2023-05-01')
        },
        {
            id: 2,
            title: 'Comprar presentes de aniversário',
            description: 'Presentes para Maria e João',
            date: '2023-05-10',
            priority: 'medium',
            category: 'personal',
            completed: false,
            recurring: false,
            checklist: [],
            createdAt: new Date('2023-04-28')
        },
        {
            id: 3,
            title: 'Ir à academia',
            description: 'Treino de pernas',
            date: '2023-05-08',
            priority: 'low',
            category: 'health',
            completed: true,
            recurring: true,
            recurringType: 'weekly',
            checklist: [],
            createdAt: new Date('2023-04-15')
        }
    ];
    
    // Initialize tasks
    renderTasks();
    
    // New task button
    document.getElementById('new-task-btn').addEventListener('click', function() {
        openTaskModal();
    });
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            renderTasks(this.textContent.toLowerCase());
        });
    });
    
    // Modal functionality
    const modal = document.getElementById('task-modal');
    const closeModal = document.querySelector('.close-modal');
    
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Recurring checkbox
    document.getElementById('task-recurring').addEventListener('change', function() {
        document.getElementById('recurring-type').disabled = !this.checked;
    });
    
    // Add checklist item
    document.getElementById('add-checklist-btn').addEventListener('click', function() {
        const input = document.getElementById('new-checklist-item');
        if (input.value.trim() === '') return;
        
        addChecklistItemToForm(input.value.trim());
        input.value = '';
        input.focus();
    });
    
    // Allow adding checklist item with Enter key
    document.getElementById('new-checklist-item').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('add-checklist-btn').click();
        }
    });
    
    // Task form submission
    document.getElementById('task-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveTask();
    });
    
    function renderTasks(filter = 'todas') {
        const tasksList = document.querySelector('.tasks-list');
        tasksList.innerHTML = '';
        
        let filteredTasks = [...tasks];
        const today = new Date().toISOString().split('T')[0];
        
        // Apply filter
        switch(filter) {
            case 'hoje':
                filteredTasks = filteredTasks.filter(task => task.date === today);
                break;
            case 'importantes':
                filteredTasks = filteredTasks.filter(task => task.priority === 'high');
                break;
            case 'concluídas':
                filteredTasks = filteredTasks.filter(task => task.completed);
                break;
            case 'pessoal':
                filteredTasks = filteredTasks.filter(task => task.category === 'personal');
                break;
            case 'trabalho':
                filteredTasks = filteredTasks.filter(task => task.category === 'work');
                break;
        }
        
        // Sort by date and priority
        filteredTasks.sort((a, b) => {
            // Completed tasks go to the bottom
            if (a.completed && !b.completed) return 1;
            if (!a.completed && b.completed) return -1;
            
            // Then sort by date (earlier first)
            if (a.date && b.date) {
                if (a.date < b.date) return -1;
                if (a.date > b.date) return 1;
            }
            
            // Then by priority (high first)
            const priorityOrder = { high: 1, medium: 2, low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        
        if (filteredTasks.length === 0) {
            tasksList.innerHTML = '<p class="no-tasks">Nenhuma tarefa encontrada.</p>';
            updateStats();
            return;
        }
        
        filteredTasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''} ${task.priority}`;
            taskItem.dataset.taskId = task.id;
            
            // Check if task is overdue
            const isOverdue = task.date && !task.completed && task.date < today;
            
            let dateDisplay = '';
            if (task.date) {
                const dateObj = new Date(task.date);
                dateDisplay = dateObj.toLocaleDateString('pt-BR', { 
                    weekday: 'short', 
                    day: 'numeric', 
                    month: 'short' 
                });
            }
            
            taskItem.innerHTML = `
                <div class="task-checkbox">
                    <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
                    <label for="task-${task.id}"></label>
                </div>
                <div class="task-content">
                    <div class="task-title">${task.title}</div>
                    ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                    ${task.date ? `<div class="task-date ${isOverdue ? 'overdue' : ''}">
                        <i class="far fa-calendar-alt"></i> ${dateDisplay}
                    </div>` : ''}
                    ${task.checklist.length > 0 ? `
                        <div class="task-checklist">
                            <div class="checklist-progress">
                                ${getChecklistProgress(task.checklist)}
                            </div>
                        </div>
                    ` : ''}
                </div>
                <div class="task-actions">
                    <button class="btn-icon edit-task"><i class="far fa-edit"></i></button>
                    <button class="btn-icon delete-task"><i class="far fa-trash-alt"></i></button>
                </div>
            `;
            
            // Add event listeners
            taskItem.querySelector('.task-checkbox input').addEventListener('change', function() {
                toggleTaskComplete(task.id, this.checked);
            });
            
            taskItem.querySelector('.edit-task').addEventListener('click', function(e) {
                e.stopPropagation();
                openTaskModal(task);
            });
            
            taskItem.querySelector('.delete-task').addEventListener('click', function(e) {
                e.stopPropagation();
                if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
                    deleteTask(task.id);
                }
            });
            
            taskItem.addEventListener('click', function(e) {
                if (!e.target.closest('.task-checkbox') && !e.target.closest('.task-actions')) {
                    openTaskModal(task);
                }
            });
            
            tasksList.appendChild(taskItem);
        });
        
        updateStats();
    }
    
    function getChecklistProgress(checklist) {
        const completed = checklist.filter(item => item.completed).length;
        return `${completed}/${checklist.length} itens concluídos`;
    }
    
    function updateStats() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const pendingTasks = totalTasks - completedTasks;
        
        const today = new Date().toISOString().split('T')[0];
        const overdueTasks = tasks.filter(task => 
            !task.completed && task.date && task.date < today
        ).length;
        
        const importantTasks = tasks.filter(task => 
            task.priority === 'high' && !task.completed
        ).length;
        
        // Update stats cards
        document.querySelectorAll('.stat-card')[0].querySelector('.stat-value').textContent = pendingTasks;
        document.querySelectorAll('.stat-card')[1].querySelector('.stat-value').textContent = completedTasks;
        document.querySelectorAll('.stat-card')[2].querySelector('.stat-value').textContent = overdueTasks;
        document.querySelectorAll('.stat-card')[3].querySelector('.stat-value').textContent = importantTasks;
    }
    
    function openTaskModal(task = null) {
        const modal = document.getElementById('task-modal');
        const form = document.getElementById('task-form');
        const deleteBtn = document.getElementById('delete-task');
        
        if (task) {
            // Editing existing task
            document.getElementById('modal-title').textContent = 'Editar Tarefa';
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-description').value = task.description || '';
            document.getElementById('task-date').value = task.date || '';
            document.getElementById('task-priority').value = task.priority;
            document.getElementById('task-category').value = task.category;
            document.getElementById('task-recurring').checked = task.recurring || false;
            document.getElementById('recurring-type').disabled = !task.recurring;
            if (task.recurring) {
                document.getElementById('recurring-type').value = task.recurringType;
            }
            
            // Add checklist items
            const checklistContainer = document.getElementById('checklist-items');
            checklistContainer.innerHTML = '';
            task.checklist.forEach(item => {
                addChecklistItemToForm(item.text, item.id, item.completed);
            });
            
            deleteBtn.style.display = 'inline-block';
            deleteBtn.onclick = function() {
                if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
                    deleteTask(task.id);
                    modal.style.display = 'none';
                }
            };
            
            form.dataset.taskId = task.id;
        } else {
            // Creating new task
            document.getElementById('modal-title').textContent = 'Nova Tarefa';
            form.reset();
            document.getElementById('checklist-items').innerHTML = '';
            deleteBtn.style.display = 'none';
            delete form.dataset.taskId;
            
            // Set default date to today
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('task-date').value = today;
        }
        
        modal.style.display = 'block';
    }
    
    function addChecklistItemToForm(text, id = null, completed = false) {
        const checklistContainer = document.getElementById('checklist-items');
        const itemId = id || Date.now();
        
        const itemElement = document.createElement('div');
        itemElement.className = 'checklist-item';
        itemElement.innerHTML = `
            <input type="checkbox" id="checklist-${itemId}" ${completed ? 'checked' : ''}>
            <label for="checklist-${itemId}"></label>
            <input type="text" value="${text}">
            <button type="button" class="remove-checklist-item"><i class="fas fa-times"></i></button>
        `;
        
        itemElement.querySelector('.remove-checklist-item').addEventListener('click', function() {
            itemElement.remove();
        });
        
        checklistContainer.appendChild(itemElement);
    }
    
    function saveTask() {
        const form = document.getElementById('task-form');
        const taskId = form.dataset.taskId;
        
        // Get all checklist items
        const checklist = [];
        document.querySelectorAll('.checklist-item').forEach(item => {
            checklist.push({
                id: parseInt(item.querySelector('input[type="checkbox"]').id.replace('checklist-', '')),
                text: item.querySelector('input[type="text"]').value,
                completed: item.querySelector('input[type="checkbox"]').checked
            });
        });
        
        const task = {
            id: taskId || Date.now(), // Use existing ID or generate new one
            title: document.getElementById('task-title').value,
            description: document.getElementById('task-description').value,
            date: document.getElementById('task-date').value || null,
            priority: document.getElementById('task-priority').value,
            category: document.getElementById('task-category').value,
            completed: false, // Will be updated from existing task if editing
            recurring: document.getElementById('task-recurring').checked,
            recurringType: document.getElementById('task-recurring').checked ? 
                document.getElementById('recurring-type').value : null,
            checklist: checklist,
            createdAt: taskId ? 
                tasks.find(t => t.id == taskId).createdAt : new Date()
        };
        
        if (taskId) {
            // Update existing task (preserve completed status)
            const existingTask = tasks.find(t => t.id == taskId);
            task.completed = existingTask.completed;
            
            const index = tasks.findIndex(t => t.id == taskId);
            if (index !== -1) {
                tasks[index] = task;
            }
        } else {
            // Add new task
            tasks.push(task);
        }
        
        renderTasks(document.querySelector('.filter-btn.active').textContent.toLowerCase());
        document.getElementById('task-modal').style.display = 'none';
        app.showNotification('Tarefa salva com sucesso!', 'success');
    }
    
    function toggleTaskComplete(id, completed) {
        const task = tasks.find(t => t.id == id);
        if (task) {
            task.completed = completed;
            renderTasks(document.querySelector('.filter-btn.active').textContent.toLowerCase());
            
            if (completed) {
                app.showNotification('Tarefa marcada como concluída!', 'success');
            }
        }
    }
    
    function deleteTask(id) {
        const index = tasks.findIndex(task => task.id == id);
        if (index !== -1) {
            tasks.splice(index, 1);
            renderTasks(document.querySelector('.filter-btn.active').textContent.toLowerCase());
            app.showNotification('Tarefa excluída', 'success');
        }
    }
}); 