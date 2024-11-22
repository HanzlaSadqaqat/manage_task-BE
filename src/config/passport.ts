import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { env } from "./env";
import User, { userDocument } from "../models/User";

passport.serializeUser((user: userDocument, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Local Strategy
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email, provider: "local" });
        if (!user) {
          return done(null, false, { message: "Invalid credentials" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid credentials" });
        }

        if (!user.verified) {
          return done(null, false, { message: "Please verify your email" });
        }

        return done(null, user);
      } catch (error) {
        done(error, undefined);
      }
    }
  )
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID:
        env.GOOGLE_CLIENT_ID ||
        "423221152830-sfna3bsl9r4tu4dd85lftbvt2a9gjkkr.apps.googleusercontent.com",
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${env.FRONTEND_URL}/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          $or: [
            { email: profile.emails?.[0].value },
            { providerId: profile.id, provider: "google" },
          ],
        });

        if (!user) {
          user = await User.create({
            email: profile.emails?.[0].value,
            name: profile.displayName,
            provider: "google",
            providerId: profile.id,
            avatar: profile.photos?.[0].value,
            verified: true,
          });
        }

        done(null, user);
      } catch (error) {
        done(error, undefined);
      }
    }
  )
);

// GitHub Strategy
// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: env.GITHUB_CLIENT_ID,
//       clientSecret: env.GITHUB_CLIENT_SECRET,
//       callbackURL: `${env.FRONTEND_URL}/auth/github/callback`,
//     },
//     async (_accessToken, _refreshToken, profile, done) => {
//       try {
//         let user = await User.findOne({
//           $or: [
//             { email: profile.emails?.[0].value },
//             { providerId: profile.id, provider: "github" },
//           ],
//         });

//         if (!user) {
//           user = await User.create({
//             email: profile.emails?.[0].value,
//             name: profile.displayName || profile.username,
//             provider: "github",
//             providerId: profile.id,
//             avatar: profile.photos?.[0].value,
//             verified: true,
//           });
//         }

//         done(null, user);
//       } catch (error) {
//         done(error, undefined);
//       }
//     }
//   )
// );

export default passport;
