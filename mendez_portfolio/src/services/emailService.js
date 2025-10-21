import emailjs from '@emailjs/browser';
import { emailjsConfig, emailSettings } from '../config/emailjs';

emailjs.init(emailjsConfig.publicKey);

export const sendContactEmail = async (formData) => {
  try {
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject || 'New Contact Form Message',
      message: formData.message,
      to_email: emailSettings.toEmail,
      to_name: emailSettings.toName,
      reply_to: formData.email,
    };

    const response = await emailjs.send(
      emailjsConfig.serviceId,
      emailjsConfig.templateId,
      templateParams
    );

    return {
      success: true,
      message: 'Message sent successfully!',
      response: response
    };
  } catch (error) {
    console.error('EmailJS error:', error);
    return {
      success: false,
      message: 'Failed to send message. Please try again.',
      error: error
    };
  }
};

// Test function to verify EmailJS configuration
export const testEmailJSConnection = async () => {
  try {
    return await emailjs.send(
      emailjsConfig.serviceId,
      emailjsConfig.templateId,
      {
        from_name: 'Test User',
        from_email: 'test@example.com',
        subject: 'Test Message',
        message: 'This is a test message from your website.',
        to_email: emailSettings.toEmail,
        to_name: emailSettings.toName,
      }
    );
  } catch (error) {
    console.error('EmailJS connection test failed:', error);
    throw error;
  }
};