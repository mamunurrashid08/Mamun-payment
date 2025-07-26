# SMS API Setup Guide - Mamun Service

## সমস্যা সমাধান (Problem Solved)

আপনার পেমেন্ট সিস্টেমে SMS অটোমেটিক যাচ্ছিল না কারণ:

1. **ভুল API URL**: `https://bulksmsdhaka.com/api/sendtext` এর পরিবর্তে `https://bulksmsdhaka.com/smsapi` ব্যবহার করতে হবে
2. **ভুল Parameter Names**: API documentation অনুযায়ী সঠিক parameter names ব্যবহার করা হয়নি
3. **CORS Issues**: Browser থেকে direct API call CORS error দিচ্ছিল
4. **Request Method**: POST method এর পরিবর্তে GET method প্রয়োজন হতে পারে

## যা ঠিক করা হয়েছে (What Has Been Fixed)

### 1. SMS Configuration Updated
```javascript
const SMS_CONFIG = {
    api_key: "c628f3e6ea38ae7892cebc1a4f09647a719964b1",
    sender_id: "Mamun eSvc",
    api_url: "https://bulksmsdhaka.com/smsapi"
};
```

### 2. Correct API Parameters
- `api_key`: Your API key
- `type`: "text"
- `contacts`: Phone number (88XXXXXXXXXX format)
- `senderid`: Sender ID
- `msg`: Message content

### 3. Multiple Fallback Methods
1. **Primary**: PHP script (`send_sms.php`) to avoid CORS
2. **Secondary**: Direct API call
3. **Tertiary**: GET method fallback

### 4. Phone Number Formatting
- Automatically adds `88` prefix for Bangladesh numbers
- Handles various input formats (+88, 88, 01)

## ফাইল তালিকা (Files Added/Modified)

### নতুন ফাইল (New Files):
- `send_sms.php` - Server-side SMS handler
- `test_sms.php` - SMS testing interface
- `.htaccess` - Server configuration
- `SMS_SETUP_README.md` - This guide

### পরিবর্তিত ফাইল (Modified Files):
- `script.js` - Updated SMS functions

## কিভাবে টেস্ট করবেন (How to Test)

### 1. SMS Test Page
Browse to: `test_sms.php`

এই পেজে:
- আপনার ফোন নাম্বার দিন
- একটি test message লিখুন
- "SMS পাঠান" বাটনে ক্লিক করুন

### 2. Payment System Test
1. আপনার main payment page এ যান
2. একটি test payment করুন
3. Payment complete করার পর SMS যাওয়ার কথা

## সম্ভাব্য সমস্যা ও সমাধান (Troubleshooting)

### 1. PHP Support
যদি PHP কাজ না করে:
- নিশ্চিত করুন যে আপনার hosting PHP support করে
- `.htaccess` file properly configured আছে কিনা চেক করুন

### 2. API Key Issues
যদি API key কাজ না করে:
- BulkSMSBD তে login করে API key verify করুন
- Balance আছে কিনা চেক করুন
- Sender ID approve আছে কিনা দেখুন

### 3. CORS Errors
যদি এখনও CORS error আসে:
- Server headers properly set আছে কিনা চেক করুন
- Browser console এ error দেখুন

### 4. Phone Number Format
নিশ্চিত করুন:
- Bangladesh number format: 88XXXXXXXXXX
- 11 digit number (01 দিয়ে শুরু)

## API Documentation

### BulkSMSBD Parameters:
```
POST https://bulksmsdhaka.com/smsapi

Parameters:
- api_key: Your API key
- type: "text"
- contacts: 88XXXXXXXXXX
- senderid: Approved sender ID
- msg: Message content
```

### Response Format:
Success response usually contains:
- "success" keyword
- "sent" keyword
- Status code 200

## যোগাযোগ (Contact)

যদি এখনও সমস্যা হয়:
1. Browser console এ error messages দেখুন
2. `test_sms.php` দিয়ে test করুন
3. BulkSMSBD support এর সাথে যোগাযোগ করুন

## Technical Details

### Security Features:
- CORS headers properly configured
- Input validation for phone numbers
- Error handling for API failures
- Multiple fallback methods

### Performance:
- Asynchronous SMS sending
- Non-blocking payment process
- Fallback mechanisms for reliability

---

## Quick Start Checklist:

- [ ] Upload all files to your server
- [ ] Ensure PHP is enabled
- [ ] Test with `test_sms.php`
- [ ] Verify API key and balance
- [ ] Test full payment flow
- [ ] Check browser console for errors

**SMS should now work automatically after payment completion!**