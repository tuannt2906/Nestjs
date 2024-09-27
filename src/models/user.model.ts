export class User {
  id: number;
  username: string;
  password: string;
  email: string;

  constructor({
    id,
    username,
    password,
    email
  }: {
    id: number;
    username: string;
    password: string;
    email: string;
  }) {
    Object.assign(this, { id, username, password, email});
  }
}
