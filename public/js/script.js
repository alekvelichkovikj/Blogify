// Landing Page
class TypeWriter {
  constructor(txtElement, words, wait = 3000) {
    this.txtElement = txtElement
    this.words = words
    this.txt = ''
    this.wordIndex = 0
    this.wait = parseInt(wait, 10)
    this.type()
    this.isDeleting = false
  }

  type() {
    // Current index of word
    const current = this.wordIndex % this.words.length
    // Get full text of current word
    const fullTxt = this.words[current]

    // Check if deleting
    if (this.isDeleting) {
      // Remove char
      this.txt = fullTxt.substring(0, this.txt.length - 1)
    } else {
      // Add char
      this.txt = fullTxt.substring(0, this.txt.length + 1)
    }

    // Insert txt into element
    this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`

    // Initial Type Speed
    let typeSpeed = 300

    if (this.isDeleting) {
      typeSpeed /= 2
    }

    // If word is complete
    if (!this.isDeleting && this.txt === fullTxt) {
      // Make pause at end
      typeSpeed = this.wait
      // Set delete to true
      this.isDeleting = true
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false
      // Move to next word
      this.wordIndex++
      // Pause before start typing
      typeSpeed = 400
    }

    setTimeout(() => this.type(), typeSpeed)
  }
}

// Init On DOM Load
document.addEventListener('DOMContentLoaded', init)

// Init App
function init() {
  const txtElement = document.querySelector('.txt-type')
  const words = JSON.parse(txtElement.getAttribute('data-words'))
  const wait = txtElement.getAttribute('data-wait')
  // Init TypeWriter
  new TypeWriter(txtElement, words, wait)
}

// Get the current year for the copyright
$('#year').text(new Date().getFullYear())

// Create the editor
tinymce.init({
  forced_root_block: false,
  selector: '#mytextarea',
  height: 500,
  menubar: false,
  plugins: [
    'advlist autolink lists link image charmap print preview anchor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste imagetools code help wordcount',
    'pageembed code preview',
  ],
  toolbar:
    'undo redo | formatselect | ' +
    'bold italic backcolor | alignleft aligncenter ' +
    'alignright alignjustify | bullist numlist outdent indent |  ' +
    'removeformat | help ' +
    'pageembed code preview ' +
    'link image',
  content_style:
    'body { font-family:Helvetica,Arial,sans-serif; font-size:14px;margin:1rem;}',
})

// Profile Input File Upload
const file = document.querySelector('#file')
file.addEventListener('change', (e) => {
  // Get the selected file
  const [file] = e.target.files
  // Get the file name and size
  const { name: fileName, size } = file
  // Convert size in bytes to kilo bytes
  const fileSize = (size / 1000).toFixed(2)
  // Set the text content
  const fileNameAndSize = `${fileName} - ${fileSize}KB`
  document.querySelector('.file-name').textContent = fileNameAndSize
})
