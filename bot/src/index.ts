import { Telegraf, Markup, Context } from "telegraf";
import * as dotenv from "dotenv";

dotenv.config();

// ── Validate environment ────────────────────────────────────────────
const BOT_TOKEN = process.env.BOT_TOKEN;
const MINI_APP_URL = process.env.MINI_APP_URL ?? "https://placeholder.vercel.app";

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN is missing from .env");
}

// ── Create bot instance ─────────────────────────────────────────────
const bot = new Telegraf(BOT_TOKEN);

// ── Middleware: basic logging ───────────────────────────────────────
bot.use(async (ctx: Context, next) => {
  const user = ctx.from;
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Update from: ${user?.username ?? user?.id ?? "unknown"}`);
  await next();
});

// ── /start command ──────────────────────────────────────────────────
bot.start(async (ctx) => {
  const firstName = ctx.from?.first_name ?? "friend";

  const welcomeMessage = `
🖊️ *Welcome to Ink DeFi Companion*, ${firstName}\\!

Your all\\-in\\-one DeFi dashboard for the *Ink blockchain* — Kraken's L2 on Superchain\\.

Here's what you can do:
📊 *Portfolio* — Track ETH \\& token balances
🚀 *InkyPump* — Explore new memecoin launches
📈 *Trade & Alerts* — Monitor prices on Nado/Tydro
🌉 *Bridge* — Check gas fees \\& bridge routes

Tap the button below to open the app\\!
  `.trim();

  await ctx.replyWithMarkdownV2(
    welcomeMessage,
    Markup.inlineKeyboard([
      [
        Markup.button.webApp("🚀 Open Ink DeFi App", MINI_APP_URL),
      ],
      [
        Markup.button.url("🌐 Ink Explorer", "https://explorer.inkonchain.com"),
        Markup.button.url("📚 Ink Docs", "https://docs.inkonchain.com"),
      ],
    ])
  );
});

// ── /help command ───────────────────────────────────────────────────
bot.help(async (ctx) => {
  await ctx.reply(
    `Ink DeFi Companion — Commands:\n\n` +
    `/start — Open the main app\n` +
    `/status — Check bot & RPC status\n` +
    `/gas — Quick gas price check (coming soon)\n` +
    `/help — Show this message`,
    { parse_mode: "HTML" }
  );
});

// ── /status command ─────────────────────────────────────────────────
bot.command("status", async (ctx) => {
  const rpcUrl = "https://rpc-gel.inkonchain.com";
  let rpcStatus = "🔴 Unreachable";
  let blockNumber = "N/A";

  try {
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_blockNumber",
        params: [],
        id: 1,
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      const data = await response.json() as { result: string };
      blockNumber = parseInt(data.result, 16).toLocaleString();
      rpcStatus = "🟢 Online";
    }
  } catch (err) {
    console.error("RPC check failed:", err);
  }

  await ctx.reply(
    `<b>🖊️ Ink DeFi Companion Status</b>\n\n` +
    `Bot: 🟢 Online\n` +
    `Ink RPC: ${rpcStatus}\n` +
    `Latest Block: <code>${blockNumber}</code>\n` +
    `Chain ID: <code>57073</code>\n` +
    `Mini App: <a href="${MINI_APP_URL}">${MINI_APP_URL}</a>`,
    { parse_mode: "HTML", link_preview_options: { is_disabled: true } }
  );
});

// ── /gas command ────────────────────────────────────────────────────
bot.command("gas", async (ctx) => {
  await ctx.reply(
    "⛽ <b>Gas Checker</b>\n\nFull gas monitoring coming in the Mini App!\n\n" +
    `<a href="${MINI_APP_URL}">Open App →</a>`,
    { parse_mode: "HTML" }
  );
});

// ── Handle unknown commands ─────────────────────────────────────────
bot.on("text", async (ctx) => {
  if (ctx.message.text.startsWith("/")) {
    await ctx.reply(`Unknown command. Try /help to see available commands.`);
  }
});

// ── Error handler ───────────────────────────────────────────────────
bot.catch((err: unknown, ctx: Context) => {
  const errorMessage = err instanceof Error ? err.message : String(err);
  console.error(`❌ Bot error for update ${ctx.updateType}:`, errorMessage);
});

// ── Graceful shutdown ───────────────────────────────────────────────
process.once("SIGINT", () => {
  console.log("SIGINT received — stopping bot...");
  bot.stop("SIGINT");
});

process.once("SIGTERM", () => {
  console.log("SIGTERM received — stopping bot...");
  bot.stop("SIGTERM");
});

// ── Launch ──────────────────────────────────────────────────────────
async function main() {
  console.log("🚀 Starting Ink DeFi Companion bot...");
  console.log(`📱 Mini App URL: ${MINI_APP_URL}`);
  console.log(`⛓️  Ink RPC: https://rpc-gel.inkonchain.com`);

  await bot.launch({
    dropPendingUpdates: true,
  });

  console.log("✅ Bot is running! Send /start in Telegram to test.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});