import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function userProfileApiPlugin(): Plugin {
  // Authoritative in-memory state representing real authenticated user in database
  let currentUser = {
    id: "usr_abror_anvarjonov",
    first_name: "Abror",
    last_name: "Anvarjonov",
    middle_name: "G'ayrat o'g'li",
    display_name: "Abror Anvarjonov",
    email: "anvarjonov750@gmail.com",
    email_verified: true,
    email_verified_at: "2026-01-15T10:00:00Z",
    phone: "+998 90 750 12 34",
    phone_verified: true,
    phone_verified_at: "2026-01-15T10:05:00Z",
    secondary_phone: "+998 97 123 45 67",
    avatar_url: null as string | null,
    country: "O'zbekiston",
    region: "Toshkent",
    city: "Toshkent shahri",
    address: "Chilonzor tumani, Bunyodkor shoh ko'chasi 42-uy",
    preferred_language: "uz",
    timezone: "Asia/Tashkent",
    job_title: "Bosh Direktor (CEO & Founder)",
    department: "Rahbariyat / Boshqaruv Kengashi",
    bio: "ProfitLeak SaaS platformasi asoschisi va boshqaruv direktori. Chakana savdo tizimlari, moliyaviy oqimlar va AI arxitekturasi bo'yicha mas'ul.",
    role: "Bosh Direktor (Owner)",
    business_name: "ProfitLeak Retail Group",
    branch_name: "Toshkent Markaziy Filial",
    account_status: "ACTIVE",
    member_since: "2026-01-15",
    last_login_at: new Date().toISOString()
  };

  return {
    name: 'user-profile-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0];

        // 1. GET /api/v1/me
        if (url === '/api/v1/me' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          return res.end(JSON.stringify({ success: true, data: currentUser }));
        }

        // 2. PATCH /api/v1/me/profile
        if (url === '/api/v1/me/profile' && req.method === 'PATCH') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body || '{}');

              // Strict Mass Assignment Protection
              delete parsed.id;
              delete parsed.email; // Email changes require security re-authentication flow
              delete parsed.role;
              delete parsed.business_id;
              delete parsed.business_name;
              delete parsed.branch_name;
              delete parsed.is_admin;
              delete parsed.is_owner;
              delete parsed.account_status;
              delete parsed.email_verified;
              delete parsed.email_verified_at;
              delete parsed.phone_verified_at;

              // Validate phone
              if (parsed.phone && !/^\+?[0-9\s\-()]{7,20}$/.test(parsed.phone)) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({
                  success: false,
                  message: "Telefon raqami formati noto'g'ri (masalan: +998 90 750 12 34)."
                }));
              }

              currentUser = {
                ...currentUser,
                ...parsed,
                last_login_at: new Date().toISOString()
              };

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              return res.end(JSON.stringify({
                success: true,
                message: "Profil ma'lumotlari muvaffaqiyatli saqlandi.",
                data: currentUser
              }));
            } catch (err: any) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ success: false, message: "Yaroqsiz JSON ma'lumoti." }));
            }
          });
          return;
        }

        // 3. POST /api/v1/me/avatar
        if (url === '/api/v1/me/avatar' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const avatar = parsed.avatar_url || parsed.image_data;
              if (!avatar) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ success: false, message: "Rasm yuklanmadi." }));
              }
              currentUser.avatar_url = avatar;
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              return res.end(JSON.stringify({
                success: true,
                message: "Profil rasmi muvaffaqiyatli yangilandi.",
                data: { avatar_url: avatar }
              }));
            } catch (err: any) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ success: false, message: "Invalid payload." }));
            }
          });
          return;
        }

        // 4. DELETE /api/v1/me/avatar
        if (url === '/api/v1/me/avatar' && req.method === 'DELETE') {
          currentUser.avatar_url = null;
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          return res.end(JSON.stringify({
            success: true,
            message: "Profil rasmi olib tashlandi.",
            data: { avatar_url: null }
          }));
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), userProfileApiPlugin()],
  server: {
    port: 3000,
  },
  root: './',
});
