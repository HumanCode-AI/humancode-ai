# Environment Variables

Before running the project, please configure the environment variables.

## Backend Project Configuration

1. `.env` in root

```yaml
# Humancode
HUMANCODE_APP_ID=
HUMANCODE_APP_KEY=
HUMANCODE_API_HOST=https://humancodeai.com
HUMANCODE_CALLBACK_URL=https://your_access_link/api/v1/auth/humancode/callback

# telegram
TELEGRAM_BOT_NAME=HumanCode
TELEGRAM_BOT_TOKEN=Bot management Token
TELEGRAM_WEBAPP_LINK=https://t.me/humancodeai_bot/airdrop

# ton
TON_CENTER_RPC_API=https://testnet.toncenter.com/api/v2/jsonRPC
TON_CENTER_API_KEY=
TON_SENDER_MNEMONIC=""
TON_SENDER_ADDRESS=
```

## Frontend Project Configuration

1. `apps/web/.env`

```yaml
VITE_TELEGRAM_WEBAPP_LINK=
VITE_BLOCK_EXPLORER= # You can use https://testnet.tonviewer.com or https://tonviewer.com
```

2. `apps/web/public/tonconnect-manifest.json`

For specific information, please refer to the [manifest docs](https://docs.ton.org/develop/dapps/ton-connect/manifest)

```json
{
  "url": "https://t.me/humancodeai_bot/airdrop",
  "name": "HumanCode",
  "iconUrl": "https://faucet-humancodeai.vecrel.com/miniapp-logo.png",
  "termsOfUseUrl": "https://humanid.xyz/agreements/userline_en.html",
  "privacyPolicyUrl": "https://humanid.xyz/agreements/privacy_en.html"
}
```