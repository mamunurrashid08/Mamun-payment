# SMS সেটআপ গাইড - Mamun eService

## সমস্যা সমাধান

আপনার পেমেন্ট সিস্টেমে SMS না যাওয়ার কারণ এবং সমাধান:

### ১. API Key সমস্যা
- আপনার বর্তমান API key expired হয়ে গেছে
- নতুন API key নিতে হবে

### ২. CORS সমস্যা
- Browser থেকে direct API call করা যাচ্ছে না
- Server-side solution প্রয়োজন

## সমাধান

### ধাপ ১: নতুন SMS API Key নিন
1. https://bulksmsdhaka.com এ যান
2. নতুন account খুলুন
3. API key নিন
4. `sms-config.js` ফাইলে API key আপডেট করুন

### ধাপ ২: API Key আপডেট করুন
`sms-config.js` ফাইলে এই লাইনগুলো পরিবর্তন করুন:

```javascript
const SMS_CONFIG = {
    primary: {
        api_key: "YOUR_NEW_API_KEY_HERE", // এখানে নতুন API key দিন
        callerID: "Mamun eSvc",
        api_url: "https://bulksmsdhaka.com/api/sendtext"
    },
    // ... অন্যান্য কনফিগারেশন
};
```

### ধাপ ৩: SMS টেস্ট করুন
1. ওয়েবসাইটে যান
2. নিচের ডান দিকে "SMS টেস্ট" বাটনে ক্লিক করুন
3. আপনার ফোনে SMS আসে কিনা দেখুন

### ধাপ ৪: Production এ ব্যবহার
টেস্ট সফল হলে, টেস্ট বাটন সরিয়ে দিন:

```html
<!-- এই অংশটি সরিয়ে দিন -->
<div style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;">
    <button id="testSMS">...</button>
</div>
```

## বিকল্প সমাধান

### ১. Server-side SMS API
যদি client-side SMS কাজ না করে, server-side solution ব্যবহার করুন:

```javascript
// Server-side SMS endpoint
app.post('/api/send-sms', async (req, res) => {
    const { phone, message } = req.body;
    // SMS sending logic here
});
```

### ২. WhatsApp Business API
SMS এর পরিবর্তে WhatsApp Business API ব্যবহার করুন:

```javascript
// WhatsApp API integration
const whatsappMessage = `Payment received: ${amount} BDT. TXN: ${transactionId}`;
// Send via WhatsApp Business API
```

### ৩. Email Notification
SMS এর পাশাপাশি email notification যোগ করুন:

```javascript
// Email notification
const emailData = {
    to: customerEmail,
    subject: "Payment Confirmation",
    body: `Your payment of ${amount} BDT has been received.`
};
```

## ট্রাবলশুটিং

### SMS না যাওয়ার কারণ:
1. **API Key ভুল**: নতুন API key নিন
2. **Network Error**: Internet connection চেক করুন
3. **CORS Error**: Server-side solution ব্যবহার করুন
4. **Phone Number Format**: 88 prefix যোগ করুন

### ডিবাগিং:
1. Browser console খুলুন (F12)
2. Network tab এ দেখুন API call হচ্ছে কিনা
3. Console এ error message দেখুন

## যোগাযোগ
যদি সমস্যা থাকে:
- WhatsApp: 01886191222
- Email: mamun1k999@gmail.com
- Website: mamuneservice.com

---
*এই গাইডটি আপনার SMS সিস্টেম ঠিক করার জন্য তৈরি করা হয়েছে।*