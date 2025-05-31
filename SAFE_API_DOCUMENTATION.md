# Chronos Vault API Documentation - النسخة الآمنة للنشر

## تكوين API الإنتاجي

```json
{
  "base_url": "https://api.chronosvault.com/v1",
  "authentication": {
    "type": "Bearer Token",
    "header": "Authorization: Bearer [YOUR_API_KEY]"
  },
  "headers": {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-API-Version": "1.0"
  }
}
```

## نقاط النهاية الرئيسية

### إدارة المحافظ
```bash
# تسجيل محفظة جديدة
POST /wallet/register
Content-Type: application/json
Authorization: Bearer [YOUR_API_KEY]

{
  "wallet_address": "0x...",
  "chain": "ethereum|solana|ton"
}
```

### عمليات الخزائن
```bash
# إنشاء خزينة جديدة
POST /vault/create
Authorization: Bearer [YOUR_API_KEY]

{
  "vault_type": "personal|multi_signature|geo_restricted",
  "unlock_time": "2025-12-31T23:59:59Z",
  "security_level": "basic|standard|advanced"
}
```

### الأمان والتحقق
```bash
# التحقق من المعاملة
POST /transaction/verify
Authorization: Bearer [YOUR_API_KEY]

{
  "transaction_hash": "0x...",
  "chain": "ethereum|solana|ton"
}
```

## الحصول على مفتاح API

1. قم بالتسجيل في منصة Chronos Vault
2. انتقل إلى إعدادات المطور
3. أنشئ مفتاح API جديد
4. احفظ المفتاح في مكان آمن

## معدلات الحد الأقصى

- **الطلبات العادية**: 1000 طلب/دقيقة
- **عمليات الخزائن**: 100 طلب/ساعة
- **العمليات عبر السلاسل**: 50 طلب/ساعة

## رموز الاستجابة

- `200`: نجح الطلب
- `400`: خطأ في البيانات المرسلة
- `401`: غير مصرح - تحقق من مفتاح API
- `429`: تجاوز الحد الأقصى للطلبات
- `500`: خطأ داخلي في الخادم

## أمثلة الاستخدام

### JavaScript/Node.js
```javascript
const response = await fetch('https://api.chronosvault.com/v1/vault/status', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});
```

### Python
```python
import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://api.chronosvault.com/v1/vault/status',
    headers=headers
)
```

### cURL
```bash
curl -X GET \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  "https://api.chronosvault.com/v1/vault/status"
```

---

**تحذير هام**: 
- لا تشارك مفتاح API الخاص بك مع أي شخص
- احفظ المفتاح في متغيرات البيئة وليس في الكود
- راقب استخدام API بانتظام للتأكد من عدم وجود نشاط مشبوه