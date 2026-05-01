import { db } from "../db";
import { clients } from "../db/schema";
import { z } from "zod";
import crypto from "crypto";

const clientSchema = z.object({
     name: z.string(),
     redirectUri: z.string().url(),
});

export const createClient = async (data: unknown) => {
     const parsed = clientSchema.parse(data);

     const clientId = crypto.randomBytes(16).toString("hex");
     const clientSecret = crypto.randomBytes(32).toString("hex");

     const [client] = await db
          .insert(clients)
          .values({
               name: parsed.name,
               clientId,
               clientSecret,
               redirectUris: [parsed.redirectUri],
          })
          .returning();

     return client;
};