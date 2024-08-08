import { Injectable } from '@nestjs/common';
import { UserDTO } from 'dto/user.dto';
import { User } from 'models/user.model';
import { CommonService } from 'modules/global/commonService';

@Injectable()
export class UserService extends CommonService<User,UserDTO>{

 constructor() {
  super();
  this.data = [
    {
      id: 1,
      username: "alex palestine",
      password: "hashed_password1",
      email: "alex.p@example.com",
      gender: "male",
      phonenumber: "+1234567890",
      age: 18
    },
    {
      id: 2,
      username: "robert adam",
      password: "hashed_password2",
      email: "robert.a@example.com",
      gender: "male",
      phonenumber: "+0987654321",
      age: 19
    },
  ]
 }

  // updateUser(userDTO: UserDTO, id: number): User {
  //   const index = this.users.findIndex(item => item.id === Number(id));
  //   this.users[index].username = userDTO.username;
  //   this.users[index].password = userDTO.password;
  //   this.users[index].email = userDTO.email;
  //   this.users[index].gender = userDTO.gender;
  //   this.users[index].phonenumber = userDTO.phonenumber;
  //   this.users[index].age = userDTO.age;
  //   return this.users[index];
  // }

  // deleteUser(id: number): boolean {
  //   const index = this.users.findIndex(item => item.id === Number(id));
  //   if (index !== -1) {
  //     this.users.splice(index, 1);
  //     return true;
  //   }
  //   return false;
  // }
}
