import React from 'react';

// ─── Shared style constants ────────────────────────────────────────────────────

export const ulStyle: React.CSSProperties = {
  paddingLeft: 20,
  marginBottom: 10,
  display: 'flex',
  flexDirection: 'column',
  gap: 5,
  fontSize: '0.88rem',
  color: 'var(--text-primary)',
  lineHeight: 1.6,
};

export const olStyle: React.CSSProperties = {
  paddingLeft: 20,
  marginBottom: 10,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  fontSize: '0.88rem',
  color: 'var(--text-primary)',
  lineHeight: 1.6,
};

export const codeStyle: React.CSSProperties = {
  fontFamily: '"Courier New", Courier, monospace',
  fontSize: '0.82em',
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border)',
  borderRadius: 4,
  padding: '1px 6px',
  color: 'var(--accent)',
};

// ─── Presentation sub-components ──────────────────────────────────────────────

export function Section({
  id,
  num,
  title,
  children,
}: {
  id: string;
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} style={{ marginBottom: 48, scrollMarginTop: 64 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16 }}>
        <span
          style={{
            fontSize: '0.7rem',
            fontWeight: 800,
            color: 'var(--accent)',
            background: 'var(--accent-dim)',
            borderRadius: 4,
            padding: '2px 7px',
            letterSpacing: '0.04em',
            flexShrink: 0,
          }}
        >
          {num}
        </span>
        <h2
          style={{
            fontSize: '1.05rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            margin: 0,
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </h2>
      </div>
      <div>{children}</div>
    </section>
  );
}

export function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontSize: '0.78rem',
        fontWeight: 700,
        color: 'var(--accent)',
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        margin: '20px 0 8px',
      }}
    >
      {children}
    </h3>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: '0.88rem',
        color: 'var(--text-primary)',
        lineHeight: 1.65,
        marginBottom: 10,
      }}
    >
      {children}
    </p>
  );
}

export function Note({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'rgba(245,166,35,0.08)',
        border: '1px solid rgba(245,166,35,0.25)',
        borderLeft: '3px solid var(--accent)',
        borderRadius: 6,
        padding: '10px 14px',
        marginBottom: 14,
        fontSize: '0.82rem',
        color: 'var(--text-primary)',
        lineHeight: 1.55,
      }}
    >
      {children}
    </div>
  );
}

export function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: 14 }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.82rem',
          color: 'var(--text-primary)',
          background: 'var(--bg-elevated)',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                style={{
                  padding: '9px 12px',
                  textAlign: i === 0 ? 'left' : 'center',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  background: 'var(--bg-surface)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              style={{ borderBottom: ri < rows.length - 1 ? '1px solid var(--border)' : 'none' }}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  style={{
                    padding: '9px 12px',
                    textAlign: ci === 0 ? 'left' : 'center',
                    fontWeight: ci === 0 ? 600 : 400,
                    color: ci === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                    verticalAlign: 'top',
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
