const modal = document.getElementById('modal')
const modalShow = document.getElementById('show-modal')
const modalClose = document.getElementById('close-modal')
const bookmarkForm = document.getElementById('bookmark-form')
const websiteNameEl = document.getElementById('website-name')
const websiteUrlEl = document.getElementById('website-url')
const bookmarksContainer = document.getElementById('bookmarks-container')

let bookmarks = []

// show modal, focus on input
function showModal() {
    modal.classList.add('show-modal')
    websiteNameEl.focus()
}
// validate form
function validateURL(value) {
    const expression =
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%\._\+~#=]{1,256}\.[a-zA-Z0-9()@:%_\+\.~#?&\\/=]+/
    const regex = new RegExp(expression)

    if (!regex.test(value)) {
        alert('Please provide a valid web address')
        return false
    }
    return true
}

// build bookmarks DOM
function buildBookmarks() {
    // remove all bookmark elements
    bookmarksContainer.textContent = ''
    // build items
    bookmarks.forEach(({ name, url }) => {
        // item
        const item = document.createElement('div')
        item.classList.add('item')
        // close icon
        const closeIcon = document.createElement('i')
        closeIcon.classList.add('fas', 'fa-times')
        closeIcon.setAttribute('title', 'Delete Bookmark')
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`)
        // favicon / link container
        const linkInfo = document.createElement('div')
        linkInfo.classList.add('name')
        // favicon
        const favicon = document.createElement('img')
        favicon.setAttribute(
            'src',
            `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
        )
        favicon.setAttribute('alt', 'Favicon')
        // link
        const link = document.createElement('a')
        link.setAttribute('href', `${url}`)
        link.setAttribute('target', '_blank')
        link.setAttribute('rel', 'noreferrer noopener')
        link.textContent = name

        // append to bookmarks container
        linkInfo.append(favicon, link)
        item.append(closeIcon, linkInfo)
        bookmarksContainer.appendChild(item)
    })
}

// populate bookmarks array
function populateBookmarks() {
    // get bookmarks from localstorage if available
    const data = localStorage.getItem('bookmarks')
    if (data) {
        bookmarks = JSON.parse(data)
    }

    // build bookmark items
    buildBookmarks()
}

// handle data from form
function storeBookmark(evt) {
    evt.preventDefault()
    const name = websiteNameEl.value
    let url = websiteUrlEl.value

    if (!name || !url) {
        alert('Please submit values for both fields.')
    }

    url = url.match('^https?://') ? url : `https://${url}`

    if (!validateURL(url)) {
        return false
    }

    const bookmark = { name, url }
    bookmarks.push(bookmark)

    // add bookmark to localstorage
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))

    // clear input fields, focus on input
    bookmarkForm.reset()
    websiteNameEl.focus()

    // populate dom
    buildBookmarks()
}

function deleteBookmark(url) {
    bookmarks = bookmarks.filter((bookmark) => bookmark.url !== url)
    // update bookmarks array in localstorage, re-populate dom
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    buildBookmarks()
}

// event listeners
modalShow.addEventListener('click', showModal)
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'))
window.addEventListener('click', (e) =>
    e.target === modal ? modal.classList.remove('show-modal') : false
)
bookmarkForm.addEventListener('submit', storeBookmark)

// on load
populateBookmarks()
