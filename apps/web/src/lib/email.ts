import { Resend } from 'resend';
import prisma from '@/lib/prisma';

// It is possible this is called on the edge, so gracefully degrade if RESEND_API_KEY is missing
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = 'ArtisanConnect <onboarding@resend.dev>'; // Using Resend's default testing domain

/**
 * Logs the email attempt to the database
 */
async function logEmail(to: string, template: string, status: 'SENT' | 'FAILED', error?: string, providerId?: string) {
  try {
    await prisma.emailLog.create({
      data: {
        to_email: to,
        template,
        status,
        error,
        provider_id: providerId
      }
    });
  } catch (err) {
    console.error('Failed to log email to DB:', err);
  }
}

/**
 * Send Welcome Email to Customers
 */
export async function sendCustomerWelcomeEmail(to: string, firstName: string) {
  if (!resend) return;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #2563eb;">Welcome to ArtisanConnect, ${firstName}! 🎉</h2>
      <p>We are thrilled to have you on board. Finding trusted, verified artisans in Ghana has never been easier.</p>
      <p>Whether you need a quick plumbing fix, some electrical work, or a major carpentry project, our professionals are ready to help.</p>
      <a href="http://localhost:3000/artisans" style="display: inline-block; background-color: #2563eb; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">Find an Artisan</a>
      <p style="margin-top: 30px; font-size: 14px; color: #666;">- The ArtisanConnect Team</p>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Welcome to ArtisanConnect!',
      html,
    });

    if (error) {
      await logEmail(to, 'CUSTOMER_WELCOME', 'FAILED', error.message);
      console.error('Resend Error:', error);
    } else {
      await logEmail(to, 'CUSTOMER_WELCOME', 'SENT', undefined, data?.id);
    }
  } catch (err: any) {
    await logEmail(to, 'CUSTOMER_WELCOME', 'FAILED', err.message);
  }
}

/**
 * Send Welcome Email to Artisans (Includes Verification Reminder)
 */
export async function sendArtisanWelcomeEmail(to: string, firstName: string) {
  if (!resend) return;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #2563eb;">Welcome to ArtisanConnect, ${firstName}! 🛠️</h2>
      <p>Thank you for joining our platform. You're one step away from connecting with customers who need your skills.</p>
      <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #991b1b;">⚠️ Action Required: Verify Your Identity</h3>
        <p style="color: #7f1d1d; margin-bottom: 0;">To appear in customer search results and receive jobs, you must verify your identity. Please log in to your dashboard and upload your Ghana Card and a selfie.</p>
      </div>
      <a href="http://localhost:3000/dashboard/profile" style="display: inline-block; background-color: #2563eb; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Verify Identity Now</a>
      <p style="margin-top: 30px; font-size: 14px; color: #666;">- The ArtisanConnect Team</p>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Action Required: Verify your ArtisanConnect Account',
      html,
    });

    if (error) {
      await logEmail(to, 'ARTISAN_WELCOME', 'FAILED', error.message);
    } else {
      await logEmail(to, 'ARTISAN_WELCOME', 'SENT', undefined, data?.id);
    }
  } catch (err: any) {
    await logEmail(to, 'ARTISAN_WELCOME', 'FAILED', err.message);
  }
}

/**
 * Send New Request Notification to Artisan
 */
export async function sendNewRequestEmail(to: string, artisanName: string, customerName: string, jobTitle: string) {
  if (!resend) return;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #2563eb;">New Service Request! 🚀</h2>
      <p>Hi ${artisanName},</p>
      <p>You have received a new service request from <strong>${customerName}</strong>.</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Job Title:</strong> ${jobTitle}</p>
      </div>
      <p>Please log in to your dashboard to review the request, chat with the customer, and provide a quote.</p>
      <a href="http://localhost:3000/dashboard/requests" style="display: inline-block; background-color: #2563eb; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Request</a>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `New Request from ${customerName}: ${jobTitle}`,
      html,
    });
    if (error) {
      await logEmail(to, 'NEW_REQUEST', 'FAILED', error.message);
    } else {
      await logEmail(to, 'NEW_REQUEST', 'SENT', undefined, data?.id);
    }
  } catch (err: any) {
    await logEmail(to, 'NEW_REQUEST', 'FAILED', err.message);
  }
}

/**
 * Send Status Update Notification to Customer
 */
export async function sendStatusUpdateEmail(to: string, customerName: string, artisanName: string, jobTitle: string, status: string) {
  if (!resend) return;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #2563eb;">Job Status Update 🔔</h2>
      <p>Hi ${customerName},</p>
      <p><strong>${artisanName}</strong> has updated the status of your service request.</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Job Title:</strong> ${jobTitle}</p>
        <p style="margin: 10px 0 0 0;"><strong>New Status:</strong> <span style="background-color: #e2e8f0; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${status}</span></p>
      </div>
      <a href="http://localhost:3000/dashboard/requests" style="display: inline-block; background-color: #2563eb; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Dashboard</a>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Update on your request: ${jobTitle}`,
      html,
    });
    if (error) {
      await logEmail(to, 'STATUS_UPDATE', 'FAILED', error.message);
    } else {
      await logEmail(to, 'STATUS_UPDATE', 'SENT', undefined, data?.id);
    }
  } catch (err: any) {
    await logEmail(to, 'STATUS_UPDATE', 'FAILED', err.message);
  }
}
