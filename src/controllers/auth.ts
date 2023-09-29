import User, { userDocument } from "../models/User";
import bcrypt from "bcrypt";

export class AuthController {
  async signup(body) {
    const { name, email, password, conformPassword } = body;
    const existingUser: userDocument | null = await User.findOne({ email });
    if (existingUser) {
      throw {
        code: 403,
        message: "User Already Exists",
      };
    }
    const check: boolean = password === conformPassword;
    if (!check)
      throw {
        code: 403,
        message: "Conform password not matched",
      };
    //create hash of your password
    const hashPassword = await bcrypt.hash(password, 10);

    //create new user
    const newUser: userDocument = new User({
      name,
      email,
      password: hashPassword,
    });

    await newUser.save();
    return {
      code: 200,
      message: "User Created Successfully",
    };
  }
  async login(body) {
    const { email, password } = body;
    const existingUser: userDocument | null = await User.findOne({ email });
    if (!existingUser) {
      throw {
        code: 403,
        message: "invalid Login Details",
      };
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch)
      throw {
        code: 403,
        message: "invalid Login Details",
      };

    return {
      code: 200,
      message: "Login successfully",
    };
  }
}
