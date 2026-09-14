# Supabase email verification

LifeOS uses Supabase Auth's Confirm Signup OTP as the source of truth. No application database stores or generates verification codes.

## Hosted Supabase setup

1. In **Authentication → Providers → Email**, enable email/password and **Confirm email**.
2. In **Authentication → Email Templates → Confirm signup**, use the subject `{{ .Token }} is your LifeOS verification code` and paste the contents of [`supabase-confirm-signup.html`](./supabase-confirm-signup.html).
3. Configure production SMTP, the project Site URL, and allowed redirect URLs in Supabase.
4. Deploy `/config.json` with `supabaseUrl` and the project's publishable/anon key, then set `VITE_AUTH_PROVIDER=supabase`.
5. Keep email-link tracking disabled for authentication messages.

The frontend deliberately rejects a signup that returns a session immediately. That indicates **Confirm email** is disabled and prevents an unverified account from entering onboarding.

For standalone UI development, `VITE_AUTH_PROVIDER=mock` uses `123456` and preserves the same unverified → verified → onboarding state boundary.
