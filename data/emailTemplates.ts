export interface EmailTheme {
    name: string;
    primaryColor: string; // Used for Button Background (Solid)
    secondaryColor: string; // Used for Button Gradient Start
    accentColor: string; // Used for H3/Links
    backgroundColor: string; // Used for Body Background
    cardBackgroundColor: string; // Used for Card Background
    textColor: string; // Main text color
    fontFamily?: string; // Optional font family
}

export interface EmailContent {
    headline: string;
    body: string; // Rich text (HTML subset)
    ctaText: string;
    ctaLink: string;
    imageUrl?: string; // Hero/Logo image URL
    showSocialLinks?: boolean;
}

export type EmailLayout = 'card' | 'full' | 'minimal';

export interface EmailTemplate {
    id: string;
    name: string;
    description: string;
    category: 'Welcome' | 'Seasonal' | 'Promotion' | 'Re-engagement' | 'Newsletter' | 'Service';
    layout: EmailLayout;
    defaultContent: EmailContent;
}

export const emailThemes: EmailTheme[] = [
    {
        name: 'Classic Navy',
        primaryColor: '#1c2d4a',
        secondaryColor: '#243a63',
        accentColor: '#b68a44',
        backgroundColor: '#f4f4f5',
        cardBackgroundColor: '#ffffff',
        textColor: '#333333',
        fontFamily: 'Arial, sans-serif'
    },
    {
        name: 'Modern Blue',
        primaryColor: '#3266d3',
        secondaryColor: '#8eb7f5',
        accentColor: '#1e40af',
        backgroundColor: '#eff6ff',
        cardBackgroundColor: '#ffffff',
        textColor: '#1e293b',
        fontFamily: 'Inter, sans-serif'
    },
    {
        name: 'Forest Green',
        primaryColor: '#16a34a',
        secondaryColor: '#22c55e',
        accentColor: '#15803d',
        backgroundColor: '#f0fdf4',
        cardBackgroundColor: '#ffffff',
        textColor: '#14532d',
        fontFamily: 'Georgia, serif'
    },
    {
        name: 'Urgent Red',
        primaryColor: '#dc2626',
        secondaryColor: '#ef4444',
        accentColor: '#991b1b',
        backgroundColor: '#fef2f2',
        cardBackgroundColor: '#ffffff',
        textColor: '#7f1d1d',
        fontFamily: 'Impact, sans-serif'
    },
    {
        name: 'Elegant Dark',
        primaryColor: '#18181b',
        secondaryColor: '#27272a',
        accentColor: '#d4d4d8',
        backgroundColor: '#09090b',
        cardBackgroundColor: '#18181b',
        textColor: '#f4f4f5',
        fontFamily: 'Courier New, monospace'
    }
];

export const emailTemplates: EmailTemplate[] = [
    {
        id: 'welcome-1',
        name: 'Warm Welcome',
        description: 'A professional introduction to new clients.',
        category: 'Welcome',
        layout: 'minimal',
        defaultContent: {
            headline: 'Welcome to the Family',
            body: '<p>I\'m <strong>[Your Name]</strong>, founder of <strong>[Company Name]</strong>. We are thrilled to have you on board! Thank you for choosing us for your home service needs.</p><p>Our team is dedicated to providing top-notch service and ensuring your home sparkles. We treat every home like it\'s our own.</p><h3>What to expect</h3><ul><li>Professional service</li><li>Satisfaction guarantee</li><li>Clear communication</li></ul>',
            ctaText: 'Book Your First Service',
            ctaLink: '{{booking_link}}',
            imageUrl: 'https://placehold.co/600x100/2563eb/ffffff?text=LOGO'
        }
    },
    {
        id: 'seasonal-spring',
        name: 'Spring Refresh',
        description: 'Promote deep cleaning services for spring.',
        category: 'Seasonal',
        layout: 'full',
        defaultContent: {
            headline: 'Spring is Here! 🌸',
            body: '<p>The flowers are blooming and it\'s the perfect time to freshen up your home!</p><p>Shake off the winter dust with our comprehensive <strong>Spring Deep Clean</strong> package. We\'ll get into every nook and cranny, leaving your home feeling brand new.</p>',
            ctaText: 'Get 15% Off',
            ctaLink: '{{booking_link}}',
            imageUrl: 'https://placehold.co/600x300/16a34a/ffffff?text=Spring+Cleaning'
        }
    },
    {
        id: 'seasonal-summer',
        name: 'Summer Ready',
        description: 'Get homes ready for summer hosting.',
        category: 'Seasonal',
        layout: 'card',
        defaultContent: {
            headline: 'Get Summer Ready ☀️',
            body: '<p>Summer is for relaxing, not cleaning. Let us handle the dirty work while you enjoy the sunshine.</p><p>Whether you\'re hosting BBQs or just relaxing, a clean home makes everything better.</p>',
            ctaText: 'Book Summer Clean',
            ctaLink: '{{booking_link}}',
            imageUrl: 'https://placehold.co/600x200/f59e0b/ffffff?text=Summer+Vibes'
        }
    },
    {
        id: 'seasonal-fall',
        name: 'Cozy Fall',
        description: 'Autumn cleaning promotion.',
        category: 'Seasonal',
        layout: 'full',
        defaultContent: {
            headline: 'Cozy Up for Fall 🍂',
            body: '<p>As the leaves change and we spend more time indoors, it\'s the perfect time to refresh your home.</p><p>Our <strong>Fall Refresh Package</strong> includes window cleaning, dusting high corners, and deep cleaning floors.</p>',
            ctaText: 'Schedule Now',
            ctaLink: '{{booking_link}}',
            imageUrl: 'https://placehold.co/600x300/ea580c/ffffff?text=Fall+Refresh'
        }
    },
    {
        id: 'seasonal-winter',
        name: 'Winter Prep',
        description: 'Pre-holiday cleaning services.',
        category: 'Seasonal',
        layout: 'card',
        defaultContent: {
            headline: 'Holiday Ready? ❄️',
            body: '<p>The holidays are coming! Guests, parties, and... cleaning?</p><p>Let us handle the mess so you can focus on the celebration. Spots fill up fast!</p>',
            ctaText: 'Book Holiday Clean',
            ctaLink: '{{booking_link}}',
            imageUrl: 'https://placehold.co/600x200/2563eb/ffffff?text=Winter+Ready'
        }
    },
    {
        id: 'review-request',
        name: 'Review Request',
        description: 'Ask happy clients for a 5-star review.',
        category: 'Service',
        layout: 'minimal',
        defaultContent: {
            headline: 'How did we do? ⭐',
            body: '<p>Thank you for choosing us! We hope you love the results.</p><p>Would you mind taking a moment to leave us a review? It helps our small business grow and helps neighbors find us.</p>',
            ctaText: 'Leave a Review',
            ctaLink: '{{review_link}}',
            imageUrl: 'https://placehold.co/600x100/fbbf24/ffffff?text=5+Stars'
        }
    },
    {
        id: 'referral-program',
        name: 'Referral Program',
        description: 'Encourage clients to refer friends.',
        category: 'Promotion',
        layout: 'card',
        defaultContent: {
            headline: 'Give $20, Get $20 💸',
            body: '<p>Love your clean home? Tell a friend!</p><p>When you refer a friend to us, <strong>they get $20 off</strong> their first service, and <strong>you get $20 off</strong> your next one!</p>',
            ctaText: 'Refer a Friend',
            ctaLink: '{{booking_link}}',
            imageUrl: 'https://placehold.co/600x200/16a34a/ffffff?text=Refer+&+Earn'
        }
    },
    {
        id: 'promo-flash',
        name: 'Flash Sale',
        description: 'Urgent 24-hour promotion.',
        category: 'Promotion',
        layout: 'full',
        defaultContent: {
            headline: '⚡ 24-Hour Flash Sale!',
            body: '<p>We have a few spots left in our schedule for next week.</p><p><strong>Book within 24 hours and save $25!</strong> Don\'t wait – these spots will go fast.</p>',
            ctaText: 'Book Now & Save',
            ctaLink: '{{booking_link}}',
            imageUrl: 'https://placehold.co/600x300/dc2626/ffffff?text=Flash+Sale'
        }
    },
    {
        id: 'newsletter-monthly',
        name: 'Monthly Tips',
        description: 'Educational content to build trust.',
        category: 'Newsletter',
        layout: 'minimal',
        defaultContent: {
            headline: '5 Tips for a Tidy Home 🧹',
            body: '<p>Keeping a home tidy can be a challenge. Here are 5 quick tips:</p><ul><li>Set a 15-minute timer</li><li>No shoes inside</li><li>Squeegee shower walls</li><li>Make the bed</li><li>Clean as you cook</li></ul>',
            ctaText: 'Read More',
            ctaLink: '{{website_link}}',
            imageUrl: 'https://placehold.co/600x150/475569/ffffff?text=Monthly+Tips'
        }
    },
    {
        id: 'service-new',
        name: 'New Service',
        description: 'Announce a new service offering.',
        category: 'Service',
        layout: 'card',
        defaultContent: {
            headline: 'New: Carpet Cleaning! ✨',
            body: '<p>We are excited to announce that we now offer <strong>Professional Carpet Cleaning</strong>!</p><p>Revitalize your carpets and improve your home\'s air quality with our new deep-clean technology.</p>',
            ctaText: 'Get a Quote',
            ctaLink: '{{booking_link}}',
            imageUrl: 'https://placehold.co/600x200/0ea5e9/ffffff?text=New+Service'
        }
    }
];

export const generateEmailHtml = (content: EmailContent, theme: EmailTheme, layout: EmailLayout = 'card'): string => {
    const { headline, body, ctaText, ctaLink, imageUrl } = content;
    const { primaryColor, secondaryColor, accentColor, backgroundColor, cardBackgroundColor, textColor } = theme;

    const commonStyles = `
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; color: ${textColor}; background-color: ${backgroundColor}; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
        a { color: ${accentColor}; text-decoration: underline; }
        .btn {
            display: inline-block; padding: 16px 32px; border-radius: 8px;
            background: ${primaryColor}; background-image: linear-gradient(180deg, ${secondaryColor}, ${primaryColor});
            color: #ffffff !important; text-decoration: none !important; font-weight: 700;
            font-size: 16px; line-height: 1; letter-spacing: 0.5px; border: 1px solid ${primaryColor};
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        h2 { color: ${primaryColor}; margin: 0 0 15px; font-size: 24px; letter-spacing: -0.5px; }
        h3 { color: ${accentColor}; margin-top: 30px; font-size: 18px; }
        ul { line-height: 1.8; padding-left: 20px; color: ${textColor}; }
        p { line-height: 1.6; margin-bottom: 16px; color: ${textColor}; }
        
        /* Responsive Styles */
        @media screen and (max-width: 600px) {
            .wrapper { width: 100% !important; max-width: 100% !important; padding: 20px !important; }
            .card { padding: 24px !important; }
            h2 { font-size: 22px !important; }
            .btn { display: block !important; width: 100% !important; box-sizing: border-box !important; text-align: center !important; }
        }

        @media (prefers-color-scheme: dark) {
            body { background-color: #18181b !important; color: #f4f4f5 !important; }
            h2 { color: #ffffff !important; }
            h3 { color: ${accentColor} !important; }
            p, ul { color: #d4d4d8 !important; }
        }
    `;

    // Layout Specific HTML Construction
    if (layout === 'minimal') {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta name="color-scheme" content="light dark">
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <style>
        ${commonStyles}
        body { background-color: #ffffff; } /* Minimal overrides bg to white */
        .wrapper { max-width: 600px; margin: auto; padding: 40px 20px; }
        .logo-area { margin-bottom: 30px; }
        .divider { height: 2px; background-color: ${primaryColor}; width: 40px; margin: 20px 0; }
        @media (prefers-color-scheme: dark) {
            body { background-color: #000000 !important; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        ${imageUrl ? `<div class="logo-area"><img src="${imageUrl}" alt="Logo" style="max-height: 60px; display: block;" /></div>` : ''}
        <h2>${headline}</h2>
        <div class="divider"></div>
        ${body}
        <div style="margin-top: 30px;">
            <a class="btn" href="${ctaLink}">${ctaText}</a>
        </div>
        <p style="margin-top: 40px; font-size: 14px; color: #71717a; border-top: 1px solid #e4e4e7; padding-top: 20px;">
            Best regards,<br><strong>{{company_name}}</strong><br>
            <span style="font-size: 12px;">{{company_address}} | <a href="{{unsubscribe_link}}">Unsubscribe</a></span>
        </p>
    </div>
</body>
</html>`;
    }

    if (layout === 'full') {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta name="color-scheme" content="light dark">
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <style>
        ${commonStyles}
        .wrapper { width: 100%; }
        .hero { background-color: ${primaryColor}; color: white; text-align: center; padding: 0; }
        .hero img { width: 100%; max-width: 600px; display: block; margin: 0 auto; }
        .content { max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: ${cardBackgroundColor}; }
        h2 { color: ${primaryColor}; text-align: center; font-size: 28px; margin-top: 20px; }
        .btn-wrap { text-align: center; margin-top: 30px; }
        @media (prefers-color-scheme: dark) {
            .content { background-color: #18181b !important; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="hero">
            ${imageUrl ? `<img src="${imageUrl}" alt="Hero" />` : ''}
        </div>
        <div class="content">
            <h2>${headline}</h2>
            ${body}
            <div class="btn-wrap">
                <a class="btn" href="${ctaLink}">${ctaText}</a>
            </div>
            <p style="text-align: center; margin-top: 40px; font-size: 12px; color: #a1a1aa;">
                {{company_name}} • {{company_address}}<br>
                <a href="{{unsubscribe_link}}" style="color: #a1a1aa;">Unsubscribe</a>
            </p>
        </div>
    </div>
</body>
</html>`;
    }

    // Default: 'card' layout
    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="color-scheme" content="light dark">
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <style>
      ${commonStyles}
      .wrapper { max-width: 600px; margin: auto; }
      .card {
        background-color: ${cardBackgroundColor};
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }
      .cta-wrap { text-align: center; margin: 30px 0; }
      .hero-image { width: 100%; max-width: 100%; border-radius: 8px; margin-bottom: 24px; display: block; }
      @media (prefers-color-scheme: dark) {
        .card { background-color: #27272a !important; box-shadow: 0 0 0 1px #3f3f46; }
      }
    </style>
  </head>
  <body>
    <table width="100%" cellspacing="0" cellpadding="0" class="wrapper" style="border-collapse:collapse;">
      <tr>
        <td style="text-align:center; padding: 40px 0 30px;">
           <div style="font-weight: bold; font-size: 20px; color: ${primaryColor};">{{company_name}}</div>
        </td>
      </tr>
      <tr>
        <td class="card">
          ${imageUrl ? `<img src="${imageUrl}" alt="Hero" class="hero-image" />` : ''}
          <h2>${headline}</h2>
          ${body}
          <div class="cta-wrap">
            <a class="btn" href="${ctaLink}" target="_blank" rel="noopener">${ctaText}</a>
          </div>
          <p style="margin-top: 25px; font-size: 14px; color: #71717a;">Best regards,<br><strong>{{company_name}}</strong></p>
        </td>
      </tr>
      <tr>
        <td style="padding: 30px 40px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #a1a1aa;">
            {{company_address}}<br>
            <a href="{{unsubscribe_link}}" style="color: #a1a1aa; text-decoration: underline;">Unsubscribe</a>
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};
