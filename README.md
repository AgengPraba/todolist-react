TODOLIST APP

Aplikasi manajemen tugas todo list yang dibangun dengan React dan TypeScript. Aplikasi ini menyediakan antarmuka yang intuitif untuk menambah, mengedit, dan melacak status penyelesaian tugas Anda dengan penyimpanan data yang persisten di browser.


FITUR UTAMA

1. Manajemen Tugas Todo
   - Tambah todo baru dengan deskripsi tugas
   - Tandai tugas sebagai selesai atau belum selesai
   - Hapus tugas individual dari daftar
   - Validasi input untuk memastikan deskripsi tidak kosong

2. Sistem Filter Canggih
   - Tampilkan semua tugas (All)
   - Tampilkan hanya tugas yang belum selesai (Active)
   - Tampilkan hanya tugas yang sudah selesai (Completed)
   - Filter dapat diubah kapan saja tanpa kehilangan data

3. Manajemen Tugas Selesai
   - Tombol untuk menghapus semua tugas yang sudah selesai sekaligus
   - Hanya muncul ketika ada minimal satu tugas yang selesai
   - Operasi yang aman dengan konfirmasi visual

4. Penyimpanan Data Persisten
   - Semua tugas disimpan otomatis di localStorage browser
   - Data tetap tersimpan bahkan setelah menutup atau menyegarkan halaman
   - Penanganan error yang robust jika penyimpanan gagal

5. Interface Responsif
   - Desain yang bersih dan user-friendly
   - Input form dengan validasi real-time
   - Daftar tugas yang mudah dibaca
   - Kontrol filter yang jelas dan mudah diakses


INSTALASI

Prasyarat Sistem

Pastikan Anda telah menginstal:
- Node.js versi 16 atau lebih tinggi
- npm atau yarn sebagai package manager

Langkah Instalasi

1. Clone atau unduh proyek ini
   git clone <repository-url>
   cd todolist-app

2. Instal dependencies
   npm install

3. Jalankan aplikasi dalam mode development
   npm run dev

   Aplikasi akan tersedia di http://localhost:5173

4. Untuk membuat build production
   npm run build

5. Preview build production
   npm run preview


PERINTAH TERSEDIA

npm run dev
Menjalankan server development dengan HMR (Hot Module Replacement) untuk pengembangan yang cepat.

npm run build
Melakukan kompilasi TypeScript dan membuat bundle production yang dioptimalkan menggunakan Vite.

npm run lint
Menjalankan ESLint untuk memeriksa kualitas code dan mendeteksi potensi masalah.

npm run test
Menjalankan unit tests menggunakan Vitest dengan mode watch.

npm run test:ui
Menjalankan tests dengan antarmuka grafis Vitest UI untuk visualisasi yang lebih baik.

npm run preview
Menampilkan preview dari build production secara lokal sebelum deploy.


STRUKTUR FOLDER

src/
  App.tsx
    Komponen utama aplikasi yang mengelola state dan koordinasi antar komponen.
  
  App.css
    Styling untuk komponen utama aplikasi.

  main.tsx
    Entry point aplikasi React.

  index.css
    Styling global untuk seluruh aplikasi.

  components/
    Komponen React yang dapat digunakan kembali.
    
    TodoInputForm.tsx
      Form input untuk menambah tugas baru.
    
    TodoList.tsx
      Komponen untuk menampilkan daftar tugas.
    
    TodoItem.tsx
      Komponen individual todo dengan kontrol toggle dan delete.
    
    FilterControls.tsx
      Komponen untuk mengubah filter tampilan tugas.
    
    ClearCompletedButton.tsx
      Tombol untuk menghapus semua tugas yang selesai.
    
    [nama-komponen].css
      File styling untuk masing-masing komponen.
    
    [nama-komponen].test.tsx
      Unit tests untuk setiap komponen.

  store/
    TodoStore.ts
      Class untuk manajemen state aplikasi dan logika bisnis.
    
    TodoStore.test.ts
      Unit tests untuk TodoStore.

  repository/
    TodoRepository.ts
      Class untuk persistensi data ke localStorage.
    
    TodoRepository.test.ts
      Unit tests untuk TodoRepository.

  types/
    index.ts
      Definisi interface TypeScript untuk Todo dan Filter.
    
    index.test.ts
      Unit tests untuk type definitions.

  test/
    setup.ts
      Konfigurasi setup untuk testing environment.

  assets/
    File asset statis seperti gambar dan icon.

public/
  File publik yang dilayani tanpa diproses oleh Vite.
  
  favicon.svg
    Icon favorit aplikasi.
  
  icons.svg
    SVG icons yang digunakan di aplikasi.

Root Files

index.html
  Template HTML utama untuk aplikasi.

vite.config.ts
  Konfigurasi Vite untuk development dan build.

vitest.config.ts
  Konfigurasi Vitest untuk testing.

tsconfig.json
  Konfigurasi TypeScript umum.

tsconfig.app.json
  Konfigurasi TypeScript spesifik untuk aplikasi.

tsconfig.node.json
  Konfigurasi TypeScript untuk file konfigurasi Node.

eslint.config.js
  Konfigurasi ESLint untuk quality assurance code.

package.json
  Metadata proyek dan dependencies.

package-lock.json
  Lock file untuk reproducible builds.


TEKNOLOGI YANG DIGUNAKAN

Framework dan Library

React (19.2.6)
  Library JavaScript untuk membangun user interface dengan component-based architecture.

React DOM (19.2.6)
  Package untuk rendering React components ke DOM browser.

Build Tools

Vite (8.0.12)
  Build tool modern yang menyediakan fast development server dengan HMR.

Vitejs Plugin React (6.0.1)
  Plugin Vite untuk integrasi seamless dengan React menggunakan Oxc compiler.

Type Safety

TypeScript (6.0.2)
  Superset JavaScript yang menambahkan static type checking.

Testing

Vitest (4.1.8)
  Unit test framework yang cepat dan kompatibel dengan Vite.

Vitest UI (4.1.8)
  Graphical interface untuk Vitest untuk visualisasi test results.

Testing Library (16.3.2)
  Library untuk testing React components dengan focus pada user behavior.

Testing Library DOM (6.9.1)
  Library untuk assertions DOM dalam testing.

Testing Library User Event (14.6.1)
  Library untuk simulasi user interactions dalam tests.

Fast Check (4.8.0)
  Property-based testing library untuk comprehensive test coverage.

Fast Check Vitest (0.4.1)
  Integrasi Fast Check dengan Vitest.

Code Quality

ESLint (10.3.0)
  Linter untuk mengidentifikasi dan melaporkan code patterns yang problematis.

ESLint JS (10.0.1)
  Plugin ESLint untuk best practices JavaScript.

TypeScript ESLint (8.59.2)
  Plugin ESLint untuk TypeScript support.

React Hooks ESLint (7.1.1)
  Plugin ESLint untuk React Hooks best practices.

React Refresh ESLint (0.5.2)
  Plugin ESLint untuk Vite React Refresh integration.

Utilities

UUID (14.0.0)
  Library untuk generate unique identifiers untuk setiap todo.

JSDOM (29.1.1)
  JavaScript implementation dari DOM untuk testing environment.

Globals (17.6.0)
  ESLint config helper untuk global variables.

Development

Vite (8.0.12)
  Modern frontend build tool dan dev server.

Vite Plugin React (6.0.1)
  React plugin untuk Vite.

Vitejs Plugin React (6.0.1)
  Official React plugin untuk Vite.

Node Types (24.12.3)
  TypeScript type definitions untuk Node.js APIs.

React Types (19.2.14)
  TypeScript type definitions untuk React.

React DOM Types (19.2.3)
  TypeScript type definitions untuk React DOM.


CARA PENGGUNAAN

1. Menambah Todo Baru
   - Ketik deskripsi tugas di input form
   - Klik tombol "Add" atau tekan Enter
   - Tugas baru akan muncul di daftar

2. Menandai Tugas Selesai
   - Klik checkbox di sebelah tugas untuk tandai sebagai selesai
   - Tugas yang selesai akan ditampilkan dengan styling berbeda
   - Klik lagi untuk menandai sebagai belum selesai

3. Menghapus Tugas
   - Klik tombol hapus (delete icon) di sebelah tugas yang ingin dihapus
   - Tugas akan langsung dihapus dari daftar

4. Menggunakan Filter
   - Klik tab "All" untuk melihat semua tugas
   - Klik tab "Active" untuk melihat hanya tugas yang belum selesai
   - Klik tab "Completed" untuk melihat hanya tugas yang sudah selesai

5. Menghapus Semua Tugas Selesai
   - Klik tombol "Clear Completed" untuk menghapus semua tugas yang sudah selesai
   - Tombol ini hanya akan muncul ketika ada tugas yang selesai


STRUKTUR KOMPONEN

Arsitektur aplikasi mengikuti pola yang terstruktur:

App (Root Component)
  - Mengelola state global dengan React hooks
  - Mengoordinasikan komunikasi antar komponen
  - Mengelola TodoStore instance

TodoStore
  - Business logic untuk todo operations
  - Filter management
  - Komunikasi dengan TodoRepository

TodoRepository
  - Persistensi data ke localStorage
  - Serialization dan deserialization

UI Components
  - TodoInputForm: Input dan validasi tugas baru
  - TodoList: Container untuk daftar tugas
  - TodoItem: Item individual dengan kontrol
  - FilterControls: Kontrol untuk filter
  - ClearCompletedButton: Tombol untuk clear completed


TESTING

Aplikasi ini dilengkapi dengan comprehensive test suite menggunakan Vitest dan Testing Library.

Menjalankan Tests

npm run test
  Menjalankan semua tests dalam mode watch.

npm run test:ui
  Membuka Vitest UI untuk visualisasi tests.

Coverage Testing

Tests mencakup:
- Unit tests untuk komponen React
- Unit tests untuk business logic (TodoStore)
- Unit tests untuk persistensi (TodoRepository)
- Property-based tests untuk edge cases
- Type definitions tests


TROUBLESHOOTING

Masalah: Build gagal dengan error TypeScript

Solusi: Pastikan semua types sudah benar dengan menjalankan:
  npm run build

Masalah: Data tidak tersimpan setelah refresh

Solusi: Periksa bahwa localStorage tidak diblokir di browser settings. Lihat console untuk error messages.

Masalah: Tests gagal

Solusi: Pastikan dependencies terinstall dengan menjalankan:
  npm install
  npm run test


KONTRIBUSI

Untuk berkontribusi pada proyek ini:

1. Pastikan code mengikuti ESLint rules
   npm run lint

2. Jalankan tests untuk memastikan tidak ada regresi
   npm run test

3. Buat pull request dengan deskripsi yang jelas tentang perubahan


LISENSI

Proyek ini tersedia di bawah lisensi MIT. Silakan lihat file LICENSE untuk detail lebih lanjut.


INFORMASI TAMBAHAN

Development Server

Aplikasi menggunakan Vite dev server yang mendukung:
- Hot Module Replacement (HMR) untuk instant updates saat development
- Fast refresh untuk React components
- Instant server start

Build Output

Build production menghasilkan:
- Minimized dan optimized bundle
- Separated CSS file untuk better caching
- Source maps untuk debugging production issues

Browser Compatibility

Aplikasi kompatibel dengan semua modern browsers yang mendukung:
- ES2020 JavaScript features
- localStorage API
- Standard DOM APIs

# todolist-react
