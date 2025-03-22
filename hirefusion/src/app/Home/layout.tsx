
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <h2>Home Layout</h2>
            {children}
        </>

    );
}
