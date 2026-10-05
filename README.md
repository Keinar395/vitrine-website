# Markasız Vitrin Şablonu (Hono.js)

Bu proje, yerel işletmelere satılmak üzere hazırlanmış, yüksek performanslı ve hafif bir Node.js/Hono.js vitrin web sitesi şablonudur.

## Kurulum
1. `npm install` komutu ile bağımlılıkları yükleyin.
2. `npm run dev` komutu ile geliştirme sunucusunu başlatın.
3. Tarayıcıda `http://localhost:3000` adresine gidin.

## Müşteriye Özel Özelleştirme
Tüm site tasarımını tek bir yerden yönetmek için `index.js` içindeki `config` objesini güncellemeniz yeterlidir:

```javascript
const config = {
  brandName: "THE KEBAP LAB",
  primaryColor: "#ef4444", 
  whatsappNumber: "905555555555",
  address: "Osmangazi, Bursa"
}
```
