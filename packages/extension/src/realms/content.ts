// Keep background alive
const port = chrome.runtime.connect({ name: 'keep-alive' });
port.onDisconnect.addListener(() => {
    chrome.runtime.connect({ name: 'keep-alive' });
});

window.addEventListener('message', async (event) => {
    if (event.source !== window) {
        return;
    }

    if (event.data.type && (event.data.type === 'xyzMESSAGE_REQUEST')) {
        chrome.runtime.sendMessage(event.data, (response) => {
            window.postMessage({
                type: 'xyzMESSAGE_RESPONSE',
                id: event.data.id,
                result: response.result,
                error: response.error,
            }, '*');
        });
    }
});

const script = document.createElement('script');
script.src = chrome.runtime.getURL('dist/inpage.js');
script.onload = () => script.remove();
(document.head || document.documentElement).appendChild(script);
