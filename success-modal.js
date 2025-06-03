// Success Modal JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Set up payment completion event handlers for all payment methods
    const completeSendMoneyBtn = document.getElementById('completeSendMoneyPayment');
    const completeCardBtn = document.getElementById('completeCardPayment');
    const completeDirectPaymentBtn = document.getElementById('completeDirectPayment');
    
    // Function to handle payment completion
    function handlePaymentCompletion(paymentMethod, transactionIdInput) {
        // Get transaction ID or generate a random one
        let transactionId = "Rf6uju";
        if (transactionIdInput && transactionIdInput.value.trim()) {
            transactionId = transactionIdInput.value;
        } else {
            transactionId = generateTransactionId();
        }
        
        // Get form values
        const name = document.getElementById('customerName')?.value || "Mohammad Mamunur Rashid";
        const phone = document.getElementById('customerPhone')?.value || "+8801886191222";
        const amount = document.getElementById('paymentAmount')?.value || "50";
        
        // Set values in success modal
        document.getElementById('successName').textContent = name;
        document.getElementById('successPhone').textContent = phone;
        document.getElementById('successAmount').textContent = amount + " টাকা";
        document.getElementById('successMethod').textContent = getPaymentMethodName(paymentMethod);
        document.getElementById('successTransactionId').textContent = transactionId;
        
        // Update share links with dynamic data
        updateShareLinks(name, phone, amount, getPaymentMethodName(paymentMethod), transactionId);
        
        // Hide payment modal
        const paymentModal = document.getElementById('paymentModal');
        if (paymentModal) {
            paymentModal.classList.remove('show');
        }
        
        // Show success modal
        const successModal = document.getElementById('successModal');
        if (successModal) {
            successModal.classList.add('show');
            document.body.style.overflow = 'hidden';
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
    if (completeCardBtn) {
        completeCardBtn.addEventListener('click', function() {
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
    const closeBtn = document.querySelector('.success-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            const successModal = document.getElementById('successModal');
            successModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Copy payment link function
    window.copyPaymentLink = function() {
        const tempInput = document.createElement('input');
        const shareText = `আমি সফলভাবে পেমেন্ট করেছি! নাম: ${document.getElementById('successName').textContent}, ফোন: ${document.getElementById('successPhone').textContent}, পরিমাণ: ${document.getElementById('successAmount').textContent}, ট্রানজেকশন আইডি: ${document.getElementById('successTransactionId').textContent}`;
        tempInput.value = shareText;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        
        alert('লিঙ্ক কপি করা হয়েছে!');
    };
});

// Function to generate a random transaction ID
function generateTransactionId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Function to get payment method name
function getPaymentMethodName(method) {
    switch(method) {
        case 'send-money':
            return 'Send Money';
        case 'payment':
            return 'Payment';
        case 'card':
            return 'Card';
        default:
            return method;
    }
}

// Function to update share links with dynamic data
function updateShareLinks(name, phone, amount, method, transactionId) {
    const shareText = `আমি সফলভাবে পেমেন্ট করেছি! নাম: ${name}, ফোন: ${phone}, পরিমাণ: ${amount}, মেথড: ${method}, ট্রানজেকশন আইডি: ${transactionId}`;
    const encodedShareText = encodeURIComponent(shareText);
    
    // Update WhatsApp share link
    const whatsappBtn = document.querySelector('.whatsapp-share-btn');
    if (whatsappBtn) {
        whatsappBtn.href = `whatsapp://send?text=${encodedShareText}`;
    }
    
    // Update Messenger share link
    const messengerBtn = document.querySelector('.messenger-btn');
    if (messengerBtn) {
        messengerBtn.href = `fb-messenger://share/?link=${encodeURIComponent(window.location.href)}&app_id=123456789&quote=${encodedShareText}`;
    }
    
    // Update IMO share link
    const imoBtn = document.querySelector('.imo-btn');
    if (imoBtn) {
        imoBtn.href = `imo://send?text=${encodedShareText}`;
    }
    
    // Update SMS share link
    const smsBtn = document.querySelector('.sms-btn');
    if (smsBtn) {
        smsBtn.href = `sms:?body=${encodedShareText}`;
    }
}
