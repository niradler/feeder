const { htmlFragment, renderIf, renderList } = require('@statikly-stack/render')


const sortOptions = () => {
    return htmlFragment`
    <div class="form-control mr-5">
        <input name="start" type="datetime-local" class="input input-bordered" placeholder="Select date start" hx-push-url="true" hx-get hx-target="#search-results" 
                hx-indicator=".htmx-indicator">
    </div>            
    <div class="form-control mr-5">
        <input name="end" type="datetime-local" class="input input-bordered" placeholder="Select date end" hx-push-url="true" hx-get hx-target="#search-results" 
                hx-indicator=".htmx-indicator">
    </div>
    `
}

module.exports = ({ tags, tagId }) => {
    return htmlFragment`
<input type="checkbox" id="filters-modal" class="modal-toggle" />
<div class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
        <h3 class="font-bold text-lg">Filters</h3>
        <div class="py-5">
        <div class="form-control">
                <select class="select select-bordered w-full max-w-xs" hx-get="/" hx-target="#search-results" hx-indicator=".htmx-indicator" name="tagId">
                <option disabled ${renderIf(!tagId, 'selected')}>Tags</option>
                ${renderList(tags, (tag) => htmlFragment`<option ${renderIf(tag.id == tagId, 'selected')} value="${tag.id}">${tag.text}</option>`)}
                </select>
            </div>   
        </div>
        <div class="modal-action">
            <label for="filters-modal" class="btn">Close</label>
        </div>
    </div>
</div>
    `;
}