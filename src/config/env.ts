import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
     PORT: z.string().default("3000"),

     DATABASE_URL: z.string(),

     JWT_PRIVATE_KEY: z.string(),
     JWT_PUBLIC_KEY: z.string(),

     MAIL_HOST: z.string(),
     MAIL_PORT: z.string(),
     MAIL_USER: z.string(),
     MAIL_PASS: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
     console.error(" Invalid environment variables");
     console.error(parsed.error.format());
     process.exit(1);
}

export const env = parsed.data;