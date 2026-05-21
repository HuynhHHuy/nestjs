import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        const errorBody =
            typeof exceptionResponse === 'string'
                ? { message: exceptionResponse }
                : (exceptionResponse as { message?: string });
        response.status(status).json({
            success: false,
            statusCode: status,
            ...errorBody,
            message: errorBody.message || 'An error occurred',
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }
}    