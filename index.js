import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { html } from 'hono/html'
import { basicAuth } from 'hono/basic-auth'
import fs from 'fs'

const app = new Hono()

// --- MÜŞTERİ & SİSTEM AYARLARI ---
const config = {
  brandName: "THE KEBAP LAB",
  primaryColor: "#d97706",
  whatsappNumber: "905555555555",
  address: "Osmangazi, Bursa",
  heroImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1920&auto=format&fit=crop", 
}

// --- VERİTABANI (JSON) YÖNETİMİ ---
const DB_FILE = './menu.json'

// Dosya yoksa varsayılan menüyle oluştur
if (!fs.existsSync(DB_FILE)) {
  const defaultMenu = [
    { id: "1", category: "Öne Çıkan Lezzetler", name: "Özel Burger", desc: "180gr dana köfte, karamelize soğan...", price: "220" },
    { id: "2", category: "Öne Çıkan Lezzetler", name: "Tütsülenmiş Antrikot", desc: "Ağır ateşte pişmiş antrikot...", price: "450" }
  ]
  fs.writeFileSync(DB_FILE, JSON.stringify(defaultMenu, null, 2))
}

const getMenuData = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))
const saveMenuData = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))


// --- ORTAK HTML MİMARİSİ ---
const Layout = (props) => html`
  <!DOCTYPE html>
  <html lang="tr" class="scroll-smooth">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${props.title} | ${config.brandName}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
    <style>
      :root { --brand: ${config.primaryColor}; }
      body { font-family: 'Montserrat', sans-serif; background-color: #050505; color: #e5e5e5; }
      .font-serif { font-family: 'Playfair Display', serif; }
      .text-brand { color: var(--brand); }
      .bg-brand { background-color: var(--brand); }
      .glass-nav { background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
    </style>
  </head>
  <body class="flex flex-col min-h-screen">
    <header class="glass-nav fixed w-full top-0 z-50 border-b border-white/5 transition-all">
      <div class="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <a href="/#home" class="text-2xl font-serif font-bold tracking-[0.2em] text-white uppercase">${config.brandName}</a>
        <nav class="hidden md:flex space-x-8 text-xs font-semibold tracking-widest uppercase text-gray-300">
          <a href="/#home" class="hover:text-brand transition duration-300">Ana Sayfa</a>
          <a href="/menu" class="hover:text-brand transition duration-300">Menü</a>
          <a href="/#hakkimizda" class="hover:text-brand transition duration-300">Hakkımızda</a>
          <a href="/#iletisim" class="hover:text-brand transition duration-300">İletişim</a>
        </nav>
      </div>
    </header>
    <main class="flex-grow w-full">${props.children}</main>
    <footer class="bg-black text-gray-600 py-12 mt-auto border-t border-white/5 text-center text-xs tracking-widest uppercase">
      <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <p>&copy; ${new Date().getFullYear()} ${config.brandName}. Tüm hakları saklıdır.</p>
        <a href="/#gizlilik" class="mt-4 md:mt-0 hover:text-white transition">Gizlilik ve KVKK</a>
      </div>
    </footer>
  </body>
  </html>
`

// --- ANA SAYFA ROTALARI ---
app.get('/', (c) => {
  return c.html(Layout({
    title: 'Karşılama',
    children: html`
      <section id="home" class="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        <div class="absolute inset-0 z-0">
          <img src="${config.heroImage}" alt="Atmosfer" class="w-full h-full object-cover opacity-50" />
          <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-[#050505]"></div>
        </div>
        <div class="relative z-10 px-4 max-w-5xl mx-auto mt-20">
          <p class="text-brand font-semibold tracking-[0.4em] uppercase mb-6 text-xs md:text-sm">Şehrin En Keyifli Mola Alanı</p>
          <h1 class="text-5xl md:text-8xl font-serif font-bold text-white leading-tight mb-8 drop-shadow-2xl">
            LEZZET, SOHBET <br/><span class="italic font-light">&</span> ATMOSFER
          </h1>
          <div class="flex flex-col sm:flex-row justify-center gap-6 mt-12">
            <a href="/menu" class="bg-brand text-black px-10 py-4 font-bold tracking-[0.2em] text-xs uppercase hover:bg-white transition duration-300">Yemekleri Keşfet</a>
            <a href="#iletisim" class="border border-white/30 text-white px-10 py-4 font-bold tracking-[0.2em] text-xs uppercase hover:bg-white hover:text-black transition duration-300">Bize Ulaşın</a>
          </div>
        </div>
      </section>

      <section id="hakkimizda" class="pt-32 pb-20 px-4 max-w-4xl mx-auto text-center min-h-[70vh] flex flex-col justify-center">
        <h2 class="text-5xl font-serif font-bold text-white mb-8">Hikayemiz</h2>
        <div class="h-px w-24 bg-brand mx-auto mb-12"></div>
        <p class="text-gray-400 leading-loose text-lg font-light mb-8">Ateşin, kaliteli etin ve samimi sohbetin buluşma noktası...</p>
      </section>

      <section id="iletisim" class="pt-32 pb-20 px-4 max-w-5xl mx-auto min-h-[70vh] flex flex-col justify-center">
        <div class="text-center mb-16"><h2 class="text-5xl font-serif font-bold text-white mb-4">İletişim</h2><div class="h-px w-24 bg-brand mx-auto"></div></div>
        <div class="grid md:grid-cols-1 gap-12 text-center">
          <div class="bg-white/5 p-12 border border-white/10 backdrop-blur-sm mx-auto w-full max-w-md">
            <h3 class="text-2xl font-serif text-white mb-6">Bizi Ziyaret Edin</h3>
            <p class="text-gray-400 font-light leading-relaxed mb-8">${config.address}</p>
            <a href="https://wa.me/${config.whatsappNumber}" target="_blank" class="inline-block bg-brand text-black px-8 py-4 font-bold tracking-[0.2em] text-xs uppercase hover:bg-white transition duration-300">WhatsApp'tan Ulaşın</a>
          </div>
        </div>
      </section>
    `
  }))
})

// --- MÜŞTERİ MENÜSÜ (DİNAMİK) ---
app.get('/menu', (c) => {
  const menuData = getMenuData()
  
  // Kategorilere göre grupla
  const groupedMenu = menuData.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  return c.html(Layout({
    title: 'Menü',
    children: html`
      <div class="pt-32 pb-20 px-4 max-w-5xl mx-auto min-h-screen">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-serif font-bold text-white mb-4">Menümüz</h2>
          <div class="h-px w-24 bg-brand mx-auto"></div>
        </div>
        
        <div class="grid md:grid-cols-2 gap-12">
          ${Object.entries(groupedMenu).map(([category, items]) => html`
            <div>
              <h3 class="text-2xl font-serif italic text-brand mb-8 border-b border-white/10 pb-4">${category}</h3>${items.map(item => html`
                <div class="mb-8 group">
                  <div class="flex justify-between items-baseline mb-2">
                    <h4 class="text-lg font-bold text-white tracking-wide group-hover:text-brand transition">${item.name}</h4>
                    <div class="flex-grow border-b border-dotted border-gray-700 mx-4"></div>
                    <span class="text-xl font-serif text-brand">${item.price}₺</span>
                  </div>
                  <p class="text-sm text-gray-500 font-light">${item.desc}</p>
                </div>
              `)}
            </div>
          `)}
        </div>
      </div>
    `
  }))
})

// --- GİZLİ ADMİN PANELİ ---
app.use('/admin/*', basicAuth({ username: 'patron', password: '123' })) // PATRON GİRİŞ BİLGİLERİ

app.get('/admin', (c) => {
  const menuData = getMenuData()
  return c.html(`
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8"><title>Admin Paneli</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-100 p-8 font-sans">
      <div class="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <div class="flex justify-between items-center mb-8 border-b pb-4">
          <h1 class="text-3xl font-bold text-gray-800">Menü Yönetimi</h1>
          <a href="/menu" class="text-blue-500 hover:underline">Menüyü Gör &rarr;</a>
        </div>
        
        <!-- Ürün Ekleme Formu -->
        <form action="/admin/add" method="POST" class="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
          <h2 class="text-xl font-bold mb-4">Yeni Ürün Ekle</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required name="category" placeholder="Kategori (Örn: Tatlılar)" class="p-3 border rounded">
            <input required name="name" placeholder="Ürün Adı (Örn: Sufle)" class="p-3 border rounded">
            <input required name="price" type="number" placeholder="Fiyat (Örn: 150)" class="p-3 border rounded">
            <input name="desc" placeholder="İçerik Açıklaması (İsteğe bağlı)" class="p-3 border rounded">
          </div>
          <button type="submit" class="mt-4 bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 w-full">Kaydet ve Ekle</button>
        </form>

        <!-- Mevcut Ürünler Listesi -->
        <h2 class="text-xl font-bold mb-4">Mevcut Ürünler</h2>
        <div class="space-y-3">
          ${menuData.map(item => `
            <div class="flex justify-between items-center bg-white p-4 border rounded shadow-sm">
              <div>
                <span class="text-xs bg-gray-200 px-2 py-1 rounded text-gray-700 font-bold mr-2">${item.category}</span>
                <strong class="text-lg">${item.name}</strong> 
                <span class="text-gray-500 ml-2">- ${item.price}₺</span>
              </div>
              <form action="/admin/delete" method="POST">
                <input type="hidden" name="id" value="${item.id}">
                <button type="submit" class="text-red-500 font-bold hover:text-red-700 bg-red-50 px-3 py-1 rounded">Sil</button>
              </form>
            </div>
          `).join('')}
        </div>
      </div>
    </body>
    </html>
  `)
})

app.post('/admin/add', async (c) => {
  const body = await c.req.parseBody()
  const menuData = getMenuData()
  menuData.push({
    id: Date.now().toString(), // Benzersiz ID
    category: body.category,
    name: body.name,
    desc: body.desc,
    price: body.price
  })
  saveMenuData(menuData)
  return c.redirect('/admin')
})

app.post('/admin/delete', async (c) => {
  const body = await c.req.parseBody()
  let menuData = getMenuData()
  menuData = menuData.filter(item => item.id !== body.id)
  saveMenuData(menuData)
  return c.redirect('/admin')
})

const port = 3000
console.log(`Vitrin http://localhost:${port} adresinde çalışıyor...`)
serve({ fetch: app.fetch, port })