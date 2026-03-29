/**
 * Main application bootstrapping
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. UI Elements
    const componentsList = document.getElementById('component-library');
    const templatesList = document.getElementById('template-library');
    const iframe = document.getElementById('canvas-iframe');
    const sizeBtns = document.querySelectorAll('.canvas-size-selector .icon-btn[data-size]');
    const deviceLabel = document.getElementById('device-label');
    const widthInput = document.getElementById('canvas-width-input');
    const heightInput = document.getElementById('canvas-height-input');
    const btnMaximize = document.getElementById('btn-maximize-workspace');
    const btnThemeToggle = document.getElementById('btn-theme-toggle');
    const workspace = document.querySelector('.workspace');
    const btnClear = document.getElementById('btn-clear');
    const btnUndo = document.getElementById('btn-undo');
    const btnRedo = document.getElementById('btn-redo');
    const btnPublish = document.getElementById('btn-publish');
    const closeExport = document.getElementById('close-export');

    // 2. Data Definitions
    const categories = {
        'Basics': ['Container', 'Heading', 'Paragraph', 'Image', 'Video'],
        'Modern UI': ['HeadingGlass', 'Card', 'CardSolid', 'Button', 'ButtonOutline', 'SearchBar', 'SearchBarGlass', 'Navbar'],
        'Presets & Sections': ['HeroSection', 'FeatureBlock', 'PricingTable', 'Testimonial', 'StatCard', 'SocialBar', 'FAQItem', 'Footer']
    };

    const templates = [
        { id: 'hero', icon: 'bx-star', label: 'Hero Page' },
        { id: 'features', icon: 'bx-grid-alt', label: 'Features Page' },
        { id: 'pricing', icon: 'bx-dollar-circle', label: 'Pricing Page' },
        { id: 'portfolio', icon: 'bx-briefcase', label: 'Portfolio Page' },
        { id: 'contact', icon: 'bx-envelope', label: 'Contact Page' }
    ];

    // 3. Library Rendering
    const renderLibrary = () => {
        if (!componentsList || !window.ComponentRegistry) return;
        componentsList.innerHTML = '';

        Object.entries(categories).forEach(([catName, compKeys]) => {
            const catHeader = document.createElement('h4');
            catHeader.className = 'eyebrow';
            catHeader.style.gridColumn = '1 / span 2';
            catHeader.style.marginTop = '15px';
            catHeader.textContent = catName;
            componentsList.appendChild(catHeader);

            compKeys.forEach(key => {
                const component = window.ComponentRegistry[key];
                if (!component) return;
                const div = document.createElement('div');
                div.className = 'component-item';
                div.draggable = true;
                div.dataset.type = key;
                div.innerHTML = `
                    <i class='bx ${component.icon}'></i>
                    <span>${component.label}</span>
                `;
                componentsList.appendChild(div);
            });
        });
    };

    const renderTemplates = () => {
        if (!templatesList) return;
        templatesList.innerHTML = '';
        templates.forEach(tpl => {
            const div = document.createElement('div');
            div.className = 'component-item template-item';
            div.innerHTML = `
                <i class='bx ${tpl.icon}'></i>
                <span>${tpl.label}</span>
            `;
            div.addEventListener('click', () => {
                if (confirm('Replace current canvas with this template?')) {
                    loadTemplate(tpl.id);
                }
            });
            templatesList.appendChild(div);
        });
    };

    // 4. Canvas Logic
    const prefillIframe = () => {
        if (!iframe) return;
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
                    body {
                        margin: 0;
                        padding: 20px;
                        font-family: 'Manrope', sans-serif;
                        min-height: 100vh;
                        background-color: #0f172a;
                        color: #ffffff;
                        box-sizing: border-box;
                        transition: background-color 0.3s ease, color 0.3s ease;
                    }
                    * { box-sizing: border-box; }
                    ::-webkit-scrollbar { width: 10px; height: 10px; }
                    ::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.05); }
                    ::-webkit-scrollbar-thumb { background: rgba(56, 189, 248, 0.3); border-radius: 10px; }
                    ::-webkit-scrollbar-thumb:hover { background: rgba(56, 189, 248, 0.5); }
                    [data-id]:hover { outline: 1px dashed rgba(56, 189, 248, 0.7); cursor: pointer; }
                    .selected { outline: 2px solid #38bdf8 !important; outline-offset: -2px; position: relative; }
                    body:empty::before {
                        content: "Drag and drop components here";
                        display: flex; align-items: center; justify-content: center;
                        height: calc(100vh - 40px); color: #64748b; font-size: 18px;
                        border: 2px dashed #cbd5e1; border-radius: 14px;
                    }
                </style>
            </head>
            <body></body>
            </html>
        `);
        iframeDoc.close();

        setTimeout(() => {
            if (!window.BuilderState.loadFromStorage()) {
                window.BuilderState.notify();
            }
        }, 100);
    };

    const updateIframeHeight = () => {
        if (iframe && iframe.contentDocument && iframe.contentDocument.body) {
            const height = iframe.contentDocument.body.scrollHeight;
            if (height > 800) {
                iframe.style.height = `${height + 100}px`;
                if (heightInput) heightInput.value = height + 100;
            }
        }
    };

    function setCanvasSize(width, height, label) {
        if (!iframe) return;
        if (width) {
            iframe.style.width = width === '100%' ? '1200px' : width;
            if (widthInput) widthInput.value = parseInt(iframe.style.width);
        }
        if (height) {
            iframe.style.height = height;
            if (heightInput) heightInput.value = parseInt(height);
        }
        if (label && deviceLabel) deviceLabel.textContent = label;
    }

    // 5. Template Actions
    function createTemplatePayload(id) {
        const C = window.ComponentRegistry;
        if (!C) return { components: [], pageSettings: {} };
        
        let comps = [];
        let pageSettings = { 
            background: '#0f172a', 
            textColor: '#ffffff', 
            theme: 'dark',
            siteName: 'My Awesome Site'
        };

        if (id === 'hero') {
            comps = [{
                ...C.HeroSection,
                styles: { ...C.HeroSection.styles, left: '100px', top: '100px' }
            }];
        } else if (id === 'features') {
            comps = [
                { ...C.FeatureBlock, styles: { ...C.FeatureBlock.styles, left: '50px', top: '100px' } },
                { ...C.FeatureBlock, props: { ...C.FeatureBlock.props, text: '🚀' }, styles: { ...C.FeatureBlock.styles, left: '420px', top: '100px' } },
                { ...C.FeatureBlock, props: { ...C.FeatureBlock.props, text: '🛡️' }, styles: { ...C.FeatureBlock.styles, left: '790px', top: '100px' } }
            ];
        } else if (id === 'pricing') {
            comps = [{
                ...C.PricingTable,
                styles: { ...C.PricingTable.styles, left: '50px', top: '150px' }
            }];
        } else if (id === 'portfolio') {
            comps = [
                { ...C.Navbar, styles: { ...C.Navbar.styles, left: '0', top: '0', position: 'fixed', zIndex: '1000' } },
                { ...C.HeadingGlass, props: { text: 'My Works' }, styles: { ...C.HeadingGlass.styles, left: '400px', top: '150px' } },
                { ...C.Card, styles: { ...C.Card.styles, left: '100px', top: '300px' } },
                { ...C.Card, styles: { ...C.Card.styles, left: '450px', top: '300px' } },
                { ...C.Card, styles: { ...C.Card.styles, left: '800px', top: '300px' } },
                { ...C.Footer, styles: { ...C.Footer.styles, left: '0', top: '1000px' } }
            ];
        } else if (id === 'contact') {
            comps = [
                { ...C.Navbar, styles: { ...C.Navbar.styles, left: '0', top: '0', position: 'fixed', zIndex: '1000' } },
                { ...C.HeadingGlass, props: { text: 'Get in Touch' }, styles: { ...C.HeadingGlass.styles, left: '400px', top: '100px' } },
                { ...C.Card, children: [
                    { ...C.SearchBarGlass, props: { placeholder: 'Name' }, styles: { ...C.SearchBarGlass.styles, width: '100%', marginBottom: '20px' } },
                    { ...C.SearchBarGlass, props: { placeholder: 'Email' }, styles: { ...C.SearchBarGlass.styles, width: '100%', marginBottom: '20px' } },
                    { ...C.Button, props: { text: 'Send' }, styles: { ...C.Button.styles, width: '100%' } }
                ], styles: { ...C.Card.styles, left: '350px', top: '250px', width: '500px' } },
                { ...C.Footer, styles: { ...C.Footer.styles, left: '0', top: '800px' } }
            ];
        }
        return { components: comps, pageSettings };
    }

    function loadTemplate(id) {
        const payload = createTemplatePayload(id);
        window.BuilderState.clear();
        window.BuilderState.updatePageSettings(payload.pageSettings);
        payload.components.forEach(component => window.BuilderState.addComponent(component));
    }

    window.BuilderActions = { loadTemplate, createTemplatePayload };

    // 6. Event Listeners
    btnThemeToggle?.addEventListener('click', () => {
        const currentTheme = window.BuilderState.pageSettings.theme || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        const settings = {
            theme: newTheme,
            background: newTheme === 'dark' ? '#0f172a' : '#ffffff',
            textColor: newTheme === 'dark' ? '#ffffff' : '#333333'
        };
        window.BuilderState.updatePageSettings(settings);
        btnThemeToggle.innerHTML = newTheme === 'dark' ? `<i class='bx bx-sun'></i> Theme` : `<i class='bx bx-moon'></i> Theme`;
    });

    btnClear?.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the entire canvas?')) window.BuilderState.clear();
    });

    btnUndo?.addEventListener('click', () => window.BuilderState.undo());
    btnRedo?.addEventListener('click', () => window.BuilderState.redo());

    widthInput?.addEventListener('input', () => {
        if (iframe) iframe.style.width = `${widthInput.value}px`;
        sizeBtns.forEach(b => b.classList.remove('active'));
    });

    heightInput?.addEventListener('input', () => {
        if (iframe) iframe.style.height = `${heightInput.value}px`;
        sizeBtns.forEach(b => b.classList.remove('active'));
    });

    btnMaximize?.addEventListener('click', () => {
        if (!workspace) return;
        workspace.classList.toggle('maximized-canvas');
        btnMaximize.classList.toggle('active');
        const icon = btnMaximize.querySelector('i');
        if (icon) icon.className = workspace.classList.contains('maximized-canvas') ? 'bx bx-exit-fullscreen' : 'bx bx-fullscreen';
    });

    sizeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            sizeBtns.forEach(b => b.classList.remove('active'));
            const target = e.currentTarget;
            target.classList.add('active');
            const size = target.dataset.size;
            if (size === 'desktop') setCanvasSize('1200px', '800px', 'Desktop');
            if (size === 'tablet') setCanvasSize('768px', '1024px', 'Tablet');
            if (size === 'mobile') setCanvasSize('375px', '667px', 'Mobile');
        });
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.dataset.tab) {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn[data-tab]').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                window.updateExportModal?.(e.currentTarget.dataset.tab);
            });
        }
    });

    closeExport?.addEventListener('click', () => {
        document.getElementById('export-modal')?.classList.remove('active');
    });

    btnPublish?.addEventListener('click', () => {
        const originalText = btnPublish.innerHTML;
        btnPublish.innerHTML = `<i class='bx bx-loader bx-spin'></i> Publishing...`;
        btnPublish.disabled = true;

        setTimeout(() => {
            const slug = (window.BuilderState.pageSettings.siteName || 'neuroforg-project')
                .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'neuroforg-project';
            btnPublish.innerHTML = `<i class='bx bx-check-circle'></i> Published!`;
            btnPublish.style.backgroundColor = '#22c55e';
            setTimeout(() => {
                alert(`Your website has been published! (Demo Link: https://${slug}.myweb.io)`);
                btnPublish.innerHTML = originalText;
                btnPublish.disabled = false;
                btnPublish.style.backgroundColor = '';
            }, 500);
        }, 1400);
    });

    // 7. Initialization
    renderLibrary();
    renderTemplates();
    prefillIframe();
    if (widthInput) widthInput.value = 1200;
    if (heightInput) heightInput.value = 800;

    window.BuilderState.subscribe((state) => {
        const counter = document.getElementById('comp-count-val');
        if (counter) {
            const countAll = (list) => list.reduce((acc, comp) => acc + 1 + (comp.children ? countAll(comp.children) : 0), 0);
            counter.textContent = countAll(state.components);
        }
        setTimeout(updateIframeHeight, 100);
    });

    window.addEventListener('message', (e) => {
        if (e.data === 'updateHeight') updateIframeHeight();
    });
});
