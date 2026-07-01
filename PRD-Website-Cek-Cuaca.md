# Product Requirements Document (PRD)
# WeatherNow — Website Cek Cuaca

**Versi Dokumen:** 1.0
**Tanggal:** 1 Juli 2026
**Dibuat oleh:** Liipp (Alif Fajdhan Yudhistiro)
**Tech Stack:** Next.js 14+ (App Router), Tailwind CSS, TypeScript

---

## 1. Ringkasan Produk

WeatherNow adalah aplikasi web pengecekan cuaca modern yang memberikan informasi cuaca real-time, prakiraan harian/mingguan, serta data lingkungan pendukung (kualitas udara, indeks UV) dengan antarmuka yang bersih, cepat, dan nyaman digunakan di berbagai perangkat.

### 1.1 Latar Belakang
Banyak aplikasi cuaca yang ada terasa penuh iklan, berat, atau desainnya ketinggalan zaman. WeatherNow hadir sebagai alternatif yang ringan, cepat (server-side rendering via Next.js), dan estetis dengan pendekatan desain minimalis-modern.

### 1.2 Tujuan Produk
- Menyediakan informasi cuaca akurat dan real-time untuk lokasi mana pun di dunia.
- Memberikan pengalaman visual yang menyenangkan dan mudah dipahami (data-driven UI).
- Menjadi portofolio teknis yang menunjukkan kemampuan fullstack (Next.js, API integration, state management, responsive design).

### 1.3 Target Pengguna
| Persona | Kebutuhan |
|---|---|
| Pengguna umum | Cek cuaca harian dengan cepat sebelum beraktivitas |
| Traveler | Cek cuaca beberapa kota sekaligus (multi-lokasi) |
| Petani/outdoor worker | Info detail seperti curah hujan, kecepatan angin, UV index |
| Recruiter/reviewer portofolio | Menilai kualitas kode & desain UI/UX Liipp |

---

## 2. Fitur Utama

### 2.1 Fitur Inti (Must Have — MVP)

1. **Cuaca Saat Ini (Current Weather)**
   - Suhu, kondisi cuaca (cerah/hujan/berawan, dst), ikon dinamis
   - "Terasa seperti" (feels like), kelembapan, kecepatan angin, tekanan udara
   - Waktu update terakhir

2. **Pencarian Lokasi**
   - Search bar dengan autocomplete nama kota (debounced input)
   - Deteksi lokasi otomatis via Geolocation API (dengan izin pengguna)

3. **Prakiraan Per Jam (Hourly Forecast)**
   - Scroll horizontal 24 jam ke depan, dengan ikon & suhu tiap jam

4. **Prakiraan 7 Hari (Daily Forecast)**
   - Suhu min/max per hari, ikon kondisi, ringkasan singkat

5. **Toggle Satuan**
   - Celsius ↔ Fahrenheit
   - km/h ↔ mph untuk kecepatan angin

6. **Dark Mode / Light Mode**
   - Toggle manual + deteksi preferensi sistem otomatis

7. **Responsive Design**
   - Optimal di mobile, tablet, dan desktop

### 2.2 Fitur Tambahan (Should Have)

8. **Lokasi Favorit / Tersimpan**
   - Simpan beberapa kota (localStorage), akses cepat lewat dropdown/list

9. **Indeks UV & Kualitas Udara (AQI)**
   - Skala visual (warna) dengan keterangan tingkat risiko

10. **Peringatan Cuaca Ekstrem (Weather Alerts)**
    - Banner notifikasi jika ada potensi badai, hujan lebat, dll (jika API mendukung)

11. **Peta Cuaca Interaktif (Weather Map)**
    - Lapisan curah hujan/awan menggunakan Leaflet/Mapbox

12. **Background Dinamis**
    - Gradasi warna/animasi latar menyesuaikan kondisi cuaca & waktu (siang/malam)

### 2.3 Fitur Nice to Have (Could Have)

13. **Perbandingan Cuaca Multi-Kota** (grid card beberapa kota sekaligus)
14. **Grafik Tren Suhu Mingguan** (chart.js/recharts)
15. **Rekomendasi Aktivitas** ("Cocok untuk lari pagi", "Bawa payung", dst — berbasis rule sederhana)
16. **PWA Support** (installable, offline fallback dengan data cache terakhir)
17. **Share Cuaca** (generate gambar/kartu cuaca untuk dibagikan ke sosial media)

---

## 3. Desain & UI/UX

### 3.1 Prinsip Desain
- **Clean & Minimalis** — banyak whitespace, hierarki tipografi jelas
- **Data-first** — angka dan kondisi cuaca jadi fokus utama, bukan dekorasi berlebihan
- **Micro-interaction halus** — transisi ikon, hover state, loading skeleton (bukan spinner polos)
- **Konsisten** — spacing & radius mengikuti design token yang seragam

### 3.2 Palet Warna (disesuaikan kondisi cuaca)
| Kondisi | Warna Aksen | Contoh |
|---|---|---|
| Cerah | Sky Blue → Amber | `#3B82F6` → `#FBBF24` |
| Berawan | Slate/Gray-blue | `#64748B` |
| Hujan | Deep Blue/Indigo | `#4338CA` |
| Malam hari | Navy/Indigo gelap | `#1E1B4B` |
| Netral (UI dasar) | Slate/Zinc + Putih | `#0F172A`, `#F8FAFC` |

> Catatan: Warna aksen bersifat dinamis mengikuti cuaca, sementara warna UI dasar (teks, card, border) tetap konsisten dari design system agar tetap "clean".

### 3.3 Tipografi
- Font: **Inter** atau **Geist** (font modern, legible, cocok untuk data numerik)
- Hierarki: Suhu utama (48–72px, bold) → Judul lokasi (24px, semibold) → Body/label (14–16px, regular)

### 3.4 Komponen UI Utama
- `SearchBar` dengan autocomplete
- `CurrentWeatherCard` (hero section)
- `HourlyForecastScroll`
- `DailyForecastList`
- `WeatherDetailGrid` (humidity, wind, pressure, UV, AQI dalam grid card kecil)
- `UnitToggle`
- `ThemeToggle`
- `FavoriteLocationChips`
- `LoadingSkeleton` & `ErrorState`

### 3.5 Referensi Layout
- Hero section besar di atas: lokasi, suhu, ikon, kondisi
- Section horizontal scroll: prakiraan per jam
- Section grid/list: prakiraan 7 hari
- Section grid kecil: detail cuaca tambahan (kelembapan, angin, UV, AQI, tekanan, visibility)

---

## 4. Spesifikasi Teknis

### 4.1 Tech Stack
| Layer | Teknologi |
|---|---|
| Framework | Next.js 14+ (App Router, Server Components) |
| Styling | Tailwind CSS |
| Bahasa | TypeScript |
| State Management | React Context / Zustand (untuk unit, tema, favorit) |
| Data Fetching | Next.js Server Actions / Route Handlers + SWR atau React Query |
| Ikon | Lucide Icons / custom weather icon set (animasi opsional dengan Lottie) |
| Chart (opsional) | Recharts |
| Peta (opsional) | Leaflet.js / React-Leaflet |
| Penyimpanan lokal | localStorage (favorit, preferensi unit & tema) |

### 4.2 Sumber Data (Weather API)
Rekomendasi salah satu:
- **OpenWeatherMap API** (gratis dengan limit, data lengkap: current, forecast, AQI, UV)
- **WeatherAPI.com** (gratis, mudah dipakai, ada alert & astro data)
- **Open-Meteo** (gratis tanpa API key, cocok untuk MVP cepat)

> Saran: mulai dengan **Open-Meteo** untuk development cepat tanpa perlu API key, lalu bisa upgrade ke OpenWeatherMap/WeatherAPI jika butuh fitur AQI & alert yang lebih lengkap.

### 4.3 Struktur Halaman (Routes)
```
/                     → Home (cuaca lokasi default/terakhir)
/search               → Hasil pencarian kota (opsional, bisa modal saja)
/location/[city]      → Detail cuaca kota tertentu
/favorites            → Daftar lokasi tersimpan
```

### 4.4 Non-Functional Requirements
- **Performa:** First Contentful Paint < 1.5s, gunakan caching API response (revalidate berkala)
- **SEO:** Metadata dinamis per lokasi (title: "Cuaca di [Kota] Hari Ini")
- **Aksesibilitas:** Kontras warna sesuai WCAG AA, alt text pada ikon cuaca, keyboard navigable
- **Error Handling:** Fallback UI jika API gagal / lokasi tidak ditemukan / izin geolocation ditolak
- **Skalabilitas kode:** Struktur folder modular (`components/`, `lib/`, `hooks/`, `types/`)

---

## 5. User Flow Singkat

1. Pengguna membuka website → diminta izin lokasi (atau lihat lokasi default)
2. Data cuaca current + forecast dimuat otomatis
3. Pengguna bisa cari kota lain via search bar
4. Pengguna bisa toggle unit (°C/°F), toggle dark mode
5. Pengguna bisa simpan kota ke favorit untuk akses cepat berikutnya

---

## 6. Metrik Keberhasilan (Opsional untuk Portofolio)
- Lighthouse Performance Score ≥ 90
- Responsive sempurna di 3 breakpoint utama (mobile, tablet, desktop)
- Load time API < 1 detik (dengan caching)
- UI mendapat kesan "modern & clean" saat direview (portofolio value)

---

## 7. Roadmap Pengembangan (Saran Tahapan)

| Tahap | Fitur |
|---|---|
| **Tahap 1 (MVP)** | Current weather, search, hourly + daily forecast, responsive, dark mode |
| **Tahap 2** | Favorit lokasi, UV/AQI, unit toggle, background dinamis |
| **Tahap 3** | Weather alerts, peta interaktif, grafik tren |
| **Tahap 4 (Polish)** | PWA, share cuaca, animasi Lottie, optimasi performa |

---

## 8. Catatan Tambahan
- Struktur PRD ini bisa disesuaikan jika ingin menambahkan branding pribadi (misal warna aksen khas Liipp) pada elemen UI non-cuaca seperti navbar/footer.
- Siap dilanjutkan ke tahap pembuatan wireframe/Figma atau langsung vibe coding ke Next.js jika diperlukan.
