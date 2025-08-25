// DOM Elements
const body = document.body;
const header = document.querySelector('header');

// Theme Constants
const THEME_STATES = {
    DARK: {
        text: '🌙',
        background: '#bb86fc',
        color: '#181818'
    },
    LIGHT: {
        text: '☀️',
        background: '#ffd600',
        color: '#222'
    }
};

// Create theme toggle button
const createToggleButton = () => {
    const btn = document.createElement('button');
    btn.id = 'toggleBtn';
    Object.assign(btn.style, {
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: '9999',
        border: 'none',
        borderRadius: '25px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background 0.3s, color 0.3s'
    });
    body.appendChild(btn);
    return btn;
};

// Initialize toggle button
const toggleBtn = createToggleButton();

// Add Vanta effect variable
let vantaEffect = null;

// Update initVanta function
const initVanta = () => {
    if (vantaEffect) {
        vantaEffect.destroy();
    }
    const isDark = document.body.classList.contains('dark-theme');
    vantaEffect = VANTA.NET({
        el: "#vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: isDark ? 0x572298 : 0x7c3aed,
        backgroundColor: isDark ? 0x000000 : 0xffffff,
        points: 10.00,
        maxDistance: 20.00,
        spacing: 16.00,
        showDots: true,
        opacity: isDark ? 1 : 0.2 // Reduced opacity for light mode
    });
};

// Theme handling
const setTheme = isDark => {
    const theme = isDark ? THEME_STATES.DARK : THEME_STATES.LIGHT;
    body.classList[isDark ? 'add' : 'remove']('dark-theme');
    Object.assign(toggleBtn.style, {
        background: theme.background,
        color: theme.color
    });
    toggleBtn.textContent = theme.text;
    localStorage.setItem('darkMode', isDark);
    
    // Reinitialize Vanta effect
    initVanta();
};

// Initialize theme
const initializeTheme = () => {
    const savedTheme = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(savedTheme !== null ? savedTheme === 'true' : prefersDark);
};

// Smooth scroll handling
const handleSmoothScroll = () => {
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', e => {
            const selector = link.getAttribute('href');
            const targetId = selector.includes('#') ? 
                selector.substring(selector.indexOf('#')) : selector;
            
            if (window.location.pathname.endsWith('index.html') || 
                window.location.pathname === '/') {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
};

// About section reveal animation
const initializeRevealAnimation = () => {
    const aboutSection = document.querySelector('#about');
    if (!aboutSection) return;

    const triggerPoint = window.innerHeight / 1.3;
    
    const checkScroll = () => {
        const aboutTop = aboutSection.getBoundingClientRect().top;
        if (aboutTop < triggerPoint) {
            aboutSection.classList.add('reveal');
            window.removeEventListener('scroll', checkScroll);
        }
    };
    
    window.addEventListener('scroll', checkScroll);
    checkScroll();
};

// Contact form handling
const initializeContactForm = () => {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async e => {
        e.preventDefault();
        const form = e.target;
        const status = document.getElementById('formStatus');
        
        try {
            console.log('Form submitted with:', {
                name: form.name.value,
                email: form.email.value,
                message: form.message.value
            });

            await new Promise(resolve => setTimeout(resolve, 1000));
            status.textContent = "Message sent successfully!";
            status.style.color = '#4CAF50';
            form.reset();
        } catch (error) {
            status.textContent = 'Failed to send message. Please try again later.';
            status.style.color = '#f44336';
            console.error('Form submission error:', error);
        }
    });
};

// Mobile responsive toggle button
const updateToggleButtonStyles = () => {
    const isMobile = window.innerWidth <= 768;
    Object.assign(toggleBtn.style, {
        padding: isMobile ? '8px 20px' : '10px 30px',
        fontSize: isMobile ? '0.9rem' : '1rem'
    });
};

// Header scroll behavior
let lastScroll = 0;
const handleHeaderScroll = () => {
    const currentScroll = window.pageYOffset;
    header?.classList[currentScroll > lastScroll && currentScroll > 100 ? 'add' : 'remove']('header-hidden');
    lastScroll = currentScroll;
};

// Event listeners
window.addEventListener('resize', updateToggleButtonStyles);
window.addEventListener('scroll', handleHeaderScroll);
toggleBtn.addEventListener('click', () => setTheme(!body.classList.contains('dark-theme')));
document.addEventListener('DOMContentLoaded', () => {
    handleSmoothScroll();
    initializeRevealAnimation();
    initializeContactForm();
    updateToggleButtonStyles();

    // Add vanta background div
    const vantaDiv = document.createElement('div');
    vantaDiv.id = 'vanta-bg';
    document.body.prepend(vantaDiv);
    
    // Initialize vanta effect
    initVanta();
});

// Initialize theme on load
initializeTheme();

console.log("Portfolio loaded successfully!");
