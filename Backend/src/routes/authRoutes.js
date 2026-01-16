import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/login` }),
  (req, res) => {
    try {
      const user = req.user;
      const payload = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev_jwt_secret', { expiresIn: '7d' });

      // Redirect to frontend with token in query (frontend should read and store it securely)
      return res.redirect(`${FRONTEND_URL}/auth-success?token=${token}`);
    } catch (err) {
      console.error('Error generating JWT after Google auth:', err);
      return res.redirect(`${FRONTEND_URL}/login`);
    }
  }
);

export default router;
