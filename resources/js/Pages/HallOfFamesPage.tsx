import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "@inertiajs/react";

interface Contributor {
    name: string
    avatar: string
    profile: string
    contributions: string
}

const contributors: Contributor[] = [
    {
        name: "Jane Doe",
        avatar: "/placeholder.svg?height=100&width=100",
        profile: "https://github.com/janedoe",
        contributions: "Core Developer"
    },
    {
        name: "John Smith",
        avatar: "/placeholder.svg?height=100&width=100",
        profile: "https://github.com/johnsmith",
        contributions: "Documentation"
    },
    {
        name: "Alice Johnson",
        avatar: "/placeholder.svg?height=100&width=100",
        profile: "https://github.com/alicejohnson",
        contributions: "Bug Fixes"
    },
    {
        name: "Bob Williams",
        avatar: "/placeholder.svg?height=100&width=100",
        profile: "https://github.com/bobwilliams",
        contributions: "Feature Development"
    },
    {
        name: "Emma Brown",
        avatar: "/placeholder.svg?height=100&width=100",
        profile: "https://github.com/emmabrown",
        contributions: "UI/UX Design"
    },
    {
        name: "Michael Davis",
        avatar: "/placeholder.svg?height=100&width=100",
        profile: "https://github.com/michaeldavis",
        contributions: "Testing"
    }
]

export default function ContributorThanks() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-4">Thank You to Our Contributors</h1>
            <p className="text-center text-muted-foreground mb-8">
                We are grateful for the hard work and dedication of all our contributors. Your efforts have made this project possible.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {contributors.map((contributor) => (
                    <Card key={contributor.name} className="flex flex-col items-center text-center">
                        <CardHeader>
                            <img
                                src={contributor.avatar}
                                alt={`${contributor.name}'s avatar`}
                                width={100}
                                height={100}
                                className="rounded-full"
                            />
                            <CardTitle className="mt-2">{contributor.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-2">{contributor.contributions}</p>
                            <Link
                                href={contributor.profile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline"
                            >
                                View Profile
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

