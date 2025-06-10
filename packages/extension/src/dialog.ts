type Dialog = {
    id: string;
    tabId: number;
    popupId: number;
    url: string;
};

const dialogs = new Array<Dialog>();
function removePopupEntry(tabId: number) {
    const index = dialogs.findIndex(x => x.tabId === tabId);
    if (index >= 0) {
        dialogs.splice(index, 1);
    }
}

type Resolver = {
    resolve: (arg: any) => void;
    reject: (reason?: any) => void;
};

const resolvers = new Map<string, Resolver>();

function resolver(id: string) {
    return new Promise((resolve, reject) => {
        resolvers.set(id, { resolve, reject });
    });
}

export async function openDialog<T>(url, message, sender): Promise<T> {

    const { id } = message;
    await chrome.storage.session.set({
        'dialog': {
            id,
            ...message.data
        }
    });

    const tabId = sender.tab?.id;

    //
    //  associate hostname w/ popupWindow
    //

    const currentWindow = await chrome.windows.getCurrent({ populate: true });
    const width = 300;
    const top = currentWindow.top! + 87;
    const left = currentWindow.width! - width;

    const popupWindow = await chrome.windows.create({
        url: chrome.runtime.getURL(url),
        type: 'popup',
        top,
        left,
        width,
        height: 512,
    });

    const popupId = popupWindow.id!;

    dialogs.push({
        id,
        tabId,
        popupId,
        url
    });

    try {
        const result = await resolver(message.id);
        removePopupEntry(tabId)
        return result as T;
    }

    catch (error) {
        removePopupEntry(tabId)
        throw error;
    }
}

export async function dialogResponse(message) {
    const resolver = resolvers.get(message.id);
    if (resolver) {
        resolvers.delete(message.id);
        if ('error' in message) {
            resolver.reject(message.error);
        } else {
            resolver.resolve(message.result);
        }
    }
}

chrome.storage.onChanged.addListener((changes, area) => {
    if ((area === 'session') && (changes.dialogResponse?.newValue)) {
        dialogResponse(changes.dialogResponse?.newValue);
    }
});

chrome.windows.onRemoved.addListener((windowId) => {

    const dialog = dialogs.find(x => x.popupId === windowId);
    if (dialog) {
        dialogResponse({
            id: dialog.id,
            error: {
                message: 'user rejected'
            }
        });

        removePopupEntry(dialog.tabId);
    }
});

function closePopup(tabId: number) {
    const dialog = dialogs.find(x => x.tabId === tabId);
    if (dialog) {
        chrome.windows.remove(dialog.popupId, () => {
            if (chrome.runtime.lastError) {
                console.error('Error closing popup:', chrome.runtime.lastError);
            }

            removePopupEntry(tabId);
        });
    }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, _ /*tab*/) => {
    const dialog = dialogs.find(x => x.tabId === tabId);
    if (dialog && changeInfo.status === 'loading') {
        closePopup(tabId);
    }
});

chrome.tabs.onRemoved.addListener((tabId) => {
    const dialog = dialogs.find(x => x.tabId === tabId);
    if (dialog) {
        closePopup(tabId);
    }
});

async function openActionPopup(filename: string) {
    await chrome.action.setPopup({ popup: filename });
    await chrome.action.openPopup();
    await chrome.action.setPopup({ popup: '' })
}

chrome.action.onClicked.addListener(async (tab) => {
    const dialog = dialogs.find(x => x.tabId === tab.id!);
    if (dialog) {
        closePopup(tab.id!);
        openActionPopup(dialog.url);
/*
    } else {
        openActionPopup('default.html');
*/
    }
});
