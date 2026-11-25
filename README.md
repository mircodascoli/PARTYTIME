# PARTYTIME

> More than a liquor store — an interactive experience that guides you through the world of spirits, helps you craft unforgettable cocktails, and makes every visit feel like a night out.

---

[Live demo Link 🔗](https://partytime-5tie.onrender.com/)

---

![UX](./src/gif-for-repo.gif)

## What is this?

Partytime is a full-stack web application that blends e-commerce with entertainment. Users don't just browse and buy — they explore spirits, discover cocktail recipes, and get guided through the art of mixology, all while the store sells more product in the most enjoyable way possible.

---

## Tech Stack

| Layer    | Technology                    |
| -------- | ----------------------------- |
| Frontend | Lit Web Components, HTML, CSS |
| Backend  | Node.js, Express              |
| Database | MongoDB                       |
| Auth     | SupaBase                      |
| Parsing  | jsPDF                         |
| Mailing  | NodeMailer                    |

---

### Getting started

Follow these steps to run Partytime on your machine. The Express server serves both the API and the frontend (`src/`), so there is a single process to start.

### Prerequisites

- **Node.js 20.6 or newer** (the dev script uses `--env-file`). Check with `node -v`.
- A **MongoDB** database (a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster works fine).
- A **Supabase** project for authentication.
- A **Gmail account with an [app password](https://support.google.com/accounts/answer/185833)** (only needed to send order emails in local mode).

### 1. Clone and install

```bash
git clone https://github.com/mircodascoli/PARTYTIME.git
cd PARTYTIME
npm install
```

### 2. Configure environment variables

Create your `.env` file from the example:

```bash
# macOS / Linux (not tested)
cp env.example .env
 
# Windows (PowerShell)
Copy-Item env.example .env
```

Then fill in the values:

| Variable                | Description                                                  | Example                          |
| ----------------------- | ------------------------------------------------------------ | -------------------------------- |
| `PORT`                  | Port the server listens on (default `1337`)                  | `1337`                           |
| `MONGO_URI`             | MongoDB connection string                                    | `mongodb+srv://user:pass@.../`   |
| `SUPABASE_URL`          | Supabase project URL                                         | `https://xxxx.supabase.co`       |
| `SUPABASE_ANON_KEY`     | Supabase publishable (anon) key                              | `sb_publishable_...`             |
| `GMAIL_USER`            | Gmail address used to send order emails                      | `you@gmail.com`                  |
| `GMAIL_APP_PASSWORD`    | Gmail app password (not your account password)               | `abcd efgh ijkl mnop`            |
| `MY_NOTIFICATION_EMAIL` | Address that receives a copy of each order                   | `you@example.com`                |
| `APP_ENV`               | `local` for development, `production` when deployed          | `local`                          |

> Never commit your `.env` file. It is already listed in `.gitignore`.

### 3. Set up Supabase

1. Create a project on [supabase.com](https://supabase.com) and enable **Email** authentication.
2. Copy the project URL and the publishable key into your `.env` (`SUPABASE_URL`, `SUPABASE_ANON_KEY`).
3. Use the **same** URL and key in the browser client, `src/config/supabaseClient.js`. The server validates the tokens issued to the frontend, so both must point to the same project.
The publishable key is designed to be public. Data protection relies on Supabase Row Level Security and on the checks made by the server.

### 4. Set up the database

The server connects to the `Partytime` database and uses three collections:

| Collection  | Content                                  |
| ----------- | ---------------------------------------- |
| `Botellas`  | Bottles sold in the shop                 |
| `Cocktails` | Cocktail recipes                         |
| `users`     | Created automatically on first login     |

`Botellas` and `Cocktails` must be populated for the shop and the recipes pages to show content. A seed script with sample data is planned (`scripts/seed.js`).(Coming soon)

### 5. Run the app

```bash
npm run dev
```

Open **http://localhost:1337**. The server restarts automatically when you change a file.

> Use `localhost` or `127.0.0.1`: the frontend picks the local API only on those hostnames.

`npm start` is meant for production, where the variables are provided by the host. It does **not** read the `.env` file.

---

## License

software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
