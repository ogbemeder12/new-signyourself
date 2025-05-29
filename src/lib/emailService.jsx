
import emailjs from '@emailjs/browser';
import { supabase } from '@/lib/supabase';

const EMAIL_TEMPLATES = {
  WELCOME: 'template_welcome',
  POINTS_EARNED: 'template_points',
  SWEEPSTAKES_ENTRY: 'template_sweepstakes',
  WAITING_LIST: 'template_waitlist_generic' 
};

export const sendEmail = async (templateParams, templateType) => {
  let serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  let publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  let actualTemplateId = EMAIL_TEMPLATES[templateType];

  if(!serviceId || !publicKey || !actualTemplateId) {
    console.warn(`EmailJS configuration missing for template type: ${templateType}. Using fallback if available.`);
    
    if (templateType === 'WAITING_LIST' && !actualTemplateId) {
       console.warn("Specific waiting list template ID not found, ensure 'template_waitlist_generic' is configured in EmailJS or update EMAIL_TEMPLATES map.");
    }
    
    if (!serviceId) serviceId = 'default_service'; 
    if (!publicKey) publicKey = 'default_public_key';
    if (!actualTemplateId && EMAIL_TEMPLATES.WELCOME) actualTemplateId = EMAIL_TEMPLATES.WELCOME;

    if(!serviceId || !publicKey || !actualTemplateId) {
        console.error('Critical EmailJS configuration (service ID, public key, or a fallback template ID) is missing. Email cannot be sent.');
        throw new Error('EmailJS critical configuration missing.');
    }
  }


  try {
    const response = await emailjs.send(
      serviceId,
      actualTemplateId,
      templateParams,
      publicKey
    );

    if (supabase) {
      await supabase
        .from('email_notifications')
        .insert([{
          type: templateType,
          status: 'sent',
          sent_at: new Date().toISOString(),
          recipient: templateParams.to_email || 'unknown',
          template_id_used: actualTemplateId
        }]);
    } else {
      console.warn("Supabase client not available, email send log skipped.");
    }

    return response;
  } catch (error) {
    console.error('Email sending failed:', error);
    if (supabase) {
       await supabase
        .from('email_notifications')
        .insert([{
          type: templateType,
          status: 'failed',
          sent_at: new Date().toISOString(),
          error_message: error.text || JSON.stringify(error),
          recipient: templateParams.to_email || 'unknown',
          template_id_used: actualTemplateId
        }]);
    }
    throw error;
  }
};

export const sendWaitingListEmail = async (email, position, discountCode, name = 'Valued User') => {
  return sendEmail({
    to_email: email,
    user_name: name,
    position: position || 'a special spot',
    discount_code: discountCode,
    subject: "You're on the List!",
    site_name: import.meta.env.VITE_APP_NAME || 'Our Awesome Product' 
  }, 'WAITING_LIST');
};

export const sendPointsEarnedEmail = async (email, points, reason, name = 'Valued User') => {
  return sendEmail({
    to_email: email,
    user_name: name,
    points_earned: points,
    reason: reason,
    subject: "You've Earned Points!",
    site_name: import.meta.env.VITE_APP_NAME || 'Our Awesome Product'
  }, 'POINTS_EARNED');
};

export const sendSweepstakesEntryEmail = async (email, entries, name = 'Valued User') => {
  return sendEmail({
    to_email: email,
    user_name: name,
    entries: entries,
    subject: "Your Sweepstakes Entry is Confirmed!",
    site_name: import.meta.env.VITE_APP_NAME || 'Our Awesome Product'
  }, 'SWEEPSTAKES_ENTRY');
};

export const sendGenericWelcomeEmail = async (email, name = 'Valued User') => {
    return sendEmail({
        to_email: email,
        user_name: name,
        subject: `Welcome to ${import.meta.env.VITE_APP_NAME || 'Our Community'}!`,
        site_name: import.meta.env.VITE_APP_NAME || 'Our Awesome Product'
    }, 'WELCOME');
};

