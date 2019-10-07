const { ipcRenderer } = require("electron")
const items = require("./items")

let showModal = document.getElementById('show-modal'),
    closeModal = document.getElementById('close-modal'),
    modal = document.getElementById('modal'),
    addItem = document.getElementById('add-item'),
    itemUrl = document.getElementById('url'),
    search = document.getElementById('search')

window.newItem = () => {
    showModal.click()
}

window.openItem = items.open

window.deleteItem = () => {
    let selectedItem = items.getSelectedItem()
    items.delete(selectedItem.index)
}

window.openItemNative = items.openItemNative

window.searchItems = () => {
    search.focus()
}

const toogleModalButtons = () => {
    if(addItem.disabled === true) {
        addItem.disabled = false
        addItem.style.opacity = 1
        addItem.innerHTML = 'Add Item'
        closeModal.style.display = 'inline'
    } else {
        addItem.disabled = true
        addItem.style.opacity = 0.5
        addItem.innerHTML = 'Adding...'
        closeModal.style.display = 'none'
    }    
}

showModal.addEventListener('click', e => {
    modal.style.display = 'flex'
    itemUrl.focus()
})

closeModal.addEventListener('click', e => {
    modal.style.display = 'none'
})

addItem.addEventListener('click', e => {
    if(itemUrl.value) {
        ipcRenderer.send('new-item', itemUrl.value)
        toogleModalButtons()
    }    
})

itemUrl.addEventListener('keyup', e => {
    if (e.key === 'Enter') {
        addItem.click()
    }   
})

search.addEventListener('keyup', e => {
    Array.from(document.getElementsByClassName('read-item')).forEach(item => {
        let hasMatch = item.innerText.toLowerCase().includes(search.value.toLowerCase())
        item.style.display = hasMatch ? 'flex' : 'none'
    })   
})

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        items.changeSelection(e.key)
    }
})

ipcRenderer.on('new-item-send-success', (e, newItem) => {
    
    items.addItem(newItem, true)

    toogleModalButtons()

    modal.style.display = 'none'
    itemUrl.value = ''
})