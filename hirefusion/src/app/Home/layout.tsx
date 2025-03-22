
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <h1>Nav Bar</h1>
            {children}
        </>

    );
}
