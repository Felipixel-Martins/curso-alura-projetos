document.addEventListener('DOMContentLoaded', function() {
    // Sample shopping lists data
    const shoppingLists = [
        {
            id: 1,
            name: 'Compras do Mês',
            date: '2023-05-15',
            items: [
                { id: 1, name: 'Arroz', quantity: '2kg', category: 'other', purchased: false },
                { id: 2, name: 'Feijão', quantity: '1kg', category: 'other', purchased: false },
                { id: 3, name: 'Leite', quantity: '4L', category: 'dairy', purchased: true },
                { id: 4, name: 'Maçã', quantity: '6 unidades', category: 'fruits', purchased: false }
            ],
            createdAt: new Date('2023-05-01')
        },
        {
            id: 2,
            name: 'Churrasco',
            date: '2023-05-20',
            items: [
                { id: 1, name: 'Picanha', quantity: '1.5kg', category: 'meat', purchased: false },
                { id: 2, name: 'Linguiça', quantity: '1kg', category: 'meat', purchased: false },
                { id: 3, name: 'Cerveja', quantity: '12 latas', category: 'beverages', purchased: false }
            ],
            createdAt: new Date('2023-05-10')
        }
    ];
    
    // Initialize shopping lists
    renderShoppingLists();
    
    // New list button
    document.getElementById('new-list-btn').addEventListener('click', function() {
        openListModal();
    });
    
    // Modal functionality
    const modal = document.getElementById('list-modal');
    const closeModal = document.querySelector('.close-modal');
    
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Add item
    document.getElementById('add-item-btn').addEventListener('click', function() {
        const nameInput = document.getElementById('new-item-name');
        const quantityInput = document.getElementById('new-item-quantity');
        const categoryInput = document.getElementById('new-item-category');
        
        if (nameInput.value.trim() === '') return;
        
        const item = {
            id: Date.now(),
            name: nameInput.value.trim(),
            quantity: quantityInput.value.trim() || '1 un',
            category: categoryInput.value || 'other',
            purchased: false
        };
        
        addItemToForm(item);
        
        // Clear inputs
        nameInput.value = '';
        quantityInput.value = '';
        categoryInput.value = '';
        nameInput.focus();
    });
    
    // Allow adding item with Enter key
    document.getElementById('new-item-name').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('add-item-btn').click();
        }
    });
    
    // List form submission
    document.getElementById('list-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveList();
    });
    
    function renderShoppingLists() {
        const listsContainer = document.querySelector('.shopping-lists');
        listsContainer.innerHTML = '';
        
        if (shoppingLists.length === 0) {
            listsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Nenhuma lista de compras</h3>
                    <p>Comece criando sua primeira lista de compras</p>
                    <button id="create-first-list" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Criar Lista
                    </button>
                </div>
            `;
            
            document.getElementById('create-first-list').addEventListener('click', openListModal);
            return;
        }
        
        // Sort by date (newest first)
        const sortedLists = [...shoppingLists].sort((a, b) => b.createdAt - a.createdAt);
        
        sortedLists.forEach(list => {
            const listElement = document.createElement('div');
            listElement.className = 'shopping-list';
            listElement.dataset.listId = list.id;
            
            // Count purchased items
            const purchasedCount = list.items.filter(item => item.purchased).length;
            const totalItems = list.items.length;
            const progress = totalItems > 0 ? Math.round((purchasedCount / totalItems) * 100) : 0;
            
            let dateDisplay = '';
            if (list.date) {
                const dateObj = new Date(list.date);
                dateDisplay = dateObj.toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                });
            }
            
            listElement.innerHTML = `
                <div class="list-header">
                    <h3>${list.name}</h3>
                    <div class="list-actions">
                        <button class="btn-icon edit-list"><i class="far fa-edit"></i></button>
                        <button class="btn-icon delete-list"><i class="far fa-trash-alt"></i></button>
                    </div>
                </div>
                ${list.date ? `<div class="list-date"><i class="far fa-calendar-alt"></i> ${dateDisplay}</div>` : ''}
                <div class="list-progress">
                    <div class="progress-bar" style="width: ${progress}%"></div>
                    <div class="progress-text">${purchasedCount}/${totalItems} itens</div>
                </div>
                <div class="list-items">
                    ${renderListItemsPreview(list.items)}
                </div>
                <button class="view-list-btn">Ver lista completa</button>
            `;
            
            // Add event listeners
            listElement.querySelector('.edit-list').addEventListener('click', function(e) {
                e.stopPropagation();
                openListModal(list);
            });
            
            listElement.querySelector('.delete-list').addEventListener('click', function(e) {
                e.stopPropagation();
                if (confirm('Tem certeza que deseja excluir esta lista?')) {
                    deleteList(list.id);
                }
            });
            
            listElement.querySelector('.view-list-btn').addEventListener('click', function(e) {
                e.stopPropagation();
                openListModal(list);
            });
            
            listElement.addEventListener('click', function(e) {
                if (!e.target.closest('.list-actions') && !e.target.classList.contains('view-list-btn')) {
                    openListModal(list);
                }
            });
            
            listsContainer.appendChild(listElement);
        });
    }
    
    function renderListItemsPreview(items) {
        if (items.length === 0) {
            return '<p class="no-items">Nenhum item na lista</p>';
        }
        
        let html = '<ul>';
        const itemsToShow = items.slice(0, 3);
        
        itemsToShow.forEach(item => {
            html += `
                <li class="${item.purchased ? 'purchased' : ''}">
                    <span class="item-name">${item.name}</span>
                    ${item.quantity ? `<span class="item-quantity">${item.quantity}</span>` : ''}
                </li>
            `;
        });
        
        if (items.length > 3) {
            html += `<li class="more-items">+${items.length - 3} mais itens</li>`;
        }
        
        html += '</ul>';
        return html;
    }
    
    function openListModal(list = null) {
        const modal = document.getElementById('list-modal');
        const form = document.getElementById('list-form');
        const deleteBtn = document.getElementById('delete-list');
        
        if (list) {
            // Editing existing list
            document.getElementById('modal-title').textContent = 'Editar Lista de Compras';
            document.getElementById('list-name').value = list.name;
            document.getElementById('list-date').value = list.date || '';
            
            // Add items
            const itemsContainer = document.getElementById('items-list');
            itemsContainer.innerHTML = '';
            list.items.forEach(item => {
                addItemToForm(item);
            });
            
            deleteBtn.style.display = 'inline-block';
            deleteBtn.onclick = function() {
                if (confirm('Tem certeza que deseja excluir esta lista?')) {
                    deleteList(list.id);
                    modal.style.display = 'none';
                }
            };
            
            form.dataset.listId = list.id;
        } else {
            // Creating new list
            document.getElementById('modal-title').textContent = 'Nova Lista de Compras';
            form.reset();
            document.getElementById('items-list').innerHTML = '';
            deleteBtn.style.display = 'none';
            delete form.dataset.listId;
            
            // Set default date to today
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('list-date').value = today;
        }
        
        modal.style.display = 'block';
    }
    
    function addItemToForm(item) {
        const itemsContainer = document.getElementById('items-list');
        const itemElement = document.createElement('div');
        itemElement.className = `item-row ${item.category} ${item.purchased ? 'purchased' : ''}`;
        itemElement.dataset.itemId = item.id;
        itemElement.innerHTML = `
            <div class="item-checkbox">
                <input type="checkbox" id="item-${item.id}" ${item.purchased ? 'checked' : ''}>
                <label for="item-${item.id}"></label>
            </div>
            <div class="item-info">
                <input type="text" class="item-name" value="${item.name}">
                <input type="text" class="item-quantity" value="${item.quantity}">
            </div>
            <div class="item-category ${item.category}">
                ${getCategoryName(item.category)}
            </div>
            <button type="button" class="remove-item"><i class="fas fa-times"></i></button>
        `;
        
        itemElement.querySelector('.item-checkbox input').addEventListener('change', function() {
            itemElement.classList.toggle('purchased', this.checked);
        });
        
        itemElement.querySelector('.remove-item').addEventListener('click', function() {
            itemElement.remove();
        });
        
        itemsContainer.appendChild(itemElement);
    }
    
    function getCategoryName(category) {
        switch(category) {
            case 'vegetables': return 'Legumes';
            case 'fruits': return 'Frutas';
            case 'meat': return 'Carnes';
            case 'dairy': return 'Laticínios';
            case 'bakery': return 'Padaria';
            case 'beverages': return 'Bebidas';
            case 'cleaning': return 'Limpeza';
            default: return 'Outros';
        }
    }
    
    function saveList() {
        const form = document.getElementById('list-form');
        const listId = form.dataset.listId;
        
        // Get all items
        const items = [];
        document.querySelectorAll('.item-row').forEach(row => {
            items.push({
                id: parseInt(row.dataset.itemId),
                name: row.querySelector('.item-name').value,
                quantity: row.querySelector('.item-quantity').value,
                category: row.classList.contains('vegetables') ? 'vegetables' :
                          row.classList.contains('fruits') ? 'fruits' :
                          row.classList.contains('meat') ? 'meat' :
                          row.classList.contains('dairy') ? 'dairy' :
                          row.classList.contains('bakery') ? 'bakery' :
                          row.classList.contains('beverages') ? 'beverages' :
                          row.classList.contains('cleaning') ? 'cleaning' : 'other',
                purchased: row.querySelector('.item-checkbox input').checked
            });
        });
        
        const list = {
            id: listId || Date.now(), // Use existing ID or generate new one
            name: document.getElementById('list-name').value,
            date: document.getElementById('list-date').value || null,
            items: items,
            createdAt: listId ? 
                shoppingLists.find(l => l.id == listId).createdAt : new Date()
        };
        
        if (listId) {
            // Update existing list
            const index = shoppingLists.findIndex(l => l.id == listId);
            if (index !== -1) {
                shoppingLists[index] = list;
            }
        } else {
            // Add new list
            shoppingLists.push(list);
        }
        
        renderShoppingLists();
        document.getElementById('list-modal').style.display = 'none';
        app.showNotification('Lista salva com sucesso!', 'success');
    }
    
    function deleteList(id) {
        const index = shoppingLists.findIndex(list => list.id == id);
        if (index !== -1) {
            shoppingLists.splice(index, 1);
            renderShoppingLists();
            app.showNotification('Lista excluída', 'success');
        }
    }
});