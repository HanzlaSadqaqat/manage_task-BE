import { userDocument } from "src/models/User";

declare global {
  namespace Express {
    interface User extends userDocument {}
  }
}
