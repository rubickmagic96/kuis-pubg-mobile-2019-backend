let useImageValues = document.querySelectorAll('input[type="radio"]')
let imageField = document.querySelector('input[type="file"]')

useImageValues.forEach((radio) => {
    radio.addEventListener('change', changeHandler)
})

function changeHandler(e) {
    if (this.value === 'true') {
        imageField.disabled = false
    } else if (this.value === 'false') {
        imageField.disabled = true
    }
}