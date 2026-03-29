/**
 * Properties Panel Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    const propContent = document.getElementById('properties-content');

    window.BuilderState.subscribe(() => {
        const id = window.BuilderState.selectedId;
        if (!id) {
            propContent.innerHTML = `
                <div class="empty-state">
                    <i class='bx bx-pointer'></i>
                    <p>Select an element on the canvas to customize its properties.</p>
                </div>
            `;
            return;
        }

        const component = window.BuilderState.findComponent(id);
        if (!component) return;

        let html = `<div class="prop-group" style="border-bottom: 1px solid var(--border-color); padding-bottom: 15px; margin-bottom: 5px;">
                        <h4 style="color: var(--accent); margin:0; display:flex; align-items:center; gap: 8px;">
                            <i class='bx ${window.ComponentRegistry[component.type].icon}'></i>
                            ${component.type} Properties
                        </h4>
                        <button id="btn-delete-element" class="btn btn-secondary" style="margin-top: 10px; width: 100%; border-color: var(--danger); color: var(--danger);">
                            <i class='bx bx-trash'></i> Delete Element
                        </button>
                    </div>`;

        // Render Prop Inputs
        html += `<h4 style="margin: 10px 0; color: var(--text-secondary); font-size: 12px; text-transform: uppercase;">Content & Attributes</h4>`;
        for (let key in component.props) {
            html += `
                <div class="prop-group">
                    <label>${key}</label>
                    <input type="text" class="prop-control" data-prop="${key}" value="${component.props[key]}">
                </div>
            `;
        }

        // Render common Style Inputs
        html += `<h4 style="margin: 20px 0 10px 0; color: var(--text-secondary); font-size: 12px; text-transform: uppercase;">Styles & Layout</h4>`;
        
        // Design Preset Switcher
        const designOptions = Object.keys(window.ComponentRegistry).filter(k => window.ComponentRegistry[k].type === component.type);
        if (designOptions.length > 1) {
            html += `
                <div class="prop-group">
                    <label>Design Preset</label>
                    <select class="prop-control design-preset-select">
                        ${designOptions.map(opt => `<option value="${opt}" ${window.ComponentRegistry[opt].label === component.label ? 'selected' : ''}>${window.ComponentRegistry[opt].label}</option>`).join('')}
                    </select>
                    <p style="font-size: 10px; color: var(--accent); margin-top: 4px;">Changes will apply instantly.</p>
                </div>
            `;
        }

        const styleKeys = [
            { key: 'zIndex', label: 'Layer (z-index)', type: 'text' },
            { key: 'left', label: 'Position Left', type: 'text' },
            { key: 'top', label: 'Position Top', type: 'text' },
            { key: 'width', label: 'Width', type: 'text' },
            { key: 'height', label: 'Height', type: 'text' },
            { key: 'color', label: 'Text Color', type: 'color' },
            { key: 'backgroundColor', label: 'Background Color', type: 'color' },
            { key: 'backgroundImage', label: 'BG Image URL', type: 'text' },
            { key: 'fontSize', label: 'Font Size', type: 'text' },
            { key: 'padding', label: 'Padding', type: 'text' },
            { key: 'borderRadius', label: 'Border Radius', type: 'text' },
            { key: 'border', label: 'Border', type: 'text' },
            { key: 'boxShadow', label: 'Box Shadow', type: 'text' },
            { key: 'display', label: 'Display', type: 'select', options: ['block', 'inline-block', 'flex', 'grid', 'none'] },
            { key: 'animation', label: 'Animation Effect', type: 'select', options: ['none', 'fadeIn 1s ease', 'slideUp 1s ease', 'pulse 2s infinite'] },
            { key: 'fontFamily', label: 'Font Family', type: 'select', options: ['Inter, sans-serif', 'Space Grotesk, sans-serif', 'Manrope, sans-serif', 'serif', 'monospace'] },
            { key: 'filter', label: 'Image Filter (e.g. blur(5px))', type: 'text' }
        ];

        styleKeys.forEach(sk => {
            // Only show if the component has this style by default OR if user wants to add it.
            // For simplicity, we show most common styles. To handle empty values, we check if it exists.
            const val = component.styles[sk.key] || '';
            
            if (sk.type === 'select') {
                html += `
                    <div class="prop-group">
                        <label>${sk.label}</label>
                        <select class="prop-control" data-style="${sk.key}">
                            ${sk.options.map(opt => `<option value="${opt}" ${val === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                        </select>
                    </div>
                `;
            } else if (sk.type === 'color') {
                // Color picking with hex
                const colorVal = val.startsWith('#') ? val : '#ffffff'; // Fallback for color picker
                html += `
                    <div class="prop-group" style="flex-direction: row; align-items: center; justify-content: space-between;">
                        <label>${sk.label}</label>
                        <div style="display: flex; gap: 8px; width: 60%;">
                            <input type="color" data-style="${sk.key}" value="${colorVal}" style="width: 30px; height: 30px; padding: 0; border: none; background: transparent; cursor: pointer;">
                            <input type="text" class="prop-control" data-style="${sk.key}" value="${val}" placeholder="e.g. #fff or rgba(..)" style="flex: 1;">
                        </div>
                    </div>
                `;
            } else {
                html += `
                    <div class="prop-group">
                        <label>${sk.label}</label>
                        <input type="text" class="prop-control" data-style="${sk.key}" value="${val}" placeholder="e.g. auto, 100%, 20px">
                    </div>
                `;
            }
        });

        propContent.innerHTML = html;

        // Attach listeners
        propContent.querySelectorAll('.design-preset-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const presetKey = e.target.value;
                const preset = window.ComponentRegistry[presetKey];
                if (preset) {
                    window.BuilderState.updateComponent(id, preset.styles, preset.props);
                }
            });
        });

        propContent.querySelectorAll('input[data-prop]').forEach(inp => {
            inp.addEventListener('change', (e) => {
                const key = e.target.getAttribute('data-prop');
                window.BuilderState.updateComponent(id, null, { [key]: e.target.value });
            });
        });

        propContent.querySelectorAll('input[data-style], select[data-style]').forEach(inp => {
            inp.addEventListener('change', (e) => {
                // If a color picker fires, update the corresponding text input
                if (e.target.type === 'color') {
                    const nextInput = e.target.nextElementSibling;
                    if (nextInput) nextInput.value = e.target.value;
                } else if (e.target.type === 'text' && e.target.previousElementSibling && e.target.previousElementSibling.type === 'color') {
                    if (e.target.value.startsWith('#')) {
                        e.target.previousElementSibling.value = e.target.value;
                    }
                }

                const key = e.target.getAttribute('data-style');
                let val = e.target.value;
                if (!val) {
                    // Remove style if emptied? For now, just set to empty string
                }
                window.BuilderState.updateComponent(id, { [key]: val }, null);
            });
        });

        document.getElementById('btn-delete-element').addEventListener('click', () => {
            window.BuilderState.removeComponent(id);
        });
    });
});
