// Main JavaScript for Mamunur Rashid eShop Payment Page
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const openPaymentFormBtn = document.getElementById('openPaymentForm');
    const closePaymentFormBtn = document.getElementById('closePaymentForm');
    const paymentFormModal = document.getElementById('paymentFormModal');
    const showPaymentOptionsBtn = document.getElementById('showPaymentOptions');
    const paymentModal = document.getElementById('paymentModal');
    const closeModalBtn = document.getElementById('closeModal');
    const paymentMethods = document.querySelectorAll('.payment-method');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const copyButtons = document.querySelectorAll('.copy-number');
    const tabItems = document.querySelectorAll('.tab-item');
    const tabContents = document.querySelectorAll('.tab-content');

    // Open payment form modal
    if (openPaymentFormBtn) {
        openPaymentFormBtn.addEventListener('click', function() {
            paymentFormModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close payment form modal
    if (closePaymentFormBtn) {
        closePaymentFormBtn.addEventListener('click', function() {
            paymentFormModal.classList.remove('show');
            document.body.style.overflow = '';
        });
    }

    // Show payment options
    if (showPaymentOptionsBtn) {
        showPaymentOptionsBtn.addEventListener('click', function() {
            // Validate form
            if (!validateForm()) {
                return;
            }

            paymentFormModal.classList.remove('show');
            paymentModal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Show the correct payment options based on selected method
            const selectedMethod = paymentMethodSelect.value;
            showSelectedPaymentOptions(selectedMethod);
        });
    }

    // Close payment options modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            paymentModal.classList.remove('show');
            document.body.style.overflow = '';
        });
    }

    // Tab switching functionality
    if (tabItems.length > 0) {
        tabItems.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs and contents
                tabItems.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Show corresponding content
                const tabId = this.getAttribute('data-tab');
                let contentToShow;
                
                if (tabId === 'send-money') {
                    contentToShow = document.getElementById('sendMoneyOptions');
                } else if (tabId === 'payment') {
                    contentToShow = document.getElementById('paymentOptions');
                } else if (tabId === 'card') {
                    contentToShow = document.getElementById('cardOptions');
                }
                
                if (contentToShow) {
                    contentToShow.classList.add('active');
                }
            });
        });
    }

    // Payment method selection
    if (paymentMethods) {
        paymentMethods.forEach(method => {
            method.addEventListener('click', function() {
                // Remove active class from all methods
                paymentMethods.forEach(m => m.classList.remove('active'));
                
                // Add active class to clicked method
                this.classList.add('active');
                
                // Update hidden select value
                if (paymentMethodSelect) {
                    paymentMethodSelect.value = this.getAttribute('data-method');
                }
            });
        });
    }

    // Copy number to clipboard
    if (copyButtons) {
        copyButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const number = this.getAttribute('data-number');
                
                // Create temporary input element
                const tempInput = document.createElement('input');
                tempInput.value = number;
                document.body.appendChild(tempInput);
                
                // Select and copy
                tempInput.select();
                document.execCommand('copy');
                
                // Remove temporary element
                document.body.removeChild(tempInput);
                
                // Change button text temporarily
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> কপি হয়েছে';
                
                // Reset button text after delay
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            });
        });
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === paymentFormModal) {
            paymentFormModal.classList.remove('show');
            document.body.style.overflow = '';
        }
        if (e.target === paymentModal) {
            paymentModal.classList.remove('show');
            document.body.style.overflow = '';
        }
        if (e.target === document.getElementById('successModal')) {
            document.getElementById('successModal').classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    // Helper functions
    function validateForm() {
        let isValid = true;
        
        // Check name
        const nameInput = document.getElementById('customerName');
        if (nameInput && !nameInput.value.trim()) {
            nameInput.style.borderColor = 'var(--error-color)';
            isValid = false;
        } else if (nameInput) {
            nameInput.style.borderColor = '';
        }
        
        // Check phone
        const phoneInput = document.getElementById('customerPhone');
        if (phoneInput && !phoneInput.value.trim()) {
            phoneInput.style.borderColor = 'var(--error-color)';
            isValid = false;
        } else if (phoneInput) {
            phoneInput.style.borderColor = '';
        }
        
        // Check amount
        const amountInput = document.getElementById('paymentAmount');
        if (amountInput && (!amountInput.value.trim() || isNaN(amountInput.value) || amountInput.value <= 0)) {
            amountInput.style.borderColor = 'var(--error-color)';
            isValid = false;
        } else if (amountInput) {
            amountInput.style.borderColor = '';
        }
        
        if (!isValid) {
            alert('অনুগ্রহ করে সমস্ত প্রয়োজনীয় তথ্য পূরণ করুন');
        }
        
        return isValid;
    }

    function showSelectedPaymentOptions(method) {
        // Set the active tab based on the selected method
        tabItems.forEach(tab => {
            if (tab.getAttribute('data-tab') === method) {
                tab.click();
            }
        });
    }

    // Add input event listeners to remove error styling
    const nameInput = document.getElementById('customerName');
    const phoneInput = document.getElementById('customerPhone');
    const amountInput = document.getElementById('paymentAmount');
    
    if (nameInput) {
        nameInput.addEventListener('input', function() {
            this.style.borderColor = '';
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            this.style.borderColor = '';
        });
    }
    
    if (amountInput) {
        amountInput.addEventListener('input', function() {
            this.style.borderColor = '';
        });
    }
});
