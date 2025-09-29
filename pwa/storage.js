// Storage Management for FindMate.io
const Storage = {
    // Initialize with dummy data
    init() {
        if (!this.getSets().length) {
            this.loadDummyData();
        }
    },

    // Get all sets
    getSets() {
        return JSON.parse(localStorage.getItem('findmate_sets') || '[]');
    },

    // Save all sets
    saveSets(sets) {
        localStorage.setItem('findmate_sets', JSON.stringify(sets));
    },

    // Get a single set by ID
    getSet(id) {
        const sets = this.getSets();
        return sets.find(set => set.id === id);
    },

    // Create a new set
    createSet(name, coverImage = '') {
        const sets = this.getSets();
        const newSet = {
            id: Date.now().toString(),
            name,
            coverImage: coverImage || 'https://picsum.photos/800/600?random=' + Date.now(),
            items: [],
            checkCount: 0
        };
        sets.push(newSet);
        this.saveSets(sets);
        return newSet;
    },

    // Update a set
    updateSet(id, updates) {
        const sets = this.getSets();
        const index = sets.findIndex(set => set.id === id);
        if (index !== -1) {
            sets[index] = { ...sets[index], ...updates };
            this.saveSets(sets);
            return sets[index];
        }
        return null;
    },

    // Delete a set
    deleteSet(id) {
        const sets = this.getSets();
        const filtered = sets.filter(set => set.id !== id);
        this.saveSets(filtered);
    },

    // Add item to set
    addItem(setId, item) {
        const sets = this.getSets();
        const set = sets.find(s => s.id === setId);
        if (set) {
            const newItem = {
                id: Date.now().toString(),
                rfidId: item.rfidId || '',
                name: item.name,
                image: item.image || 'https://picsum.photos/400/400?random=' + Date.now(),
                description: item.description || ''
            };
            set.items.push(newItem);
            this.saveSets(sets);
            return newItem;
        }
        return null;
    },

    // Update an item
    updateItem(setId, itemId, updates) {
        const sets = this.getSets();
        const set = sets.find(s => s.id === setId);
        if (set) {
            const item = set.items.find(i => i.id === itemId);
            if (item) {
                Object.assign(item, updates);
                this.saveSets(sets);
                return item;
            }
        }
        return null;
    },

    // Delete an item
    deleteItem(setId, itemId) {
        const sets = this.getSets();
        const set = sets.find(s => s.id === setId);
        if (set) {
            set.items = set.items.filter(i => i.id !== itemId);
            this.saveSets(sets);
        }
    },

    // Increment check count
    incrementCheckCount(setId) {
        const sets = this.getSets();
        const set = sets.find(s => s.id === setId);
        if (set) {
            set.checkCount = (set.checkCount || 0) + 1;
            this.saveSets(sets);
            return set.checkCount;
        }
        return 0;
    },

    // Admin rules management
    getAdminRules() {
        return JSON.parse(localStorage.getItem('findmate_admin_rules') || '[]');
    },

    saveAdminRule(rule) {
        const rules = this.getAdminRules();
        // Remove existing rule for same set and check number
        const filtered = rules.filter(r => !(r.setId === rule.setId && r.checkNumber === rule.checkNumber));
        filtered.push(rule);
        localStorage.setItem('findmate_admin_rules', JSON.stringify(filtered));
    },

    getAdminRule(setId, checkNumber) {
        const rules = this.getAdminRules();
        return rules.find(r => r.setId === setId && r.checkNumber === checkNumber);
    },

    deleteAdminRule(setId, checkNumber) {
        const rules = this.getAdminRules();
        const filtered = rules.filter(r => !(r.setId === setId && r.checkNumber === checkNumber));
        localStorage.setItem('findmate_admin_rules', JSON.stringify(filtered));
    },

    // Load dummy data
    loadDummyData() {
        const dummySet = {
            id: '1',
            name: 'Vlogger Essentials',
            coverImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
            checkCount: 0,
            items: [
                {
                    id: '1',
                    rfidId: 'RFID001',
                    name: 'Sony A7 IV',
                    image: 'images/Sony-A7-IV-1024x683.jpg',
                    description: 'Professional mirrorless camera'
                },
                {
                    id: '2',
                    rfidId: 'RFID002',
                    name: '24-70mm lens',
                    image: 'images/sony-fe-24-70-gm-ii-side_1.webp',
                    description: 'Versatile zoom lens'
                },
                {
                    id: '3',
                    rfidId: 'RFID003',
                    name: 'Rode Videomic NTG',
                    image: 'images/rode.jpg',
                    description: 'Professional shotgun microphone'
                },
                {
                    id: '4',
                    rfidId: 'RFID004',
                    name: 'DJI Osmo Pocket',
                    image: 'images/dji osmo pocket.webp',
                    description: 'Handheld gimbal camera'
                },
                {
                    id: '5',
                    rfidId: 'RFID005',
                    name: 'MacBook Pro 14"',
                    image: 'images/macbook-pro.png',
                    description: 'Editing powerhouse'
                },
                {
                    id: '6',
                    rfidId: 'RFID006',
                    name: 'GoPro Hero 12',
                    image: 'images/gopro.jpeg',
                    description: 'Action camera'
                },
                {
                    id: '7',
                    rfidId: 'RFID007',
                    name: 'LED panel light',
                    image: 'images/led panel.jpg',
                    description: 'Portable lighting solution'
                },
                {
                    id: '8',
                    rfidId: 'RFID008',
                    name: 'Manfrotto tripod',
                    image: 'images/manfrotto.jpg',
                    description: 'Sturdy professional tripod'
                },
                {
                    id: '9',
                    rfidId: 'RFID009',
                    name: 'DJI Mini 4 Pro',
                    image: 'images/DJI_Mini_4_Pro__1_.png',
                    description: 'Compact drone for aerial shots'
                },
                {
                    id: '10',
                    rfidId: 'RFID010',
                    name: 'Sony WH-1000XM5 headphones',
                    image: 'images/sonywh1000.webp',
                    description: 'Premium noise-canceling headphones'
                }
            ]
        };
        this.saveSets([dummySet]);
    }
};

// Initialize storage on load
Storage.init();