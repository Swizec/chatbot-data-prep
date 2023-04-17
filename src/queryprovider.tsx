"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

function Providers({ children }: React.PropsWithChildren) {
    const [client] = React.useState(
        new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } })
    );

    return (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
}

export default Providers;
