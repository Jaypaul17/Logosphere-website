document.addEventListener('DOMContentLoaded', function () {
    const popup = document.getElementById('eventPopup');
    const closeBtn = document.getElementById('closePopup');
    const navTimer = document.getElementById('navEventTimer');
    const countdownDisplay = document.getElementById('eventCountdown');

    // Check if popup was already shown in this session
    let popupHasBeenShown = sessionStorage.getItem('popupShown') === 'true';

    // Set Event Date: For demonstration, we'll set it to 5 days from now.
    // In a real scenario, you would set a specific date string, e.g., new Date('2025-12-31T00:00:00')
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + 5);

    function updateTimer() {
        const now = new Date();
        const diff = eventDate - now;

        if (diff <= 0) {
            if (countdownDisplay) countdownDisplay.textContent = "00d 00h 00m";
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
        if (navTimer) {
            navTimer.style.display = 'block';
            // Add a subtle animation when it appears
            navTimer.classList.add('animate__animated', 'animate__fadeInDown');
        }
    }

    function closePopup() {
        if (popup) {
            popup.classList.remove('show');
            // Show timer when popup is closed
            showNavTimer();
        }
    }

    // Scroll Logic to show popup
    window.addEventListener('scroll', function () {
        // Show popup if not shown before and scrolled past 30%
        if (!popupHasBeenShown && window.scrollY > (document.body.scrollHeight * 0.3)) {
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
});
