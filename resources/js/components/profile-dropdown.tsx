"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, ChevronDown, UserRound } from 'lucide-react'
import { AuthUser } from "@/types";

export function ProfileDropdown({ className, authUser }: {
    className?: string;
    authUser: AuthUser;
}) {
    const [open, setOpen] = useState(false)

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={`flex items-center justify-start space-x-1 transition-colors duration-200
            ${open ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}
            focus:ring-0 focus:ring-offset-0 ${className ?? ''} w-60 !px-2`}
                >
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={authUser.avatar ? `/storage/praktikan/${authUser.avatar}` : undefined} alt={authUser.nama} />
                        <AvatarFallback><UserRound /></AvatarFallback>
                    </Avatar>
                    <span className="truncate flex-1 text-left">{authUser.nama}</span>
                    <ChevronDown className={`ml-auto justify-self-end h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2">
                        <p className="text-sm font-medium leading-none">{authUser.nama}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {authUser.npm ?? ''}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <UserRound className="mr-2 h-4 w-4" />
                        <span>Profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

