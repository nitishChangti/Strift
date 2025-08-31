import { useState } from "react";

export default function LazyImage({ src, alt, className }) {
    const [loaded, setLoaded] = useState(false);

    return (
        <img
            src={src}
            alt={alt}
            onLoad={() => setLoaded(true)}
            className={`${className} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"
                }`}
        />
    );
}
