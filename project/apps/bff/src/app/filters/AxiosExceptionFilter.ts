import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AxiosError } from 'axios';

const INTERNAL_SERVER_ERROR_MESSAGE = 'Internal server error';

@Catch(AxiosError)
export class AxiosExceptionFilter implements ExceptionFilter {
  catch(error: AxiosError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const data = error.response?.data as { statusCode: number; message: string; error: string } | undefined;
    const response = ctx.getResponse<Response>();
    const status = data?.statusCode || error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const errorResponse = data?.error || error.response?.statusText || INTERNAL_SERVER_ERROR_MESSAGE;


    response.status(status).json({
      statusCode: status,
      error: errorResponse,
      message: data?.message || error.message,
    });
  }
}
