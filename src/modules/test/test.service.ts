import { Injectable } from '@nestjs/common';
import { CommonService } from 'modules/global/commonService';

@Injectable()
export class TestService extends CommonService<any,any>{

    constructor() {
     super();
     this.data = [
       {
         id: 1,
         name: "Dog",
         password: "hashed_password1",
        
       },
       {
         id: 2,
         username: "robert adam",
      
       },
     ]
    }
}
