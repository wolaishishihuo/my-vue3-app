import http from '@/http';
// http://localhost:3000
const PORT = '/auth';
export const getUserList = () => {
    return http.get(
        PORT + '/getAll',
        {},
        {
            cancel: true,
            retryConfig: {
                isRetry: true,
                count: 3,
                waitTime: 1000
            }
        }
    );
};
