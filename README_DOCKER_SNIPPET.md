## Docker + Traefik Local HTTPS

This project supports optional internal HTTPS via Traefik.

### Features
- Local HTTPS at https://app.localhost and https://localhost
- Toggle on/off with `ENABLE_INTERNAL_PROXY`
- Compose profiles: `proxy` (with Traefik) and `no-proxy`
- mkcert self‑signed certificates (trusted locally) – not committed

### Prerequisites
Install mkcert (see https://github.com/FiloSottile/mkcert).

Generate certificates (first time):
```
mkdir -p certs
mkcert -install
mkcert -key-file certs/localhost-key.pem -cert-file certs/localhost-cert.pem "localhost" "127.0.0.1" "app.localhost"
```

### Environment
Copy `.env.example` to `.env` and adjust as needed.

### Start with proxy (HTTPS)
```
docker compose --profile proxy up --build
```
Access: https://app.localhost (or https://localhost)

### Start without proxy (e.g. Vercel-like environment)
```
ENABLE_INTERNAL_PROXY=false docker compose --profile no-proxy up --build
```
Access: http://localhost:3000

### Notes
- Vercel deployment ignores Docker + Traefik; set `ENABLE_INTERNAL_PROXY=false`.
- Add more local hostnames by regenerating certs including them.
- `app.localhost` resolves automatically to 127.0.0.1.

### Cleaning Up
```
docker compose down
```

### Future (Production)
To use real certificates, add ACME (Let's Encrypt) flags in Traefik and point DNS to your host.