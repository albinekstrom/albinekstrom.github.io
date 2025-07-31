/**
 * Menu Management Module
 * Handles all functionality related to the expanded menu
 */

class MenuManager {
  constructor() {
    this.menuToggle = document.querySelector(".menu__toggle");
    this.menuOverlay = document.querySelector(".menu__overlay");
    this.menuExpanded = document.querySelector(".menu__expanded");
    this.menuItems = document.querySelectorAll(".menu__item");
    this.isMenuOpen = false;

    this.init();
  }

  init() {
    this.bindEvents();
    console.log("Menu manager initialized");
  }

  bindEvents() {
    // Toggle menu on hamburger button click
    if (this.menuToggle) {
      this.menuToggle.addEventListener("click", () => this.openMenu());
    }

    // Close menu when clicking overlay
    if (this.menuOverlay) {
      this.menuOverlay.addEventListener("click", () => this.closeMenu());
    }

    // Close menu when clicking outside the menu
    document.addEventListener("click", (event) => {
      if (
        this.isMenuOpen &&
        !this.menuExpanded.contains(event.target) &&
        !this.menuToggle.contains(event.target)
      ) {
        this.closeMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && this.isMenuOpen) {
        this.closeMenu();
      }
    });

    // Close menu when clicking on menu items
    this.menuItems.forEach((item) => {
      item.addEventListener("click", () => this.closeMenu());
    });
  }

  openMenu() {
    this.menuOverlay.classList.add("active");
    this.menuExpanded.classList.add("active");
    this.isMenuOpen = true;
    document.body.style.overflow = "hidden"; // Prevent scrolling
  }

  closeMenu() {
    this.menuOverlay.classList.remove("active");
    this.menuExpanded.classList.remove("active");
    this.isMenuOpen = false;
    document.body.style.overflow = ""; // Restore scrolling
  }

  // Public method to check if menu is open
  isOpen() {
    return this.isMenuOpen;
  }
}

// Export the MenuManager class
export default MenuManager;
