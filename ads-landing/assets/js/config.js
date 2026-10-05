/* ============ SETTINGS for the landing page and the thank-you page ============
   Edit these values, save, and redeploy. See README.md. */
window.HS_CONFIG = {
  // WhatsApp Business number, digits only, with country code, e.g. "971501234567".
  // While empty, every WhatsApp button is hidden.
  WHATSAPP_NUMBER: '',
  // Where the form is sent. "/api/lead" is the email function (api/lead.js),
  // which emails every lead to the team through Resend.
  FORM_ENDPOINT: '/api/lead',
  // Full URL of the privacy policy. While empty, the privacy links are hidden.
  PRIVACY_URL: '',
  // Where a delivered lead lands. The Google Ads / Meta conversion fires there.
  THANK_YOU_URL: 'thank-you.html',
};
