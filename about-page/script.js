const TRAIL_STORAGE_KEY = 'isTrailEnabled';
const COLOR_STORAGE_KEY = 'primaryThemeColor';
const DEFAULT_COLOR = '#38bdf8';
const TRAIL_SIZE = 50;

let squares = [];
let container;

// --- 1. THEME & VISUALS ---
const applyThemeColor = (color) => {
    document.documentElement.style.setProperty('--primary-color', color);
    localStorage.setItem(COLOR_STORAGE_KEY, color);
    const display = document.getElementById('current-color-display');
    if (display) display.textContent = color;
};

const updateTrailState = (isEnabled) => {
    if (!container) return;
    const btn = document.getElementById('toggle-trail');
    
    if (isEnabled) {
        container.classList.remove('disabled');
        if (btn) btn.textContent = 'Disable Trail';
        localStorage.setItem(TRAIL_STORAGE_KEY, 'true');
    } else {
        container.classList.add('disabled');
        if (btn) btn.textContent = 'Enable Trail';
        localStorage.setItem(TRAIL_STORAGE_KEY, 'false');
    }
};

// --- 2. TAB CLOAKER ---
window.changeTabTitle = () => {
    const val = document.getElementById('userinput').value;
    if (val) {
        document.title = val;
        localStorage.setItem('tabTitle', val);
    }
};

window.changeTabIcon = () => {
    const val = document.getElementById('userinput').value;
    if (val) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = val;
        localStorage.setItem('tabIcon', val);
    }
};

window.resetTabSettings = () => {
    document.title = "Extras | palmtree";
    let link = document.querySelector("link[rel~='icon']");
    if (link) link.href = 'images/favicon.ico';
    localStorage.removeItem('tabTitle');
    localStorage.removeItem('tabIcon');
};

// --- 3. CIPHER ENGINE ---
const caesarCipher = (text, shift, action) => {
    if (action === 'decode') shift = (26 - shift) % 26;
    return text.replace(/[a-z]/gi, (char) => {
        const base = char <= 'Z' ? 65 : 97;
        return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
    });
};

// --- 4. PROJECTS SYSTEM ---
const projects = [
    {
        title: "Palmtree OS",
        description: "A customized security-focused Linux environment built for ethical hacking and privacy research.",
        tech: ["Python", "Bash", "Security"],
        icon: "shield",
        link: "#"
    },
    {
        title: "Cipher-X Engine",
        description: "An advanced encryption toolset designed to demonstrate modern cryptographic principles and shifts.",
        tech: ["JavaScript", "Crypto"],
        icon: "lock",
        link: "#"
    },
    {
        title: "Data Converter",
        description: "High-speed Base64 and HEX encoding/decoding utility optimized for rapid data transformation.",
        tech: ["HTML", "JS", "UI/UX"],
        icon: "refresh-cw",
        link: "https://converter.palmtree.technology"
    }
];

const renderProjects = () => {
    const projectGrid = document.getElementById('project-grid');
    if (!projectGrid) return;

    projectGrid.innerHTML = projects.map(proj => `
        <div class="glass-card p-6 rounded-[2rem] flex flex-col justify-between h-64 group interactable">
            <div class="flex justify-between items-start">
                <div class="bg-sky-500/10 p-3 rounded-xl border border-sky-500/20">
                    <i data-lucide="${proj.icon}" class="w-6 h-6 text-sky-400"></i>
                </div>
                <a href="${proj.link}" target="_blank" class="bg-white/5 p-2 rounded-lg hover:bg-sky-500/20 transition-colors">
                    <i data-lucide="external-link" class="w-4 h-4 text-slate-500"></i>
                </a>
            </div>
            <div>
                <div class="text-white font-bold text-lg mb-1">${proj.title}</div>
                <p class="text-xs text-slate-500 line-clamp-2 mb-4">${proj.description}</p>
                <div class="flex gap-2">
                    ${proj.tech.map(t => `<span class="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] code-font text-slate-400">${t}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
    
    // Re-initialize icons for the new HTML
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
};

// --- 5. GRID TRAIL LOGIC ---
const createGrid = () => {
    if (!container) return;
    container.innerHTML = '';
    const cols = Math.ceil(window.innerWidth / TRAIL_SIZE);
    const rows = Math.ceil(window.innerHeight / TRAIL_SIZE);
    squares = [];

    for (let i = 0; i < cols * rows; i++) {
        const square = document.createElement('div');
        square.className = 'grid-square';
        container.appendChild(square);
        squares.push(square);
    }
};

const handleMouseMove = (e) => {
    if (container.classList.contains('disabled')) return;
    const col = Math.floor(e.clientX / TRAIL_SIZE);
    const row = Math.floor(e.clientY / TRAIL_SIZE);
    const cols = Math.ceil(window.innerWidth / TRAIL_SIZE);
    const index = row * cols + col;

    if (squares[index]) {
        squares[index].classList.add('active');
        setTimeout(() => squares[index].classList.remove('active'), 1000);
    }
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    container = document.getElementById('cursor-grid-container');
    
    // Render dynamic content
    renderProjects();

    // Setup Accordion
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = header.nextElementSibling;
            const isOpen = item.classList.contains('active');
            
            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.accordion-content').style.maxHeight = '0';
            });

            if (!isOpen) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // Setup Cipher
    const encodeBtn = document.getElementById('encode-btn');
    if (encodeBtn) {
        encodeBtn.addEventListener('click', () => {
            const input = document.getElementById('cipher-input').value;
            const shift = parseInt(document.getElementById('cipher-shift').value) || 3;
            document.getElementById('cipher-output').textContent = caesarCipher(input, shift, 'encode');
        });
        document.getElementById('decode-btn').addEventListener('click', () => {
            const input = document.getElementById('cipher-input').value;
            const shift = parseInt(document.getElementById('cipher-shift').value) || 3;
            document.getElementById('cipher-output').textContent = caesarCipher(input, shift, 'decode');
        });
    }

    // Setup Trail & Theme
    const storedColor = localStorage.getItem(COLOR_STORAGE_KEY) || DEFAULT_COLOR;
    applyThemeColor(storedColor);
    const colorPicker = document.getElementById('theme-color-picker');
    if (colorPicker) {
        colorPicker.value = storedColor;
        colorPicker.addEventListener('input', (e) => applyThemeColor(e.target.value));
    }

    if (container) {
        createGrid();
        window.addEventListener('resize', createGrid);
        document.addEventListener('mousemove', handleMouseMove);
        const trailEnabled = localStorage.getItem(TRAIL_STORAGE_KEY) !== 'false';
        updateTrailState(trailEnabled);
        
        const toggleBtn = document.getElementById('toggle-trail');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const currentState = localStorage.getItem(TRAIL_STORAGE_KEY) !== 'false';
                updateTrailState(!currentState);
            });
        }
    }

    // Setup About:Blank
    const createBtn = document.getElementById('create');
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            const url = document.getElementById('url-target').value;
            if (url) {
                const win = window.open('about:blank', '_blank');
                win.document.write(`<iframe src="${url}" style="position:fixed;top:0;left:0;width:100%;height:100%;border:none;"></iframe>`);
            }
        });
    }
});
