# Smart Email Assistant

Smart Email Assistant is an AI-powered email reply generator that helps users turn incoming email content into clear, tone-aware responses. It includes a Spring Boot backend powered by Gemini, a React web interface for manual reply generation, and a Chrome extension that can inject an **AI Reply** button directly inside Gmail.

## What It Does

- Generates email replies from the original email content.
- Supports tone-based reply generation, including professional, friendly, casual, and sarcastic styles.
- Provides a clean React + Material UI web interface.
- Exposes a simple REST API for reply generation.
- Adds Gmail integration through a Chrome extension content script.
- Copies generated replies to the clipboard from the web app.
- Inserts generated replies directly into the Gmail compose box from the extension.

## Project Structure

```text
Smart-Email-Assistant/
+-- reply/                 # Spring Boot backend API
+-- email-writer-react/    # React + Vite frontend
+-- email-reply-ext/       # Chrome extension for Gmail
+-- hello-world-ext/       # Basic extension experiment/demo
`-- README.md
```

## Tech Stack

| Layer | Technology |
| --- | --- |
| Backend | Java 21, Spring Boot 3, Spring Web, WebClient |
| AI Provider | Google Gemini API |
| Frontend | React, Vite, Material UI, Axios |
| Browser Extension | Chrome Extension Manifest V3, JavaScript |
| Build Tools | Maven, npm |

## How It Works

1. The user enters or selects an email.
2. The app sends the email content and selected tone to the backend.
3. The Spring Boot API builds a prompt and calls the Gemini API.
4. Gemini returns a generated reply.
5. The reply is shown in the React app or inserted into Gmail by the Chrome extension.

```text
User / Gmail
    |
    v
React UI or Chrome Extension
    |
    v
Spring Boot API
    |
    v
Gemini API
    |
    v
Generated Email Reply
```

## Backend Setup

The backend lives in the `reply` folder.

### Prerequisites

- Java 21
- Maven, or the included Maven wrapper
- Gemini API key

### Configure Gemini

Open:

```text
reply/src/main/resources/application.properties
```

Use your own Gemini configuration:

```properties
spring.application.name=reply

gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=
gemini.api.key=YOUR_GEMINI_API_KEY
```

Important: do not commit a real API key to GitHub. Use a placeholder in public repositories.

### Run Backend

```bash
cd reply
./mvnw spring-boot:run
```

On Windows:

```cmd
cd reply
mvnw.cmd spring-boot:run
```

The backend starts on:

```text
http://localhost:8080
```

## API Reference

### Generate Email Reply

```http
POST /api/email/generate
```

Request body:

```json
{
  "content": "Hi, can we reschedule our meeting to tomorrow?",
  "tone": "professional"
}
```

Response:

```text
Sure, tomorrow works for me. Please let me know what time is convenient for you.
```

## Frontend Setup

The React app lives in the `email-writer-react` folder.

### Prerequisites

- Node.js
- npm

### Install And Run

```bash
cd email-writer-react
npm install
npm run dev
```

The frontend usually starts on:

```text
http://localhost:5173
```

### Available Scripts

```bash
npm run dev      # Start local development server
npm run build    # Create production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Chrome Extension Setup

The Gmail extension lives in the `email-reply-ext` folder.

### Load Extension In Chrome

1. Open Chrome.
2. Go to `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the `email-reply-ext` folder.
6. Open Gmail.
7. Make sure the backend is running on `http://localhost:8080`.
8. Open a compose or reply window.
9. Click **AI Reply**.

The extension detects Gmail compose boxes, adds an **AI Reply** button to the toolbar, sends the email content to the backend, and inserts the generated response into the compose editor.

## Environment Notes

- The frontend and extension both call the backend at `http://localhost:8080/api/email/generate`.
- The backend currently allows cross-origin requests with `@CrossOrigin(origins = "*")`, which is convenient for local development.
- For production, restrict CORS to trusted origins only.
- Keep secrets such as `gemini.api.key` outside public commits.

## Troubleshooting

### Backend is not responding

Make sure the Spring Boot server is running:

```cmd
cd reply
mvnw.cmd spring-boot:run
```

### Frontend cannot generate replies

Check that:

- Backend is running on port `8080`.
- Gemini API key is valid.
- Browser console does not show CORS or network errors.

### Gmail button does not appear

Try these steps:

- Reload the extension from `chrome://extensions`.
- Refresh Gmail.
- Open a fresh compose or reply box.
- Check Gmail DevTools console for extension logs.

### Gemini returns an error

Verify:

- API key is correct.
- Gemini URL is correct.
- Your Google AI account has access to the selected model.

## Future Improvements

- Add tone selection directly inside the Gmail extension.
- Store user preferences with Chrome storage.
- Add loading and success states inside Gmail.
- Move API key handling to environment variables.
- Improve prompt engineering for shorter, warmer, or more detailed replies.
- Add unit and integration tests for the backend.
- Add deployment configuration for frontend and backend hosting.

## Author

Built by **P. Sai Ramesh Kumar** as a full-stack AI email productivity project.

## License

This project is currently for learning and portfolio use. Add a license before publishing or accepting contributions.
