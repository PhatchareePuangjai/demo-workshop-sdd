# ตั้งค่า Claude Code ให้ใช้ OpenRouter

คู่มือนี้ทำให้ทุกเครื่องในห้อง workshop ใช้ Claude Code ผ่าน OpenRouter
โดย**ใส่ key ไว้ในไฟล์ของโปรเจกต์** (`.claude/settings.local.json`) ไม่ต้องไปแก้ตัวแปรระบบของแต่ละเครื่อง

**ใช้ได้ทั้ง Windows, macOS และ Linux**

> อ้างอิง: [OpenRouter — Claude Code Integration](https://openrouter.ai/docs/cookbook/coding-agents/claude-code-integration) · [Claude Code — Advanced setup](https://code.claude.com/docs/en/setup)

---

## ขั้นตอนที่ 1 — ติดตั้ง Claude Code

เลือกคำสั่งตามเครื่องของตัวเอง

### 🪟 Windows

**วิธีดูว่าตอนนี้อยู่ PowerShell หรือ CMD**: ดูที่หน้าบรรทัดพิมพ์คำสั่ง
ถ้าขึ้นต้นด้วย `PS C:\...` = **PowerShell** / ถ้าขึ้น `C:\...` เฉย ๆ = **CMD**

**PowerShell** (แนะนำ — เปิดจาก Start menu พิมพ์ว่า PowerShell):

```powershell
irm https://claude.ai/install.ps1 | iex
```

**CMD:**

```batch
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

> ถ้าขึ้น error `The token '&&' is not a valid statement separator` แปลว่าอยู่ใน PowerShell แต่ใช้คำสั่งของ CMD
> ถ้าขึ้น `'irm' is not recognized...` แปลว่าอยู่ใน CMD แต่ใช้คำสั่งของ PowerShell

**ไม่ต้องเปิดเป็น Administrator**

### 🍎 macOS / 🐧 Linux / WSL

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

### ทางเลือกอื่น (ทุก OS)

```bash
# ต้องมี Node.js 22 ขึ้นไป
npm install -g @anthropic-ai/claude-code
```

```powershell
# Windows ที่มี winget
winget install Anthropic.ClaudeCode
```

> อย่าใช้ `sudo npm install -g` เด็ดขาด จะเกิดปัญหาสิทธิ์ไฟล์ตามมา

### เช็กว่าติดตั้งสำเร็จ

```bash
claude --version
```

ต้องขึ้นเลขเวอร์ชัน เช่น `2.1.211 (Claude Code)` ถ้าขึ้น `command not found` ให้ **ปิด terminal แล้วเปิดใหม่** ก่อน (ตัวติดตั้งเพิ่ง set PATH ให้)

---

## ขั้นตอนที่ 2 — รับ API key

วันงาน workshop จะมี key (ขึ้นต้นด้วย `sk-or-v1-...`) แจกให้ ไม่ต้องสมัครหรือสร้างเอง รับมาแล้วเก็บไว้ ไปใช้ในขั้นตอนที่ 3 ได้เลย

> **Note: ถ้าอยากสร้าง key เอง**
> 1. สมัคร / ล็อกอินที่ https://openrouter.ai
> 2. ไปที่ https://openrouter.ai/keys แล้วกด **Create Key**
> 3. คัดลอกค่าที่ขึ้นต้นด้วย `sk-or-v1-...` เก็บไว้ (หน้าเว็บจะโชว์ให้ครั้งเดียว)

---

## ขั้นตอนที่ 3 — สร้างไฟล์ `.claude/settings.local.json`

### ✅ วิธี A: สร้างผ่าน VS Code (แนะนำ — ทำเหมือนกันทุก OS)

1. เปิดโฟลเดอร์โปรเจกต์ใน VS Code (**File → Open Folder**) ต้องเห็น `index.html` อยู่ในรายการไฟล์
2. ที่แถบไฟล์ด้านซ้าย คลิกขวาบนพื้นที่ว่าง → **New Folder** → ตั้งชื่อว่า `.claude`
   (ถ้ามีโฟลเดอร์ `.claude` อยู่แล้ว ข้ามไปข้อ 3 ได้เลย)
3. คลิกขวาที่โฟลเดอร์ `.claude` → **New File** → ตั้งชื่อว่า `settings.local.json`
4. วางเนื้อหานี้ลงไปแล้ว **Ctrl+S** (Mac: **Cmd+S**)

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://openrouter.ai/api",
    "ANTHROPIC_AUTH_TOKEN": "sk-or-v1-เปลี่ยนเป็น-key-ของคุณ",
    "ANTHROPIC_API_KEY": "",
    "CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY": "1"
  }
}
```

5. เปลี่ยน `sk-or-v1-เปลี่ยนเป็น-key-ของคุณ` เป็น key จริงของตัวเอง (ต้องมีเครื่องหมาย `"` ครอบไว้)

> ถ้า VS Code ขีดเส้นหยักแดงตรงไหน แปลว่า JSON พิมพ์ผิด ให้แก้ก่อนบันทึก

### วิธี B: สร้างผ่าน terminal

**🪟 Windows (PowerShell):**

```powershell
New-Item -ItemType Directory -Force -Path .claude | Out-Null
@'
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://openrouter.ai/api",
    "ANTHROPIC_AUTH_TOKEN": "sk-or-v1-เปลี่ยนเป็น-key-ของคุณ",
    "ANTHROPIC_API_KEY": "",
    "CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY": "1"
  }
}
'@ | Set-Content -Encoding utf8 .claude/settings.local.json
```

**🍎 macOS / 🐧 Linux / Git Bash:**

```bash
mkdir -p .claude
cat > .claude/settings.local.json <<'JSON'
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://openrouter.ai/api",
    "ANTHROPIC_AUTH_TOKEN": "sk-or-v1-เปลี่ยนเป็น-key-ของคุณ",
    "ANTHROPIC_API_KEY": "",
    "CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY": "1"
  }
}
JSON
```

จากนั้นเปิดไฟล์ใน VS Code แล้วเปลี่ยนเป็น key จริงของตัวเอง

### คำอธิบายแต่ละค่า

| ค่า | ทำอะไร |
|---|---|
| `ANTHROPIC_BASE_URL` | ชี้ให้ Claude Code ยิงไปที่ OpenRouter แทน Anthropic |
| `ANTHROPIC_AUTH_TOKEN` | key ของ OpenRouter ที่ใช้ยืนยันตัวตน |
| `ANTHROPIC_API_KEY` | **ต้องเป็นค่าว่าง `""`** ถ้าไม่ว่าง Claude Code จะไปใช้ key เดิมของ Anthropic แทน |
| `CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY` | ให้ดึงรายชื่อโมเดลจาก gateway ได้ (ใส่ไว้ดีกว่า) |

### ⚠️ ถ้าไฟล์นี้มีอยู่แล้ว

Claude Code ใช้ไฟล์นี้เก็บ permission ที่เคยกดอนุญาตไว้ด้วย ถ้าเปิดมาแล้วเจอแบบนี้อยู่ก่อน:

```json
{
  "permissions": {
    "allow": ["Bash(git status)"]
  }
}
```

อย่าเขียนทับทิ้ง ให้**เพิ่ม `"env"` เข้าไปเป็น key เข้าไป**:

```json
{
  "permissions": {
    "allow": ["Bash(git status)"]
  },
  "env": {
    "ANTHROPIC_BASE_URL": "https://openrouter.ai/api",
    "ANTHROPIC_AUTH_TOKEN": "sk-or-v1-เปลี่ยนเป็น-key-ของคุณ",
    "ANTHROPIC_API_KEY": "",
    "CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY": "1"
  }
}
```

> อย่าลืมใส่ `,` คั่นระหว่าง block และห้ามมีคอมเมนต์ `//` ในไฟล์ JSON

---

## ขั้นตอนที่ 4 — ล้าง login เดิมแล้วเปิดใหม่

ถ้าเคยล็อกอิน Claude Code ด้วยบัญชี Anthropic มาก่อน ต้องล้างทิ้งก่อน ไม่งั้นมันจะใช้ของเดิม:

```
> /logout
```

จากนั้น**ปิด Claude Code ให้สนิทแล้วเปิดใหม่จากโฟลเดอร์โปรเจกต์**

**🪟 Windows:**

```powershell
cd C:\Users\ชื่อผู้ใช้\Documents\demo-workshop-sdd
claude
```

**🍎 macOS / 🐧 Linux:**

```bash
cd ~/Documents/demo-workshop-sdd
claude
```

> ต้องเปิด `claude` จาก**โฟลเดอร์โปรเจกต์** เท่านั้น เพราะไฟล์ตั้งค่าเป็นแบบ project-level
> ถ้าเปิดจากโฟลเดอร์อื่น มันจะไม่เห็นไฟล์นี้

**ทางลัดที่ง่ายที่สุด**: เปิดโฟลเดอร์ใน VS Code แล้วกด **Ctrl+`** (Mac: **Ctrl+`**) เพื่อเปิด terminal
VS Code จะพาไปอยู่ที่โฟลเดอร์โปรเจกต์ให้อัตโนมัติ แล้วค่อยพิมพ์ `claude`

---

## ขั้นตอนที่ 5 — ตรวจว่าใช้ OpenRouter จริง

พิมพ์ใน Claude Code:

```
> /status
```

ต้องเห็นประมาณนี้:

```
Auth token: ANTHROPIC_AUTH_TOKEN
Anthropic base URL: https://openrouter.ai/api
```

ถ้าอยากดูละเอียดกว่านั้น ออกจาก Claude Code แล้วรัน (ใช้ได้ทุก OS):

```bash
claude doctor
```

คำสั่งนี้จะบอกว่าไฟล์ settings อ่านผ่านไหม มี error ตรงไหน โดยไม่ต้องเริ่ม session

สุดท้าย ลองสั่งงานอะไรสักอย่าง แล้วเช็กว่ามียอดใช้งานเข้าที่ https://openrouter.ai/activity

---

## แก้ปัญหาที่เจอบ่อย

| อาการ | สาเหตุ / วิธีแก้ |
|---|---|
| `claude: command not found` / `'claude' is not recognized` | ยังไม่ได้ปิด-เปิด terminal ใหม่หลังติดตั้ง |
| `/status` ยังขึ้น base URL ของ Anthropic | ยังไม่ได้ปิด-เปิด Claude Code ใหม่ หรือเปิด `claude` จากโฟลเดอร์อื่นที่ไม่ใช่ root ของโปรเจกต์ |
| ขึ้น error 401 / invalid API key | key ผิด หรือ `ANTHROPIC_API_KEY` ไม่ได้เป็น `""` |
| ยังใช้บัญชี Anthropic เดิมอยู่ | ยังไม่ได้ `/logout` แล้วเปิดใหม่ |
| แก้ไฟล์แล้วไม่มีผล | JSON พิมพ์ผิด (ลืม `,` / มีคอมเมนต์ / วงเล็บไม่ครบ) — ลองรัน `claude doctor` จะบอกจุดที่ผิด |
| 🪟 `The token '&&' is not a valid statement separator` | อยู่ใน PowerShell แต่ใช้คำสั่งของ CMD |
| 🪟 `'irm' is not recognized...` | อยู่ใน CMD แต่ใช้คำสั่งของ PowerShell |
| 🪟 สร้างโฟลเดอร์ `.claude` ใน File Explorer ไม่ได้ | Windows ไม่ให้ตั้งชื่อขึ้นต้นด้วยจุดผ่าน Explorer — ให้สร้างผ่าน VS Code (วิธี A) หรือ terminal (วิธี B) แทน |
| 🪟 มองไม่เห็นโฟลเดอร์ `.claude` | เป็นโฟลเดอร์ซ่อน — ใน File Explorer ไปที่ View → Show → Hidden items (VS Code เห็นอยู่แล้ว) |
| วางค่าใน `.env` แล้วไม่ทำงาน | Claude Code แบบ native install **ไม่อ่าน `.env`** ต้องใช้ `.claude/settings.local.json` เท่านั้น |
| ใช้วิธี export ตัวแปรใน shell profile แล้ว token ว่าง | ลำดับบรรทัดผิด — ถ้า `ANTHROPIC_AUTH_TOKEN` อ้าง `OPENROUTER_API_KEY` ที่ประกาศทีหลัง ค่าจะกลายเป็นว่าง (อีกเหตุผลที่คู่มือนี้เลือกใช้ไฟล์โปรเจกต์แทน) |

---

## เช็กลิสต์ก่อนเริ่ม workshop

- [ ] `claude --version` ขึ้นเลขเวอร์ชัน
- [ ] `/status` ขึ้น `https://openrouter.ai/api`
- [ ] มียอดใช้งานขึ้นที่หน้า OpenRouter Activity
- [ ] `git status` **ไม่มี** `.claude/settings.local.json` โผล่ในลิสต์

---
