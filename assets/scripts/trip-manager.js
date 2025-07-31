/**
 * Trip Manager Class
 * Handles expandable trip descriptions on kommande resor page
 */
export default class TripManager {
    constructor() {
        console.log('TripManager constructor called!');
        this.activeTrip = null;
        this.expandedElement = null;
        this.styleRemovalTimeout = null;
        this.init();
    }

    init() {
        console.log('TripManager init() called');
        
        this.expandedElement = document.getElementById('trip-expanded');
        if (!this.expandedElement) {
            console.error('Trip expanded element not found');
            return;
        }
        
        this.bindTripEvents();
        this.bindGlobalEvents();
        console.log('Trip manager initialized successfully');
    }

    bindTripEvents() {
        const tripCards = document.querySelectorAll('.trip-card[data-trip]');
        console.log('Found trip cards:', tripCards.length);
        
        tripCards.forEach((card, index) => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent global click handler from firing
                const tripId = card.getAttribute('data-trip');
                console.log('Trip card clicked:', tripId);
                this.toggleTrip(tripId, card);
            });
        });
    }

    bindGlobalEvents() {
        // Close expanded content when clicking outside cards or expanded content
        document.addEventListener('click', (e) => {
            // Check if click is outside trip cards and expanded content
            if (!e.target.closest('.trip-card') && 
                !e.target.closest('.trip-expanded') && 
                this.activeTrip) {
                console.log('Clicked outside, closing trip');
                this.closeTrip();
            }
        });
    }

    toggleTrip(tripId, clickedCard) {
        console.log('Toggling trip:', tripId);
        
        // If clicking the same trip that's already open, close it
        if (this.activeTrip === tripId) {
            this.closeTrip();
            return;
        }

        // If switching between trips, close immediately without delay
        const wasSwitching = this.activeTrip !== null;
        if (this.activeTrip) {
            this.closeTrip(true); // Pass true to indicate immediate close
        }

        // Open the new trip
        this.openTrip(tripId, clickedCard);
    }

    openTrip(tripId, clickedCard) {
        console.log('Opening trip:', tripId);
        
        // Clear any pending style removal timeout
        if (this.styleRemovalTimeout) {
            clearTimeout(this.styleRemovalTimeout);
            this.styleRemovalTimeout = null;
        }
        
        // Set active states
        this.activeTrip = tripId;
        
        // Add active class to clicked card
        document.querySelectorAll('.trip-card').forEach(card => {
            card.classList.remove('trip-card--active');
        });
        clickedCard.classList.add('trip-card--active');

        // Show the correct trip content
        const tripContent = document.querySelector(`.trip-expanded__trip[data-trip="${tripId}"]`);
        console.log('Trip content element:', tripContent);
        
        if (tripContent) {
            // Hide all trip contents
            document.querySelectorAll('.trip-expanded__trip').forEach(content => {
                content.classList.remove('trip-expanded__trip--active');
            });
            
            // Show the selected trip content
            tripContent.classList.add('trip-expanded__trip--active');
        } else {
            console.error('Trip content not found for:', tripId);
        }

        // Position the expanded element after the current row with full width
        this.positionExpandedElementFullWidth(clickedCard);

        // Show the expanded element with animation
        setTimeout(() => {
            this.expandedElement.classList.add('trip-expanded--visible');
        }, 10);

        // Smooth scroll to expanded content
        setTimeout(() => {
            this.expandedElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 300);
    }

    closeTrip(immediate = false) {
        console.log('Closing trip', immediate ? '(immediate)' : '');
        
        // Clear any pending style removal timeout
        if (this.styleRemovalTimeout) {
            clearTimeout(this.styleRemovalTimeout);
            this.styleRemovalTimeout = null;
        }
        
        // Remove active states
        this.activeTrip = null;
        
        document.querySelectorAll('.trip-card').forEach(card => {
            card.classList.remove('trip-card--active');
        });

        document.querySelectorAll('.trip-expanded__trip').forEach(content => {
            content.classList.remove('trip-expanded__trip--active');
        });

        // Hide the expanded element
        this.expandedElement.classList.remove('trip-expanded--visible');

        // Remove full width styling
        if (immediate) {
            // When switching between trips, remove styling immediately
            this.removeFullWidthStyling();
        } else {
            // When fully closing, wait for animation to complete
            this.styleRemovalTimeout = setTimeout(() => {
                this.removeFullWidthStyling();
                this.styleRemovalTimeout = null;
            }, 500);
        }
    }

    positionExpandedElement(clickedCard) {
        const grid = document.getElementById('trips-grid');
        const cards = Array.from(grid.querySelectorAll('.trip-card'));
        const clickedIndex = cards.indexOf(clickedCard);
        
        console.log('Positioning expanded element for card index:', clickedIndex);
        
        // Calculate how many cards per row based on grid layout
        const gridStyles = window.getComputedStyle(grid);
        const gridCols = gridStyles.getPropertyValue('grid-template-columns').split(' ').length;
        
        console.log('Grid columns detected:', gridCols);
        
        // Calculate which row the clicked card is in
        const currentRow = Math.floor(clickedIndex / gridCols);
        
        console.log('Current row:', currentRow);
        
        // Find the last card in the current row
        const lastCardInRow = Math.min((currentRow + 1) * gridCols - 1, cards.length - 1);
        const lastCard = cards[lastCardInRow];
        
        console.log('Last card in row:', lastCardInRow, lastCard);
        
        // Move expanded element to correct position if it's not already there
        if (lastCard.nextElementSibling !== this.expandedElement) {
            // Remove expanded element from its current position
            this.expandedElement.remove();
            
            // Insert expanded element after the last card in the current row
            lastCard.insertAdjacentElement('afterend', this.expandedElement);
            
                    console.log('Moved expanded element after card:', lastCard);
        }
    }

    positionExpandedElementFullWidth(clickedCard) {
        const grid = document.getElementById('trips-grid');
        const cards = Array.from(grid.querySelectorAll('.trip-card'));
        const clickedIndex = cards.indexOf(clickedCard);
        
        console.log('Positioning expanded element with full width for card index:', clickedIndex);
        
        // Calculate how many cards per row based on grid layout
        const gridStyles = window.getComputedStyle(grid);
        const gridCols = gridStyles.getPropertyValue('grid-template-columns').split(' ').length;
        
        console.log('Grid columns detected:', gridCols);
        
        // Calculate which row the clicked card is in
        const currentRow = Math.floor(clickedIndex / gridCols);
        
        console.log('Current row:', currentRow);
        
        // Find the last card in the current row
        const lastCardInRow = Math.min((currentRow + 1) * gridCols - 1, cards.length - 1);
        const lastCard = cards[lastCardInRow];
        
        console.log('Last card in row:', lastCardInRow, lastCard);
        
        // Move expanded element to correct position if it's not already there
        if (lastCard.nextElementSibling !== this.expandedElement) {
            // Remove expanded element from its current position
            this.expandedElement.remove();
            
            // Insert expanded element after the last card in the current row
            lastCard.insertAdjacentElement('afterend', this.expandedElement);
            
            console.log('Moved expanded element after card:', lastCard);
        }
        
        // Add full-width class for styling
        this.expandedElement.classList.add('trip-expanded--full-width');
    }

    removeFullWidthStyling() {
        console.log('Removing full width styling');
        
        // Remove the full-width class
        this.expandedElement.classList.remove('trip-expanded--full-width');
    }
} 