/**
 * Main Application Entry Point
 * Handles initialization of all website components
 */

import MenuManager from "./menu.js";
import TripManager from "./trip-manager.js";
import GalleryManager from "./gallery-manager.js";
import FormModalManager from "./form-modal-manager.js";

class NordtripApp {
  constructor() {
    this.menuManager = null;
    this.tripManager = null;
    this.galleryManager = null;
    this.formModalManager = null;
    this.init();
  }

  init() {
    console.log("Nordtrip website initializing...");

    this.initializeComponents();
    this.bindGlobalEvents();

    console.log("Nordtrip website loaded successfully");
  }

  initializeComponents() {
    // Initialize menu functionality
    this.menuManager = new MenuManager();

    // Initialize trip expansion functionality
    this.initializeTripManager();

    // Initialize gallery functionality for tidigare-resor page
    this.initializeGalleryManager();

    // Initialize form modal functionality
    this.initializeFormModalManager();

    // Add other component initializations here in the future
    // Example: this.heroManager = new HeroManager();
  }

  initializeTripManager() {
    // Only initialize trip manager if we're on a page with trips
    console.log("Looking for trips-grid element...");
    const tripsGrid = document.getElementById("trips-grid");
    console.log("trips-grid element:", tripsGrid);

    if (tripsGrid) {
      console.log("Initializing TripManager...");
      this.tripManager = new TripManager();
    } else {
      console.log("No trips-grid found, skipping TripManager initialization");
    }
  }

  initializeGalleryManager() {
    // Only initialize gallery manager if we're on tidigare-resor page
    console.log("Looking for image-gallery element...");
    const imageGallery = document.getElementById("image-gallery");
    console.log("image-gallery element:", imageGallery);

    if (imageGallery) {
      console.log("Initializing GalleryManager...");
      this.galleryManager = new GalleryManager();
    } else {
      console.log(
        "No image-gallery found, skipping GalleryManager initialization"
      );
    }
  }

  initializeFormModalManager() {
    // Only initialize form modal manager if we're on a page with modal triggers
    console.log("Looking for modal trigger elements...");
    const modalTriggers = document.querySelectorAll(
      '[data-modal-trigger="signup"]'
    );
    console.log("modal trigger elements:", modalTriggers.length);

    if (modalTriggers.length > 0) {
      console.log("Initializing FormModalManager...");
      this.formModalManager = new FormModalManager();
    } else {
      console.log(
        "No modal triggers found, skipping FormModalManager initialization"
      );
    }
  }

  bindGlobalEvents() {
    // Global event handlers can be added here
    // Example: window scroll events, resize events, etc.

    window.addEventListener("resize", () => {
      // Handle window resize if needed
    });
  }
}

// Initialize the application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new NordtripApp();
});
