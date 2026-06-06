import { Order } from "@/lib/data/types";

export function VariantLabelDisplay({
    variants,
}: {
    variants: Order["items"][0]["variantLabel"];
}) {
    return (
        <p className="text-xs text-[#9a8085] font-semibold mt-0.5">
            {variants.toUpperCase()}
        </p>
    );
}
