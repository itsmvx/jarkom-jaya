import { ComponentProps, ReactNode, useState } from "react";
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

export const DialogDrawer = ({ children, dialogProps, drawerProps, triggerText, triggerEl, headerTitle, headerDescription }: {
    children: ReactNode;
    dialogProps?: ComponentProps<typeof Dialog>;
    drawerProps?: ComponentProps<typeof Drawer>;
    triggerText?: string;
    triggerEl?: ReactNode;
    headerTitle?: string;
    headerDescription?: string;
}) => {
    const [ open, setOpen ] = useState(false);
    const handleClose = () => setOpen(false);
    return (
        <>
            {
                useIsMobile()
                    ? (
                        <Drawer open={open} onOpenChange={setOpen} dismissible={false} { ...drawerProps }>
                            <DrawerTrigger asChild>
                                {
                                    triggerEl
                                        ? triggerEl
                                        : (
                                            <Button variant="outline">
                                                { triggerText ?? 'Dialog Drawer' }
                                            </Button>
                                        )
                                }
                            </DrawerTrigger>
                            <DrawerContent>
                                <DrawerHeader className="text-left">
                                    <DrawerTitle>
                                        { headerTitle ?? 'Header Title' }
                                    </DrawerTitle>
                                    <DrawerDescription>
                                        { headerDescription ?? 'Header Description...' }
                                    </DrawerDescription>
                                </DrawerHeader>
                                <div className="p-5">
                                    { children }
                                </div>
                                <DrawerFooter className="pt-2">
                                    <DrawerClose asChild>
                                        <Button variant="outline" onClick={handleClose}>Batal</Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>
                    ) : (
                        <Dialog open={open} onOpenChange={setOpen} { ...dialogProps }>
                            <DialogTrigger asChild>
                                {
                                    triggerEl
                                        ? triggerEl
                                        : (
                                            <Button variant="outline">
                                                { triggerText ?? 'Dialog Drawer' }
                                            </Button>
                                        )
                                }
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>
                                        { headerTitle ?? 'Header Title' }
                                    </DialogTitle>
                                    <DialogDescription>
                                        { headerDescription ?? 'Header Description...' }
                                    </DialogDescription>
                                </DialogHeader>
                                { children }
                            </DialogContent>
                        </Dialog>
                    )
            }
        </>
    );
};
