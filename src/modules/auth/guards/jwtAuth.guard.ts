import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/services/user.service';
import { UserPayload } from '../types/userPayload.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService,private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token: string = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authorization token not found');
    }

    try {
      // Validate the JWT
      const secret = this.configService.get<string>('jwt.JWT_SECRET');
      const payload = jwt.verify(token, secret) as UserPayload

      // Attach the user payload to the request object
      request['user'] = await this.userService.findWithEmail(payload.email);
      return true;
    } catch (err) {
      console.log(err)
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Extracts the JWT token from the Authorization header
   * @param request - The incoming HTTP request
   * @returns The JWT token as a string
   */
  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
