"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function Test() {
    const [isOpen, setIsOpen] = useState(false)
    const [dontShowAgain, setDontShowAgain] = useState(false)

    useEffect(() => {
        const hasVisited = localStorage.getItem("hasVisited")
        if (!hasVisited) {
            setIsOpen(true)
            localStorage.setItem("hasVisited", "true")
        }
    }, [])

    const handleClose = () => {
        setIsOpen(false)
        if (dontShowAgain) {
            localStorage.setItem("neverShowWelcome", "true")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-primary">Welcome to Our Site!</DialogTitle>
                    <DialogDescription className="text-lg text-muted-foreground">
                        We're excited to have you here. Let's get you started with some key features.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex items-center gap-4">
                        <div className="rounded-full bg-primary/10 p-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-6 w-6 text-primary"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                                />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold">Personalized Experience</h3>
                            <p className="text-sm text-muted-foreground">Tailored content just for you</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="rounded-full bg-primary/10 p-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-6 w-6 text-primary"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                                />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold">Secure & Private</h3>
                            <p className="text-sm text-muted-foreground">Your data is always protected</p>
                        </div>
                    </div>
                </div>
                <DialogFooter className="flex-col items-start sm:flex-row sm:justify-between sm:space-x-0">
                    <div className="flex items-center space-x-2">
                        <Switch id="dont-show" checked={dontShowAgain} onCheckedChange={setDontShowAgain} />
                        <Label htmlFor="dont-show">Don't show this again</Label>
                    </div>
                    <Button type="submit" onClick={handleClose} className="mt-4 sm:mt-0">
                        Let's Get Started
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

