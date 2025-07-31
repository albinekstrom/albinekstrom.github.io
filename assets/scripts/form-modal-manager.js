/**
 * FormModalManager
 * Handles the signup form modal functionality
 */

export default class FormModalManager {
  constructor() {
    this.modal = null;
    this.form = null;
    this.triggerButtons = [];
    this.isSubmitting = false;

    this.init();
  }

  init() {
    console.log("Initializing FormModalManager...");

    this.bindElements();
    this.bindEvents();

    console.log("FormModalManager initialized successfully");
  }

  bindElements() {
    // Get modal element
    this.modal = document.getElementById("signup-modal");
    if (!this.modal) {
      console.log("No signup modal found");
      return;
    }

    // Get form element
    this.form = this.modal.querySelector("#signup-form");

    // Get all trigger buttons (Anmäl Intresse buttons)
    this.triggerButtons = document.querySelectorAll(
      '[data-modal-trigger="signup"]'
    );

    console.log(`Found ${this.triggerButtons.length} trigger buttons`);
  }

  bindEvents() {
    if (!this.modal) return;

    // Bind trigger buttons
    this.triggerButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        this.openModal();
      });
    });

    // Bind close buttons
    const closeButtons = this.modal.querySelectorAll("[data-modal-close]");
    closeButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        this.closeModal();
      });
    });

    // Close modal when clicking overlay
    const overlay = this.modal.querySelector(".modal__overlay");
    if (overlay) {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          this.closeModal();
        }
      });
    }

    // Handle form submission
    if (this.form) {
      this.form.addEventListener("submit", (e) => {
        this.handleFormSubmit(e);
      });
    }

    // Close modal on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isModalOpen()) {
        this.closeModal();
      }
    });
  }

  openModal() {
    if (!this.modal) return;

    this.modal.classList.add("modal--active");
    document.body.classList.add("modal-open");

    // Focus on first input
    const firstInput = this.modal.querySelector("input, textarea");
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }

    console.log("Modal opened");
  }

  closeModal() {
    if (!this.modal) return;

    this.modal.classList.remove("modal--active");
    document.body.classList.remove("modal-open");

    // Clear form if not submitted
    if (!this.isSubmitting) {
      this.resetForm();
    }

    console.log("Modal closed");
  }

  isModalOpen() {
    return this.modal && this.modal.classList.contains("modal--active");
  }

  async handleFormSubmit(e) {
    e.preventDefault();

    if (this.isSubmitting) return;

    // Validate form
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;
    this.showSubmittingState();

    try {
      const formData = new FormData(this.form);
      const success = await this.submitToGoogleForms(formData);

      if (success) {
        this.showSuccessState();
        setTimeout(() => {
          this.closeModal();
          this.resetForm();
        }, 2000);
      } else {
        this.showErrorState();
      }
    } catch (error) {
      console.error("Form submission error:", error);
      this.showErrorState();
    } finally {
      this.isSubmitting = false;
    }
  }

  validateForm() {
    if (!this.form) return false;

    let isValid = true;

    // Clear all previous errors first
    this.clearAllErrors();

    // Validate required fields (only name is required)
    const requiredFields = this.form.querySelectorAll("[required]");
    requiredFields.forEach((field) => {
      const value = field.value.trim();

      if (!value) {
        this.showFieldError(field, "Detta fält är obligatoriskt");
        isValid = false;
      }
    });

    // Special validation: email OR phone required (but not both required)
    const emailField = this.form.querySelector('[name="email"]');
    const phoneField = this.form.querySelector('[name="nummer"]');
    const emailValue = emailField ? emailField.value.trim() : "";
    const phoneValue = phoneField ? phoneField.value.trim() : "";

    if (!emailValue && !phoneValue) {
      // Neither email nor phone provided
      if (emailField) {
        this.showFieldError(
          emailField,
          "E-postadress eller telefonnummer krävs"
        );
      }
      if (phoneField) {
        this.showFieldError(
          phoneField,
          "E-postadress eller telefonnummer krävs"
        );
      }
      isValid = false;
    } else {
      // Validate email format if provided
      if (emailValue && !this.isValidEmail(emailValue)) {
        this.showFieldError(emailField, "Ange en giltig e-postadress");
        isValid = false;
      }

      // Validate phone format if provided
      if (phoneValue && !this.isValidPhone(phoneValue)) {
        this.showFieldError(phoneField, "Ange ett giltigt telefonnummer");
        isValid = false;
      }
    }

    return isValid;
  }

  clearAllErrors() {
    const allFields = this.form.querySelectorAll(".form__field");
    allFields.forEach((field) => {
      field.classList.remove("form__field--error");
      // Restore original placeholder
      const originalPlaceholder = field.getAttribute(
        "data-original-placeholder"
      );
      if (originalPlaceholder !== null) {
        field.placeholder = originalPlaceholder;
      }
    });
  }

  showFieldError(field, message) {
    field.classList.add("form__field--error");
    field.placeholder = message;
    field.value = ""; // Clear the field value to show the error placeholder
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone) {
    // Swedish phone number validation (basic)
    // Accepts formats like: 070-123 45 67, 0701234567, +46701234567
    const phoneRegex =
      /^(\+46|0)[- ]?[0-9]{1,3}[- ]?[0-9]{3}[- ]?[0-9]{2}[- ]?[0-9]{2}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  }

  async submitToGoogleForms(formData) {
    // Your Google Form URL: https://forms.gle/ybj6zYhhYaW3cnPN9
    // To get the exact entry IDs, you need to:
    // 1. Open the form in edit mode
    // 2. Right-click and "View Page Source"
    // 3. Search for "entry." to find the field IDs

    // For now, this will log the data and simulate submission
    // You'll need to replace the entry IDs with the actual ones from your form
    const GOOGLE_FORM_URL =
      "https://docs.google.com/forms/d/e/1FAIpQLSf7X8YQ9x2YRZPYCYbLZKJhcxNLYqxT5yXuHw9vEVzQ8A3TGw/formResponse";

    // Map form fields to Google Forms entry IDs
    // These are placeholder IDs - replace with actual ones from your form source
    const googleFormData = new FormData();
    googleFormData.append("entry.123456789", formData.get("namn") || ""); // namn field
    googleFormData.append("entry.987654321", formData.get("email") || ""); // email field
    googleFormData.append("entry.456789123", formData.get("nummer") || ""); // nummer field
    googleFormData.append("entry.789123456", formData.get("resa") || ""); // resa field
    googleFormData.append("entry.321654987", formData.get("meddelande") || ""); // meddelande field

    try {
      console.log("Form data to submit:", Object.fromEntries(formData));

      // Uncomment this section once you have the correct entry IDs:
      /*
      const response = await fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: googleFormData
      });
      return true; // Google Forms always returns success for no-cors requests
      */

      // For now, simulate successful submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return true;
    } catch (error) {
      console.error("Google Forms submission error:", error);
      return false;
    }
  }

  showSubmittingState() {
    const submitButton = this.form.querySelector('[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      const buttonContent = submitButton.querySelector(".btn__content");
      if (buttonContent) {
        buttonContent.textContent = "Skickar...";
      }
    }
  }

  showSuccessState() {
    const submitButton = this.form.querySelector('[type="submit"]');
    if (submitButton) {
      const buttonContent = submitButton.querySelector(".btn__content");
      if (buttonContent) {
        buttonContent.textContent = "Tack! Meddelandet skickat ✓";
      }
      submitButton.classList.add("btn--success");
    }

    // Show success message
    const successElement = this.modal.querySelector(".form__success");
    if (successElement) {
      successElement.style.display = "block";
    }
  }

  showErrorState() {
    const submitButton = this.form.querySelector('[type="submit"]');
    if (submitButton) {
      submitButton.disabled = false;
      const buttonContent = submitButton.querySelector(".btn__content");
      if (buttonContent) {
        buttonContent.textContent = "Försök igen";
      }
      submitButton.classList.add("btn--error");
    }

    // Show error message
    const errorElement = this.modal.querySelector(".form__error-general");
    if (errorElement) {
      errorElement.style.display = "block";
      errorElement.textContent =
        "Ett fel uppstod. Försök igen eller kontakta oss direkt.";
    }
  }

  resetForm() {
    if (!this.form) return;

    this.form.reset();

    // Clear all error states and restore original placeholders
    this.clearAllErrors();

    // Reset submit button
    const submitButton = this.form.querySelector('[type="submit"]');
    if (submitButton) {
      submitButton.disabled = false;
      const buttonContent = submitButton.querySelector(".btn__content");
      if (buttonContent) {
        buttonContent.textContent = "Skicka intresseanmälan";
      }
      submitButton.classList.remove("btn--success", "btn--error");
    }

    // Hide success/error messages
    const successElement = this.modal.querySelector(".form__success");
    const errorElement = this.modal.querySelector(".form__error-general");
    if (successElement) successElement.style.display = "none";
    if (errorElement) errorElement.style.display = "none";
  }
}
