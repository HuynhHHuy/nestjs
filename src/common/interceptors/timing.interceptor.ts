import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class TimingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const start = Date.now();

        return next.handle().pipe(
            tap(() => {
                const end = Date.now();
                console.log('Execution time:', end - start, 'ms');
            })
        );
    }
}