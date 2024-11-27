import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Footer } from "@/components/app-footer";
import { Toaster } from "@/components/ui/toaster";

export const AppLayout = ({ children }: {
    children: ReactNode;
}) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1"/>
                    <Separator orientation="vertical" className="mr-2 h-4"/>
                    <h3 className="text-muted-foreground/80 font-medium italic select-none">RPL COULD NEVER DO</h3>
                </header>
                <div className="p-3 bg-muted">
                    <Card className="p-5 md:p-6 space-y-4 bg-white rounded-md border min-h-[calc(100vh-10rem)]">
                        { children }
                    </Card>
                </div>
                <Footer />
                <Toaster />
            </SidebarInset>
        </SidebarProvider>
    )
}
