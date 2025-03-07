/**
 * SplashScreen - A customizable splash screen component for web applications
 * @version 1.0.1
 */
class SplashScreen {
  /**
   * Create a new splash screen
   * @param {Object} options - Configuration options
   * @param {string} [options.containerId='splash-screen-container'] - ID for the splash screen container
   * @param {string} [options.backgroundColor='#ffffff'] - Background color
   * @param {string} [options.logoSrc] - URL to the logo image
   * @param {number} [options.logoWidth=120] - Logo width in pixels
   * @param {number} [options.logoHeight=120] - Logo height in pixels
   * @param {string} [options.logoAlt='Logo'] - Alt text for the logo
   * @param {string} [options.text] - Text to display below the logo
   * @param {string} [options.textColor='#333333'] - Color of the text
   * @param {number} [options.duration=2500] - Duration in milliseconds before the splash screen disappears
   * @param {number} [options.fadeOutDuration=500] - Duration of the fade out animation in milliseconds
   * @param {boolean} [options.showProgressBar=false] - Whether to show a progress bar
   * @param {string} [options.progressBarColor='#4CAF50'] - Color of the progress bar
   * @param {boolean} [options.showSpinner=false] - Whether to show a loading spinner
   * @param {string} [options.spinnerColor='#333333'] - Color of the spinner
   * @param {Function} [options.onHide] - Callback function to execute after the splash screen is hidden
   * @param {string} [options.logoAnimation='pulse'] - Animation for the logo: 'pulse', 'rotate', 'bounce', or 'none'
   * @param {boolean} [options.removeAfterHide=false] - Whether to remove the splash screen from the DOM after hiding
   */
  constructor(options = {}) {
    this.options = {
      containerId: options.containerId || 'splash-screen-container',
      backgroundColor: options.backgroundColor || '#ffffff',
      logoSrc: options.logoSrc || null,
      logoWidth: options.logoWidth || 120,
      logoHeight: options.logoHeight || 120,
      logoAlt: options.logoAlt || 'Logo',
      text: options.text || null,
      textColor: options.textColor || '#333333',
      duration: options.duration !== undefined ? options.duration : 2500,
      fadeOutDuration: options.fadeOutDuration || 500,
      showProgressBar: options.showProgressBar || false,
      progressBarColor: options.progressBarColor || '#4CAF50',
      showSpinner: options.showSpinner || false,
      spinnerColor: options.spinnerColor || '#333333',
      onHide: options.onHide || null,
      animation: options.animation || 'fade', // 'fade', 'zoom', 'slide'
      zIndex: options.zIndex || 9999,
      logoAnimation: options.logoAnimation || 'pulse',
      removeAfterHide: options.removeAfterHide || false
    };

    this.container = null;
    this.progressInterval = null;
    this.isHidden = false;
    this.isInitialized = false;
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initialize());
    } else {
      this.initialize();
    }
  }

  /**
   * Initialize the splash screen
   */
  initialize() {
    if (this.isInitialized) return;
    this.isInitialized = true;
    
    // Create and inject styles
    this._injectStyles();
    
    // Create splash screen element
    this._createSplashScreen();
    
    // Auto-hide after duration if duration is greater than 0
    if (this.options.duration > 0) {
      this._autoHide();
    }
  }

  /**
   * Inject required CSS styles
   * @private
   */
  _injectStyles() {
    const styleId = 'splash-screen-styles';
    
    // Don't add styles if they already exist
    if (document.getElementById(styleId)) return;
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .splash-screen-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transition: opacity ${this.options.fadeOutDuration}ms ease-out, visibility ${this.options.fadeOutDuration}ms ease-out;
        z-index: ${this.options.zIndex};
      }
      
      .splash-screen-container.hidden {
        opacity: 0;
        visibility: hidden;
      }
      
      .splash-screen-logo {
        max-width: 100%;
        height: auto;
        margin-bottom: 20px;
      }
      
      .splash-screen-logo.pulse {
        animation: splash-screen-pulse 2s infinite;
      }
      
      .splash-screen-logo.rotate {
        animation: splash-screen-rotate 2s infinite linear;
      }
      
      .splash-screen-logo.bounce {
        animation: splash-screen-bounce 2s infinite;
      }
      
      .splash-screen-text {
        font-family: Arial, sans-serif;
        font-size: 18px;
        margin-top: 16px;
        text-align: center;
      }
      
      .splash-screen-progress-container {
        width: 200px;
        height: 4px;
        background-color: rgba(0, 0, 0, 0.1);
        margin-top: 20px;
        border-radius: 2px;
        overflow: hidden;
      }
      
      .splash-screen-progress-bar {
        height: 100%;
        width: 0%;
        transition: width 0.3s ease-out;
      }
      
      .splash-screen-spinner {
        margin-top: 20px;
        width: 40px;
        height: 40px;
        border: 3px solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        border-top-color: #333;
        animation: splash-screen-spin 1s linear infinite;
      }
      
      @keyframes splash-screen-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
      
      @keyframes splash-screen-rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes splash-screen-bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-20px); }
        60% { transform: translateY(-10px); }
      }
      
      @keyframes splash-screen-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Create the splash screen DOM elements
   * @private
   */
  _createSplashScreen() {
    // Check if container already exists
    const existingContainer = document.getElementById(this.options.containerId);
    if (existingContainer) {
      existingContainer.remove();
    }
    
    // Create container
    this.container = document.createElement('div');
    this.container.id = this.options.containerId;
    this.container.className = 'splash-screen-container';
    this.container.style.backgroundColor = this.options.backgroundColor;
    
    // Create logo if provided
    if (this.options.logoSrc) {
      const logo = document.createElement('img');
      logo.src = this.options.logoSrc;
      logo.alt = this.options.logoAlt;
      logo.width = this.options.logoWidth;
      logo.height = this.options.logoHeight;
      logo.className = 'splash-screen-logo';
      
      // Add animation class if specified
      if (this.options.logoAnimation && this.options.logoAnimation !== 'none') {
        logo.classList.add(this.options.logoAnimation);
      }
      
      // Handle image loading errors
      logo.onerror = () => {
        console.error(`Failed to load logo image: ${this.options.logoSrc}`);
        logo.style.display = 'none';
      };
      
      this.container.appendChild(logo);
    }
    
    // Create text if provided
    if (this.options.text) {
      const text = document.createElement('div');
      text.className = 'splash-screen-text';
      text.style.color = this.options.textColor;
      text.textContent = this.options.text;
      this.container.appendChild(text);
    }
    
    // Create progress bar if enabled
    if (this.options.showProgressBar) {
      const progressContainer = document.createElement('div');
      progressContainer.className = 'splash-screen-progress-container';
      
      const progressBar = document.createElement('div');
      progressBar.className = 'splash-screen-progress-bar';
      progressBar.style.backgroundColor = this.options.progressBarColor;
      
      progressContainer.appendChild(progressBar);
      this.container.appendChild(progressContainer);
      
      // Animate progress bar
      this._animateProgressBar(progressBar);
    }
    
    // Create spinner if enabled
    if (this.options.showSpinner) {
      const spinner = document.createElement('div');
      spinner.className = 'splash-screen-spinner';
      spinner.style.borderTopColor = this.options.spinnerColor;
      this.container.appendChild(spinner);
    }
    
    // Add to DOM
    document.body.appendChild(this.container);
  }

  /**
   * Animate the progress bar
   * @param {HTMLElement} progressBar - The progress bar element
   * @private
   */
  _animateProgressBar(progressBar) {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    
    let width = 0;
    const duration = this.options.duration;
    const interval = 30; // Update every 30ms
    const increment = (interval / duration) * 100;
    
    this.progressInterval = setInterval(() => {
      if (width >= 100) {
        clearInterval(this.progressInterval);
      } else {
        width += increment;
        progressBar.style.width = `${Math.min(width, 100)}%`;
      }
    }, interval);
  }

  /**
   * Auto-hide the splash screen after the specified duration
   * @private
   */
  _autoHide() {
    setTimeout(() => {
      this.hide();
    }, this.options.duration);
  }

  /**
   * Hide the splash screen
   */
  hide() {
    if (this.isHidden || !this.container) return;
    
    this.isHidden = true;
    this.container.classList.add('hidden');
    
    // Clean up after transition
    const handleTransitionEnd = () => {
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
      }
      
      // Execute callback if provided
      if (typeof this.options.onHide === 'function') {
        this.options.onHide();
      }
      
      // Remove from DOM if needed
      if (this.options.removeAfterHide) {
        this.container.remove();
      }
      
      this.container.removeEventListener('transitionend', handleTransitionEnd);
    };
    
    this.container.addEventListener('transitionend', handleTransitionEnd);
    
    // Fallback in case the transition event doesn't fire
    setTimeout(() => {
      if (this.container.classList.contains('hidden') && 
          this.container.parentNode && 
          !this.container._transitionHandled) {
        handleTransitionEnd();
      }
    }, this.options.fadeOutDuration + 50);
  }

  /**
   * Show the splash screen (if it was hidden)
   */
  show() {
    if (!this.isHidden || !this.container) return;
    
    this.isHidden = false;
    this.container.classList.remove('hidden');
    
    // Reset progress bar if it exists
    if (this.options.showProgressBar) {
      const progressBar = this.container.querySelector('.splash-screen-progress-bar');
      if (progressBar) {
        progressBar.style.width = '0%';
        this._animateProgressBar(progressBar);
      }
    }
    
    // Auto-hide again if duration is set
    if (this.options.duration > 0) {
      this._autoHide();
    }
  }

  /**
   * Update splash screen options
   * @param {Object} newOptions - New options to apply
   */
  updateOptions(newOptions) {
    // Update options
    Object.assign(this.options, newOptions);
    
    // Update DOM elements based on new options
    if (this.container) {
      this.container.style.backgroundColor = this.options.backgroundColor;
      
      const logo = this.container.querySelector('.splash-screen-logo');
      if (logo && this.options.logoSrc) {
        logo.src = this.options.logoSrc;
        logo.alt = this.options.logoAlt;
        logo.width = this.options.logoWidth;
        logo.height = this.options.logoHeight;
        
        // Update animation
        logo.classList.remove('pulse', 'rotate', 'bounce');
        if (this.options.logoAnimation && this.options.logoAnimation !== 'none') {
          logo.classList.add(this.options.logoAnimation);
        }
      }
      
      const text = this.container.querySelector('.splash-screen-text');
      if (text && this.options.text) {
        text.textContent = this.options.text;
        text.style.color = this.options.textColor;
      }
      
      const progressBar = this.container.querySelector('.splash-screen-progress-bar');
      if (progressBar) {
        progressBar.style.backgroundColor = this.options.progressBarColor;
      }
      
      const spinner = this.container.querySelector('.splash-screen-spinner');
      if (spinner) {
        spinner.style.borderTopColor = this.options.spinnerColor;
      }
    }
  }
}
