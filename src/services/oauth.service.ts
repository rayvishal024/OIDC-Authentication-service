import { Request, Response } from "express";
import { db } from "../db";
import { clients, authorizationCodes, users, refreshTokens } from "../db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { signToken } from "../utils/jwt";
import fs from "fs";
import { importSPKI, exportJWK } from "jose";


export const handleAuthorize = async (req: Request) => {
     const { client_id, redirect_uri, response_type, state } = req.query;

     //  Validate response type
     if (response_type !== "code") {
          throw new Error("Unsupported response type");
     }

     //  Validate client
     const client = await db
          .select()
          .from(clients)
          .where(eq(clients.clientId, client_id as string));

     if (!client[0]) {
          throw new Error("Invalid client");
     }

     // Validate redirect URI
     if (!client[0].redirectUris.includes(redirect_uri as string)) {
          throw new Error("Invalid redirect URI");
     }

     //  Check login
     const user = (req as any).user;
    
     if (!user) {
          const fullUrl = `/oauth/authorize?${new URLSearchParams(req.query as any)}`;
          return {
               redirectToLogin: true,
               loginUrl: `/auth/login?redirect=${encodeURIComponent(fullUrl)}`,
          };
     }

     //  Generate code
     const code = crypto.randomBytes(32).toString("hex");

     // store code in db
     await db.insert(authorizationCodes).values({
          code,
          userId: user.userId as string,  
          clientId: client_id as string,
          redirectUri: redirect_uri as string,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
     });

     //  Redirect back
     const redirectUrl =
          `${redirect_uri}?code=${code}${state ? `&state=${state}` : ""}`;
      
     return {
          redirectUrl,
     };
};

const handleAuthCodeFlow = async (data: any) => {
     const { code, client_id, client_secret, redirect_uri } = data;

     // validate client
     const clientRes = await db
          .select()
          .from(clients)
          .where(eq(clients.clientId, client_id));

     const client = clientRes[0];
     if (!client) throw new Error("Invalid client");
     if (client.clientSecret !== client_secret) {
          throw new Error("Invalid client secret");
     }

     // validate code
     const codeRes = await db
          .select()
          .from(authorizationCodes)
          .where(eq(authorizationCodes.code, code));

     const authCode = codeRes[0];
     if (!authCode) throw new Error("Invalid code");

     if (new Date() > authCode.expiresAt) {
          throw new Error("Code expired");
     }

     if (authCode.redirectUri !== redirect_uri) {
          throw new Error("Redirect URI mismatch");
     }

     if (authCode.clientId !== client_id) {
          throw new Error("Client mismatch");
     }

     // get user
     const userRes = await db
          .select()
          .from(users)
          .where(eq(users.id, authCode.userId));

     const user = userRes[0];
     if (!user) throw new Error("User not found");

     // tokens
     const accessToken = signToken({
          userId: user.id,
          email: user.email,
          clientId: client_id,
     });

     const refreshToken = crypto.randomBytes(40).toString("hex");

     await db.insert(refreshTokens).values({
          token: refreshToken,
          userId: user.id,
          clientId: client_id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
     });

     // delete used code
     await db
          .delete(authorizationCodes)
          .where(eq(authorizationCodes.code, code));

     return {
          access_token: accessToken,
          refresh_token: refreshToken,
          token_type: "Bearer",
          expires_in: 900,
     };
};

const handleRefreshFlow = async (data: any) => {
     const { refresh_token } = data;

     const result = await db
          .select()
          .from(refreshTokens)
          .where(eq(refreshTokens.token, refresh_token));

     const stored = result[0];
     if (!stored) throw new Error("Invalid refresh token");

     if (new Date() > stored.expiresAt) {
          throw new Error("Refresh token expired");
     }

     const userRes = await db
          .select()
          .from(users)
          .where(eq(users.id, stored.userId));

     const user = userRes[0];
     if (!user) throw new Error("User not found");

     const accessToken = signToken({
          userId: user.id,
          email: user.email,
          clientId: stored.clientId,
     });

     return {
          access_token: accessToken,
          token_type: "Bearer",
          expires_in: 900,
     };
};

export const handleToken = async (data: any) => {
     const { grant_type } = data;

     if (grant_type === "authorization_code") {
          return handleAuthCodeFlow(data);
     }

     if (grant_type === "refresh_token") {
          return handleRefreshFlow(data);
     }

     throw new Error("Unsupported grant_type");
};


export const handleUserInfo = async (req: Request) => {
     const user = (req as any).user;

     if (!user) {
          throw new Error("Unauthorized");
     }

     return {
          sub: user.userId,       // subject (standard OIDC)
          email: user.email,
          client_id: user.clientId,
     };
};


export const getJWKS = async () => {
     const publicKeyPem = fs.readFileSync("keys/public.pem", "utf-8");

     const key = await importSPKI(publicKeyPem, "RS256");
     const jwk = await exportJWK(key);

     return {
          keys: [
               {
                    ...jwk,
                    use: "sig",
                    alg: "RS256",
                    kid: "my-key-1", // important identifier
               },
          ],
     };
};