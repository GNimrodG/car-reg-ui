import { createContext, useContext, useEffect, useState } from "react";

const MakeLogosContext = createContext<{ [key: string]: string }>({});

export function MakeLogosProvider({ children }: { children: React.ReactNode }) {
    const [logos, setLogos] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        async function fetchLogos() {
            const res = await fetch("https://api.lpdb.data-unknown.eu/assets/make-logos.json");
            const json = await res.json();
            setLogos(json);
        }
        fetchLogos();
    }, []);

    return <MakeLogosContext.Provider value={logos}>{children}</MakeLogosContext.Provider>;
}

export default function useMakeLogos() {
    return useContext(MakeLogosContext);
}
