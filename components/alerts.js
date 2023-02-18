const { htmlFragment, renderIf, renderList } = require('@statikly-stack/render')
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime)

const titleLength = 80;
const descriptionLength = 200;

const textWithLimit = (text, limit) => {
    if (!text) return '';
    if (text.length > limit) {
        return htmlFragment`
        <span>${text.slice(0, limit) + '...'}</span>
        `
    }
    return htmlFragment`
<span>${text}</span>
`
}

const formatField = (type, value) => {
    switch (type) {
        case 'createdAt':
        case 'timestamp':
            return dayjs(value).format()

    }

    return value;
}

const groupAlert = (alert) => {
    return htmlFragment`
    <ul class="steps mt-3">
        ${renderIf(Array.isArray(alert.alerts), () => alert.alerts.map(alert => htmlFragment`
        <div tabindex="0" class="collapse">
            <div class="collapse-title text-xl font-medium">
                <li class="step step-primary">${textWithLimit(alert.title, titleLength)}</li>
            </div>
            <div class="collapse-content">
                ${basicAlert(alert)}
            </div>
        </div>
        `))}
    </ul>
    `
}

const basicAlert = (alert) => {
    return htmlFragment`
    <div tabindex="0" class="collapse">
        <div class="collapse-title text-xl font-medium">
            <div class="alert ${alert.level && `alert-${alert.level}`} shadow-lg">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        class="stroke-info flex-shrink-0 w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                        <h3 class="font-bold">${textWithLimit(alert.title, titleLength)}</h3>
                        <div class="text-xs">${textWithLimit(alert.description, descriptionLength)}</div>
                    </div>
                </div>
                <div class="flex-none">
                    <span class="badge">${dayjs(alert.timestamp).fromNow()}</span>
                    ${renderIf(alert.action, htmlFragment`
                    <form action="${alert.action}" method="${alert.actionMethod || 'post'}">
                        <input type="hidden" name="id" value="${alert.id}" />
                        <button type="submit" class="btn btn-sm">Response</button>
                    </form>
                    `)}
                </div>
    
            </div>
        </div>
        <div class="collapse-content">
            <p>${alert.description}</p>
            ${renderList(Object.keys(alert).filter(key => alert[key] && key != 'tags' && key != 'description'), (key) => htmlFragment`<span class="badge">${key}=${formatField(key, alert[key])}</span>`)}            
            ${renderIf(alert.tags, (tags) => tags.map(tag => htmlFragment`<a href="/?tagId=${tag.id}"><span id="${tag.id}" class="badge">${tag.text}</span></a>`))
        }
        </div >
    </div >
    `
}

const empty = () => {
    return htmlFragment`
    <div class="alert alert-error shadow-lg mt-3">
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                class="stroke-info flex-shrink-0 w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
                <h3 class="font-bold">No messages</h3>
            </div>
        </div>
        </div >
    `
}

const all = ({ alerts }) => {
    return renderList(alerts, (alert) => basicAlert(alert), empty())
}

module.exports = {
    all,
    basicAlert,
    groupAlert
}

