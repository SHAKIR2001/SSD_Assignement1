export default function mediaUpload(file) {
    return new Promise(async (resolve, reject) => {
        if (file == null) {
            return reject("No file selected");
        }

        const formData = new FormData();
        formData.append("image", file);

        try {
            // Adjust the base URL if needed, but relative should work in a proxy setup 
            // or we use import.meta.env.VITE_BACKEND_URL
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
            
            const response = await fetch(`${backendUrl}/api/upload`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Backend upload error:", errorData);
                return reject(errorData.error || "Error uploading file to backend");
            }

            const data = await response.json();
            resolve(data.secure_url);
        } catch (error) {
            console.error("Upload error:", error);
            reject("Error uploading file");
        }
    });
}
