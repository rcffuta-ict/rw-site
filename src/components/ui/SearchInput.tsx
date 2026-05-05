import { Input } from "./forms/Input";

export function SearchInput({
    onChange,
    onClear,
    query,
}: {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void;
    query: string;
}) {
    return (
        <div className="mt-6 relative max-w-xl">
            <Input
                id="orders-search"
                type="search"
                value={query}
                onChange={onChange}
                placeholder="Search by phone number, email, or order ref…"
                icon={
                    <svg
                        className="h-4.5 w-4.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803 7.5 7.5 0 0 0 15.803 15.803Z"
                        />
                    </svg>
                }
                autoComplete="off"
            />
            {query && (
                <button
                    onClick={onClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-rw-muted hover:text-rw-ink transition-colors"
                    aria-label="Clear search"
                >
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
}
