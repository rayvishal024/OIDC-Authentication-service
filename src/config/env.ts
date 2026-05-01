import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
     NODE_ENV: z.enum(["development", "production"]).default("development"),

     PORT: z.string().default("3000"),

     DATABASE_URL: z.string(),

     // JWT (base64 encoded keys)
     JWT_PRIVATE_KEY_BASE64: z.string(),
     JWT_PUBLIC_KEY_BASE64: z.string(),

     // App
     BASE_URL: z.string(),

});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
     console.error("Invalid environment variables");
     console.error(parsed.error.format());
     process.exit(1);
}

export const env = parsed.data;