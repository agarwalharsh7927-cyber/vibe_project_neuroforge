/**
 * State Management
 * Holds the components placed on the canvas and handles selection state
 */

const BuilderState = {
    components: [], // Array of component objects on the canvas
    selectedId: null, // ID of currently selected component
    pageSettings: {
        background: '#0f172a',
        textColor: '#ffffff',
        theme: 'dark',
        enable3d: false,
        siteName: 'NeuroForg Project'
    },
    history: [], // For undo functionality
    historyIndex: -1,
    
    // Subscribe to state changes
    listeners: [],
    subscribe(callback) {
        this.listeners.push(callback);
    },
    notify() {
        this.listeners.forEach(cb => cb(this));
        
        // Auto-save to LocalStorage
        const stateCopy = {
            components: this.components,
            selectedId: this.selectedId,
            pageSettings: this.pageSettings
        };
        localStorage.setItem('builderSave', JSON.stringify(stateCopy));
    },

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('builderSave');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.components = parsed.components || [];
                this.pageSettings = {
                    ...this.pageSettings,
                    ...(parsed.pageSettings || {})
                };
                // selectedId shouldn't map over on fresh load usually, but we can set it to null
                this.selectedId = null; 
                this.notify();
                return true;
            }
        } catch(e) { console.error('Error loading save', e); }
        return false;
    },

    addComponent(component, parentId = null, index = null) {
        this.saveHistory();
        
        const prepareComponent = (comp) => {
            const id = 'el_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
            const newComp = {
                ...comp,
                id,
                props: { ...(comp.props || {}) },
                styles: { ...(comp.styles || {}) },
                children: comp.children ? comp.children.map(c => prepareComponent(c)) : (comp.isContainer ? [] : null)
            };
            return newComp;
        };

        const newComponent = prepareComponent(component);
        
        if (parentId) {
            // Find parent and add to its children
            const parent = this.findComponent(parentId);
            if (parent && parent.children) {
                if (index !== null) {
                    parent.children.splice(index, 0, newComponent);
                } else {
                    parent.children.push(newComponent);
                }
            }
        } else {
            if (index !== null) {
                this.components.splice(index, 0, newComponent);
            } else {
                this.components.push(newComponent);
            }
        }
        this.selectComponent(newComponent.id);
        this.notify();
    },

    findComponent(id, list = this.components) {
        for (let item of list) {
            if (item.id === id) return item;
            if (item.children) {
                const found = this.findComponent(id, item.children);
                if (found) return found;
            }
        }
        return null;
    },

    updateComponent(id, newStyles, newProps) {
        this.saveHistory();
        const component = this.findComponent(id);
        if (component) {
            if (newStyles) component.styles = { ...component.styles, ...newStyles };
            if (newProps) component.props = { ...component.props, ...newProps };
            this.notify();
        }
    },

    removeComponent(id) {
        this.saveHistory();
        const recursiveRemove = (list) => {
            const index = list.findIndex(c => c.id === id);
            if (index !== -1) {
                list.splice(index, 1);
                return true;
            }
            for (let item of list) {
                if (item.children && recursiveRemove(item.children)) {
                    return true;
                }
            }
            return false;
        };
        recursiveRemove(this.components);
        if (this.selectedId === id) this.selectedId = null;
        this.notify();
    },

    selectComponent(id) {
        this.selectedId = id;
        this.notify();
    },

    clear() {
        this.saveHistory();
        this.components = [];
        this.selectedId = null;
        this.notify();
    },

    updatePageSettings(nextSettings) {
        this.saveHistory();
        this.pageSettings = {
            ...this.pageSettings,
            ...nextSettings
        };
        this.notify();
    },

    saveHistory() {
        // Drop future history if we're not at the end
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        
        // Deep copy state
        const stateCopy = JSON.parse(JSON.stringify({
            components: this.components,
            selectedId: this.selectedId,
            pageSettings: this.pageSettings
        }));
        
        this.history.push(stateCopy);
        
        // Limit history size to 50
        if (this.history.length > 50) {
            this.history.shift();
        } else {
            this.historyIndex++;
        }
    },

    undo() {
        if (this.historyIndex >= 0) {
            const previousState = this.history[this.historyIndex];
            
            // Re-save current state as a forward step if we are at the end
            if (this.historyIndex === this.history.length - 1) {
                const currentState = JSON.parse(JSON.stringify({
                    components: this.components,
                    selectedId: this.selectedId,
                    pageSettings: this.pageSettings
                }));
                this.history.push(currentState);
            }
            
            this.components = JSON.parse(JSON.stringify(previousState.components));
            this.selectedId = previousState.selectedId;
            this.pageSettings = {
                ...this.pageSettings,
                ...(previousState.pageSettings || {})
            };
            this.historyIndex--;
            this.notify();
        }
    },

    redo() {
        if (this.historyIndex < this.history.length - 2) {
            this.historyIndex++;
            const nextState = this.history[this.historyIndex + 1];
            this.components = JSON.parse(JSON.stringify(nextState.components));
            this.selectedId = nextState.selectedId;
            this.pageSettings = {
                ...this.pageSettings,
                ...(nextState.pageSettings || {})
            };
            this.notify();
        }
    }
};

window.BuilderState = BuilderState;
