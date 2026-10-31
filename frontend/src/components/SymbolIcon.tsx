type SymbolKind = "spiral" | "cross" | "special";

export function SymbolIcon({ kind }: { kind: SymbolKind }) {
  return (
    <svg className="symbol-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      {kind === "cross" ? (
        <path d="M10 3.5v13M3.5 10h13" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
      ) : (
        <>
          <path d="M3 15.5C1.2 12 2.1 6.1 6.2 3.9c3.3-1.8 7.9-.9 9.5 2.5 1.4 3-.1 6.4-3 7.2-2.5.7-5.2-.6-5.3-3-.1-1.5 1-2.7 2.4-2.6 1.2.1 1.9 1.1 1.5 2.1" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
          {kind === "special" && <circle cx="16.2" cy="16.1" r="2.7" fill="currentColor" />}
        </>
      )}
    </svg>
  );
}
