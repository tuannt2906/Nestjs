import { JwtService } from "@nestjs/jwt";
import { UserService } from "modules/users/user.service";

export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    // // const user = await this.usersService.findByUser(username);
    // // if (!user) return null;
    // // const isValidPassword = await ComparePass(pass, user.password);
    // // if (!isValidPassword) return null;
    // return user;
  }
}