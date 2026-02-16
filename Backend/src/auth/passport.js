import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/usersModel.js';

export default function configurePassport() {

  

  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackURL = process.env.GOOGLE_CALLBACK_URL;

  if (!clientID || !clientSecret || !callbackURL) {
    console.warn('Google OAuth env vars not fully set. Skipping Passport Google setup.');
    return;
  }

  console.info('Configuring Passport Google strategy with callback:', callbackURL);
  console.info('Google Client ID loaded:', clientID ? `${clientID.slice(0, 8)}...` : 'missing');

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
          const allowedDomain = "@umariana.edu.co";

          if (!email.endsWith(allowedDomain)) {
            console.log("Acceso denegado:", email);
            return done(null, false, {
              message: "Solo correos institucionales permitidos"
            });
          }

          let user = await User.findOne({ email });

          if (!user) {
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}
