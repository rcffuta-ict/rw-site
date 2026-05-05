import { Input } from "./forms/Input";

export function SearchInput({
    onChange,
    onClear,
    query,
    placeholder = "Search by phone number, email, or order ref…"
}: {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void;
    query: string;
    placeholder?: string;
}) {
    return (
        <div className="relative w-full">
            <Input
                id="search-input"
                type="search"
                value={query}
                onChange={onChange}
                placeholder={placeholder}
                icon={
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
                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                    </svg>
                }
                autoComplete="off"
                containerClassName="!gap-0"
            />
            {query && (
                <button
                    onClick={onClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-rw-muted hover:text-rw-crimson hover:bg-rw-crimson/5 transition-all"
                    aria-label="Clear search"
                >
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
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
