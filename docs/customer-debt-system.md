# ProfitLeak Customer 360, Identity & Debt Operating System

## 1. Arxitektura va Asosiy Prinsiplar
ProfitLeak bu oddiy CRM yoki eslatma yuboruvchi bot emas. Bu supermarketlar, savdo markazlari va ko‘p filialli chakana savdo tarmoqlari uchun ishlab chiqilgan to‘liq huquqiy va moliyaviy **Customer Recovery & Debt Operating System** hisoblanadi.

Asosiy jarayon zanjiri:
```text
Customer
   ↓
Customer Identity (Encrypted & Masked)
   ↓
Tokenized Payment Method (Uzcard/Humo/Bank Vault)
   ↓
Payment Consent / Direct Debit Mandate
   ↓
POS Sale
   ↓
PAY LATER (1 daqiqa – 20 kun)
   ↓
Debt & Debt Ledger Entry (Double-Entry Record)
   ↓
Scheduled Payment (Server Authoritative UTC Due Time)
   ↓
Payment Engine (Idempotent Distributed Lock)
   ↓
Licensed Provider Adapter
   ↓
SUCCESS / FAILURE
   ↓
Debt Ledger Recalculation
   ↓
Stop Condition Trigger (Cancel reminders & future attempts)
```

---

## 2. Mijoz Modeli va Identifikatsiya
- **Asosiy Ma'lumotlar (`Customer`)**: Ism, familiya, telefon (+998 formatida normalizatsiyalangan), email, manzil, status (`ACTIVE`, `RESTRICTED`, `SUSPENDED`, `ARCHIVED`).
- **Moliya ko'rsatkichlari daxlsizligi**: `total_purchase_amount`, `current_debt_amount`, `overdue_debt_amount` kabi ko'rsatkichlar client yoki oddiy PATCH so'rov orqali o'zgartirilishi TAQIQLANADI. Ular faqatgina `DebtLedgerEntry` va `Sale` harakatlari asosida hisoblanadi.
- **Maxfiy Identifikatsiya (`CustomerIdentity`)**:
  - `pinfl_jshshir_encrypted`, `document_series_encrypted`, `document_number_encrypted`.
  - Cashier va oddiy foydalanuvchilar faqat niqoblangan ko'rinishda ko'radi: `***********42`, `AA *****21`.
  - To'liq ochish faqat `customer.sensitive.read` ruxsati va `CUSTOMER.SENSITIVE.VIEWED` audit yozuvi bilan amalga oshiriladi.

---

## 3. Plastik Karta Tokenizatsiyasi va Xavfsizlik
- **PCI-DSS va Bank Qoidasi**: ProfitLeak hech qachon o'z PostgreSQL bazasida CVV, PIN, To'liq karta raqami (PAN) yoki magnit lenta ma'lumotlarini saqlamaydi.
- Kartani bog'lash litsenziyalangan to'lov shlyuzlari (Uzcard, Humo, Payme, Click yoki Bank hamkori) orqali amalga oshiriladi.
- Tizimda faqatgina `provider_payment_method_reference` (karta tokeni) va `masked_pan` (`•••• 4821`) saqlanadi.

---

## 4. To'lov Mandati va Rozilik (Payment Consent)
Avtomatik to'lov yechish uchun mijozning rasmiy tasdiqlangan mandati talab qilinadi:
- `single_use`: Bir martalik belgilangan muddatli to'lov.
- `recurring`: Cheklangan takroriy to'lov.
- Kassirning bitta checkbox bosishi mijoz roziligi hisoblanmaydi; mijoz OTP SMS yoki rasmiy imzo orqali tasdiqlaydi.
- Audit voqealari: `CONSENT.CONFIRMED`, `CONSENT.REVOKED`, `CONSENT.USED`.

---

## 5. Kechiktirilgan To'lov Muddati: 1 daqiqadan 20 kungacha
- **Minimal muddat**: 60 soniya (1 daqiqa). 59 soniya kiritilsa backend qat'iy rad etadi.
- **Maksimal muddat**: 1,728,000 soniya (20 kun). 20 kundan ortiq muddat rad etiladi.
- **Server Vaqti Avtoriteti**: `due_at` mijoz yoki brauzer vaqtiga tayanmaydi. Serverning o'z UTC vaqti asosida aniqlanadi.

---

## 6. Debt va Double-entry Debt Ledger
- Har bir qarz uchun inson o'qiy oladigan raqam beriladi: `DEBT-2026-000184`.
- **DebtLedgerEntry** orqali barcha balans o'zgarishlari qayd etiladi:
  - `DEBT_CREATED`: Savdo paytida yozilgan qarz.
  - `PAYMENT`: To'liq to'lov.
  - `PARTIAL_PAYMENT`: Qisman to'lov (masalan 1,000,000 qarzdan 400,000 to'lansa, qoldiq 600,000).
- **Overpayment Guard**: To'lov summasi ochiq qarz qoldig'idan ortiq bo'lishi mumkin emas.

---

## 7. To'xtatish Sharti (Stop Condition)
Qarz to'liq to'langanda (`outstanding_amount == 0`):
- Barcha kelgusi rejalashtirilgan `ScheduledPayment` urinishlari zudlik bilan `CANCELLED` qilinadi.
- Eslatma xabarlari (SMS, Telegram, qo'ng'iroq) to'xtatiladi.
- Mijozga keraksiz qayta qo'ng'iroq yoki pul yechish urinishlari bo'lmaydi.
