/**
 * Global Logic for palmtree's sub-pages
 * Handles: Grid Trail, Theme Persistence, and Tab Cloaking
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. GRID TRAIL LOGIC
    const container = document.getElementById('cursor-grid-container');
    const TRAIL_SIZE = 50; // Size of each square in pixels
    let squares = [];

    function createGrid() {
        if (!container) return;
        container.innerHTML = '';
        squares = [];
        
        // Calculate how many squares we need based on window size
        const columns = Math.ceil(window.innerWidth / TRAIL_SIZE);
        const rows = Math.ceil(window.innerHeight / TRAIL_SIZE);
        
        container.style.display = 'grid';
        container.style.gridTemplateColumns = `repeat(${columns}, ${TRAIL_SIZE}px)`;
        container.style.gridTemplateRows = `repeat(${rows}, ${TRAIL_SIZE}px)`;

        for (let i = 0; i < columns * rows; i++) {
            const square = document.createElement('div');
            // Apply base square styles via JS to avoid style.css conflicts
            square.style.backgroundColor = 'var(--primary-color, #3625cc)';
            square.style.opacity = '0';
            square.style.transition = 'opacity 1s, transform 0.5s';
            square.style.transform = 'scale(0)';
            
            container.appendChild(square);
            squares.push(square);
        }
    }

    document.addEventListener('mousemove', (e) => {
        if (!container || squares.length === 0) return;

        const col = Math.floor(e.clientX / TRAIL_SIZE);
        const row = Math.floor(e.clientY / TRAIL_SIZE);
        const cols = Math.ceil(window.innerWidth / TRAIL_SIZE);
        const index = row * cols + col;

        if (squares[index]) {
            squares[index].style.opacity = '0.5';
            squares[index].style.transform = 'scale(1)';
            squares[index].style.transition = '0s'; // Instant appearance

            // Fade out after delay
            setTimeout(() => {
                squares[index].style.opacity = '0';
                squares[index].style.transform = 'scale(0)';
                squares[index].style.transition = 'opacity 1s, transform 0.5s';
            }, 1000);
        }
    });

    // 2. THEME PERSISTENCE
    const themePicker = document.getElementById('theme-picker');
    const savedColor = localStorage.getItem('primaryThemeColor');

    // Apply saved color on load
    if (savedColor) {
        document.documentElement.style.setProperty('--primary-color', savedColor);
        if (themePicker) themePicker.value = savedColor;
    }

    // Listen for changes
    if (themePicker) {
        themePicker.addEventListener('input', (e) => {
            const color = e.target.value;
            document.documentElement.style.setProperty('--primary-color', color);
            localStorage.setItem('primaryThemeColor', color);
        });
    }

    // 3. TRAIL TOGGLE
    const toggleBtn = document.getElementById('toggle-trail');
    if (toggleBtn && container) {
        toggleBtn.addEventListener('click', () => {
            const isHidden = container.style.visibility === 'hidden';
            container.style.visibility = isHidden ? 'visible' : 'hidden';
            toggleBtn.innerText = isHidden ? 'Disable Trail' : 'Enable Trail';
        });
    }

    // Initialize grid
    window.addEventListener('resize', createGrid);
    createGrid();
});

// 4. TAB CLOAKER FUNCTIONS (Global Scope for HTML onclick)
window.changeTabTitle = function() {
    const input = document.getElementById('userinput');
    if (input && input.value.trim() !== "") {
        document.title = input.value;
        localStorage.setItem('savedTabTitle', input.value);
    }
};

window.resetTabSettings = function() {
    const originalTitle = "Extras | palmtree"; 
    document.title = originalTitle;
    localStorage.removeItem('savedTabTitle');
    const input = document.getElementById('userinput');
    if (input) input.value = "";
};

// Check for saved title on load
if (localStorage.getItem('savedTabTitle')) {
    document.title = localStorage.getItem('savedTabTitle');
}
