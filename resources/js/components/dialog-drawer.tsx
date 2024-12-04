import { ComponentProps, Dispatch, ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
    Drawer, DrawerClose,
    DrawerContent,
    DrawerDescription, DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import React, { memo } from "react";

export const DialogDrawer = memo(({ children, dialogProps, drawerProps, triggerText, triggerEl, headerTitle, headerDescription, open, setOpen }: {
    children: ReactNode;
    dialogProps?: ComponentProps<typeof Dialog>;
    drawerProps?: ComponentProps<typeof Drawer>;
    triggerText?: string;
    triggerEl?: ReactNode;
    headerTitle?: string;
    headerDescription?: string;
    open: boolean;
    setOpen: Dispatch<React.SetStateAction<boolean>>;
}) => {
    const handleClose = () => setOpen(false);

    return (
        <>
            { useIsMobile() ? (
                <Drawer open={open} onOpenChange={setOpen} dismissible={false} {...drawerProps}>
                    <DrawerTrigger asChild>
                        {triggerEl ?? <Button variant="outline">{triggerText ?? 'Dialog Drawer'}</Button>}
                    </DrawerTrigger>
                    <DrawerContent onOpenAutoFocus={(e) => e.preventDefault()}>
                        <DrawerHeader className="text-left">
                            <DrawerTitle>{headerTitle ?? 'Header Title'}</DrawerTitle>
                            <DrawerDescription>{headerDescription ?? 'Header Description...'}</DrawerDescription>
                        </DrawerHeader>
                        <div className="p-5">{children}</div>
                        <DrawerFooter className="pt-2">
                            <DrawerClose asChild>
                                <Button variant="outline" onClick={handleClose}>
                                    Batal
                                </Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            ) : (
                <Dialog open={open} onOpenChange={setOpen} {...dialogProps}>
                    <DialogTrigger asChild>
                        {triggerEl ?? <Button variant="outline">{triggerText ?? 'Dialog Drawer'}</Button>}
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]" onOpenAutoFocus={(e) => e.preventDefault()}>
                        <DialogHeader>
                            <DialogTitle>{headerTitle ?? 'Header Title'}</DialogTitle>
                            <DialogDescription>{headerDescription ?? 'Header Description...'}</DialogDescription>
                        </DialogHeader>
                        {children}
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
});
