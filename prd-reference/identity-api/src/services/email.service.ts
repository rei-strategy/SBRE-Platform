export const sendVerificationEmail = async (email: string, token: string) => {
  // In production integrate with your SMTP provider.
  console.log(`[email] verification token for ${email}: ${token}`);
};
