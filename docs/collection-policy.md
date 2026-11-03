# ProfitLeak Debt Collection & Reminder Policy

## 1. Muloqot Siyosati va Odob Qoidalari
ProfitLeak mijozlar bilan munosabatlarda tajovuzkor bo'lmagan, qonuniy va axloqiy muloqot tizimiga amal qiladi.

- **Tungi Sokinlik Vaqti (Quiet Hours)**:
  - 21:00 dan 09:00 gacha avtomatik qo'ng'iroqlar, SMS va eslatmalar qat'iyan taqiqlanadi.
- **Kunlik Muloqot Cheklovi (Daily Contact Cap)**:
  - Bir kunda bitta mijoz bilan ko'pi bilan 3 marta aloqa o'rnatilishi mumkin (`max_contacts_per_day = 3`).
- **Subyektiv Baholar Taqiqlanadi**:
  - Tizimda "yomon mijoz" yoki "ishonchsiz" degan his-tuyg'uli tamg'alar qo'yilmaydi.
  - Xavf darajasi faqat aniq faktlar (kechikkan kunlar soni, to'lovlar intizomi) bilan asoslanadi.

---

## 2. Eslatma Kampaniyalari Rejasi
1. **Pre-Due Eslatmasi**:
   - Agar qarz muddati 3 kundan ortiq bo'lsa, to'lov kunidan 3 kun oldin eslatma yuborilishi mumkin.
   - 5 daqiqalik yoki 1 kunlik qarzlar uchun 3 kunlik pre-due ishlatilmaydi; muddatga mos oqilona shart tanlanadi.
2. **To'lov Kuni (Due Day)**:
   - To'lov muddati yaqinlashganda eslatma va avto-to'lov haqida xabarnoma.
3. **Muddati O'tgan (Overdue)**:
   - Agar kartadan avtomatik pul yechishda mablag' yetarli bo'lmasa (`INSUFFICIENT_FUNDS`), qarz o'chirilmaydi, status `PAYMENT_FAILED` va keyinchalik `OVERDUE` ga o'tadi.

---

## 3. "Men To'laganman" Da'volari
- Agar mijoz "Men to'lab bo'lganman" deb murojaat qilsa, operator yoki AI qarzni darhol o'chirib yubormaydi.
- `PaymentVerificationTask` ochiladi va mas'ul buxgalter tekshiruviga yuboriladi.

---

## 4. To'lov Yopilgandagi Zudlik bilan To'xtatish
- Qarz to'liq to'langan zahoti barcha kelgusi qo'ng'iroqlar, SMSlar va rejalashtirilgan to'lovlar zudlik bilan to'xtatiladi.
