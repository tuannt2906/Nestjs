export class User {
  id?: number;
  fullname?: string;
  age?: number;

  constructor({ id, fullname, age }) {
    if (id !== null) this.id = id;
    if (fullname !== null) this.fullname = fullname;
    if (age !== null) this.age = age;
  }
};