/**
 * Drag and Drop & Canvas Rendering Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    // Wait for iframe to be ready
    setTimeout(() => {
        const iframe = document.getElementById('canvas-iframe');
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        let draggedComponentType = null;

        // Setup Drag from Sidebar
        const components = document.querySelectorAll('.component-item');
        components.forEach(comp => {
            comp.addEventListener('dragstart', (e) => {
                draggedComponentType = e.target.closest('.component-item').dataset.type;
                e.dataTransfer.setData('text/plain', draggedComponentType);
                e.dataTransfer.effectAllowed = 'copy';
            });
            comp.addEventListener('dragend', () => {
                draggedComponentType = null;
                iframeDoc.querySelectorAll('.drop-zone-active').forEach(el => el.classList.remove('drop-zone-active'));
            });
        });

        // Setup Iframe Drop Zones
        iframeDoc.body.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });

        iframeDoc.body.addEventListener('drop', (e) => {
            e.preventDefault();
            
            const type = e.dataTransfer.getData('text/plain') || draggedComponentType;
            if (!type || !window.ComponentRegistry[type]) return;

            const baseComponent = window.ComponentRegistry[type];
            
            // Calculate relative position within iframe accounting for scroll
            const x = e.clientX + iframeDoc.documentElement.scrollLeft;
            const y = e.clientY + iframeDoc.documentElement.scrollTop;

            const newComponent = {
                type: baseComponent.type,
                props: { ...baseComponent.props },
                styles: { 
                    ...baseComponent.styles,
                    position: 'absolute',
                    left: `${x}px`,
                    top: `${y}px`,
                    width: baseComponent.styles.width || '300px', 
                    height: baseComponent.styles.height || 'auto',
                    margin: '0',
                    zIndex: '10' // Default z-index for new items
                },
                children: baseComponent.isContainer ? [] : null
            };

            window.BuilderState.addComponent(newComponent);
            
            // Auto-scroll to the new element
            setTimeout(() => {
                const newEl = iframeDoc.querySelector(`[data-id]`); // It will be the first one rendered usually or just scroll to coords
                iframe.parentElement.scrollTo({
                    top: y - 100,
                    left: x - 100,
                    behavior: 'smooth'
                });
            }, 100);
            
            // If in manual mode, notify that edits might be overwritten
            if (window.dispatchEvent) {
                window.dispatchEvent(new CustomEvent('builderActivity'));
            }
        });

        // Free dragging and resizing existing elements
        let isDraggingExisting = false;
        let isResizing = false;
        let startX, startY, initialLeft, initialTop, initialWidth, initialHeight, draggingId;

        iframeDoc.addEventListener('mousedown', (e) => {
            const resizer = e.target.closest('.resizer');
            const el = e.target.closest('[data-id]');
            
            if (resizer && el) {
                isResizing = true;
                draggingId = el.getAttribute('data-id');
                startX = e.clientX;
                startY = e.clientY;
                initialWidth = el.offsetWidth;
                initialHeight = el.offsetHeight;
                e.preventDefault();
                return;
            }

            if (el && !e.shiftKey) {
                isDraggingExisting = true;
                draggingId = el.getAttribute('data-id');
                window.BuilderState.selectComponent(draggingId);
                
                startX = e.clientX;
                startY = e.clientY;
                initialLeft = el.offsetLeft;
                initialTop = el.offsetTop;
                
                el.style.cursor = 'grabbing';
                e.preventDefault();
            }
        });

        iframeDoc.addEventListener('mousemove', (e) => {
            if (isResizing && draggingId) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                const el = iframeDoc.querySelector(`[data-id="${draggingId}"]`);
                if (el) {
                    const newWidth = Math.max(20, initialWidth + dx);
                    const newHeight = Math.max(20, initialHeight + dy);
                    el.style.width = `${newWidth}px`;
                    el.style.height = `${newHeight}px`;
                }
            } else if (isDraggingExisting && draggingId) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                const el = iframeDoc.querySelector(`[data-id="${draggingId}"]`);
                if (el) {
                    el.style.left = `${initialLeft + dx}px`;
                    el.style.top = `${initialTop + dy}px`;
                }
            }
        });

        iframeDoc.addEventListener('mouseup', (e) => {
            if ((isDraggingExisting || isResizing) && draggingId) {
                const el = iframeDoc.querySelector(`[data-id="${draggingId}"]`);
                if (el) {
                    window.BuilderState.updateComponent(draggingId, {
                        left: el.style.left,
                        top: el.style.top,
                        width: el.style.width,
                        height: el.style.height
                    });
                    el.style.cursor = '';
                }
            }
            isDraggingExisting = false;
            isResizing = false;
            draggingId = null;
        });

        // Selection Logic in Iframe
        iframeDoc.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link clicks etc
            const el = e.target.closest('[data-id]');
            if (el) {
                const id = el.getAttribute('data-id');
                window.BuilderState.selectComponent(id);
            } else {
                window.BuilderState.selectComponent(null);
            }
        });

        // Subscribe Render to State Changes
        window.BuilderState.subscribe(() => {
            renderCanvas();
            highlightSelected();
        });
        renderCanvas();
        highlightSelected();

        function renderCanvas() {
            // Keep styles but clear body
            const body = iframeDoc.body;
            body.innerHTML = '';
            const pageSettings = window.BuilderState.pageSettings || {};
            
            // Inject Resizer CSS
            if (!iframeDoc.getElementById('resizer-style')) {
                const style = iframeDoc.createElement('style');
                style.id = 'resizer-style';
                style.textContent = `
                    .resizer {
                        width: 14px;
                        height: 14px;
                        background: #38bdf8;
                        position: absolute;
                        right: -7px;
                        bottom: -7px;
                        cursor: nwse-resize;
                        z-index: 1000;
                        display: none;
                        border-radius: 50%;
                        border: 2px solid #fff;
                        box-shadow: 0 0 10px rgba(56, 189, 248, 0.5);
                    }
                    .selected .resizer {
                        display: block;
                    }
                    [data-id].selected {
                        outline: 2px solid #38bdf8 !important;
                        outline-offset: 4px;
                        box-shadow: 0 0 20px rgba(56, 189, 248, 0.3);
                    }
                    /* Ensure all elements are draggable and don't block clicks */
                    [data-id] * {
                        pointer-events: none !important;
                    }
                    [data-id] .resizer {
                        pointer-events: auto !important;
                    }
                    [data-id] {
                        cursor: grab !important;
                        user-select: none !important;
                        touch-action: none;
                    }
                    [data-id]:active {
                        cursor: grabbing !important;
                    }
                `;
                iframeDoc.head.appendChild(style);
            }
            
            // Handle Background
            if (pageSettings.backgroundVideo) {
                const video = iframeDoc.createElement('video');
                video.src = pageSettings.backgroundVideo;
                video.autoplay = true;
                video.muted = true;
                video.loop = true;
                video.style.position = 'fixed';
                video.style.top = '0';
                video.style.left = '0';
                video.style.width = '100%';
                video.style.height = '100%';
                video.style.objectFit = 'cover';
                video.style.zIndex = '-1';
                body.appendChild(video);
            } else if (pageSettings.backgroundImage) {
                body.style.backgroundImage = `url(${pageSettings.backgroundImage})`;
                body.style.backgroundSize = 'cover';
                body.style.backgroundPosition = 'center';
            } else {
                body.style.background = pageSettings.background || '#f7f7f2';
            }
            
            body.style.color = pageSettings.textColor || '#1f2937';
            body.style.position = 'relative'; // Ensure absolute children are relative to body
            body.style.minHeight = '100vh';
            body.style.margin = '0';
            
            const renderNode = (comp) => {
                let el;
                switch (comp.type) {
                    case 'Heading':
                    case 'HeadingGlass':
                        el = iframeDoc.createElement(comp.props.level || 'h2');
                        el.textContent = comp.props.text;
                        el.style.margin = '0';
                        break;
                    case 'Paragraph':
                        el = iframeDoc.createElement('p');
                        el.textContent = comp.props.text;
                        break;
                    case 'Button':
                    case 'ButtonOutline':
                        el = iframeDoc.createElement('a');
                        el.textContent = comp.props.text;
                        el.href = '#';
                        el.style.display = 'inline-flex';
                        el.style.alignItems = 'center';
                        el.style.justifyContent = 'center';
                        el.style.textAlign = 'center';
                        break;
                    case 'SearchBar':
                        el = iframeDoc.createElement('div');
                        el.style.display = 'flex';
                        el.style.alignItems = 'center';
                        el.innerHTML = `<input type="text" placeholder="${comp.props.placeholder}" style="width:100%;border:none;background:transparent;outline:none;color:inherit;font-family:inherit;" disabled><i class='bx bx-search' style='margin-left:10px;opacity:0.5;'></i>`;
                        break;
                    case 'Video':
                        el = iframeDoc.createElement('video');
                        el.src = comp.props.src;
                        if(comp.props.controls) el.controls = true;
                        if(comp.props.autoplay) el.autoplay = true;
                        break;
                    case 'Image':
                        el = iframeDoc.createElement('img');
                        el.src = comp.props.src;
                        el.alt = comp.props.alt || 'Image';
                        break;
                    case 'Form':
                        el = iframeDoc.createElement('form');
                        el.className = comp.props.className || 'form';
                        break;
                    case 'Navbar':
                        el = iframeDoc.createElement('nav');
                        el.className = comp.props.className || 'navbar';
                        break;
                    case 'Card':
                        el = iframeDoc.createElement('section');
                        el.className = comp.props.className || 'card';
                        break;
                    case 'Container':
                    default:
                        el = iframeDoc.createElement('div');
                        el.className = comp.props.className || 'container';
                        break;
                }

                // Apply dataset
                el.setAttribute('data-id', comp.id);
                if (comp.children !== null) {
                    el.setAttribute('data-container', 'true');
                }

                // Add Resizer handle
                const resizer = iframeDoc.createElement('div');
                resizer.className = 'resizer';
                el.appendChild(resizer);
                
                // Set inline styles from component.styles
                Object.assign(el.style, comp.styles);

                // Render children
                if (comp.children && comp.children.length > 0) {
                    comp.children.forEach(child => {
                        el.appendChild(renderNode(child));
                    });
                }

                return el;
            };

            window.BuilderState.components.forEach(comp => {
                body.appendChild(renderNode(comp));
            });
        }

        function highlightSelected() {
            // Remove previous highlights
            iframeDoc.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
            
            if (window.BuilderState.selectedId) {
                const selectedEl = iframeDoc.querySelector(`[data-id="${window.BuilderState.selectedId}"]`);
                if (selectedEl) {
                    selectedEl.classList.add('selected');
                }
            }
        }
        
    }, 500); // Wait 500ms for iframe content to be initialized by main.js
});
