export type SendRequest = typeof sendRequest;

export const responseChannel = 'xyzMESSAGE_RESPONSE';
export const requestChannel = 'xyzMESSAGE_REQUEST';

export async function sendRequest(data): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const id = Math.random().toString(36).substring(2);

        window.addEventListener('message', function handler(event) {
            if (event.source !== window) {
                return;
            }

            if (event.data.type === responseChannel && event.data.id === id) {
                window.removeEventListener('message', handler);
                if (event.data.error) {
                    reject(new Error(event.data.error));
                } else {
                    resolve(event.data.result);
                }
            }
        });
        window.postMessage({ type: requestChannel, data, id }, '*');
    });
}
