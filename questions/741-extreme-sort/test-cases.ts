import { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<Sort<[]>, []>>,
  Expect<Equal<Sort<[1]>, [1]>>,
  Expect<Equal<Sort<[2, 1]>, [1, 2]>>,
  Expect<Equal<Sort<[0, 0, 0]>, [0, 0, 0]>>,
  Expect<Equal<Sort<[1, 2, 3]>, [1, 2, 3]>>,
  Expect<Equal<Sort<[3, 2, 1]>, [1, 2, 3]>>,
  Expect<Equal<Sort<[3, 2, 1, 2]>, [1, 2, 2, 3]>>,
  Expect<Equal<Sort<[3, 2, 0, 1, 0, 0, 0]>, [0, 0, 0, 0, 1, 2, 3]>>,
  Expect<Equal<Sort<[2, 4, 7, 6, 6, 6, 5, 8, 9]>, [2, 4, 5, 6, 6, 6, 7, 8, 9]>>,
  Expect<Equal<Sort<[1, 1, 2, 1, 1, 1, 1, 1, 1]>, [1, 1, 1, 1, 1, 1, 1, 1, 2]>>,
  Expect<Equal<Sort<[], true>, []>>,
  Expect<Equal<Sort<[1], true>, [1]>>,
  Expect<Equal<Sort<[2, 1], true>, [2, 1]>>,
  Expect<Equal<Sort<[0, 0, 0], true>, [0, 0, 0]>>,
  Expect<Equal<Sort<[1, 2, 3], true>, [3, 2, 1]>>,
  Expect<Equal<Sort<[3, 2, 1], true>, [3, 2, 1]>>,
  Expect<Equal<Sort<[3, 2, 1, 2], true>, [3, 2, 2, 1]>>,
  Expect<Equal<Sort<[3, 2, 0, 1, 0, 0, 0], true>, [3, 2, 1, 0, 0, 0, 0]>>,
  Expect<
    Equal<Sort<[2, 4, 7, 6, 6, 6, 5, 8, 9], true>, [9, 8, 7, 6, 6, 6, 5, 4, 2]>
  >
];

type MakeTuple<U extends number, T extends any[] = []> = T["length"] extends U
  ? T
  : MakeTuple<U, [any, ...T]>;

type IsGe<T extends number, U extends number> = T extends U
  ? false
  : Reduce<U, MakeTuple<T>>;

type Reduce<U extends number, T extends any[] = []> = T["length"] extends U
  ? true
  : T["length"] extends 0
  ? false
  : T extends [infer Alpha, ...infer Rest]
  ? Reduce<U, Rest>
  : never;

type Compare<T extends number, U extends number> = T extends U
  ? 0
  : IsGe<T, U> extends true
  ? 1
  : -1;

type PickSmall<T extends any[]> = T extends [infer Alpha, ...infer Rest]
  ? Rest extends []
    ? Alpha
    : Compare<Alpha & number, PickSmall<Rest>> extends -1 | 0
    ? Alpha & number
    : PickSmall<Rest>
  : never;

type Split<T extends any[], U extends any> = T extends [
  infer Alpha,
  ...infer Rest
]
  ? Rest extends []
    ? U extends Alpha
      ? []
      : [Alpha]
    : U extends Alpha
    ? Rest
    : [Alpha, ...Split<Rest, U>]
  : [];

type Reverse<T extends any[]> = T extends [...infer Rest, infer Last]
  ? Rest extends []
    ? [Last]
    : [Last, ...Reverse<Rest>]
  : T;

type SortAsc<T extends any[]> = T extends [infer Alpha, ...infer Rest]
  ? Rest extends []
    ? [Alpha]
    : Compare<Alpha & number, PickSmall<Rest>> extends 0 | -1
    ? [Alpha, ...SortAsc<Rest>]
    : [PickSmall<Rest>, ...SortAsc<[Alpha, ...Split<Rest, PickSmall<Rest>>]>]
  : T;
type SortDes<T extends number[]> = Reverse<T>;

type Sort<T extends any[], U extends boolean = false> = U extends true
  ? SortDes<SortAsc<T>>
  : SortAsc<T>;
