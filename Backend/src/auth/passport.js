import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import fs from 'fs';
import User from '../models/usersModel.js';
export default function configurePassport() {
  

  dotenv.config();
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CALLBACK_URL) {
    const altPath = '.env.google';
    if (fs.existsSync(altPath)) {
      dotenv.config({ path: altPath });
      console.info(`Loaded environment from ${altPath}`);
    }
  }

  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackURL = process.env.GOOGLE_CALLBACK_URL;

  if (!clientID || !clientSecret || !callbackURL) {
    console.warn('Google OAuth env vars not fully set. Skipping Passport Google setup.');
    console.warn('Expected GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL.');
    return;
  }

  console.info('Configuring Passport Google strategy with callback:', callbackURL);
  console.info('Google Client ID loaded:', clientID ? `${clientID.slice(0,8)}...` : 'missing');

  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL,
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email
          });
        }
        return done(null, profile);
      }catch (err) {
        return done(err, null);
        }
        }
    )
  );


}
