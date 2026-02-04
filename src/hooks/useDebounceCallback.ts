import { useEffect, useRef } from "react";

export function useDebouncedCallback<T extends (...args: any[]) => void>(
    callback: T,
    delay: number
) {
    const timeout = useRef<NodeJS.Timeout | null>(null);

    function debouncedFunction(...args: Parameters<T>) {
        if (timeout.current) clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }

    // Clean up
    useEffect(() => {
        return () => {
            if (timeout.current) clearTimeout(timeout.current);
        };
    }, []);

    return debouncedFunction;
}
