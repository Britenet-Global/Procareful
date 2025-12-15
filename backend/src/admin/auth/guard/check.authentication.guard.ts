import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class IsAuthenticated implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authStatus = request.isAuthenticated();

    if (!authStatus) {
      throw new UnauthorizedException('Unauthorized access. Please login.');
    }

    const validationCode = request.session.validationCode;

    if (validationCode) {
      throw new ForbiddenException('Access denied.');
    }

    return authStatus;
  }
}
