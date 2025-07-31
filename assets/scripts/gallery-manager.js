/**
 * Gallery Manager
 * Handles trip selection and image gallery switching for tidigare-resor page
 */

export default class GalleryManager {
  constructor() {
    this.tripButtons = document.querySelectorAll(".trip-list__item");
    this.galleryContents = document.querySelectorAll(".gallery-content");
    this.activeTrip = this.getFirstTripId(); // Default to first trip

    this.init();
  }

  init() {
    console.log("GalleryManager initializing...");

    if (this.tripButtons.length === 0) {
      console.log("No trip buttons found, skipping gallery initialization");
      return;
    }

    this.bindEvents();
    this.setActiveTrip(this.activeTrip);

    console.log("GalleryManager initialized successfully");
  }

  getFirstTripId() {
    // Get the first trip button's data-trip attribute
    const firstButton = this.tripButtons[0];
    return firstButton ? firstButton.getAttribute("data-trip") : null;
  }

  bindEvents() {
    this.tripButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const tripId = button.getAttribute("data-trip");
        this.setActiveTrip(tripId);
      });
    });
  }

  setActiveTrip(tripId) {
    console.log("Setting active trip:", tripId);

    // Update active trip button
    this.tripButtons.forEach((button) => {
      const buttonTripId = button.getAttribute("data-trip");
      if (buttonTripId === tripId) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });

    // Update active gallery content
    this.galleryContents.forEach((content) => {
      const contentTripId = content.getAttribute("data-trip");
      if (contentTripId === tripId) {
        content.classList.add("active");
      } else {
        content.classList.remove("active");
      }
    });

    this.activeTrip = tripId;
  }

  // Optional: Add smooth transition effect
  setActiveTripWithTransition(tripId) {
    // First fade out current content
    const currentContent = document.querySelector(".gallery-content.active");
    const newContent = document.querySelector(`[data-trip="${tripId}"]`);

    if (currentContent && newContent && currentContent !== newContent) {
      currentContent.style.opacity = "0";

      setTimeout(() => {
        this.setActiveTrip(tripId);
        newContent.style.opacity = "0";
        newContent.style.display = "block";

        // Fade in new content
        setTimeout(() => {
          newContent.style.opacity = "1";
        }, 50);
      }, 200);
    } else {
      this.setActiveTrip(tripId);
    }
  }
}
