import { Request, Response } from "express";
import * as oauthService from "../services/oauth.service";

export const authorize = async (req: Request, res: Response) => {
     try {
          const result = await oauthService.handleAuthorize(req);
           
          // redirect to login
          if ("redirectToLogin" in result) {
               
               return res.redirect(result.loginUrl!);
          }
          
          // redirect with code
          if ("redirectUrl" in result) {
               return res.redirect(result.redirectUrl!);
          }

     } catch (err: any) {
          return res.status(400).send(err.message);
     }
};

export const token = async (req: Request, res: Response) => {
     try {
          const result = await oauthService.handleToken(req.body);
          res.json(result);
     } catch (err: any) {
          res.status(400).json({ error: err.message });
     }
};

export const userInfo = async (req: Request, res: Response) => {
     try {
          const result = await oauthService.handleUserInfo(req);
          res.json(result);
     } catch (err: any) {
          res.status(401).json({ error: err.message });
     }
};

export const jwks = async (req: Request, res: Response) => {
     try {
          const result = await oauthService.getJWKS();
          res.json(result);
     } catch (err: any) {
          res.status(500).json({ error: err.message });
     }
};

export const discovery = (req: Request, res: Response) => {
     const baseUrl = `${req.protocol}://${req.get("host")}`;

     res.json({
          issuer: baseUrl,

          authorization_endpoint: `${baseUrl}/oauth/authorize`,
          token_endpoint: `${baseUrl}/oauth/token`,
          userinfo_endpoint: `${baseUrl}/oauth/userinfo`,
          jwks_uri: `${baseUrl}/.well-known/jwks.json`,

          response_types_supported: ["code"],
          subject_types_supported: ["public"],
          id_token_signing_alg_values_supported: ["RS256"],

          scopes_supported: ["openid", "email", "profile"],
          token_endpoint_auth_methods_supported: ["client_secret_post"],
     });
};