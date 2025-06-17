// Main JavaScript for Mamunur Rashid eShop Payment Page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your actual EmailJS public key
    
    // Elements
    const openPaymentFormBtn = document.getElementById('openPaymentForm');
    const closePaymentFormBtn = document.getElementById('closePaymentForm');
    const paymentFormModal = document.getElementById('paymentFormModal');
    const showPaymentOptionsBtn = document.getElementById('showPaymentOptions');
    const paymentModal = document.getElementById('paymentModal');
    const closeModalBtn = document.getElementById('closeModal');
    const completePaymentBtns = document.querySelectorAll('.payment-button');
    const successModal = document.getElementById('successModal');
    const successCloseButtons = document.querySelectorAll('.success-close');
    const paymentMethods = document.querySelectorAll('.payment-method');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const sendMoneyOptions = document.getElementById('sendMoneyOptions');
    const paymentOptions = document.getElementById('paymentOptions');
    const cardOptions = document.getElementById('cardOptions');
    const copyButtons = document.querySelectorAll('.copy-number');
    const successDetails = document.getElementById('successDetails');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const amountInput = document.getElementById('amount');
    const directPaymentLinks = document.querySelectorAll('.direct-payment-link');
    const tabItems = document.querySelectorAll('.tab-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Sharing buttons
    const whatsappShareBtn = document.getElementById('whatsappShare');
    const telegramShareBtn = document.getElementById('telegramShare');
    const messengerShareBtn = document.getElementById('messengerShare');
    const smsShareBtn = document.getElementById('smsShare');
    const emailShareBtn = document.getElementById('emailShare');

    // Function to open payment form modal - used by both click and touch events
    function openPaymentForm(e) {
        // Prevent default behavior to avoid keyboard popup
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        paymentFormModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Add entrance animation
        const modalContent = paymentFormModal.querySelector('.modal-content');
        modalContent.style.animation = 'modalFadeIn 0.4s';
        
        // Return false to prevent any default behavior
        return false;
    }
    
    // Open payment form modal - add both click and touchstart events for mobile compatibility
    if (openPaymentFormBtn) {
        // Since we're now using a div instead of a button, ensure it's not focusable in a way that triggers keyboard
        openPaymentFormBtn.setAttribute('role', 'button');
        openPaymentFormBtn.setAttribute('tabindex', '0');
        
        // Add click event for desktop
        openPaymentFormBtn.addEventListener('click', function(e) {
            return openPaymentForm(e);
        });
        
        // Add touchstart event for mobile
        openPaymentFormBtn.addEventListener('touchstart', function(e) {
            return openPaymentForm(e);
        });
        
        // Add touchend event for mobile to prevent any default behavior
        openPaymentFormBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
        
        // Add keyboard support for accessibility
        openPaymentFormBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                return openPaymentForm(e);
            }
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
                } else if (tabId === 'card') {
                    contentToShow = document.getElementById('cardOptions');
                } else if (tabId === 'payment') {
                    contentToShow = document.getElementById('paymentOptions');
                }
                
                if (contentToShow) {
                    contentToShow.classList.add('active');
                }
            });
        });
    }

    // Direct payment links - open directly in new tab without checking transaction ID
    if (directPaymentLinks.length > 0) {
        directPaymentLinks.forEach(link => {
            // No validation needed - just let the link open directly
        });
    }

    // Complete payment buttons (including the ones in all tabs)
    const completeSendMoneyBtn = document.getElementById('completeSendMoneyPayment');
    const completeCardPaymentBtn = document.getElementById('completeCardPayment');
    const completeDirectPaymentBtn = document.getElementById('completeDirectPayment');

    // Function to create payment message for sharing
    function createPaymentMessage(name, phone, amount, paymentMethod, transactionId) {
        return `নাম: ${name}
ফোন: ${phone}
পরিমাণ: ${amount} টাকা
পেমেন্ট মেথড: ${paymentMethod}
ট্রানজেকশন আইডি: ${transactionId}`;
    }

    // Function to send email using EmailJS
    function sendPaymentEmail(name, email, phone, amount, paymentMethod, transactionId) {
        const templateParams = {
            customer_name: name,
            customer_email: email,
            customer_phone: phone,
            amount: amount,
            payment_method: paymentMethod,
            transaction_id: transactionId,
            date: new Date().toLocaleString('bn-BD', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        emailjs.send('service_9blwvtc', 'template_vp3kg4i', templateParams)
            .then(function(response) {
                console.log('Email sent successfully!', response.status, response.text);
            }, function(error) {
                console.log('Email sending failed...', error);
            });
    }

    // Function to handle payment completion
    function handlePaymentCompletion(paymentMethod, transactionIdInput) {
        // Validate transaction ID
        if (!transactionIdInput.value.trim()) {
            transactionIdInput.style.borderColor = 'var(--error-color)';
            alert('অনুগ্রহ করে ট্রানজেকশন আইডি লিখুন');
            return;
        }
        
        transactionIdInput.style.borderColor = '';
        const transactionId = transactionIdInput.value;
        
        // Get form data
        const name = nameInput.value;
        const email = emailInput.value;
        const amount = amountInput.value;
        const phone = phoneInput.value;
        const paymentMethodName = getPaymentMethodName(paymentMethod);
        
        // Send email if email is provided
        if (email && email.trim()) {
            sendPaymentEmail(name, email, phone, amount, paymentMethodName, transactionId);
        }
        
        // Show success message
        paymentModal.classList.remove('show');
        successModal.classList.add('show');
        
        // Show payment details in success modal (including email)
        successDetails.innerHTML = `
            <strong>নাম:</strong> ${name}<br>
            ${email ? `<strong>ইমেইল:</strong> ${email}<br>` : ''}
            <strong>ফোন:</strong> ${phone}<br>
            <strong>পরিমাণ:</strong> ${amount} টাকা<br>
            <strong>পেমেন্ট মেথড:</strong> ${paymentMethodName}<br>
            <strong>ট্রানজেকশন আইডি:</strong> ${transactionId}
        `;
        
        // Create payment message for sharing
        const paymentMessage = createPaymentMessage(name, phone, amount, paymentMethodName, transactionId);
        const encodedMessage = encodeURIComponent(paymentMessage);
        
        // Set up sharing links
        if (whatsappShareBtn) {
            whatsappShareBtn.href = `https://wa.me/8801886191222?text=${encodedMessage}`;
        }
        
        if (telegramShareBtn) {
            telegramShareBtn.href = `https://t.me/mamunur_rashid55?text=${encodedMessage}`;
        }
        
        if (messengerShareBtn) {
            messengerShareBtn.href = `https://m.me/mamunur.rashid08?text=${encodedMessage}`;
        }
        
        if (smsShareBtn) {
            smsShareBtn.href = `sms:?body=${encodedMessage}`;
        }
        
        if (emailShareBtn) {
            emailShareBtn.href = `mailto:mamun1k999@gmail.com?subject=পেমেন্ট বিবরণ&body=${encodedMessage}`;
        }
        
        // Add click event listeners to sharing buttons
        setupSharingButtons(name, phone, amount, paymentMethodName, transactionId);
    }
    
    // Function to set up sharing buttons
    function setupSharingButtons(name, phone, amount, paymentMethod, transactionId) {
        const paymentMessage = createPaymentMessage(name, phone, amount, paymentMethod, transactionId);
        const encodedMessage = encodeURIComponent(paymentMessage);
        
        // WhatsApp sharing
        if (whatsappShareBtn) {
            whatsappShareBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.open(`https://wa.me/8801886191222?text=${encodedMessage}`, '_blank');
            });
        }
        
        // Telegram sharing
        if (telegramShareBtn) {
            telegramShareBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.open(`https://t.me/mamunur_rashid55?text=${encodedMessage}`, '_blank');
            });
        }
        
        // Messenger sharing
        if (messengerShareBtn) {
            messengerShareBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.open(`https://m.me/mamunur.rashid08?text=${encodedMessage}`, '_blank');
            });
        }
        
        // SMS sharing
        if (smsShareBtn) {
            smsShareBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.open(`sms:?body=${encodedMessage}`, '_blank');
            });
        }
        
        // Email sharing
        if (emailShareBtn) {
            emailShareBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.open(`mailto:mamun1k999@gmail.com?subject=পেমেন্ট বিবরণ&body=${encodedMessage}`, '_blank');
            });
        }
    }

    // Send Money payment completion
    if (completeSendMoneyBtn) {
        completeSendMoneyBtn.addEventListener('click', function() {
            const transactionIdInput = document.getElementById('sendMoneyTransactionId');
            handlePaymentCompletion('send-money', transactionIdInput);
        });
    }

    // Card payment completion
    if (completeCardPaymentBtn) {
        completeCardPaymentBtn.addEventListener('click', function() {
            const transactionIdInput = document.getElementById('cardTransactionId');
            handlePaymentCompletion('card', transactionIdInput);
        });
    }

    // Direct payment completion
    if (completeDirectPaymentBtn) {
        completeDirectPaymentBtn.addEventListener('click', function() {
            const transactionIdInput = document.getElementById('paymentTransactionId');
            handlePaymentCompletion('payment', transactionIdInput);
        });
    }

    // Close success modal
    successCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            successModal.classList.remove('show');
            document.body.style.overflow = '';
            
            // Reset form
            document.getElementById('paymentForm').reset();
        });
    });

    // Payment method selection
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Remove active class from all methods
            paymentMethods.forEach(m => m.classList.remove('active'));
            
            // Add active class to clicked method
            this.classList.add('active');
            
            // Update hidden select value
            paymentMethodSelect.value = this.getAttribute('data-method');
        });
    });

    // Copy number to clipboard
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
        if (e.target === successModal) {
            successModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    // Helper functions
    function validateForm() {
        let isValid = true;
        
        // Check name
        if (!nameInput.value.trim()) {
            nameInput.style.borderColor = 'var(--error-color)';
            isValid = false;
        } else {
            nameInput.style.borderColor = '';
        }
        
        // Check phone
        if (!phoneInput.value.trim()) {
            phoneInput.style.borderColor = 'var(--error-color)';
            isValid = false;
        } else {
            phoneInput.style.borderColor = '';
        }
        
        // Check amount
        if (!amountInput.value.trim() || isNaN(amountInput.value) || amountInput.value <= 0) {
            amountInput.style.borderColor = 'var(--error-color)';
            isValid = false;
        } else {
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
    
    function getPaymentMethodName(method) {
        switch(method) {
            case 'send-money':
                return 'Send Money';
            case 'payment':
                return 'Payment';
            case 'card':
                return 'Card Payment';
            default:
                return method;
        }
    }

    // Add input event listeners to remove error styling
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

    // App open buttons with improved cross-platform deep linking
    const appOpenButtons = document.querySelectorAll('.app-open-button');
    appOpenButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get app info
            const appName = button.getAttribute('data-app') || '';
            const appText = button.textContent || '';
            
            // Define app schemes, intent URLs, and store URLs for each app
            let appSchemes = [];
            let intentUrls = [];
            let universalLinks = [];
            let appStoreUrl = '';
            let playStoreUrl = '';
            
            if (appName === 'bkash' || appText.includes('bKash')) {
                // bKash deep links
                appSchemes = ['bkash://'];
                intentUrls = ['intent://payment/#Intent;scheme=bkash;package=com.bKash.customerapp;end'];
                universalLinks = ['https://www.bkash.com/redirect'];
                playStoreUrl = 'https://play.google.com/store/apps/details?id=com.bKash.customerapp';
                appStoreUrl = 'https://apps.apple.com/us/app/bkash/id1351183172';
            } else if (appName === 'nagad' || appText.includes('Nagad')) {
                // Nagad deep links
                appSchemes = ['nagad://'];
                intentUrls = ['intent://payment/#Intent;scheme=nagad;package=com.konasl.nagad;end'];
                universalLinks = ['https://nagad.com.bd/redirect'];
                playStoreUrl = 'https://play.google.com/store/apps/details?id=com.konasl.nagad';
                appStoreUrl = 'https://apps.apple.com/us/app/nagad/id1435157730';
            } else if (appName === 'upay' || appText.includes('Upay')) {
                // Upay deep links
                appSchemes = ['upay://'];
                intentUrls = ['intent://payment/#Intent;scheme=upay;package=com.ucb.upay;end'];
                universalLinks = ['https://www.upaybd.com/redirect'];
                playStoreUrl = 'https://play.google.com/store/apps/details?id=com.ucb.upay';
                appStoreUrl = 'https://apps.apple.com/us/app/upay-bangladesh/id1453474910';
            } else if (appName === 'rocket' || appText.includes('Rocket')) {
                // Rocket deep links
                appSchemes = ['rocket://'];
                intentUrls = ['intent://payment/#Intent;scheme=rocket;package=com.dbbl.mbs;end'];
                universalLinks = ['https://www.dutchbanglabank.com/rocket/redirect'];
                playStoreUrl = 'https://play.google.com/store/apps/details?id=com.dbbl.mbs';
                appStoreUrl = 'https://apps.apple.com/us/app/rocket-dbbl-mobile-banking/id1455826421';
            } else if (appName === 'cellfin' || appText.includes('Cellfin')) {
                // Cellfin deep links
                appSchemes = ['cellfin://'];
                intentUrls = ['intent://payment/#Intent;scheme=cellfin;package=com.progoti.cellfin;end'];
                universalLinks = ['https://www.cellfin.com/redirect'];
                playStoreUrl = 'https://play.google.com/store/apps/details?id=com.progoti.cellfin';
                appStoreUrl = 'https://apps.apple.com/us/app/cellfin/id1535677391';
            }
            
            // Try to open app using various methods
            tryOpenApp(appSchemes, intentUrls, universalLinks, playStoreUrl, appStoreUrl);
        });
    });
    
    // Function to try opening an app using various methods
    function tryOpenApp(appSchemes, intentUrls, universalLinks, playStoreUrl, appStoreUrl) {
        // Detect platform
        const isAndroid = /Android/i.test(navigator.userAgent);
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        
        if (isAndroid) {
            // Try intent URLs first on Android
            if (intentUrls && intentUrls.length > 0) {
                window.location.href = intentUrls[0];
                return;
            }
        }
        
        if (isIOS) {
            // Try app schemes first on iOS
            if (appSchemes && appSchemes.length > 0) {
                window.location.href = appSchemes[0];
                
                // Fallback to App Store after delay
                setTimeout(function() {
                    if (appStoreUrl) {
                        window.location.href = appStoreUrl;
                    }
                }, 2000);
                
                return;
            }
        }
        
        // Try universal links as fallback
        if (universalLinks && universalLinks.length > 0) {
            window.location.href = universalLinks[0];
            return;
        }
        
        // Final fallback to app stores
        if (isAndroid && playStoreUrl) {
            window.location.href = playStoreUrl;
        } else if (isIOS && appStoreUrl) {
            window.location.href = appStoreUrl;
        }
    }
});
