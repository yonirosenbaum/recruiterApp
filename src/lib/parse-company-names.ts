const HEADER_ALIASES = new Set([
  'company',
  'company name',
  'client',
  'client name',
  'employer',
  'organisation',
  'organization',
  'name',
  'firm',
  'account',
]);

export type ParsedNameRow = { row: number; name: string };

export type ParseNamesResult = {
  rows: ParsedNameRow[];
  blankCount: number;
  headerUsed: string | null;
  errors: string[];
};

function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i]!;
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === ',' && !inQuotes) {
      cells.push(cur);
      cur = '';
      continue;
    }
    cur += ch;
  }
  cells.push(cur);
  return cells.map((c) => c.trim().replace(/^"|"$/g, ''));
}

/**
 * Parse CSV or newline-separated company names for lapsed-client import.
 * Detects a company-like header; otherwise uses the first column / whole line.
 */
export function parseCompanyNamesText(text: string): ParseNamesResult {
  const raw = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = raw.split('\n');
  const errors: string[] = [];
  const rows: ParsedNameRow[] = [];
  let blankCount = 0;
  let headerUsed: string | null = null;
  let colIndex = 0;
  let startLine = 0;

  const nonEmpty = lines
    .map((l, i) => ({ line: l.trim(), index: i }))
    .filter((l) => l.line.length > 0);

  if (nonEmpty.length === 0) {
    return {
      rows: [],
      blankCount: lines.length,
      headerUsed: null,
      errors: ['No company names found. Add one name per line or a CSV column.'],
    };
  }

  const first = nonEmpty[0]!;
  const firstCells = splitCsvLine(first.line);
  const looksLikeHeader = firstCells.some((c) =>
    HEADER_ALIASES.has(c.toLowerCase()),
  );

  if (looksLikeHeader) {
    const idx = firstCells.findIndex((c) =>
      HEADER_ALIASES.has(c.toLowerCase()),
    );
    colIndex = idx >= 0 ? idx : 0;
    headerUsed = firstCells[colIndex] ?? null;
    startLine = first.index + 1;
  }

  for (let i = startLine; i < lines.length; i += 1) {
    const line = lines[i] ?? '';
    if (!line.trim()) {
      blankCount += 1;
      continue;
    }
    const cells = splitCsvLine(line);
    const name = (cells[colIndex] ?? cells[0] ?? '').trim();
    if (!name) {
      blankCount += 1;
      continue;
    }
    rows.push({ row: i + 1, name });
  }

  if (rows.length > 2000) {
    errors.push(
      `Found ${rows.length} names — maximum is 2,000 per import. Split the file and try again.`,
    );
  }

  return { rows, blankCount, headerUsed, errors };
}
