const { htmlFragment, renderIf } = require('@statikly-stack/render')

const alertHeader = ({ search }) => {
    return htmlFragment`
        <div class="flex justify-center">       
            <div class="form-control mr-5">
                <div class="input-group">
                    <input id="search-input" class="input input-bordered" type="search" name="search"
                        hx-include="*"
                        hx-params="*"
                        placeholder="Begin Typing To Search..." 
                        hx-post="/search" 
                        hx-trigger="keyup changed delay:500ms, search"
                        hx-target="#search-results" 
                        hx-indicator=".htmx-indicator"
                        ${renderIf(search, `value=${search}`)}
                        >
                    <button class="btn btn-square">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </button>
                </div>
            </div>
        </div>
    `
}

module.exports = { alertHeader }