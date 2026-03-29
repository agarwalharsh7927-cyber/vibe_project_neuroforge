/**
 * Theme Engine
 * Generates and applies comprehensive themes to the builder canvas components.
 */

document.addEventListener('DOMContentLoaded', () => {
    const themeButtons = document.querySelectorAll('.theme-btn');

    const themePresets = {
        modern: { 
            background: '#ffffff', textColor: '#111827', theme: 'light', 
            fontFamily: 'Inter, sans-serif', accent: '#3b82f6', borderRadius: '12px' 
        },
        gaming: { 
            background: '#09090b', textColor: '#f8fafc', theme: 'dark', 
            fontFamily: 'Space Grotesk, sans-serif', accent: '#ff003c', borderRadius: '0px' 
        },
        business: { 
            background: '#f8fafc', textColor: '#0f172a', theme: 'light', 
            fontFamily: 'Arial, sans-serif', accent: '#0f172a', borderRadius: '4px' 
        },
        minimal: { 
            background: '#ffffff', textColor: '#000000', theme: 'light', 
            fontFamily: 'Helvetica Neue, sans-serif', accent: '#000000', borderRadius: '0px' 
        },
        futuristic: { 
            background: '#020617', textColor: '#e2e8f0', theme: 'dark', 
            fontFamily: 'Space Grotesk, sans-serif', accent: '#00f0ff', borderRadius: '6px' 
        },
        colorful: { 
            background: '#fffbeb', textColor: '#4c1d95', theme: 'light', 
            fontFamily: 'Comic Sans MS, cursive', accent: '#d946ef', borderRadius: '24px' 
        }
    };

    window.BuilderThemeEngine = {
        applyTheme: (themeName) => {
            const preset = themePresets[themeName];
            if (!preset) return;
            
            // 1. Update page settings
            window.BuilderState.updatePageSettings({
                background: preset.background,
                textColor: preset.textColor,
                theme: preset.theme
            });

            // 2. Update components recursively
            const components = window.BuilderState.components;
            
            function applyStyle(comp) {
                if (!comp.styles) comp.styles = {};

                // Headings & Text
                if (comp.type === 'Heading' || comp.type === 'Paragraph') {
                    comp.styles.fontFamily = preset.fontFamily;
                    comp.styles.color = preset.textColor;
                }
                
                // Buttons
                if (comp.type === 'Button') {
                    comp.styles.backgroundColor = preset.accent;
                    comp.styles.borderRadius = preset.borderRadius;
                    comp.styles.fontFamily = preset.fontFamily;
                    
                    if (preset.theme === 'light') {
                        comp.styles.color = themeName === 'minimal' ? '#ffffff' : '#ffffff';
                    } else {
                        comp.styles.color = themeName === 'futuristic' ? '#000000' : '#ffffff';
                    }

                    if (themeName === 'gaming') {
                        comp.styles.boxShadow = `0 0 15px ${preset.accent}`;
                        comp.styles.textTransform = 'uppercase';
                        comp.styles.fontWeight = '800';
                    } else if (themeName === 'futuristic') {
                        comp.styles.boxShadow = `0 0 20px ${preset.accent}`;
                        comp.styles.border = `1px solid ${preset.accent}`;
                        comp.styles.textTransform = 'uppercase';
                        comp.styles.letterSpacing = '2px';
                    } else {
                        comp.styles.boxShadow = 'none';
                        comp.styles.textTransform = 'none';
                        comp.styles.letterSpacing = 'normal';
                        comp.styles.border = 'none';
                    }
                }

                // Cards and Containers
                if (comp.type === 'Card' || comp.type === 'Form') {
                    comp.styles.backgroundColor = preset.theme === 'dark' ? 'rgba(255,255,255,0.03)' : '#ffffff';
                    comp.styles.borderRadius = preset.borderRadius;
                    
                    if (themeName === 'futuristic') {
                        comp.styles.border = `1px solid ${preset.accent}`;
                        comp.styles.boxShadow = `inset 0 0 20px rgba(0,240,255,0.05), 0 0 15px rgba(0,240,255,0.1)`;
                        comp.styles.backdropFilter = 'blur(10px)';
                    } else if (themeName === 'gaming') {
                        comp.styles.border = `2px solid ${preset.accent}`;
                        comp.styles.boxShadow = 'none';
                    } else if (themeName === 'minimal') {
                        comp.styles.border = '1px solid #e5e7eb';
                        comp.styles.boxShadow = 'none';
                    } else {
                        comp.styles.border = preset.theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)';
                        comp.styles.boxShadow = preset.theme === 'dark' ? '0 20px 40px rgba(0,0,0,0.4)' : '0 20px 40px rgba(0,0,0,0.06)';
                    }
                }

                // Inputs
                if (comp.type === 'SearchBar') {
                    comp.styles.borderRadius = Math.max(0, parseInt(preset.borderRadius) - 4) + 'px';
                    comp.styles.fontFamily = preset.fontFamily;
                    if (themeName === 'futuristic') {
                        comp.styles.backgroundColor = 'rgba(0,240,255,0.05)';
                        comp.styles.border = `1px solid ${preset.accent}`;
                        comp.styles.color = preset.accent;
                    } else if (themeName === 'gaming') {
                        comp.styles.backgroundColor = '#000';
                        comp.styles.border = '1px solid #333';
                        comp.styles.color = '#fff';
                    } else {
                        comp.styles.backgroundColor = preset.theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#f3f4f6';
                        comp.styles.border = '1px solid transparent';
                        comp.styles.color = preset.textColor;
                    }
                }

                if (comp.children && comp.children.length > 0) {
                    comp.children.forEach(applyStyle);
                }
            }
            
            components.forEach(applyStyle);
            window.BuilderState.notify();
        }
    };

    themeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            themeButtons.forEach(b => b.classList.remove('active'));
            const target = e.currentTarget;
            target.classList.add('active');
            window.BuilderThemeEngine.applyTheme(target.dataset.theme);
        });
    });
});
