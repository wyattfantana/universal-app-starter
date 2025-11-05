import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.warn('⚠️  Resend API key not configured. Email sending disabled.');
}

export const resend = new Resend(apiKey);

// Email helper functions
export const email = {
  send: async (params: {
    to: string | string[];
    subject: string;
    html?: string;
    react?: React.ReactElement;
    from?: string;
  }) => {
    if (!apiKey) {
      console.log('📧 [DEV] Email not sent (Resend not configured):', params.subject);
      return { success: false, message: 'Resend not configured' };
    }

    try {
      const { data, error } = await resend.emails.send({
        from: params.from || process.env.EMAIL_FROM || 'QuoteMaster <noreply@yourdomain.com>',
        to: params.to,
        subject: params.subject,
        html: params.html,
        react: params.react,
      });

      if (error) {
        console.error('❌ Email send error:', error);
        return { success: false, error };
      }

      console.log('✅ Email sent:', data?.id);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Email send error:', error);
      return { success: false, error };
    }
  },
};
