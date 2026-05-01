import { Request, Response } from "express";
import * as clientService from "../services/client.service";

export const showClientPage = (req: Request, res: Response) => {
     res.render("client");
};

export const registerClient = async (req: Request, res: Response) => {
     try {
          const client = await clientService.createClient(req.body);

          res.json({
               message: "Client created",
               client,
          });
     } catch (err: any) {
          res.status(400).send(err.message);
     }
};