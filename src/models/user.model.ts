export class User {
  id?: number;
  username?: string;
  password?: string;
  email?: string;
  gender?: string;
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
    gender?: string;
    phonenumber?: string;
    age?: number;
  }) {
    if (id !== null && id !== undefined) this.id = id;
    if (username !== null && username !== undefined) this.username = username;
    if (password !== null && password !== undefined) this.password = password;
    if (email !== null && email !== undefined) this.email = email;
    if (gender !== null && gender !== undefined) this.gender = gender;
    if (phonenumber !== null && phonenumber !== undefined) this.phonenumber = phonenumber;
    if (age !== null && age !== undefined) this.age = age;
  }
}