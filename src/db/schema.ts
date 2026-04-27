import {
     pgTable,
     uuid,
     text,
     timestamp,
     boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
     id: uuid("id").primaryKey().defaultRandom(),
     email: text("email").notNull().unique(),
     passwordHash: text("password_hash").notNull(),
     name: text("name"),
     isEmailVerified: boolean("is_email_verified").default(false),
     createdAt: timestamp("created_at").defaultNow(),
});

export const clients = pgTable("clients", {
     id: uuid("id").primaryKey().defaultRandom(),
     clientId: text("client_id").notNull().unique(),
     clientSecret: text("client_secret"),
     name: text("name").notNull(),
     redirectUris: text("redirect_uris").array().notNull(),
     createdAt: timestamp("created_at").defaultNow(),
});