class OTPVerification {
  constructor() {
    this.otpInputs = document.querySelectorAll('.otp-input');
    this.verifyBtn = document.getElementById('verifyBtn');
    this.message = document.getElementById('message');
    this.correctOTP = '1230'; // Demo OTP - in real app this would come from server
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.otpInputs[0].focus(); // Focus first input on load
  }
  
  setupEventListeners() {
    // Handle input events
    this.otpInputs.forEach((input, index) => {
      input.addEventListener('input', (e) => this.handleInput(e, index));
      input.addEventListener('keydown', (e) => this.handleKeydown(e, index));
      input.addEventListener('paste', (e) => this.handlePaste(e, index));
      input.addEventListener('focus', (e) => this.handleFocus(e));
    });
    
    // Handle verify button click
    this.verifyBtn.addEventListener('click', () => this.verifyOTP());
    
    // Handle form submission on Enter key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && this.isComplete()) {
        this.verifyOTP();
      }
    });
  }
  
  handleInput(e, index) {
    const input = e.target;
    const value = input.value;
    
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      input.value = '';
      return;
    }
    
    // Clear any previous validation states
    this.clearValidationStates();
    this.clearMessage();
    
    // Move to next input if current is filled
    if (value.length === 1 && index < this.otpInputs.length - 1) {
      this.otpInputs[index + 1].focus();
    }
    
    // Auto-verify if all fields are filled
    if (this.isComplete()) {
      setTimeout(() => this.verifyOTP(), 300);
    }
  }
  
  handleKeydown(e, index) {
    const input = e.target;
    
    // Handle backspace
    if (e.key === 'Backspace') {
      if (input.value === '' && index > 0) {
        this.otpInputs[index - 1].focus();
        this.otpInputs[index - 1].value = '';
      } else {
        input.value = '';
      }
      this.clearValidationStates();
      this.clearMessage();
    }
    
    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      this.otpInputs[index - 1].focus();
    }
    if (e.key === 'ArrowRight' && index < this.otpInputs.length - 1) {
      this.otpInputs[index + 1].focus();
    }
    
    // Prevent non-numeric input
    if (!/\d|Backspace|Delete|Tab|Enter|ArrowLeft|ArrowRight/.test(e.key)) {
      e.preventDefault();
    }
  }
  
  handlePaste(e, index) {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain');
    const digits = pastedData.replace(/\D/g, '').split('');
    
    // Fill inputs with pasted digits
    digits.forEach((digit, i) => {
      if (index + i < this.otpInputs.length) {
        this.otpInputs[index + i].value = digit;
      }
    });
    
    // Focus the last filled input or the next empty one
    const lastIndex = Math.min(index + digits.length - 1, this.otpInputs.length - 1);
    this.otpInputs[lastIndex].focus();
    
    // Auto-verify if complete
    if (this.isComplete()) {
      setTimeout(() => this.verifyOTP(), 300);
    }
  }
  
  handleFocus(e) {
    e.target.select(); // Select all text when focused
  }
  
  isComplete() {
    return Array.from(this.otpInputs).every(input => input.value.length === 1);
  }
  
  getOTPValue() {
    return Array.from(this.otpInputs).map(input => input.value).join('');
  }
  
  verifyOTP() {
    if (!this.isComplete()) {
      this.showMessage('Please enter the complete OTP code.', 'error');
      return;
    }
    
    const enteredOTP = this.getOTPValue();
    const isValid = enteredOTP === this.correctOTP;
    
    // Add loading state
    this.verifyBtn.classList.add('loading');
    this.verifyBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
      this.verifyBtn.classList.remove('loading');
      this.verifyBtn.disabled = false;
      
      if (isValid) {
        this.handleValidOTP();
      } else {
        this.handleInvalidOTP();
      }
    }, 1000);
  }
  
  handleValidOTP() {
    this.otpInputs.forEach(input => {
      input.classList.add('valid');
      input.classList.remove('invalid');
    });
    
    this.showMessage('✅ OTP verified successfully! Welcome aboard.', 'success');
    
    // Simulate redirect after success
    setTimeout(() => {
      this.showMessage('🎉 Redirecting to dashboard...', 'success');
    }, 2000);
  }
  
  handleInvalidOTP() {
    this.otpInputs.forEach(input => {
      input.classList.add('invalid');
      input.classList.remove('valid');
    });
    
    this.showMessage('❌ Invalid OTP. Please try again.', 'error');
    
    // Clear inputs after a delay and focus first input
    setTimeout(() => {
      this.clearInputs();
      this.clearValidationStates();
      this.otpInputs[0].focus();
    }, 1500);
  }
  
  clearInputs() {
    this.otpInputs.forEach(input => {
      input.value = '';
    });
  }
  
  clearValidationStates() {
    this.otpInputs.forEach(input => {
      input.classList.remove('valid', 'invalid');
    });
  }
  
  clearMessage() {
    this.message.textContent = '';
    this.message.className = 'message';
  }
  
  showMessage(text, type) {
    this.message.textContent = text;
    this.message.className = `message ${type}`;
  }
}

// Initialize the OTP verification when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new OTPVerification();
});

// Add some demo functionality
console.log('🔐 OTP Verification Component Loaded');
console.log('💡 Demo OTP: 1230');
console.log('🎯 Try entering different combinations to see validation in action');
