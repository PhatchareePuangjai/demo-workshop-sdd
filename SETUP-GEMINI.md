# ตั้งค่า Gemini CLI (ทางเลือกแทน Claude Code)

คู่มือนี้สำหรับใครที่**อยากใช้ Gemini แทน Claude Code** ในการรันคำสั่ง Spec Kit (`/speckit.specify`, `/speckit.plan`, ...)
ไม่บังคับ — ถ้าใช้ Claude Code + OpenRouter อยู่แล้วตาม [`SETUP-OPENROUTER.md`](SETUP-OPENROUTER.md) ไม่ต้องทำตามนี้ก็ได้

**ใช้ได้ทั้ง Windows, macOS และ Linux**

> อ้างอิง: [Gemini CLI — GitHub](https://github.com/google-gemini/gemini-cli) · [Google AI Studio — API keys](https://aistudio.google.com/apikey)

---

## ขั้นตอนที่ 1 — ติดตั้ง Gemini CLI

ต้องมี Node.js 20 ขึ้นไปก่อน เช็กด้วย:

```bash
node --version
```

จากนั้นติดตั้ง (ใช้ได้ทุก OS):

```bash
npm install -g @google/gemini-cli
```

> อย่าใช้ `sudo npm install -g` บน macOS/Linux เด็ดขาด จะเกิดปัญหาสิทธิ์ไฟล์ตามมา

### เช็กว่าติดตั้งสำเร็จ

```bash
gemini --version
```

ต้องขึ้นเลขเวอร์ชัน ถ้าขึ้น `command not found` ให้**ปิด terminal แล้วเปิดใหม่**ก่อน

---

## ขั้นตอนที่ 2 — รับ / สร้าง Gemini API key

1. เข้า https://aistudio.google.com/apikey (ล็อกอินด้วยบัญชี Google)
2. กด **Create API key**
3. คัดลอกค่าที่ขึ้นต้นด้วย `AIza...` เก็บไว้

> ฟรีมี rate limit จำกัดต่อวัน/ต่อนาที ถ้าเจอ error 429 ให้รอสักครู่แล้วลองใหม่

---

## ขั้นตอนที่ 3 — สร้างไฟล์ `.env` ที่ root โปรเจกต์

Gemini CLI จะอ่านไฟล์ `.env` ที่ root ของโปรเจกต์อัตโนมัติ (ไฟล์นี้ถูกกัน push ขึ้น git ไว้แล้วใน `.gitignore`)

### ✅ วิธี A: สร้างผ่าน VS Code (แนะนำ)

1. เปิดโฟลเดอร์โปรเจกต์ใน VS Code ต้องเห็น `index.html` อยู่ในรายการไฟล์
2. คลิกขวาบนพื้นที่ว่างในแถบไฟล์ด้านซ้าย → **New File** → ตั้งชื่อว่า `.env` (ที่ root เดียวกับ `index.html` **ไม่ใช่**ในโฟลเดอร์ `.claude` หรือ `.gemini`)
3. วางบรรทัดนี้ลงไปแล้ว **Ctrl+S** (Mac: **Cmd+S**)

```
GEMINI_API_KEY=AIzaเปลี่ยนเป็น-key-ของคุณ
```

### วิธี B: สร้างผ่าน terminal

**🪟 Windows (PowerShell):**

```powershell
"GEMINI_API_KEY=AIzaเปลี่ยนเป็น-key-ของคุณ" | Set-Content -Encoding utf8 .env
```

**🍎 macOS / 🐧 Linux / Git Bash:**

```bash
cat > .env <<'ENV'
GEMINI_API_KEY=AIzaเปลี่ยนเป็น-key-ของคุณ
ENV
```

จากนั้นเปิดไฟล์ใน VS Code แล้วเปลี่ยนเป็น key จริงของตัวเอง

> ห้ามใส่เครื่องหมาย `"` ครอบค่าใน `.env` และห้ามมีช่องว่างรอบ `=`

---

## ขั้นตอนที่ 4 — เปิด Gemini CLI จากโฟลเดอร์โปรเจกต์

```bash
cd demo-workshop-sdd   # หรือ path ที่ clone ไว้
gemini
```

> ต้องเปิดจาก**โฟลเดอร์โปรเจกต์**เท่านั้น (เห็น `index.html`, `.env` อยู่ในโฟลเดอร์เดียวกัน) ไม่งั้น CLI จะไม่เห็นทั้ง `.env` และคำสั่ง `/speckit.*`

ครั้งแรกที่เปิด ถ้า CLI ถามวิธี auth ให้เลือก **"Use Gemini API key"** (ไม่ใช่ "Login with Google") เพราะเราตั้งค่าไว้ผ่าน `.env`

---

## ขั้นตอนที่ 5 — ตรวจว่าใช้งานได้จริง

ในหน้า Gemini CLI ลองพิมพ์:

```
/speckit.plan
```

> คำสั่ง Spec Kit บน Gemini CLI ใช้ **จุด** คั่น ไม่ใช่ขีด เช่น `/speckit.specify`, `/speckit.tasks` (ต่างจาก Claude Code ที่ใช้ `/speckit-specify`)

ถ้าสั่งงานได้โดยไม่ error แปลว่าเชื่อม key สำเร็จ

---

## แก้ปัญหาที่เจอบ่อย

| อาการ | สาเหตุ / วิธีแก้ |
|---|---|
| `gemini: command not found` | ยังไม่ได้ปิด-เปิด terminal ใหม่หลังติดตั้ง หรือ npm global bin ไม่อยู่ใน PATH |
| ขึ้น error 401 / `API key not valid` | key พิมพ์ผิด หรือไฟล์ `.env` ไม่ได้อยู่ที่ root โปรเจกต์ |
| CLI ถาม Login with Google ทุกครั้ง ไม่ยอมใช้ key | ตอน auth เลือกผิดวิธี ให้รัน `gemini` แล้วเลือก **"Use Gemini API key"** ใหม่ (ใน CLI พิมพ์ `/auth` เพื่อเปลี่ยนวิธี auth ได้) |
| ขึ้น error 429 / quota exceeded | Free tier ของ Gemini API มี limit ต่อวัน/ต่อนาที รอสักครู่แล้วลองใหม่ |
| พิมพ์ `/speckit-plan` (ขีด) แล้วหาไม่เจอ | บน Gemini CLI ต้องใช้จุด: `/speckit.plan` |
| แก้ `.env` แล้วไม่มีผล | ต้องปิด Gemini CLI แล้วเปิดใหม่ (`gemini`) ทุกครั้งที่แก้ `.env` |

---

## เช็กลิสต์ก่อนเริ่ม workshop

- [ ] `gemini --version` ขึ้นเลขเวอร์ชัน
- [ ] มีไฟล์ `.env` ที่ root โปรเจกต์ (ข้าง `index.html`) พร้อม `GEMINI_API_KEY=...`
- [ ] `gemini` เปิดจากโฟลเดอร์โปรเจกต์แล้วสั่ง `/speckit.plan` ได้โดยไม่ error
- [ ] `git status` **ไม่มี** `.env` โผล่ในลิสต์

---
