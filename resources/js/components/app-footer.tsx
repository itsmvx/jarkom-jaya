import { Link } from "@inertiajs/react";

export const Footer = () => {
    return (
        <>
            <footer className="max-h-20 overflow-hidden flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-gray-500">
                    &copy;2024, Made with love by Laboratorium Jaringan Komputer ITATS.
                </p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Layanan
                    </Link>
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Kebijakan Data
                    </Link>
                </nav>
            </footer>
        </>
    );
};
