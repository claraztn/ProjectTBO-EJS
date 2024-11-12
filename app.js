//  Nama        : Clara Zita Nabilla
//  NIM         : 24060122130057
//  Nama File   : app.js
//  Deskripsi   : Berisi regex dan validasi email beserta nomor telepon

const express = require('express'); // Mengimpor modul Express untuk membuat aplikasi web
const app = express();              // Membuat aplikasi Express
const port = 3000;                  // Menentukan port tempat server akan berjalan

// Set mesin template untuk merender file EJS
app.set('view engine', 'ejs');

// Menyajikan file statis dari folder 'public' (CSS, gambar, dll.)
app.use(express.static('public'));

// Middleware untuk menguraikan data form yang dikirim melalui POST (dalam bentuk URL-encoded)
app.use(express.urlencoded({ extended: true }));

// Render halaman utama (GET request ke root '/')
app.get('/', (req, res) => {
    // Merender halaman 'index.ejs' dengan parameter default (kosong dan tidak ada error atau success)
    res.render('index', { username: '', email: '', phone: '', error: null, success: null });
});

// POST request ke '/greet' saat form dikirim
app.post('/greet', (req, res) => {
    // Mengambil data yang dikirimkan dari form (username, email, dan phone)
    const { username, email, phone } = req.body;  
    
    // Ekspresi reguler untuk validasi email, nomor telepon, dan username
    const emailRegex = /^(?!.*\.\.)(?!.*\.-)(?!.*-\.)(?!^\.)(?!^-)(?!.*\+\+)([a-zA-Z0-9._%+-]+[a-zA-Z0-9])(?<!\.)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^(\+62|62|0)[\s-]?8[0-9]{1}\d{1}[\s-]?\d{4}[\s-]?\d{2,5}$/;
    const usernameRegex = /^[a-zA-Z ]+$/;

    // Objek untuk menyimpan pesan error
    let error = {
        username: null,
        email: null,
        phone: null
    };

    // Validasi username: harus diisi dan hanya boleh terdiri dari huruf dan spasi
    if (!username || !usernameRegex.test(username)) {
        if (!username) {
            error.username = "Nama harus diisi!";  // Jika username kosong
        } else {
            error.username = "Nama hanya boleh terdiri dari huruf!";  // Jika username mengandung karakter tidak valid
        }
    }

    // Validasi email: harus diisi, mengandung '@' dan '.', serta sesuai dengan format yang benar
    if (!email) {
        error.email = "Email harus diisi!";  
    } else if (!email.includes('@')) {
        error.email = "Email harus mengandung '@'!";  
    } else if (!email.includes('.')) {
        error.email = "Email harus mengandung domain (misalnya '.com')!";  
    } else if (!emailRegex.test(email)) {
        error.email = "Format email tidak valid!";  
    }

    // Validasi nomor telepon: harus diisi, terdiri dari 10-14 digit, dan dimulai dengan +62, 62, atau 0
    if (!phone) {
        error.phone = "Nomor telepon harus diisi!";  
    } else if (phone.length < 10) {
        error.phone = "Nomor telepon terlalu pendek! Harus minimal 10 digit.";  
    } else if (phone.length > 14) {
        error.phone = "Nomor telepon terlalu panjang! Harus maksimal 14 digit.";  
    } else if (!phone.startsWith('+62') && !phone.startsWith('62') && !phone.startsWith('0')) {
        error.phone = "Nomor telepon harus diawali dengan +62, 6 2, atau 0!";  
    } else if (!phoneRegex.test(phone)) {
        error.phone = "Format nomor telepon tidak valid!";  
    }

    // Mengecek apakah ada error
    if (error.username || error.email || error.phone) {
        res.render('index', { username, email, phone, error, success: null });
    } else {
        res.render('index', { username, email, phone, error: null, success: true });
    }
});

// Menjalankan server di port yang ditentukan
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
