import { useState, useRef, useEffect, RefObject } from "react";

// Handle clicks outside of an element and close and scroll close
export function useClickOutsideAndScrollClose(): [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
    RefObject<HTMLElement>
] {
    // State for controlling the open/close status
    const [open, setOpen] = useState(false);

    // Ref to attach to the dropdown/element container
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        // Handle clicks outside the ref element
        const handleClickOutside = (event: MouseEvent) => {
            // Close if the ref exists and the click is outside
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        // Handle scrolling (closes the element)
        const handleScroll = () => {
            setOpen(false);
        };

        // Add listeners
        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScroll, true);

        // Cleanup
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll, true);
        };

        // Re-run effect only when 'open' changes to optimize (optional, but clean)
    }, [open]);

    // Return the necessary values
    return [open, setOpen, ref as RefObject<HTMLElement>];
}