export class User {
  id?: number;
  username?: string;
  password?: string;
  email?: string;
  gender?: number;
  phonenumber?: string;
  age?: number;

  constructor({
    id,
    username,
    password,
    email,
    gender,
    phonenumber,
    age
  }: {
    id?: number;
    username?: string;
    password?: string;
    email?: string;
    gender?: number;
    phonenumber?: string;
    age?: number;
  }) {
    Object.assign(this, { id, username, password, email, gender, phonenumber, age });
  }
}
