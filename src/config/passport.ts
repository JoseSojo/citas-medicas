import passport from "passport";
import {Strategy} from "passport-local";
import UserModel from "../model/user/UserModel";

const User = new UserModel();

passport.use("local.login", new Strategy({
  usernameField: "email",
  passwordField: "password"
}, async (email: string, password: string, done: any) => {
  const user: any | null = await User.findUser({filter:{ email }});


  if (user) {
    const dbPassword: string = user.password;
    const match = await User.ComparePassword({password, dbPassword: dbPassword});
    if (match) {
      return done(null, user);
    } else {
      return done(null, false, {message: "Verifica tus credenciales."});
    }
  } else {

    return done(null, false, {message: "Verifica tus credenciales."});
  }
}));

passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done: any) => {
  const user = await User.findUser({filter:{id}});
  if(!user) return done(`404`, null);
  return done(null, user);
});
