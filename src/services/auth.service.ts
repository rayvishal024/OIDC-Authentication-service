import bcrypt from "bcrypt";
import { z } from "zod";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const registerSchema = z.object({
     email: z.string().email(),
     password: z.string().min(6),
     name: z.string().optional(),
});

export const registerUser = async (data: unknown) => {

     // Validate input
     const parsed = registerSchema.parse(data);

     // Check already existence
     const existingUser = await db.query.users.findFirst({
          where: eq(users.email, parsed.email),
     });

     if (existingUser) {
          throw new Error("User already exists with this email");
     }

     // Hash password
     const hashedPassword = await bcrypt.hash(parsed.password, 10);

     // Create user 
     const [user] = await db
          .insert(users)
          .values({
               email: parsed.email,
               passwordHash: hashedPassword,
               name: parsed.name,
          })
          .returning();

     // Issue while creation
     if (!user) {
          throw new Error("User creation failed");
     }

     return {
          id: user.id,
          email: user.email,
          name: user.name,
     };
};

const loginSchema = z.object({
     email: z.string().email(),
     password: z.string().min(6),
});


export const loginUser = async (data: unknown) => {

     //  Validate input
     const parsed = loginSchema.parse(data);

     //  Find user 
     const user = await db.query.users.findFirst({
          where: eq(users.email, parsed.email),
     });

     // Ivalid Email
     if (!user) {
          throw new Error("Invalid email or password");
     }

     //  Compare password
     const isValid = await bcrypt.compare(
          parsed.password,
          user.passwordHash
     );

     if (!isValid) {
          throw new Error("Invalid email or password");
     }

     return {
          id: user.id,
          email: user.email,
          name: user.name,
     };
};