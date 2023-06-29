function previewImg(file,preview) {
    const files = $(`#${file}`)[0].files  
    if (files.length > 0) {
        var fileToLoad = files[0];
        var fileReader = new FileReader();
        fileReader.onload = function (fileLoadedEvent) {
            var srcData = fileLoadedEvent.target.result; // <--- data: base64
            $(`#${preview}`)[0].src = srcData
            $(`#${preview}`).removeClass('d-none')
        }
        fileReader.readAsDataURL(fileToLoad);
    }
}