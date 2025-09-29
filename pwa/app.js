// FindMate.io - Main Application
const App = {
    currentView: 'home',
    currentSetId: null,
    longPressTimer: null,

    init() {
        this.setupEventListeners();
        this.setupBLE();
        this.renderHome();
    },

    setupEventListeners() {
        // Hamburger menu
        document.getElementById('hamburger').addEventListener('click', () => {
            document.getElementById('menu').classList.remove('hidden');
        });

        // Long press for admin panel
        let pressTimer;
        document.getElementById('hamburger').addEventListener('touchstart', (e) => {
            pressTimer = setTimeout(() => {
                this.openAdminPanel();
                e.preventDefault();
            }, 800);
        });

        document.getElementById('hamburger').addEventListener('touchend', () => {
            clearTimeout(pressTimer);
        });

        // Close menu
        document.getElementById('closeMenu').addEventListener('click', () => {
            document.getElementById('menu').classList.add('hidden');
        });

        document.getElementById('menu').addEventListener('click', (e) => {
            if (e.target.id === 'menu') {
                document.getElementById('menu').classList.add('hidden');
            }
        });

        // Admin panel
        document.getElementById('closeAdmin').addEventListener('click', () => {
            document.getElementById('adminPanel').classList.add('hidden');
        });

        document.getElementById('adminSetSelect').addEventListener('change', (e) => {
            this.loadAdminItems(e.target.value);
        });

        document.getElementById('saveAdminRule').addEventListener('click', () => {
            this.saveAdminRule();
        });

        // BLE button
        document.getElementById('bleButton').addEventListener('click', () => {
            this.toggleBLE();
        });
    },

    // BLE Management
    setupBLE() {
        // Load saved BLE state
        const savedState = localStorage.getItem('bleConnected');
        this.bleConnected = savedState === 'true';
        this.updateBLEStatus();
    },

    async toggleBLE() {
        if (!this.bleConnected) {
            // Show connecting state
            const indicator = document.getElementById('bleIndicator');
            const status = document.getElementById('bleStatus');
            indicator.className = 'w-2 h-2 rounded-full bg-accent animate-spin';
            status.textContent = 'Connecting...';

            // Simulate connection for demo (1.5 second delay)
            await new Promise(resolve => setTimeout(resolve, 1500));
            this.bleConnected = true;
            localStorage.setItem('bleConnected', 'true');
            this.updateBLEStatus();
        } else {
            // Disconnect
            this.bleConnected = false;
            localStorage.setItem('bleConnected', 'false');
            this.updateBLEStatus();
        }
    },

    updateBLEStatus() {
        const indicator = document.getElementById('bleIndicator');
        const status = document.getElementById('bleStatus');

        if (this.bleConnected) {
            indicator.className = 'w-2 h-2 rounded-full bg-primary pulse';
            status.textContent = 'Connected';
        } else {
            indicator.className = 'w-2 h-2 rounded-full bg-gray-500';
            status.textContent = 'RFID';
        }
    },

    // Navigation
    navigate(view, setId = null) {
        this.currentView = view;
        this.currentSetId = setId;

        switch(view) {
            case 'home':
                this.renderHome();
                break;
            case 'setDetail':
                this.renderSetDetail(setId);
                break;
            case 'check':
                this.renderCheck(setId);
                break;
        }
    },

    // Render Home View
    renderHome() {
        const sets = Storage.getSets();
        const app = document.getElementById('app');

        app.innerHTML = `
            <div class="p-4 fade-in">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold">My Sets</h2>
                    <button onclick="App.showCreateSetModal()" class="bg-primary hover:bg-green-500 text-gray-900 font-semibold px-4 py-2 rounded-lg transition-colors">
                        + New Set
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${sets.map(set => `
                        <div class="bg-gray-800 rounded-2xl overflow-hidden shadow-lg relative group">
                            <div onclick="App.navigate('setDetail', '${set.id}')" class="cursor-pointer">
                                <div class="h-48 bg-cover bg-center" style="background-image: url('${set.coverImage}')"></div>
                                <div class="p-4">
                                    <h3 class="font-bold text-lg">${set.name}</h3>
                                    <p class="text-gray-400 text-sm mt-1">${set.items.length} items</p>
                                </div>
                            </div>
                            <div class="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onclick="event.stopPropagation(); App.checkSet('${set.id}')" class="w-9 h-9 bg-gray-900 bg-opacity-90 hover:bg-primary rounded-lg flex items-center justify-center transition-colors" title="Check this set">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </button>
                                <button onclick="event.stopPropagation(); App.showEditSetModal('${set.id}')" class="w-9 h-9 bg-gray-900 bg-opacity-90 hover:bg-secondary rounded-lg flex items-center justify-center transition-colors" title="Edit set">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                </button>
                                <button onclick="event.stopPropagation(); App.deleteSet('${set.id}')" class="w-9 h-9 bg-gray-900 bg-opacity-90 hover:bg-danger rounded-lg flex items-center justify-center transition-colors" title="Delete set">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>

                ${sets.length === 0 ? `
                    <div class="text-center py-16">
                        <p class="text-gray-400 text-lg">No sets yet. Create your first one!</p>
                    </div>
                ` : ''}
            </div>
        `;
    },

    // Render Set Detail View
    renderSetDetail(setId) {
        const set = Storage.getSet(setId);
        if (!set) {
            this.navigate('home');
            return;
        }

        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="p-4 fade-in">
                <button onclick="App.navigate('home')" class="flex items-center gap-2 text-gray-400 hover:text-gray-50 mb-4">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Back to Sets
                </button>

                <div class="mb-6">
                    <h2 class="text-2xl font-bold">${set.name}</h2>
                    <p class="text-gray-400 mt-1">${set.items.length} items in this set</p>
                </div>

                <div class="flex gap-3 mb-6">
                    <button onclick="App.checkSet('${set.id}')" class="flex-1 bg-secondary hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors">
                        📦 Check This Set
                    </button>
                    <button onclick="App.showAddItemModal('${set.id}')" class="flex-1 bg-primary hover:bg-green-500 text-gray-900 font-semibold py-3 rounded-lg transition-colors">
                        + Add Item
                    </button>
                </div>

                <div class="space-y-3">
                    ${set.items.map(item => `
                        <div class="bg-gray-800 rounded-xl p-4 flex items-center gap-4">
                            <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg">
                            <div class="flex-1">
                                <h3 class="font-semibold">${item.name}</h3>
                                ${item.description ? `<p class="text-gray-400 text-sm mt-1">${item.description}</p>` : ''}
                                ${item.rfidId ? `<p class="text-gray-500 text-xs mt-1">RFID: ${item.rfidId}</p>` : ''}
                            </div>
                            <div class="flex gap-2">
                                <button onclick="App.showEditItemModal('${set.id}', '${item.id}')" class="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                </button>
                                <button onclick="App.deleteItem('${set.id}', '${item.id}')" class="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-danger transition-colors">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>

                ${set.items.length === 0 ? `
                    <div class="text-center py-16">
                        <p class="text-gray-400">No items yet. Add your first item!</p>
                    </div>
                ` : ''}
            </div>
        `;
    },

    // Check if BLE is connected before running check
    async checkSet(setId) {
        if (!this.bleConnected) {
            // Auto-connect if not connected
            await this.toggleBLE();
        }
        this.navigate('check', setId);
    },

    // Render Check View
    renderCheck(setId) {
        const set = Storage.getSet(setId);
        if (!set || set.items.length === 0) {
            alert('This set has no items to check!');
            this.navigate('setDetail', setId);
            return;
        }

        const checkCount = Storage.incrementCheckCount(setId);
        const adminRule = Storage.getAdminRule(setId, checkCount);

        // Debug info
        console.log('Check #:', checkCount);
        console.log('Admin Rule:', adminRule);
        console.log('Missing Items:', adminRule ? adminRule.missingItemIds : 'none');

        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="min-h-screen flex flex-col items-center justify-center p-4">
                <h2 class="text-xl font-bold mb-4">Checking ${set.name}...</h2>
                <div id="animationContainer" class="w-full overflow-hidden h-32 bg-gray-800 rounded-xl flex items-center">
                    <!-- Items will slide here -->
                </div>
            </div>
        `;

        // Animate items
        setTimeout(() => {
            const container = document.getElementById('animationContainer');
            container.innerHTML = `
                <div class="flex gap-4 slide-animation whitespace-nowrap">
                    ${set.items.map(item => `
                        <img src="${item.image}" alt="${item.name}" class="h-24 w-24 object-cover rounded-lg flex-shrink-0">
                    `).join('')}
                </div>
            `;

            // Show results after animation
            setTimeout(() => {
                this.showCheckResults(set, adminRule);
            }, 2000);
        }, 500);
    },

    showCheckResults(set, adminRule) {
        let missingItems = [];

        console.log('=== SHOW CHECK RESULTS DEBUG ===');
        console.log('Admin Rule:', adminRule);
        console.log('Set Items:', set.items.map(i => ({id: i.id, name: i.name})));

        if (adminRule && adminRule.missingItemIds && adminRule.missingItemIds.length > 0) {
            console.log('Missing Item IDs from rule:', adminRule.missingItemIds);
            missingItems = set.items.filter(item => adminRule.missingItemIds.includes(item.id));
            console.log('Filtered missing items:', missingItems.map(i => i.name));
        }

        const allPresent = missingItems.length === 0;
        console.log('All present?', allPresent);
        console.log('================================');

        const app = document.getElementById('app');

        app.innerHTML = `
            <div class="min-h-screen flex flex-col items-center justify-center p-4 fade-in">
                ${allPresent ? `
                    <div class="text-center scale-in">
                        <div class="w-32 h-32 bg-primary rounded-full flex items-center justify-center mb-6 mx-auto">
                            <svg class="w-20 h-20 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 class="text-3xl font-bold text-primary mb-2">All Items Packed!</h2>
                        <p class="text-gray-400 mb-8">Your ${set.name} set is complete</p>
                    </div>
                ` : `
                    <div class="text-center scale-in">
                        <div class="w-32 h-32 bg-danger rounded-full flex items-center justify-center mb-6 mx-auto">
                            <svg class="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                        </div>
                        <h2 class="text-3xl font-bold text-danger mb-2">Missing Items!</h2>
                        <p class="text-gray-400 mb-8">${missingItems.length} item${missingItems.length > 1 ? 's' : ''} not detected</p>

                        <div class="bg-gray-800 rounded-xl p-6 max-w-md mx-auto space-y-3">
                            ${missingItems.map(item => `
                                <div class="flex items-center gap-4 bg-gray-900 p-3 rounded-lg">
                                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
                                    <div class="text-left">
                                        <h3 class="font-semibold text-danger">${item.name}</h3>
                                        ${item.description ? `<p class="text-gray-400 text-sm">${item.description}</p>` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `}

                <button onclick="App.navigate('setDetail', '${set.id}')" class="mt-8 bg-gray-700 hover:bg-gray-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
                    Back to Set
                </button>
            </div>
        `;
    },

    // Modals
    showCreateSetModal() {
        const modal = this.createModal('Create New Set', `
            <input type="text" id="setName" placeholder="Set name" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-50 mb-4">
            <input type="text" id="setCoverImage" placeholder="Cover image URL (optional)" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-50 mb-4">
            <button onclick="App.createSet()" class="w-full bg-primary hover:bg-green-500 text-gray-900 font-semibold py-3 rounded-lg">Create</button>
        `);
        document.body.appendChild(modal);
    },

    showEditSetModal(setId) {
        const set = Storage.getSet(setId);
        const modal = this.createModal('Edit Set', `
            <input type="text" id="setName" value="${set.name}" placeholder="Set name" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-50 mb-4">
            <input type="text" id="setCoverImage" value="${set.coverImage}" placeholder="Cover image URL" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-50 mb-4">
            <button onclick="App.updateSet('${setId}')" class="w-full bg-secondary hover:bg-blue-600 text-white font-semibold py-3 rounded-lg">Update Set</button>
        `);
        document.body.appendChild(modal);
    },

    showAddItemModal(setId) {
        // Get all items from all sets
        const allSets = Storage.getSets();
        const currentSet = allSets.find(s => s.id === setId);
        const allItems = [];

        allSets.forEach(set => {
            set.items.forEach(item => {
                // Only add if not already in current set
                if (!currentSet.items.find(i => i.id === item.id)) {
                    allItems.push({...item, setName: set.name});
                }
            });
        });

        const modal = this.createModal('Add Item to Set', `
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-300 mb-2">Choose option:</label>
                <div class="flex gap-2 mb-4">
                    <button onclick="App.showNewItemForm()" class="flex-1 bg-primary hover:bg-green-500 text-gray-900 font-semibold py-2 px-3 rounded-lg text-sm">
                        + New Item
                    </button>
                    <button onclick="App.showExistingItemForm('${setId}')" class="flex-1 bg-secondary hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg text-sm">
                        📋 Existing Item
                    </button>
                </div>
            </div>

            <div id="itemFormContainer">
                <p class="text-gray-400 text-center py-4">Select an option above</p>
            </div>
        `);
        document.body.appendChild(modal);
    },

    showNewItemForm() {
        const container = document.getElementById('itemFormContainer');
        const setId = this.currentSetId;
        container.innerHTML = `
            <input type="text" id="itemRfidId" placeholder="RFID ID (optional)" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-50 mb-3">
            <input type="text" id="itemName" placeholder="Item name" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-50 mb-3">
            <input type="text" id="itemImage" placeholder="Image URL (optional)" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-50 mb-3">
            <textarea id="itemDescription" placeholder="Description (optional)" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-50 mb-4" rows="3"></textarea>
            <button onclick="App.addItem('${setId}')" class="w-full bg-primary hover:bg-green-500 text-gray-900 font-semibold py-3 rounded-lg">Create & Add Item</button>
        `;
    },

    showExistingItemForm(setId) {
        const allSets = Storage.getSets();
        const currentSet = allSets.find(s => s.id === setId);
        const availableItems = [];

        allSets.forEach(set => {
            set.items.forEach(item => {
                // Only show items not in current set
                if (!currentSet.items.find(i => i.id === item.id)) {
                    availableItems.push({...item, setName: set.name, setId: set.id});
                }
            });
        });

        const container = document.getElementById('itemFormContainer');

        if (availableItems.length === 0) {
            container.innerHTML = `
                <p class="text-gray-400 text-center py-4">No existing items available from other sets</p>
            `;
            return;
        }

        container.innerHTML = `
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-300 mb-2">Select item to add:</label>
                <div class="space-y-2 max-h-64 overflow-y-auto bg-gray-900 rounded-lg p-3">
                    ${availableItems.map(item => `
                        <label class="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                            <input type="radio" name="existingItem" value="${item.id}" class="w-5 h-5 text-primary">
                            <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded">
                            <div class="flex-1">
                                <p class="font-medium text-sm">${item.name}</p>
                                <p class="text-xs text-gray-400">from ${item.setName}</p>
                            </div>
                        </label>
                    `).join('')}
                </div>
            </div>
            <button onclick="App.addExistingItem('${setId}')" class="w-full bg-secondary hover:bg-blue-600 text-white font-semibold py-3 rounded-lg">Add Selected Item</button>
        `;
    },

    addExistingItem(setId) {
        const selected = document.querySelector('input[name="existingItem"]:checked');
        if (!selected) {
            alert('Please select an item');
            return;
        }

        const itemId = selected.value;

        // Find the item from any set
        const allSets = Storage.getSets();
        let sourceItem = null;
        for (let set of allSets) {
            const found = set.items.find(i => i.id === itemId);
            if (found) {
                sourceItem = found;
                break;
            }
        }

        if (sourceItem) {
            // Add copy of item to current set
            Storage.addItem(setId, {
                rfidId: sourceItem.rfidId,
                name: sourceItem.name,
                image: sourceItem.image,
                description: sourceItem.description
            });
        }

        document.querySelector('.fixed').remove();
        this.renderSetDetail(setId);
    },

    showEditItemModal(setId, itemId) {
        const set = Storage.getSet(setId);
        const item = set.items.find(i => i.id === itemId);

        const modal = this.createModal('Edit Item', `
            <input type="text" id="itemRfidId" value="${item.rfidId}" placeholder="RFID ID (optional)" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-50 mb-3">
            <input type="text" id="itemName" value="${item.name}" placeholder="Item name" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-50 mb-3">
            <input type="text" id="itemImage" value="${item.image}" placeholder="Image URL" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-50 mb-3">
            <textarea id="itemDescription" placeholder="Description (optional)" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-50 mb-4" rows="3">${item.description}</textarea>
            <button onclick="App.updateItem('${setId}', '${itemId}')" class="w-full bg-secondary hover:bg-blue-600 text-white font-semibold py-3 rounded-lg">Update Item</button>
        `);
        document.body.appendChild(modal);
    },

    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 scale-in">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-bold">${title}</h2>
                    <button onclick="this.closest('.fixed').remove()" class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-50">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                ${content}
            </div>
        `;
        return modal;
    },

    // Actions
    createSet() {
        const name = document.getElementById('setName').value.trim();
        const coverImage = document.getElementById('setCoverImage').value.trim();

        if (!name) {
            alert('Please enter a set name');
            return;
        }

        Storage.createSet(name, coverImage);
        document.querySelector('.fixed').remove();
        this.renderHome();
    },

    addItem(setId) {
        const rfidId = document.getElementById('itemRfidId').value.trim();
        const name = document.getElementById('itemName').value.trim();
        const image = document.getElementById('itemImage').value.trim();
        const description = document.getElementById('itemDescription').value.trim();

        if (!name) {
            alert('Please enter an item name');
            return;
        }

        Storage.addItem(setId, { rfidId, name, image, description });
        document.querySelector('.fixed').remove();
        this.renderSetDetail(setId);
    },

    updateItem(setId, itemId) {
        const rfidId = document.getElementById('itemRfidId').value.trim();
        const name = document.getElementById('itemName').value.trim();
        const image = document.getElementById('itemImage').value.trim();
        const description = document.getElementById('itemDescription').value.trim();

        if (!name) {
            alert('Please enter an item name');
            return;
        }

        Storage.updateItem(setId, itemId, { rfidId, name, image, description });
        document.querySelector('.fixed').remove();
        this.renderSetDetail(setId);
    },

    updateSet(setId) {
        const name = document.getElementById('setName').value.trim();
        const coverImage = document.getElementById('setCoverImage').value.trim();

        if (!name) {
            alert('Please enter a set name');
            return;
        }

        Storage.updateSet(setId, { name, coverImage });
        document.querySelector('.fixed').remove();
        this.renderHome();
    },

    deleteSet(setId) {
        if (confirm('Are you sure you want to delete this set and all its items?')) {
            Storage.deleteSet(setId);
            this.renderHome();
        }
    },

    deleteItem(setId, itemId) {
        if (confirm('Are you sure you want to delete this item?')) {
            Storage.deleteItem(setId, itemId);
            this.renderSetDetail(setId);
        }
    },

    clearAllData() {
        if (confirm('⚠️ This will delete ALL your sets, items, and admin rules. Are you sure?')) {
            localStorage.clear();
            document.getElementById('menu').classList.add('hidden');
            alert('✅ All data cleared! Reloading app...');
            window.location.reload();
        }
    },

    // Admin Panel
    openAdminPanel() {
        const sets = Storage.getSets();
        const select = document.getElementById('adminSetSelect');

        select.innerHTML = '<option value="">-- Choose a set --</option>' +
            sets.map(set => `<option value="${set.id}">${set.name}</option>`).join('');

        document.getElementById('adminPanel').classList.remove('hidden');
        document.getElementById('menu').classList.add('hidden');

        // Setup clear storage button
        document.getElementById('clearStorage').onclick = () => this.clearAllData();
    },

    loadAdminItems(setId) {
        const container = document.getElementById('adminItemsList');

        if (!setId) {
            container.innerHTML = '<p class="text-gray-500 text-sm">Select a set to see items</p>';
            return;
        }

        const set = Storage.getSet(setId);
        container.innerHTML = set.items.map(item => `
            <label class="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                <input type="checkbox" value="${item.id}" class="admin-item-checkbox w-5 h-5 rounded border-gray-600 text-danger focus:ring-danger">
                <span class="text-sm">${item.name}</span>
            </label>
        `).join('');
    },

    saveAdminRule() {
        const setId = document.getElementById('adminSetSelect').value;
        const checkNumber = parseInt(document.getElementById('adminCheckNumber').value);

        if (!setId || !checkNumber) {
            alert('Please select a set and enter a check number');
            return;
        }

        const checkboxes = document.querySelectorAll('.admin-item-checkbox:checked');
        const missingItemIds = Array.from(checkboxes).map(cb => cb.value);

        console.log('=== SAVING ADMIN RULE ===');
        console.log('Set ID:', setId);
        console.log('Check Number:', checkNumber);
        console.log('Missing Item IDs:', missingItemIds);

        Storage.saveAdminRule({
            setId,
            checkNumber,
            missingItemIds
        });

        console.log('Rule saved. All rules:', Storage.getAdminRules());
        console.log('========================');

        alert(`Simulation rule saved! Missing items will be triggered on check #${checkNumber}`);
        document.getElementById('adminPanel').classList.add('hidden');
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(() => {
            console.log('Service worker registration failed');
        });
    });
}