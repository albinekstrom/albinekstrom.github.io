// menu.js

// Väntar tills hela dokumentet har laddats innan skriptet körs
document.addEventListener('DOMContentLoaded', () => {
  const menuIcon = document.querySelector('.menu-icon'); // Hämtar elementet för meny ikonen
  const overlay = document.getElementById('overlay'); // Hämtar elementet för "overlay"

  // Lägg till en klick-händelse på meny ikonen som visar överlägget och låser sidans scrollning
  menuIcon.addEventListener('click', () => {
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
  });

  // Lägg till en klick-händelse på överlägget som döljer det när användaren klickar utanför navigeringen
  overlay.addEventListener('click', (event) => {
    if (!event.target.closest('.overlay-nav')) {
      overlay.style.display = 'none';
      document.body.style.overflow = ''; // Återställer sidans scrollning
    }
  });
});

  