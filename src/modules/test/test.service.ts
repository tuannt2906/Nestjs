import { Injectable } from '@nestjs/common';
import { CommonService } from 'modules/global/commonService';

@Injectable()
export class TestService extends CommonService<any,any>{

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
    }}
