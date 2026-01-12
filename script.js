document.addEventListener('DOMContentLoaded', function () {
    const popup = document.getElementById('eventPopup');
    const closeBtn = document.getElementById('closePopup');
    const navTimer = document.getElementById('navEventTimer');
    const countdownDisplay = document.getElementById('eventCountdown');

    // Check if popup was already shown in this session
    let popupHasBeenShown = sessionStorage.getItem('popupShown') === 'true';

    // Set Event Date: January 17th, 2026
    const eventDate = new Date('2026-01-17T00:00:00');

    function updateTimer() {
        const now = new Date();
        const diff = eventDate - now;

        if (diff <= 0) {
            if (countdownDisplay) countdownDisplay.textContent = "00d 00h 00m";
            // Hide event elements if expired
            if (navTimer) navTimer.style.display = 'none';
            if (popup) popup.classList.remove('show');
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (countdownDisplay) {
            countdownDisplay.textContent = `${days}d ${hours}h ${minutes}m`;
        }
    }

    // Initial call and interval
    updateTimer();
    setInterval(updateTimer, 60000); // Update every minute

    function showNavTimer() {
        const now = new Date();
        if (navTimer && (eventDate - now > 0)) {
            navTimer.style.display = 'block';
            // Add a subtle animation when it appears
            navTimer.classList.add('animate__animated', 'animate__fadeInDown');
        }
    }

    function closePopup() {
        if (popup) {
            popup.classList.remove('show');
            // Show timer when popup is closed (if not expired)
            showNavTimer();
        }
    }

    // Scroll Logic to show popup
    window.addEventListener('scroll', function () {
        const now = new Date();
        // Only show popup if not expired
        if (eventDate - now > 0 && !popupHasBeenShown && window.scrollY > (document.body.scrollHeight * 0.3)) {
            if (popup) {
                popup.classList.add('show');
                sessionStorage.setItem('popupShown', 'true');
                popupHasBeenShown = true;
            }
        }
    });

    // Close handlers
    if (closeBtn) {
        closeBtn.addEventListener('click', closePopup);
    }

    window.addEventListener('click', function (e) {
        if (e.target === popup) {
            closePopup();
        }
    });

    // If popup was already shown in a previous session (or reload), 
    // we should ensure the timer is visible so the user doesn't lose the info.
    if (popupHasBeenShown) {
        showNavTimer();
    }

    /* ==============================
       DARK MODE TOGGLE LOGIC
    ============================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        htmlElement.setAttribute('data-theme', 'dark');
        updateIcon(true);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateIcon(newTheme === 'dark');
        });
    }

    function updateIcon(isDark) {
        if (!themeToggleBtn) return;
        // Use FontAwesome icons if available, or simple text/emoji
        // Assuming FontAwesome is loaded based on index.html
        if (isDark) {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
});

