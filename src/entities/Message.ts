import { IUser } from "./Auth.ts";

export interface IMessage {
  id: number;
  text: string;
  parent_id: number;
  user_id: number;
  user: IUser;
  created_at: string;
}
