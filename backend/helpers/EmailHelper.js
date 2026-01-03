import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import { getVendorMailById } from "./VendorHelper.js";
import { getRFPById } from "./rfpHelper.js";
import { getBuyerById } from "./BuyerHelper.js";
import RfpVendor from "../models/rfpVendor.js";
import Rfp from "../models/rfp.js";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendVerificationEmail(email, token, userId, userType) {
  const baseUrl =
    `${process.env.PROTOCAL}://${process.env.DB_HOST}:${process.env.PORT}` ||
    "http://localhost:8080";
  const verificationUrl = `${baseUrl}/api/verify-email?token=${token}&userId=${userId}&userType=${userType}`;

  const msg = {
    to: email,
    from: {
      email: process.env.EMAIL_USER,
      name: "RFP_CONNECT",
    },
    subject: "✅ Verify Your RFP_CONNECT Account",
    html: `
    <div style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background-color: #f4f4f4; line-height: 1.6; color: #333;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #ddd;">
        <!-- Header -->
        <tr>
          <td style="padding: 40px 32px; text-align: center; background: linear-gradient(135deg, #d8400e 0%, #d8400e 50%, #b7300a 100%); color: white;">
            <h1 style="font-size: 28px; font-weight: 800; margin: 0 0 8px; letter-spacing: -0.02em;">Verify Your RFP_CONNECT Account</h1>
            <p style="font-size: 16px; margin: 0; font-weight: 500; opacity: 0.95;">Connect with verified users instantly</p>
          </td>
        </tr>
        
        <!-- Main Content -->
        <tr>
          <td style="padding: 48px 36px;">
            <h2 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 16px; letter-spacing: -0.01em;">Welcome to RFP_CONNECT! 👋</h2>
            <p style="font-size: 17px; color: #6b7280; line-height: 1.6; margin: 0 0 36px;">Verify your email to access professional like Tech Solutions, and Bright Logistics Pvt Ltd for your RFPs.</p>

            <!-- Primary Button -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 36px; text-align: center;">
              <tr>
                <td>
                  <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #d8400e 0%, #d8400e 100%); color: white !important; padding: 18px 48px; text-decoration: none; font-size: 17px; font-weight: 700; border: 2px solid #d8400e; letter-spacing: -0.01em; min-width: 220px;">Verify Email Now</a>
                </td>
              </tr>
            </table>

            <!-- Security Notice -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 32px auto; background: #fef7ed; border: 1px solid #fed7aa; border-left: 5px solid #d8400e; padding: 24px; width: 100%;">
              <tr>
                <td style="text-align: center;">
                  <p style="font-size: 15px; color: #92400e; font-weight: 600; margin: 0 0 8px;">Didn't request this?</p>
                  <p style="font-size: 14px; color: #c2410c; margin: 0;">
                    <a href="#" style="color: #dc2626; text-decoration: underline; font-weight: 600;">Secure your account</a>
                  </p>
                </td>
              </tr>
            </table>

            <!-- Expires Notice -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="background: #f3f4f6; border: 1px solid #d1d5db; border-left: 4px solid #d8400e; padding: 20px 24px; margin: 28px auto; width: 100%;">
              <tr>
                <td style="display: flex; align-items: center; gap: 12px;">
                  <div style="width: 8px; height: 8px; background: #d8400e; border: 1px solid #fb923c;"></div>
                  <span style="font-size: 14px; color: #6b7280; font-weight: 500;">This link expires in <strong style="color: #111827;">24 hours</strong></span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding: 32px 36px 48px; text-align: center; border-top: 1px solid #e5e7eb; background-color: #f8fafc;">
            <p style="font-size: 14px; color: #6b7280; line-height: 1.5; margin: 0 0 12px;">
              Need help? Reply to this email or contact 
              <a href="mailto:support@rfpconnect.com" style="color: #d8400e; text-decoration: none; font-weight: 600;">support@rfpconnect.com</a>
            </p>
            <p style="font-size: 13px; color: #9ca3af; margin: 0;">
              © 2025 RFP_CONNECT. All rights reserved. | 
              <a href="#" style="color: #6b7280; text-decoration: none;">Unsubscribe</a>
            </p>
          </td>
        </tr>
      </table>
    </div>
  `,
  };

  await sgMail.send(msg);
}

export async function sendVendorBuyersProposal(token, userId, rfpId) {
  try {
    var { emailAddress, vendorCompanyName } = await getVendorMailById(userId);
    var rfp = await getRFPById(rfpId);
    var { data } = await getBuyerById(rfp.toJSON().buyerId);
    const baseUrl =
      `${process.env.PROTOCAL}://${process.env.DB_HOST}:${process.env.PORT}` ||
      "http://localhost:8080";
    const acceptUrl = `${baseUrl}/api/rfp/vendor-response/${token}/${userId}/${rfpId}/true`;
    const rejectUrl = `${baseUrl}/api/rfp/vendor-response/${token}/${userId}/${rfpId}/false`;
    const rfpJSON = rfp.toJSON();
    const rfpTitle = rfpJSON.rfpTitle;
    const buyerName = `${data.firstName} ${data.lastName}`;
    const rfpDeadline = rfpJSON.expectedDelivery;
    const rfpBudget = `₹ ${rfpJSON.budgetRange}`;
    const rfpDetailsUrl = `${baseUrl}/rfps/${rfpId}`;
    const buyerMail = data.emailAddress;
    const msg = {
      to: [{ email: emailAddress }],
      cc: buyerMail ? [{ email: buyerMail }] : [],
      from: {
        email: process.env.EMAIL_USER,
        name: "RFP_CONNECT",
      },
      subject: "✅ Got shortlisted by a buyer for an RFP",
      html: `
  <div style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background-color: #f4f4f4; line-height: 1.6; color: #333;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #ddd;">
    
    <!-- Header -->
    <tr>
      <td style="padding: 40px 32px; text-align: center; background: linear-gradient(135deg, #d8400e 0%, #d8400e 50%, #b7300a 100%); color: white;">
        <h1 style="font-size: 28px; font-weight: 800; margin: 0 0 8px; letter-spacing: -0.02em;">🎉 You're Shortlisted!</h1>
        <p style="font-size: 16px; margin: 0; font-weight: 500; opacity: 0.95;">Buyer selected you for an RFP opportunity</p>
      </td>
    </tr>
    
    <!-- Main Content -->
    <tr>
      <td style="padding: 48px 36px;">
        <h2 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 16px; letter-spacing: -0.01em;">Congratulations ${
          vendorCompanyName || "Vendor"
        }!</h2>
        <p style="font-size: 17px; color: #6b7280; line-height: 1.6; margin: 0 0 8px;">You've been <strong style="color: #d8400e;">shortlisted</strong> by a buyer for RFP:</p>
        <p style="font-size: 18px; color: #111827; font-weight: 600; margin: 0 0 36px; background: #fef7ed; padding: 16px 20px; border-left: 4px solid #d8400e; border-radius: 8px;">
          "${rfpTitle || "New Procurement Opportunity"}"
        </p>

        <!-- Action Buttons -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 36px;">
          <tr>
            <td style="padding-right: 12px;">
              <a href="${acceptUrl}" style="display: inline-block; background: linear-gradient(135deg, #d8400e 0%, #d8400e 100%); color: white !important; padding: 18px 32px; text-decoration: none; font-size: 17px; font-weight: 700; border: 2px solid #d8400e; letter-spacing: -0.01em; min-width: 140px; border-radius: 8px; box-shadow: 0 4px 12px rgba(216, 64, 14, 0.3);">✅ Accept</a>
            </td>
            <td style="padding-left: 12px;">
              <a href="${rejectUrl}" style="display: inline-block; background: #f3f4f6; color: #374151 !important; padding: 18px 32px; text-decoration: none; font-size: 17px; font-weight: 700; border-radius: 8px; min-width: 140px; border: 2px solid #d1d5db;">❌ Reject</a>
            </td>
          </tr>
        </table>

        <!-- Learn More Button -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 36px; text-align: center;">
          <tr>
            <td>
              <a href="${rfpDetailsUrl}" style="display: inline-block; background: linear-gradient(135deg, #d8400e 0%, #b7300a 100%); color: white !important; padding: 16px 40px; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; min-width: 200px;">📋 Know More About RFP</a>
            </td>
          </tr>
        </table>

        <!-- RFP Details -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 28px; margin: 28px 0; width: 100%;">
          <tr>
            <td>
              <h3 style="font-size: 18px; font-weight: 700; color: #111827; margin: 0 0 20px;">RFP Quick Info</h3>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 15px; color: #6b7280;">
                <tr>
                  <td style="padding: 8px 0; font-weight: 500; color: #374151;">Posted by:</td>
                  <td style="padding: 8px 0; color: #111827; font-weight: 600;">${
                    buyerName || "Premium Buyer"
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 500; color: #374151;">Closes:</td>
                  <td style="padding: 8px 0; color: #111827; font-weight: 600;">${
                    rfpDeadline || "Soon"
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 500; color: #374151;">Budget:</td>
                  <td style="padding: 8px 0; color: #d8400e; font-weight: 700;">${
                    rfpBudget || "Competitive"
                  }</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Action Required Notice -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="background: #fef7ed; border: 1px solid #fed7aa; border-left: 5px solid #d8400e; padding: 24px; margin: 28px auto; width: 100%;">
          <tr>
            <td style="text-align: center;">
              <p style="font-size: 15px; color: #92400e; font-weight: 600; margin: 0 0 8px;">
                ⏰ <strong>Respond within 48 hours</strong> to stay in consideration
              </p>
              <p style="font-size: 14px; color: #c2410c; margin: 0;">Your response helps buyers make faster decisions</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 32px 36px 48px; text-align: center; border-top: 1px solid #e5e7eb; background-color: #f8fafc;">
        <p style="font-size: 14px; color: #6b7280; line-height: 1.5; margin: 0 0 12px;">
          Questions? Reply to this email or contact 
          <a href="mailto:support@rfpconnect.com" style="color: #d8400e; text-decoration: none; font-weight: 600;">support@rfpconnect.com</a>
        </p>
        <p style="font-size: 13px; color: #9ca3af; margin: 0;">
          © 2025 RFP_CONNECT. All rights reserved. | 
          <a href="#" style="color: #6b7280; text-decoration: none;">Unsubscribe</a>
        </p>
      </td>
    </tr>
  </table>
</div>
  `,
    };

    await sgMail.send(msg);
    await RfpVendor.update(
      { notificationSent: true },
      { where: { rfpId, vendorId: userId } }
    );
    await Rfp.update({ notificationSent: true }, { where: { id: rfpId } });
    return { success: true, error: null };
  } catch (error) {
    console.log(error);
    return { error, success: false };
  }
}

// function to send a mail to buyer
export async function sendProposalResponseToBuyer(isAccepted, rfpId, vendorId) {
  try {
    var { emailAddress, vendorCompanyName } = await getVendorMailById(vendorId);
    var rfp = await getRFPById(rfpId);
    const frontendUrl =
      `${process.env.PROTOCAL}://${process.env.DB_HOST}:${process.env.FE_PORT}` ||
      "http://localhost:3000";
    const rfpTitle = rfp.toJSON().rfpTitle;
    const responseType = isAccepted === "true" ? "accepted" : "rejected";
    const rfpDashboardUrl = `${frontendUrl}/rfp-matching/${rfpId}`;
    const msg = {
      to: emailAddress,
      from: {
        email: process.env.EMAIL_USER,
        name: "RFP_CONNECT",
      },
      subject: `✅ ${vendorCompanyName} responded to "${rfpTitle}" RFP`,
      html: `
  <div style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background-color: #f4f4f4; line-height: 1.6; color: #333;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #ddd;">
      
      <!-- Header -->
      <tr>
        <td style="padding: 40px 32px; text-align: center; background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%); color: white;">
          <h1 style="font-size: 28px; font-weight: 800; margin: 0 0 8px; letter-spacing: -0.02em;">${
            responseType === "accepted" ? "✅ Accepted!" : "❌ Declined"
          }</h1>
          <p style="font-size: 16px; margin: 0; font-weight: 500; opacity: 0.95;">Vendor responded to your RFP</p>
        </td>
      </tr>
      
      <!-- Main Content -->
      <tr>
        <td style="padding: 48px 36px;">
          <h2 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 16px; letter-spacing: -0.01em;">Update on "${rfpTitle}"</h2>
          
          <!-- Response Status -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="background: ${
            responseType === "accepted" ? "#f0fdf4" : "#fef2f2"
          }; border: 1px solid ${
        responseType === "accepted" ? "#bbf7d0" : "#fecaca"
      }; border-left: 5px solid ${
        responseType === "accepted" ? "#10b981" : "#ef4444"
      }; padding: 28px; margin: 0 0 36px; border-radius: 8px; width: 100%;">
            <tr>
              <td style="text-align: center;">
                <div style="font-size: 48px; font-weight: 800; margin-bottom: 12px;">${
                  responseType === "accepted" ? "✅" : "❌"
                }</div>
                <h3 style="font-size: 22px; font-weight: 700; color: ${
                  responseType === "accepted" ? "#166534" : "#991b1b"
                }; margin: 0 0 8px;">
                  ${vendorCompanyName} ${
        responseType === "accepted" ? "Accepted" : "Declined"
      } your RFP
                </h3>
                <p style="font-size: 16px; color: ${
                  responseType === "accepted" ? "#065f46" : "#7f1d1d"
                }; margin: 0; font-weight: 500;">
                  ${
                    responseType === "accepted"
                      ? "Ready to submit proposal!"
                      : "Chose not to participate"
                  }
                </p>
              </td>
            </tr>
          </table>

          <!-- Next Steps -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 36px auto; text-align: center;">
            <tr>
              <td>
                <a href="${rfpDashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white !important; padding: 18px 40px; text-decoration: none; font-size: 17px; font-weight: 700; border-radius: 8px; min-width: 220px;">📊 View RFP Dashboard</a>
              </td>
            </tr>
          </table>

          <!-- Simplified Status Notice -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="background: #fef3cd; border: 1px solid #fde68a; border-left: 5px solid #d97706; padding: 24px; margin: 28px auto; width: 100%;">
            <tr>
              <td style="text-align: center;">
                <p style="font-size: 15px; color: #92400e; font-weight: 600; margin: 0 0 8px;">
                  Monitor all vendor responses in your dashboard
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding: 32px 36px 48px; text-align: center; border-top: 1px solid #e5e7eb; background-color: #f8fafc;">
          <p style="font-size: 14px; color: #6b7280; line-height: 1.5; margin: 0 0 12px;">
            Questions? Reply to this email or contact 
            <a href="mailto:support@rfpconnect.com" style="color: #d8400e; text-decoration: none; font-weight: 600;">support@rfpconnect.com</a>
          </p>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">
            © 2025 RFP_CONNECT. All rights reserved. | 
            <a href="#" style="color: #6b7280; text-decoration: none;">Unsubscribe</a>
          </p>
        </td>
      </tr>
    </table>
  </div>
  `,
    };

    await sgMail.send(msg);
  } catch (error) {
    console.log(error);
  }
}
