import { z } from "zod";

export const loginSchema = z
  .object({
    username: z.string().min(1, { message: 'กรุณากรอก Email ให้ถูกต้อง' }),
    password: z.string().min(4, { message: 'กรอก Password อย่างน้อย 4 หลัก' }),
  })

export type LoginSchemaType = z.infer<typeof loginSchema>