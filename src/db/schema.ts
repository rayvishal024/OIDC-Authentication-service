import {
     pgTable,
     uuid,
     serial,
     text,
     timestamp,
     boolean,
     integer
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

export const authorizationCodes = pgTable("authorization_codes", {
     id: serial("id").primaryKey(),

     code: text("code").notNull(),
     userId: uuid("user_id").notNull(),

     clientId: text("client_id").notNull(),
     redirectUri: text("redirect_uri").notNull(),

     expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),

     createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const refreshTokens = pgTable("refresh_tokens", {
     id: serial("id").primaryKey(),

     token: text("token").notNull(),
     userId: uuid("user_id").notNull(),
     clientId: text("client_id").notNull(),

     expiresAt: timestamp("expires_at").notNull(),
     createdAt: timestamp("created_at").defaultNow(),
});