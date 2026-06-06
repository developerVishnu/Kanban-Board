/**
 * A board column (a.k.a. lane). New columns can be added in the
 * future without code changes elsewhere — the board renders
 * whatever columns the store holds.
 */
export interface Column {
  id: string;
  title: string;
}
