# StartupMatch API Documentation

## Base Information
- Base URL (local): `http://localhost:8000/api`
- Auth type: Bearer token via Laravel Sanctum personal access token
- Content type: `application/json` for most endpoints
- File upload content type: `multipart/form-data`

## Authentication Header
```http
Authorization: Bearer <token>
Accept: application/json
```

## Response Conventions
- Successful responses return standard JSON payloads.
- Validation errors return HTTP `422` with Laravel validation error format.
- Access control errors return HTTP `403`.
- Missing resources return HTTP `404`.

## Endpoint Summary
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register user and return token |
| POST | `/login` | No | Login and return token |
| POST | `/logout` | Yes | Logout current token |
| GET | `/me` | Yes | Get authenticated user with role profile |
| PATCH | `/profile` | Yes | Update authenticated account (`name`, `email`) |
| POST | `/startup/profile` | Yes | Create/update startup profile |
| POST | `/talent/profile` | Yes | Create/update talent profile |
| GET | `/discover` | Yes | Discovery feed with role-based filters |
| POST | `/swipe` | Yes | Swipe left/right and check match |
| GET | `/matches` | Yes | List current user matches |
| GET | `/matches/{id}` | Yes | Match detail with profile + conversation |
| GET | `/conversations/{matchId}` | Yes | Get/create conversation for match |
| POST | `/conversations/{matchId}/read` | Yes | Mark incoming conversation messages as read |
| POST | `/messages` | Yes | Send message to match conversation |
| POST | `/uploads/avatar` | Yes | Upload avatar image |
| POST | `/uploads/pitch-deck` | Yes (startup) | Upload startup pitch deck |
| POST | `/uploads/resume` | Yes (talent) | Upload talent resume |
| GET | `/users/{id}` | No | Public user profile view |

## 1. Auth

### POST `/register`
Request body:
```json
{
  "name": "Startup A",
  "email": "startup@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "startup"
}
```
Validation:
- `name`: required, string, max 255
- `email`: required, email, unique
- `password`: required, string, min 8, confirmed
- `role`: required, `startup|talent`

Success `201`:
```json
{
  "user": { "id": 1, "name": "Startup A", "email": "startup@example.com", "role": "startup" },
  "token": "1|..."
}
```

### POST `/login`
Request body:
```json
{
  "email": "startup@example.com",
  "password": "password123"
}
```
Success `200` returns `user` + `token`.
Invalid credentials: `422` with message `Email atau password tidak valid.`

### POST `/logout`
Success `200`:
```json
{ "message": "Logout berhasil." }
```

### GET `/me`
Success `200`: authenticated user including `roles`, `startup_profile`, `talent_profile`.

## 2. Account Profile Edit

### PATCH `/profile`
Update account-level fields only.

Request body:
```json
{
  "name": "Nama Baru",
  "email": "baru@example.com"
}
```
Validation:
- `name`: required, string, max 255
- `email`: required, email, max 255, unique except current user

Success `200`: updated user with loaded relations `roles`, `startup_profile`, `talent_profile`.

## 3. Role Profiles

### POST `/startup/profile`
Only startup users.

Request body:
```json
{
  "company_name": "PT Startup Maju",
  "tagline": "Berkembang bersama",
  "pitch_description": "Platform kolaborasi startup dan talent.",
  "pitch_deck_url": "pitch-decks/file.pdf",
  "stage": "mvp",
  "industry": "SaaS",
  "needs": ["CTO", "Designer"],
  "location": "Bandung",
  "website": "https://startup.test",
  "team_size": 8
}
```
Validation:
- `stage`: `idea|mvp|growth|scaling`
- `needs`: array of strings (max 120 each)
- `website`: valid URL if provided

### POST `/talent/profile`
Only talent users.

Request body:
```json
{
  "bio": "Saya engineer fullstack.",
  "skills": ["React", "Laravel"],
  "experience_years": 4,
  "role_title": "Fullstack Engineer",
  "preferred_industries": ["SaaS"],
  "work_type": "remote",
  "availability": "immediately",
  "resume_url": "resumes/resume.pdf",
  "portfolio_url": "https://portfolio.test"
}
```
Validation:
- `work_type`: `remote|onsite|hybrid`
- `availability`: `immediately|1month|3months`

## 4. Discovery and Swipe

### GET `/discover`
Role-based feed:
- If authenticated user is talent: returns startup cards
- If authenticated user is startup: returns talent cards

Common behavior:
- Excludes self
- Excludes users already swiped by current user
- Returns paginated response (`paginate(10)`)

Talent filters:
- `industry`
- `stage`
- `location` (partial match)

Startup filters:
- `skills` (comma-separated, e.g. `React,Laravel`)
- `work_type`
- `experience_min`

### POST `/swipe`
Request body:
```json
{
  "swiped_id": 9,
  "direction": "right"
}
```
Validation:
- `swiped_id`: required, exists in users
- `direction`: `left|right`

Rules:
- Cannot swipe self (`422`)
- Cannot swipe same-role user (`422`)
- Uses upsert per pair (`swiper_id`, `swiped_id`)
- Match happens only on mutual `right`

Success `200`:
```json
{
  "match": true,
  "match_id": 12
}
```
If no match:
```json
{
  "match": false,
  "match_id": null
}
```

## 5. Matches

### GET `/matches`
Returns paginated matches (`paginate(20)`) for current user with:
- startup + startup profile
- talent + talent profile
- conversation

### GET `/matches/{id}`
Returns single match detail if current user is startup or talent participant.
Includes conversation messages + sender.

If unauthorized/not found for current user: `404` with `Match tidak ditemukan.`

## 6. Conversations and Messages

### GET `/conversations/{matchId}`
- Checks current user belongs to match
- Creates conversation automatically if not existing
- Returns:
```json
{
  "conversation_id": 2,
  "match_id": 12,
  "messages": []
}
```

Unauthorized access: `403` with `Akses percakapan ditolak.`

### POST `/conversations/{matchId}/read`
- Checks current user belongs to match
- Creates conversation automatically if not existing
- Marks unread incoming messages (`sender_id != auth user` and `read_at = null`) as read
- Returns:
```json
{
  "conversation_id": 2,
  "read_count": 3,
  "read_at": "2026-03-27T11:00:00.000000Z",
  "last_read_message_id": 88
}
```

If there is no unread incoming message:
```json
{
  "conversation_id": 2,
  "read_count": 0,
  "read_at": null,
  "last_read_message_id": null
}
```

Unauthorized access: `403` with `Akses percakapan ditolak.`

### POST `/messages`
Request body:
```json
{
  "match_id": 12,
  "body": "Halo, kita bisa schedule call?"
}
```
Validation:
- `match_id`: required, exists in `matches`
- `body`: required, string, max 2000

Success `201`: created message with sender relation and `match_id`.
Unauthorized: `403`.

## 7. Uploads

### POST `/uploads/avatar`
- Field: `file`
- Validation: image, max 5120 KB
- Stores to `public/avatars`
- Updates `users.avatar`

Success `201`:
```json
{
  "path": "avatars/abc.jpg",
  "url": "/storage/avatars/abc.jpg"
}
```

### POST `/uploads/pitch-deck`
- Startup only
- Field: `file`
- Validation: `pdf|ppt|pptx`, max 10240 KB
- Stores to `public/pitch-decks`
- Creates startup profile fallback data if missing

### POST `/uploads/resume`
- Talent only
- Field: `file`
- Validation: `pdf|doc|docx`, max 10240 KB
- Stores to `public/resumes`
- Creates talent profile fallback data if missing

## 8. Public User Endpoint

### GET `/users/{id}`
Returns user with `startup_profile` and `talent_profile`.

If not found: `404` with `User tidak ditemukan.`

## 9. Realtime (Reverb / Echo)

### Broadcast auth endpoint
- `POST /broadcasting/auth`
- Uses `auth:sanctum`

### Channels
- `private-users.{userId}`
  - Authorized only if `auth user id === {userId}`
  - Event: `.MatchCreated`

- `private-conversation.{conversationId}`
  - Authorized only for users belonging to that conversation’s match
  - Event: `.MessageSent`
  - Event: `.MessageRead`

- `presence-conversation.presence.{conversationId}`
  - Authorized only for users belonging to that conversation’s match
  - Presence members: `{ id, name, avatar }`
  - Whisper supported for typing indicators

### Event payloads
`MatchCreated` payload:
```json
{
  "id": 12,
  "startup": { "id": 1, "name": "Startup A", "avatar": null },
  "talent": { "id": 9, "name": "Talent B", "avatar": null },
  "matched_at": "2026-03-15T10:00:00.000000Z",
  "status": "active"
}
```

`MessageSent` payload:
```json
{
  "id": 77,
  "conversation_id": 2,
  "match_id": 12,
  "body": "Halo",
  "sender_id": 1,
  "sender": { "id": 1, "name": "Startup A", "avatar": null },
  "read_at": null,
  "created_at": "2026-03-15T10:10:00.000000Z",
  "updated_at": "2026-03-15T10:10:00.000000Z"
}
```

`MessageRead` payload:
```json
{
  "conversation_id": 2,
  "reader_id": 9,
  "reader": { "id": 9, "name": "Talent B", "avatar": null },
  "read_at": "2026-03-15T10:12:00.000000Z",
  "last_read_message_id": 77
}
```

## 10. Quick cURL Example
```bash
# Login
curl -X POST http://localhost:8000/api/login \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"email":"startup@example.com","password":"password123"}'

# Update account profile
curl -X PATCH http://localhost:8000/api/profile \
  -H "Accept: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Nama Baru","email":"baru@example.com"}'
```
