import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class IsAuthenticated implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authStatus = request.isAuthenticated();

    if (!authStatus || request.user.module === 'Admin') {
      throw new ForbiddenException('Access denied.');
    }
    return authStatus;
  }
}
