document.addEventListener('DOMContentLoaded', function() {
    // Sample recipes data
    const recipes = [
        {
            id: 1,
            name: 'Panquecas Integrais',
            category: 'breakfast',
            time: 20,
            portions: 4,
            difficulty: 'easy',
            ingredients: [
                { name: 'Farinha integral', amount: '1 xícara' },
                { name: 'Ovo', amount: '1 unidade' },
                { name: 'Leite', amount: '3/4 xícara' },
                { name: 'Fermento em pó', amount: '1 colher de chá' }
            ],
            instructions: '1. Misture todos os ingredientes em uma tigela.\n2. Aqueça uma frigideira antiaderente em fogo médio.\n3. Despeje pequenas porções da massa na frigideira.\n4. Vire quando aparecerem bolhas na superfície.\n5. Sirva com mel ou frutas.',
            notes: 'Para panquecas mais fofas, deixe a massa descansar por 5 minutos antes de cozinhar.',
            image: 'https://via.placeholder.com/300x200?text=Panquecas+Integrais',
            favorite: true,
            createdAt: new Date('2023-05-01')
        },
        {
            id: 2,
            name: 'Frango ao Curry',
            category: 'dinner',
            time: 45,
            portions: 6,
            difficulty: 'medium',
            ingredients: [
                { name: 'Peito de frango', amount: '500g' },
                { name: 'Creme de leite', amount: '1 caixinha' },
                { name: 'Molho de tomate', amount: '1/2 xícara' },
                { name: 'Curry em pó', amount: '2 colheres de sopa' }
            ],
            instructions: '1. Corte o frango em cubos e tempere com sal.\n2. Refogue o frango em uma panela com um pouco de óleo.\n3. Adicione o curry e misture bem.\n4. Acrescente o molho de tomate e deixe cozinhar por 10 minutos.\n5. Adicione o creme de leite e mexa até homogeneizar.\n6. Sirva com arroz branco.',
            notes: 'Para um sabor mais intenso, deixe o frango marinar com o curry por 1 hora antes de cozinhar.',
            image: 'https://via.placeholder.com/300x200?text=Frango+ao+Curry',
            favorite: false,
            createdAt: new Date('2023-05-10')
        }
    ];
    
    // Initialize recipes
    renderRecipes();
    
    // New recipe button
    document.getElementById('new-recipe-btn').addEventListener('click', function() {
        openRecipeModal();
    });
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            renderRecipes(this.textContent.toLowerCase());
        });
    });
    
    // Modal functionality
    const modal = document.getElementById('recipe-modal');
    const closeModal = document.querySelector('.close-modal');
    
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Image upload preview
    document.getElementById('recipe-image').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const preview = document.getElementById('image-preview');
                preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Add ingredient
    document.getElementById('add-ingredient-btn').addEventListener('click', function() {
        const nameInput = document.getElementById('new-ingredient');
        const amountInput = document.getElementById('new-ingredient-amount');
        
        if (nameInput.value.trim() === '') return;
        
        const ingredient = {
            name: nameInput.value.trim(),
            amount: amountInput.value.trim() || 'a gosto'
        };
        
        addIngredientToForm(ingredient);
        
        // Clear inputs
        nameInput.value = '';
        amountInput.value = '';
        nameInput.focus();
    });
    
    // Allow adding ingredient with Enter key
    document.getElementById('new-ingredient').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('add-ingredient-btn').click();
        }
    });
    
    // Recipe form submission
    document.getElementById('recipe-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveRecipe();
    });
    
    function renderRecipes(filter = 'todas') {
        const recipesGrid = document.querySelector('.recipes-grid');
        recipesGrid.innerHTML = '';
        
        let filteredRecipes = [...recipes];
        
        // Apply filter
        if (filter === 'favoritas') {
            filteredRecipes = filteredRecipes.filter(recipe => recipe.favorite);
        } else if (filter !== 'todas') {
            filteredRecipes = filteredRecipes.filter(recipe => 
                recipe.category === filter || 
                recipe.name.toLowerCase().includes(filter.toLowerCase())
            );
        }
        
        // Sort by creation date (newest first)
        filteredRecipes.sort((a, b) => b.createdAt - a.createdAt);
        
        if (filteredRecipes.length === 0) {
            recipesGrid.innerHTML = '<p class="no-recipes">Nenhuma receita encontrada.</p>';
            return;
        }
        
        filteredRecipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'recipe-card';
            recipeCard.innerHTML = `
                <div class="recipe-image" style="background-image: url('${recipe.image}')">
                    ${recipe.favorite ? '<div class="favorite-badge"><i class="fas fa-star"></i></div>' : ''}
                </div>
                <div class="recipe-info">
                    <h3>${recipe.name}</h3>
                    <div class="recipe-meta">
                        <span><i class="fas fa-clock"></i> ${recipe.time} min</span>
                        <span><i class="fas fa-utensils"></i> ${recipe.portions} ${recipe.portions === 1 ? 'porção' : 'porções'}</span>
                        <span class="difficulty ${recipe.difficulty}">
                            ${recipe.difficulty === 'easy' ? 'Fácil' : 
                              recipe.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                        </span>
                    </div>
                    <div class="recipe-category ${recipe.category}">
                        ${getCategoryName(recipe.category)}
                    </div>
                </div>
            `;
            
            recipeCard.addEventListener('click', () => openRecipeModal(recipe));
            recipesGrid.appendChild(recipeCard);
        });
    }
    
    function getCategoryName(category) {
        switch(category) {
            case 'breakfast': return 'Café da manhã';
            case 'lunch': return 'Almoço';
            case 'dinner': return 'Jantar';
            case 'dessert': return 'Sobremesa';
            case 'snack': return 'Lanche';
            case 'drink': return 'Bebida';
            default: return category;
        }
    }
    
    function openRecipeModal(recipe = null) {
        const modal = document.getElementById('recipe-modal');
        const form = document.getElementById('recipe-form');
        const deleteBtn = document.getElementById('delete-recipe');
        
        if (recipe) {
            // Editing existing recipe
            document.getElementById('modal-title').textContent = 'Editar Receita';
            document.getElementById('recipe-name').value = recipe.name;
            document.getElementById('recipe-category').value = recipe.category;
            document.getElementById('recipe-time').value = recipe.time;
            document.getElementById('recipe-portions').value = recipe.portions;
            document.getElementById('recipe-difficulty').value = recipe.difficulty;
            document.getElementById('recipe-instructions').value = recipe.instructions;
            document.getElementById('recipe-notes').value = recipe.notes || '';
            
            // Set image preview
            const preview = document.getElementById('image-preview');
            if (recipe.image) {
                preview.innerHTML = `<img src="${recipe.image}" alt="Preview">`;
            } else {
                preview.innerHTML = '<i class="fas fa-camera"></i><span>Adicionar imagem</span>';
            }
            
            // Add ingredients
            const ingredientsList = document.getElementById('ingredients-list');
            ingredientsList.innerHTML = '';
            recipe.ingredients.forEach(ingredient => {
                addIngredientToForm(ingredient);
            });
            
            deleteBtn.style.display = 'inline-block';
            deleteBtn.onclick = function() {
                if (confirm('Tem certeza que deseja excluir esta receita?')) {
                    deleteRecipe(recipe.id);
                    modal.style.display = 'none';
                }
            };
            
            form.dataset.recipeId = recipe.id;
        } else {
            // Creating new recipe
            document.getElementById('modal-title').textContent = 'Nova Receita';
            form.reset();
            document.getElementById('ingredients-list').innerHTML = '';
            document.getElementById('image-preview').innerHTML = 
                '<i class="fas fa-camera"></i><span>Adicionar imagem</span>';
            deleteBtn.style.display = 'none';
            delete form.dataset.recipeId;
        }
        
        modal.style.display = 'block';
    }
    
    function addIngredientToForm(ingredient) {
        const ingredientsList = document.getElementById('ingredients-list');
        const ingredientElement = document.createElement('div');
        ingredientElement.className = 'ingredient-item';
        ingredientElement.innerHTML = `
            <span class="ingredient-name">${ingredient.name}</span>
            <span class="ingredient-amount">${ingredient.amount}</span>
            <button type="button" class="remove-ingredient"><i class="fas fa-times"></i></button>
        `;
        
        ingredientElement.querySelector('.remove-ingredient').addEventListener('click', function() {
            ingredientElement.remove();
        });
        
        ingredientsList.appendChild(ingredientElement);
    }
    
    function saveRecipe() {
        const form = document.getElementById('recipe-form');
        const recipeId = form.dataset.recipeId;
        
        // Get all ingredients
        const ingredients = [];
        document.querySelectorAll('.ingredient-item').forEach(item => {
            ingredients.push({
                name: item.querySelector('.ingredient-name').textContent,
                amount: item.querySelector('.ingredient-amount').textContent
            });
        });
        
        // Get image (simplified for this example)
        let image = 'https://via.placeholder.com/300x200?text=Sem+imagem';
        const imagePreview = document.getElementById('image-preview').querySelector('img');
        if (imagePreview) {
            image = imagePreview.src;
        }
        
        const recipe = {
            id: recipeId || Date.now(), // Use existing ID or generate new one
            name: document.getElementById('recipe-name').value,
            category: document.getElementById('recipe-category').value,
            time: parseInt(document.getElementById('recipe-time').value),
            portions: parseInt(document.getElementById('recipe-portions').value),
            difficulty: document.getElementById('recipe-difficulty').value,
            ingredients: ingredients,
            instructions: document.getElementById('recipe-instructions').value,
            notes: document.getElementById('recipe-notes').value,
            image: image,
            favorite: false, // Would be preserved in a real app
            createdAt: recipeId ? 
                recipes.find(r => r.id == recipeId).createdAt : new Date()
        };
        
        if (recipeId) {
            // Update existing recipe
            const index = recipes.findIndex(r => r.id == recipeId);
            if (index !== -1) {
                recipes[index] = recipe;
            }
        } else {
            // Add new recipe
            recipes.push(recipe);
        }
        
        renderRecipes(document.querySelector('.filter-btn.active').textContent.toLowerCase());
        document.getElementById('recipe-modal').style.display = 'none';
        app.showNotification('Receita salva com sucesso!', 'success');
    }
    
    function deleteRecipe(id) {
        const index = recipes.findIndex(recipe => recipe.id == id);
        if (index !== -1) {
            recipes.splice(index, 1);
            renderRecipes(document.querySelector('.filter-btn.active').textContent.toLowerCase());
            app.showNotification('Receita excluída', 'success');
        }
    }
});