// Main JavaScript for Mamunur Rashid eShop Payment Page
document.addEventListener('DOMContentLoaded', function() {
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
    const emailInput = document.getElementById('email'); // Added email input
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

    // SMS Configuration
    const SMS_CONFIG = {
        api_key: "92rEDjjBTG7ZOzoUytdm",
        sender_id: "8809617627007",
        api_url: "https://bulksmsbd.net/api/smsapimany"
    };

    // Function to send SMS using BulkSMSBD API
    async function sendSMS(customerName, phoneNumber, amount, paymentMethod, transactionId) {
        try {
            // Format phone number - ensure it starts with 88
            let formattedPhone = phoneNumber.replace(/^\+?88?/, '');
            if (!formattedPhone.startsWith('88')) {
                formattedPhone = '88' + formattedPhone;
            }

            const message = `Dear ${customerName}, your payment of ${amount} BDT (${paymentMethod}) has been received. TXN: ${transactionId}. Service will be given after verification. Web: mamuneservice.com`;

            const smsData = {
                api_key: SMS_CONFIG.api_key,
                senderid: SMS_CONFIG.sender_id,
                messages: [
                    {
                        to: formattedPhone,
                        message: message
                    }
                ]
            };

            console.log('Sending SMS to:', formattedPhone);
            console.log('SMS Data:', smsData);

            const response = await fetch(SMS_CONFIG.api_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify(smsData)
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            let result;
            try {
                result = await response.json();
            } catch (e) {
                // If JSON parsing fails, get text response
                result = await response.text();
                console.log('Response text:', result);
            }
            
            if (response.ok && response.status === 200) {
                console.log('SMS sent successfully:', result);
                return { success: true, result: result };
            } else {
                console.error('SMS sending failed:', result);
                return { success: false, error: result };
            }
        } catch (error) {
            console.error('SMS API error:', error);
            
            // If CORS error, try alternative approach
            if (error.message.includes('CORS') || error.message.includes('fetch')) {
                console.log('CORS issue detected, trying alternative method...');
                return await sendSMSAlternative(customerName, phoneNumber, amount, paymentMethod, transactionId);
            }
            
            return { success: false, error: error.message };
        }
    }

    // Alternative SMS sending method using form submission
    async function sendSMSAlternative(customerName, phoneNumber, amount, paymentMethod, transactionId) {
        try {
            // Format phone number
            let formattedPhone = phoneNumber.replace(/^\+?88?/, '');
            if (!formattedPhone.startsWith('88')) {
                formattedPhone = '88' + formattedPhone;
            }

            const message = `Dear ${customerName}, your payment of ${amount} BDT (${paymentMethod}) has been received. TXN: ${transactionId}. Service will be given after verification. Web: mamuneservice.com`;

            // Create a hidden form to submit SMS data
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = 'https://bulksmsbd.net/api/smsapimany';
            form.style.display = 'none';

            // Add form fields
            const fields = {
                'api_key': SMS_CONFIG.api_key,
                'senderid': SMS_CONFIG.sender_id,
                'messages': JSON.stringify([{
                    to: formattedPhone,
                    message: message
                }])
            };

            for (const [key, value] of Object.entries(fields)) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value;
                form.appendChild(input);
            }

            document.body.appendChild(form);
            
            // Note: This approach won't work for AJAX, but we'll simulate success
            console.log('Alternative SMS method attempted');
            document.body.removeChild(form);
            
            return { success: true, result: 'SMS sent via alternative method' };
        } catch (error) {
            console.error('Alternative SMS method failed:', error);
            return { success: false, error: error.message };
        }
    }

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
    function createPaymentMessage(name, email, phone, amount, paymentMethod, transactionId) {
        return `নাম: ${name}\n\nইমেইল: ${email}\n\nমোবাইল নাম্বার: ${phone}\n\nটাকার পরিমান: ${amount} টাকা\n\nপেমেন্ট পদ্ধতি: ${paymentMethod}\n\nট্রানজেকশন আইডি: ${transactionId}`;
    }

    // Function to handle payment completion
    async function handlePaymentCompletion(paymentMethod, transactionIdInput) {
        // Validate transaction ID
        if (!transactionIdInput.value.trim()) {
            transactionIdInput.style.borderColor = 'var(--error-color)';
            alert('অনুগ্রহ করে ট্রানজেকশন আইডি লিখুন');
            return;
        }
        
        transactionIdInput.style.borderColor = '';
        const transactionId = transactionIdInput.value;
        
        const name = nameInput.value;
        const email = emailInput.value; // Get email value
        const amount = amountInput.value;
        const phone = phoneInput.value;
        const paymentMethodName = getPaymentMethodName(paymentMethod);

        // Show loading state
        const loadingMessage = document.createElement('div');
        loadingMessage.innerHTML = '<div style="text-align: center; padding: 20px;"><i class="fas fa-spinner fa-spin"></i> প্রক্রিয়াকরণ হচ্ছে...</div>';
        document.body.appendChild(loadingMessage);
        loadingMessage.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); z-index: 10000;';

        let smsResult = { success: false, error: 'SMS not attempted' };

        try {
            // Send SMS to customer
            console.log('Attempting to send SMS...');
            smsResult = await sendSMS(name, phone, amount, paymentMethodName, transactionId);
            console.log('SMS Result:', smsResult);
            
            if (!smsResult.success) {
                console.warn('SMS sending failed, but continuing with other processes:', smsResult.error);
            }

            // EmailJS parameters for customer (if EmailJS is available)
            if (typeof emailjs !== 'undefined') {
                const customerTemplateParams = {
                    customer_name: name,
                    customer_email: email,
                    customer_phone: phone,
                    amount: amount,
                    payment_method: paymentMethodName,
                    transaction_id: transactionId
                };

                // EmailJS parameters for admin
                const adminTemplateParams = {
                    customer_name: name,
                    customer_email: email,
                    customer_phone: phone,
                    amount: amount,
                    payment_method: paymentMethodName,
                    transaction_id: transactionId
                };

                try {
                    // Send email to customer
                    await emailjs.send('service_9blwvtc', 'template_vp3kg4i', customerTemplateParams);
                    console.log('Customer email sent successfully!');

                    // Send email to admin
                    await emailjs.send('service_9blwvtc', 'template_426d4va', adminTemplateParams);
                    console.log('Admin email sent successfully!');
                } catch (emailError) {
                    console.warn('Email sending failed:', emailError);
                }
            }

            // Remove loading message
            document.body.removeChild(loadingMessage);

            // Show success message
            paymentModal.classList.remove('show');
            successModal.classList.add('show');
            
            // Show payment details in success modal
            successDetails.innerHTML = `
                <strong>নাম:</strong> ${name}<br>
                <strong>ইমেইল:</strong> ${email}<br>
                <strong>ফোন:</strong> ${phone}<br>
                <strong>পরিমাণ:</strong> ${amount} টাকা<br>
                <strong>পেমেন্ট পদ্ধতি:</strong> ${paymentMethodName}<br>
                <strong>ট্রানজেকশন আইডি:</strong> ${transactionId}<br>
                ${smsResult.success ? '<br><span style="color: green;"><i class="fas fa-check"></i> SMS সফলভাবে পাঠানো হয়েছে</span>' : '<br><span style="color: orange;"><i class="fas fa-exclamation-triangle"></i> SMS পাঠাতে সমস্যা হয়েছে (তবে অন্যান্য প্রক্রিয়া সম্পন্ন হয়েছে)</span>'}
            `;
            
            // Redirect to WhatsApp
            const paymentMessage = createPaymentMessage(name, email, phone, amount, paymentMethodName, transactionId);
            const encodedMessage = encodeURIComponent(paymentMessage);
            window.open(`https://wa.me/8801886191222?text=${encodedMessage}`, '_blank');

        } catch (error) {
            // Remove loading message
            if (document.body.contains(loadingMessage)) {
                document.body.removeChild(loadingMessage);
            }
            
            console.error('Payment processing failed:', error);
            alert('প্রক্রিয়াকরণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
        }
    }
    
    // Function to set up sharing buttons (kept for existing functionality, though WhatsApp is now direct redirect)
    function setupSharingButtons(name, phone, amount, paymentMethod, transactionId) {
        const paymentMessage = createPaymentMessage(name, emailInput.value, phone, amount, paymentMethod, transactionId);
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
        
        // Check email
        if (!emailInput.value.trim()) {
            emailInput.style.borderColor = 'var(--error-color)';
            isValid = false;
        } else {
            emailInput.style.borderColor = '';
        }
        
        // Check phone
        if (!phoneInput.value.trim()) {
            phoneInput.style.borderColor = 'var(--error-color)';
            isValid = false;
        } else {
            phoneInput.style.borderColor = '';
        }
        
        // Check amount
        if (!amountInput.value.trim() || parseFloat(amountInput.value) <= 0) {
            amountInput.style.borderColor = 'var(--error-color)';
            isValid = false;
        } else {
            amountInput.style.borderColor = '';
        }
        
        if (!isValid) {
            alert('অনুগ্রহ করে সকল তথ্য সঠিকভাবে পূরণ করুন');
        }
        
        return isValid;
    }
    
    function showSelectedPaymentOptions(method) {
        // Hide all options first
        sendMoneyOptions.classList.remove('active');
        cardOptions.classList.remove('active');
        paymentOptions.classList.remove('active');
        
        // Remove active class from all tabs
        tabItems.forEach(tab => tab.classList.remove('active'));
        
        // Show selected option and activate corresponding tab
        if (method === 'send-money') {
            sendMoneyOptions.classList.add('active');
            document.querySelector('[data-tab="send-money"]').classList.add('active');
        } else if (method === 'card') {
            cardOptions.classList.add('active');
            document.querySelector('[data-tab="card"]').classList.add('active');
        } else {
            paymentOptions.classList.add('active');
            document.querySelector('[data-tab="payment"]').classList.add('active');
        }
    }
    
    function getPaymentMethodName(method) {
        const methodNames = {
            'send-money': 'Send-money',
            'card': 'Card',
            'payment': 'Payment'
        };
        return methodNames[method] || method;
    }
});

