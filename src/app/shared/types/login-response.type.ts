import { User } from "./user.type"

export type LoginResponse = {
  token: string,
  message: string,
  user: User
}
