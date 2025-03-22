import { resend } from "@/lib/resend";
import VerificationEmail from "@/emails/VerificationEmail"; // Corrected import
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });

        if (error) {
            console.log("Error sending verification email", error);
            return { success: false, message: "Error sending verification email" };
        }

        return { success: true, message: "Verification email sent successfully!" };
    } catch (emailError) {
        console.log("Error sending verification email", emailError);
        return { success: false, message: "Error sending verification email" };
    }
}
