document.addEventListener('DOMContentLoaded', () => {
    const uploadImageInput = document.getElementById('uploadImage');
    const addStickerButton = document.getElementById('addSticker');
    const captionInput = document.getElementById('caption');
    const addCaptionButton = document.getElementById('addCaption');
    const scrapbook = document.getElementById('scrapbook');
    const downloadPDFButton = document.getElementById('downloadPDF');
    let selectedImageContainer = null;

    // Upload and display image
    uploadImageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgElement = document.createElement('img');
                imgElement.src = e.target.result;
                createImageContainer(imgElement);
            };
            reader.readAsDataURL(file);
        }
    });

    // Create image container
    function createImageContainer(imgElement) {
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');
        imageContainer.appendChild(imgElement);

        imageContainer.setAttribute('draggable', true);

        // Drag and drop functionality
        imageContainer.addEventListener('dragstart', (e) => {
            selectedImageContainer = imageContainer;
        });

        scrapbook.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        scrapbook.addEventListener('drop', (e) => {
            e.preventDefault();
            if (selectedImageContainer) {
                scrapbook.appendChild(selectedImageContainer);
                selectedImageContainer = null;
            }
        });

        scrapbook.appendChild(imageContainer);
    }

    // Add sticker to selected image
    addStickerButton.addEventListener('click', () => {
        const stickerUrl = 'https://img.icons8.com/emoji/48/000000/star-emoji.png'; // Example sticker
        if (selectedImageContainer) {
            const sticker = document.createElement('img');
            sticker.src = stickerUrl;
            sticker.classList.add('sticker');
            selectedImageContainer.appendChild(sticker);
        } else {
            alert('Please select an image first by clicking on it.');
        }
    });

    // Add caption to selected image
    addCaptionButton.addEventListener('click', () => {
        if (selectedImageContainer) {
            const captionText = captionInput.value;
            const captionElement = document.createElement('div');
            captionElement.classList.add('caption');
            captionElement.textContent = captionText;
            selectedImageContainer.appendChild(captionElement);
            captionInput.value = ''; // Clear input field after adding
        } else {
            alert('Please select an image first by clicking on it.');
        }
    });

    // Select image for sticker/caption
    scrapbook.addEventListener('click', (e) => {
        if (e.target.parentNode.classList.contains('image-container')) {
            // Deselect previous image
            if (selectedImageContainer) {
                selectedImageContainer.style.borderColor = '#ccc';
            }
            selectedImageContainer = e.target.parentNode;
            selectedImageContainer.style.borderColor = 'blue'; // Highlight selected image
        }
    });

    // Download scrapbook as PDF
    downloadPDFButton.addEventListener('click', () => {
        html2canvas(scrapbook).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');

            // Convert canvas to fit A4 size page
            const pageWidth = 210;
            const pageHeight = 297;
            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * pageWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save('scrapbook.pdf');
        });
    });
});
