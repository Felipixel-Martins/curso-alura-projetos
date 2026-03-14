document.addEventListener('DOMContentLoaded', function() {
    // Check for browser notifications permission
    if ('Notification' in window) {
        if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                console.log('Notification permission:', permission);
            });
        }
    }
    
    // Sample notifications data
    const notifications = [
        {
            id: 1,
            title: 'Reunião em 15 minutos',
            message: 'Você tem uma reunião com a equipe às 10:00',
            time: '10 minutos atrás',
            read: false,
            type: 'calendar'
        },
        {
            id: 2,
            title: 'Tarefa concluída',
            message: 'Você marcou "Comprar presentes" como concluída',
            time: '1 hora atrás',
            read: true,
            type: 'task'
        },
        {
            id: 3,
            title: 'Nova receita adicionada',
            message: 'Sua receita "Panquecas Integrais" foi salva',
            time: 'Ontem',
            read: true,
            type: 'recipe'
        }
    ];
    
    // Initialize notifications
    renderNotifications();
    
    // Show browser notification
    function showBrowserNotification(title, message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body: message });
        }
    }
    
    // Render notifications in UI
    function renderNotifications() {
        const notificationsContainer = document.getElementById('notifications-container');
        if (!notificationsContainer) return;
        
        notificationsContainer.innerHTML = '';
        
        const unreadCount = notifications.filter(n => !n.read).length;
        const badge = document.querySelector('.notifications-badge');
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
        
        if (notifications.length === 0) {
            notificationsContainer.innerHTML = '<p class="no-notifications">Nenhuma notificação</p>';
            return;
        }
        
        notifications.forEach(notification => {
            const notificationElement = document.createElement('div');
            notificationElement.className = `notification-item ${notification.read ? 'read' : 'unread'} ${notification.type}`;
            notificationElement.innerHTML = `
                <div class="notification-icon">
                    ${getNotificationIcon(notification.type)}
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${notification.time}</div>
                </div>
                ${!notification.read ? '<div class="notification-dot"></div>' : ''}
            `;
            
            notificationElement.addEventListener('click', function() {
                markNotificationAsRead(notification.id);
            });
            
            notificationsContainer.appendChild(notificationElement);
        });
    }
    
    function getNotificationIcon(type) {
        switch(type) {
            case 'calendar': return '<i class="fas fa-calendar-alt"></i>';
            case 'task': return '<i class="fas fa-tasks"></i>';
            case 'recipe': return '<i class="fas fa-utensils"></i>';
            case 'shopping': return '<i class="fas fa-shopping-cart"></i>';
            default: return '<i class="fas fa-bell"></i>';
        }
    }
    
    function markNotificationAsRead(id) {
        const notification = notifications.find(n => n.id === id);
        if (notification && !notification.read) {
            notification.read = true;
            renderNotifications();
        }
    }
    
    // Mark all as read
    const markAllReadBtn = document.getElementById('mark-all-read');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            notifications.forEach(n => n.read = true);
            renderNotifications();
        });
    }
    
    // Expose functions to other modules
    window.notifications = {
        showBrowserNotification,
        addNotification: function(title, message, type = 'info') {
            const newNotification = {
                id: Date.now(),
                title,
                message,
                time: 'Agora',
                read: false,
                type
            };
            
            notifications.unshift(newNotification);
            renderNotifications();
            
            // Show browser notification
            showBrowserNotification(title, message);
        }
    };
});