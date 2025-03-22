
import { z } from "zod";

export const signupSchema = z.object({
    username: z.string().min(3,"Username must be atleast 3 character long").max(20,"Username must be atmost 20 character long").regex(/^[a-zA-Z0-9_]*$/,"Username can only contain alphabets, numbers and underscore"),
    email: z.string().email("Invalid email address"),
    password:z.string().min(8,"Password must be atleast 8 character long").max(20,"Password must be atmost 20 character long").regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,"Password must contain at least 8 characters, including UPPER/lowercase, numbers, and a special character")
});

