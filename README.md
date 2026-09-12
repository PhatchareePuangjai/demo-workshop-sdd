# demo-workshop-sdd

Workshop: Spec-Driven Development (SDD) — แต่ละกลุ่มทำงานบน branch ของตัวเอง แล้วได้ URL preview อัตโนมัติจาก Vercel

- Repo: https://github.com/PhatchareePuangjai/demo-workshop-sdd
- **โจทย์ของกลุ่ม**: [`specs/โจทย์/team-<เลขกลุ่ม>.md`](specs/โจทย์/)
- **กติกาโปรเจกต์ (ต้องอ่าน)**: [`.specify/memory/constitution.md`](.specify/memory/constitution.md)

> ทุกกลุ่มเริ่มจาก **base template** ชุดเดียวกันที่ root (`index.html`, `style.css`, `app.js`)
> แล้วแก้ไฟล์เดิมเหล่านั้นให้ตรงกับโจทย์ของกลุ่ม — ไม่ต้องสร้างไฟล์ใหม่

---

## ขั้นตอนสำหรับนักศึกษา

### 0. เตรียมตัว (ทำครั้งเดียว)

ตรวจว่ามี git แล้ว และตั้งชื่อ/อีเมลของตัวเองไว้:

```bash
git --version
git config --global user.name "ชื่อ นามสกุล"
git config --global user.email "อีเมลที่ใช้กับ GitHub"
```

### 1. Clone repo ลงเครื่อง

```bash
git clone https://github.com/PhatchareePuangjai/demo-workshop-sdd.git
cd demo-workshop-sdd
```

ถ้า clone ไว้แล้ว ให้ดึงของใหม่ก่อนเริ่มงานทุกครั้ง:

```bash
git checkout main
git pull origin main
```

### 2. แตก branch ของกลุ่มตัวเอง

**แต่ละกลุ่มมี branch ของตัวเอง 1 branch เท่านั้น** ชื่อ branch ตามหมายเลขกลุ่ม `team-1` ถึง `team-12`

```bash
# ตัวอย่าง: กลุ่มที่ 1
git checkout main
git pull origin main
git checkout -b team-1
```

เปลี่ยน `team-1` เป็นเลขกลุ่มของตัวเอง:

| กลุ่ม | ชื่อ branch | กลุ่ม | ชื่อ branch |
|---|---|---|---|
| กลุ่ม 1 | `team-1` | กลุ่ม 7 | `team-7` |
| กลุ่ม 2 | `team-2` | กลุ่ม 8 | `team-8` |
| กลุ่ม 3 | `team-3` | กลุ่ม 9 | `team-9` |
| กลุ่ม 4 | `team-4` | กลุ่ม 10 | `team-10` |
| กลุ่ม 5 | `team-5` | กลุ่ม 11 | `team-11` |
| กลุ่ม 6 | `team-6` | กลุ่ม 12 | `team-12` |

> ⚠️ ห้ามตั้งชื่ออื่น เช่น `Team-1`, `team_1`, `team1`, `team-1-final` — Vercel จะสร้าง URL ตามชื่อ branch ตรง ๆ

เช็กว่าตอนนี้อยู่ branch ถูกต้องหรือยัง:

```bash
git branch --show-current   # ต้องได้ team-<เลขกลุ่ม>
```

ถ้าเพื่อนในกลุ่มแตก branch ไปแล้ว คนที่เหลือใช้คำสั่งนี้แทน (ไม่ต้อง `-b`):

```bash
git fetch origin
git checkout team-1
```

### 3. Push branch ขึ้น GitHub ครั้งแรก

```bash
git push -u origin team-1
```

หลังจากครั้งแรกแล้ว push ครั้งต่อไปใช้แค่ `git push`

### 4. อ่านโจทย์ของกลุ่ม

โจทย์ของแต่ละกลุ่มอยู่ที่ `specs/โจทย์/team-<เลขกลุ่ม>.md` เช่นกลุ่ม 3 อ่านที่ [`specs/โจทย์/team-3.md`](specs/โจทย์/team-3.md)

- อ่านให้จบทั้งไฟล์ก่อนเริ่มเขียนโค้ด โดยเฉพาะหัวข้อ **User Capabilities** และ **Edge Cases**
- **ทำเฉพาะโจทย์ของกลุ่มตัวเอง** ห้ามหยิบฟีเจอร์จากโจทย์กลุ่มอื่นมาทำเพิ่ม
- ทุกบรรทัดที่เขียนต้องอ้างกลับไปที่ข้อใดข้อหนึ่งในโจทย์ได้ (constitution ข้อ V — Traceability)

### 5. ลงมือแก้ base template

ที่ root ของ repo มีไฟล์ตั้งต้นให้แล้ว 3 ไฟล์ **ให้แก้ไฟล์เดิมเหล่านี้ ไม่ต้องสร้างไฟล์ใหม่**:

| ไฟล์ | หน้าที่ |
|---|---|
| `index.html` | โครงหน้าเว็บ (ฟอร์มเพิ่ม → สรุปตัวเลข → ตัวกรอง → ลิสต์ → empty state) |
| `style.css` | สไตล์กลาง |
| `app.js` | `state` เดียวเป็นแหล่งความจริง + โหลด/บันทึก `localStorage` + `render()` |

ในไฟล์จะมีคอมเมนต์ `TODO` กำกับไว้ทุกจุดที่ต้องแก้ **ต้องจัดการ `TODO` ให้หมดทุกอัน** — ทำตามโจทย์ หรือถ้าโจทย์ไม่ต้องการส่วนนั้น ให้ลบทิ้งไปเลย (อย่าปล่อยไว้ว่าง ๆ)

กติกาสำคัญจาก constitution:

- ใช้ HTML / CSS / JavaScript ล้วน ๆ เท่านั้น (ไม่มี framework, ไม่มี build step, ไม่มี npm)
- เก็บข้อมูลด้วย `localStorage` เท่านั้น — ห้ามมี backend, API, หรือ `fetch` ออกนอกเครื่อง
- ไม่มีระบบ login / สมัครสมาชิก
- **`index.html` ต้องอยู่ root ของ repo** ห้ามย้ายเข้าโฟลเดอร์ย่อย, `style.css` / `app.js` วางระดับเดียวกัน
- ขอบเขตงานต้องทำเสร็จได้ใน **75 นาที** ถ้าทำท่าจะไม่ทัน ให้ตัดสโคปตามที่โจทย์อนุญาต

**Shared Interface** — ควรคง id หลักเหล่านี้ไว้ เพื่อให้ `app.js` กับ `index.html` อ้างถึงกันตรงกัน:

`#item-form` · `#form-error` · `#summary-text` · `#filter-section` · `#item-list` · `#empty-state`

เพิ่ม id ใหม่ได้ถ้าโจทย์ต้องการ แต่ห้ามทำทางเก็บ/วาดข้อมูลซ้ำซ้อนขึ้นมาอีกชุด และให้ `render()` เป็นฟังก์ชันเดียวที่เขียน DOM

ทดสอบในเครื่องก่อน push:

```bash
python3 -m http.server 8000
# เปิดเบราว์เซอร์ไปที่ http://localhost:8000
```

### 6. Commit และ push

```bash
git add .
git commit -m "อธิบายสั้น ๆ ว่าทำอะไร"
git push
```

แนะนำให้ commit ย่อย ๆ บ่อย ๆ ไม่ต้องรอทำเสร็จหมดแล้วค่อย commit ทีเดียว

### 7. เปิดดู URL preview ของกลุ่ม

ทุกครั้งที่ `git push` Vercel จะ deploy ให้อัตโนมัติ ไม่ต้องกดอะไรเพิ่ม:

```
demo-workshop-sdd-git-team-1-<scope>.vercel.app
```

เช่น กลุ่ม 3 push ขึ้น branch `team-3` → `demo-workshop-sdd-git-team-3-<scope>.vercel.app`

URL จะอัปเดตตาม commit ล่าสุดของ branch นั้นเสมอ (รอประมาณ 1-2 นาทีหลัง push)

---

## ใช้ Spec Kit ช่วยทำงาน

repo นี้ติดตั้ง [Spec Kit](https://github.com/github/spec-kit) ไว้แล้ว ใช้สั่งงาน AI assistant ให้ทำตามขั้นตอน SDD ได้ ลำดับหลักคือ:

| คำสั่ง (Claude Code) | ทำอะไร |
|---|---|
| `/speckit-specify` | ร่าง spec จากคำอธิบายฟีเจอร์แบบภาษาคน |
| `/speckit-clarify` | ถามกลับจุดที่ spec ยังกำกวม แล้วเติมคำตอบกลับเข้า spec |
| `/speckit-plan` | วางแผนการ implement จาก spec |
| `/speckit-tasks` | แตกเป็น task ย่อยเรียงตามลำดับ dependency |
| `/speckit-implement` | ลงมือเขียนโค้ดตาม tasks |
| `/speckit-analyze` | ตรวจความสอดคล้องระหว่าง spec / plan / tasks |
| `/speckit-constitution` | อัปเดตกติกาโปรเจกต์ |

> ใช้ Gemini CLI ให้เปลี่ยนขีดเป็นจุด เช่น `/speckit.specify`
> โจทย์ของ workshop นี้เตรียม spec มาให้แล้ว จึงเริ่มที่ `/speckit-plan` หรือ `/speckit-tasks` ได้เลย

---

## โครงสร้างโปรเจกต์

```
demo-workshop-sdd/
├── index.html              # entry point — ต้องอยู่ root เสมอ
├── style.css               # สไตล์ (root, ข้าง index.html)
├── app.js                  # logic + localStorage + render (root, ข้าง index.html)
├── README.md
├── specs/
│   └── โจทย์/
│       └── team-1.md ... team-12.md    # โจทย์ของแต่ละกลุ่ม
└── .specify/
    └── memory/constitution.md          # กติกาโปรเจกต์ (supreme authority)
```

ไฟล์แอปทั้งหมดต้องอยู่ root เท่านั้น โฟลเดอร์ย่อยไว้เก็บเฉพาะ spec / เอกสาร / เครื่องมือ

---

## ข้อควรระวัง

- **ห้าม push ขึ้น `main` โดยตรง** — `main` เป็นของกลางสำหรับทุกกลุ่ม งานทุกอย่างทำบน branch กลุ่มตัวเอง
- **ห้ามแก้ branch ของกลุ่มอื่น** — ทำงานเฉพาะบน `team-<เลขกลุ่มตัวเอง>`
- **ห้ามแก้ของกลาง** — `README.md`, `constitution.md`, และโจทย์ของกลุ่มอื่น ไม่ใช่ของกลุ่มเรา diff ของ branch ควรมีแต่ไฟล์แอปของกลุ่มตัวเอง
- **ให้ `index.html` รันได้ตลอดเวลา** — ทุก commit ที่ push ต้องเปิดแล้วไม่ error เพราะทุก push คือ deploy จริง
- ก่อนเริ่มงานทุกครั้ง ให้ `git pull` เพื่อดึงงานล่าสุดของเพื่อนในกลุ่มมาก่อน

```bash
git pull
```

## คำสั่งที่ใช้บ่อย

| อยากทำอะไร | คำสั่ง |
|---|---|
| ดูว่าอยู่ branch ไหน | `git branch --show-current` |
| ดูว่าแก้ไฟล์อะไรไปบ้าง | `git status` |
| ดึงงานล่าสุดของกลุ่ม | `git pull` |
| สลับกลับไป branch กลุ่ม | `git checkout team-1` |
| ดู commit ล่าสุด | `git log --oneline -5` |
| ดู diff ของกลุ่มเทียบ main | `git diff main --stat` |
| เปิดเว็บทดสอบในเครื่อง | `python3 -m http.server 8000` |
