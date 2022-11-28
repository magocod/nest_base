import { HttpStatus, Injectable, ValidationPipe } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WSValidationPipe extends ValidationPipe {
  createExceptionFactory() {
    return (validationErrors = []) => {
      if (this.isDetailedOutputDisabled) {
        return new WsException('Bad request');
      }
      const errors = this.flattenValidationErrors(validationErrors);

      // return new WsException(errors);
      return new WsException({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: errors,
      });
    };
  }
}
