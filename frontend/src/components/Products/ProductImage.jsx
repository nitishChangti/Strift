import React, { useState } from "react";

function ProductImage({ image, images }) {
    const [selectedImage, setSelectedImage] = useState(image);

    return (
        <div className="flex flex-col items-center">
            {/* Main Selected Image */}
            {image && (
                <img
                    src={selectedImage}
                    alt="main product"
                    className="w-full max-w-md h-auto object-contain rounded border mb-4"
                />
            )}

            {/* Thumbnails Below */}
            <div className="flex gap-2 overflow-x-auto">
                {Array.isArray(images) &&
                    images.map((img, index) => (
                        <div key={index} className="flex-shrink-0">
                            <img
                                src={img}
                                alt="product thumbnail"
                                onClick={() => setSelectedImage(img)}
                                className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 ${selectedImage === img
                                        ? "border-blue-500"
                                        : "border-gray-300"
                                    }`}
                            />
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default ProductImage;
