import { Card } from "@/components/ui/card";
import { deltaParse, RenderQuillDelta } from "@/lib/utils";

export default function AdminKuisViewPage({ kuis }: {
    kuis: {
        deskripsi: string;
    };
}) {
    return (
        <>
            <Card className="my-card !border-2">
                <RenderQuillDelta delta={deltaParse(kuis.deskripsi)} className="!items-start !justify-start"/>
            </Card>
        </>
    );
}
