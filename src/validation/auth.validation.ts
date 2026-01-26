import z from "zod";


const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    // password: z
    //   .string()
    //   .regex(
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    //     "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    //   ),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Associate the error with the confirmPassword field
})




export { loginSchema, registerSchema };