# Usage — Connect Frontend to Backend

This file documents how to activate and use the backend from both **React (web)** and **React Native** clients.

## Quick web start (React / Vite)
1. Install dependencies

```bash
npm install
```

2. Create `.env` in project root

```env
VITE_API_BASE_URL=http://localhost:8000
```

3. Run dev server

```bash
npm run dev
```

4. Build for production

```bash
npm run build
npm run preview
```

> The frontend reads the API base URL from `import.meta.env.VITE_API_BASE_URL` (see `src/App.tsx`).

---

## Key backend endpoints used by the frontend
- `POST /login_react` — login (returns `token`, `user`)
- `POST /logout`
- `GET /user` — token validation
- `POST /ADM_GPX_UPLOAD`, `POST /events/:event_code/gpx-upload` — GPX upload
- `POST /delete` — remove data
- `/broadcasting/auth` — private-channel auth for real-time
- `POST /event/:event_code/emergency/:participant_id/message` — emergency message

---

## Authentication & token flow
- **Web (this repo)**: token stored in `localStorage` under `authToken`.
  - `src/comp/axiosClient.ts` automatically attaches `Authorization: Bearer <token>` header.
  - Components such as `src/Authentication/ProfileLogin.tsx` call `/login_react` and store token/local user data in `localStorage`.

- **React Native**: store token in `AsyncStorage` and attach it to each request (example below).

---

## React Native integration notes
- Environment: use `react-native-config`, `expo-constants` or set constants directly for `API_BASE_URL`.
- Async token plus axios interceptor (RN example):

```js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

- GPX upload: use `FormData` and append the file using `{ uri, name, type }`.
- Real-time: RN may need WebSocket polyfills or native Pusher SDKs to use Laravel Echo/Pusher.

---

## Backend (Laravel) quick checklist
- Authentication endpoints and token issuance for `/login_react`.
- CORS allowed for the web origin.
- Broadcasting configured (Pusher or laravel-websockets) and `/broadcasting/auth` enabled.
- File upload endpoint accepts field name `gpx_file` in `multipart/form-data`.

---

## Troubleshooting
- **401 Unauthorized**: verify token presence and validity.
- **CORS errors**: enable CORS or set allowed origins on backend.
- **WebSocket failing**: verify websocket host, port, and server process (Echo/pusher/laravel-websockets).
- **Upload issues**: ensure `gpx_file` form key and `Content-Type: multipart/form-data`.

---

If you want, I can:
- Add a `.env.example` file with recommended variables, or
- Add a small React Native example app showing login, GPX upload and simple Echo usage.

Which would you prefer?