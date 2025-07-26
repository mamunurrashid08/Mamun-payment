// SMS Configuration File
// Update these values with your actual SMS API credentials

const SMS_CONFIG = {
    // Primary SMS API Configuration
    primary: {
        api_key: "YOUR_PRIMARY_API_KEY_HERE", // Replace with your actual API key
        callerID: "Mamun eSvc",
        api_url: "https://bulksmsdhaka.com/api/sendtext"
    },
    
    // Backup SMS API Configuration
    backup: {
        api_key: "YOUR_BACKUP_API_KEY_HERE", // Replace with your backup API key
        callerID: "Mamun eSvc", 
        api_url: "https://bulksmsbd.com/api/sendtext"
    },
    
    // Alternative SMS API Configuration
    alternative: {
        api_key: "YOUR_ALTERNATIVE_API_KEY_HERE", // Replace with alternative API key
        callerID: "Mamun eSvc",
        api_url: "https://bulksms.com/api/sendtext"
    }
};

// SMS Message Templates
const SMS_TEMPLATES = {
    payment_confirmation: (customerName, amount, paymentMethod, transactionId) => 
        `Dear ${customerName}, your payment of ${amount} BDT (${paymentMethod}) has been received. TXN: ${transactionId}. Service will be given after verification. Web: mamuneservice.com`,
    
    payment_received: (customerName, amount, paymentMethod, transactionId) =>
        `Hello ${customerName}, payment of ${amount} BDT via ${paymentMethod} received. Transaction ID: ${transactionId}. We will contact you soon. - Mamun eService`,
    
    simple_confirmation: (customerName, amount, transactionId) =>
        `Payment received: ${amount} BDT. TXN: ${transactionId}. Thank you ${customerName}. - Mamun eService`
};

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SMS_CONFIG, SMS_TEMPLATES };
}