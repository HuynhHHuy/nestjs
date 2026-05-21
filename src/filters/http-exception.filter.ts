import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        if (exception instanceof HttpException) {
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
            return;
        }

        console.log('Unexpected Error:', exception);
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
            errorCode: 'INTERNAL_SERVER_ERROR',
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }
}    