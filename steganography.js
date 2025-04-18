const delimiter = '--MESSAGE-START--';  // Unique delimiter to identify the start of the message

// Function to encode the message into the file and return the encoded file
function encodeMessage() {
    const fileInput = document.getElementById('fileInput').files[0];
    const message = document.getElementById('messageInput').value;

    if (!fileInput || !message) {
        alert("Please select a file and enter a message.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const fileData = new Uint8Array(event.target.result);
        const encodedMessage = new TextEncoder().encode(delimiter + message);
        const combinedData = new Uint8Array(fileData.length + encodedMessage.length);

        combinedData.set(fileData);
        combinedData.set(encodedMessage, fileData.length);

        const blob = new Blob([combinedData], { type: fileInput.type });
        const url = URL.createObjectURL(blob);

        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = url;
        downloadLink.download = `encoded_${fileInput.name}`;
        downloadLink.style.display = 'inline';
        downloadLink.textContent = 'Download Encoded File';

        alert("Message encoded and file ready for download!");
    };
    reader.readAsArrayBuffer(fileInput);
}

// Function to decode the message from the uploaded file
function decodeMessage() {
    const fileInput = document.getElementById('fileInput').files[0];

    if (!fileInput) {
        alert("Please select a file to decode.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const fileData = new Uint8Array(event.target.result);
        const decodedData = new TextDecoder().decode(fileData);

        // Find the delimiter in the file data
        const delimiterIndex = decodedData.indexOf(delimiter);
        if (delimiterIndex === -1) {
            alert("No encoded message found in this file.");
            return;
        }

        // Extract the message after the delimiter
        const message = decodedData.substring(delimiterIndex + delimiter.length);
        document.getElementById('result').value = message;
        alert("Message decoded successfully!");
    };
    reader.readAsArrayBuffer(fileInput);
}