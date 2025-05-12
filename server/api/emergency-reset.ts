import { Request, Response } from 'express';

/**
 * Emergency reset API endpoint that can be directly called
 * to reset onboarding state when mobile views disappear
 */
export async function resetOnboarding(req: Request, res: Response) {
  try {
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Chronos Vault Emergency Reset</title>
        <style>
          body {
            font-family: system-ui, sans-serif;
            background-color: #000;
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            text-align: center;
          }
          .container {
            max-width: 500px;
            background: #111;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 0 20px rgba(107, 0, 215, 0.3);
            border: 1px solid rgba(107, 0, 215, 0.3);
          }
          h1 {
            color: #FF5AF7;
            margin-bottom: 16px;
          }
          p {
            margin-bottom: 24px;
            opacity: 0.9;
          }
          .btn {
            background: linear-gradient(to right, #6B00D7, #FF5AF7);
            color: white;
            font-weight: bold;
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            margin: 8px 0;
            display: inline-block;
            text-decoration: none;
            font-size: 16px;
          }
          .btn-secondary {
            background: transparent;
            border: 1px solid rgba(107, 0, 215, 0.5);
          }
          .success {
            background: rgba(0, 128, 0, 0.2);
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 16px;
            border: 1px solid rgba(0, 128, 0, 0.3);
          }
          .logo {
            width: 64px;
            height: 64px;
            border: 3px solid #6B00D7;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
            background: black;
          }
          .logo svg {
            width: 32px;
            height: 32px;
            fill: #FF5AF7;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
          </div>
          <h1>Chronos Vault Reset</h1>
          <div class="success">Reset successful! Your onboarding state has been reset.</div>
          <p>This will clear all local storage for the Chronos Vault application and allow you to restart the onboarding process.</p>
          <div>
            <a href="/mobile-direct" class="btn">Go to Mobile Experience</a>
          </div>
          <div style="margin-top: 10px;">
            <a href="/onboarding" class="btn btn-secondary">Try Regular Onboarding</a>
          </div>
          <div style="margin-top: 24px; opacity: 0.6; font-size: 12px;">
            <p>Chronos Vault Mobile Reset</p>
            <p>Version 1.0</p>
          </div>
        </div>
        <script>
          // Clear all localStorage
          localStorage.clear();
          
          // Set initial values for fresh start
          localStorage.setItem('chronosVault.firstVisit', 'true');
          localStorage.setItem('chronosVault.onboardingStep', JSON.stringify('welcome'));
          localStorage.setItem('chronosVault.onboardingCompleted', 'false');
          localStorage.setItem('chronosVault.isMobile', 'true');
          
          // Log success
          console.log('Chronos Vault localStorage reset complete');
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error in emergency reset endpoint:', error);
    res.status(500).json({ error: 'Reset failed' });
  }
}