import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '@nestjs/common';

const SAFE_CONTENT_TYPES = ['application/json', 'multipart/form-data'];

export const contentTypeValidationMiddleware = (req: Request, res: Response, next: NextFunction): Response | void => {
  const requestMethod = req.method || '';
  if (!['POST', 'PUT', 'PATCH'].includes(requestMethod.toLocaleUpperCase())) {
    return next();
  }

  const rawContentType = req.headers['content-type'];

  if (!rawContentType) {
    return res.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).json({
      statusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      message: 'Missing Content-Type header',
    });
  }

  const contentType = rawContentType.split(';')[0].trim().toLowerCase();

  if (contentType.startsWith('text/') || contentType === 'application/xml' || contentType === 'text/xml') {
    return res.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).json({
      statusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      message: `Unsupported or unsafe Content-Type: ${contentType}`,
    });
  }

  if (!SAFE_CONTENT_TYPES.includes(contentType)) {
    return res.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).json({
      statusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      message: `Unsupported Media Type: ${contentType}. Allowed: ${SAFE_CONTENT_TYPES.join(', ')}`,
    });
  }

  next();
};
