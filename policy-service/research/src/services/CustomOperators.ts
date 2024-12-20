export const customOperators = {
  withContext: (context: any) => ({
    //isAdmin: (): boolean => context.user?.roles?.includes('Admin') ?? false,
    isAdmin: (): boolean => {
  console.log('Checking if user is admin...');
  console.log('User roles:', context.user?.roles);
  const result = context.user?.roles?.includes('admin') ?? false;
  console.log('isAdmin result:', result);
  return result;
},
    isBlacklisted: (): boolean => context.blacklist?.some((entry: any) => entry.userId === context.P._id && entry.status === 'ACTIVE') ?? false,
    isIn: (value: any, list: any[]): boolean => list.includes(value),
    contains: (value: string, substring: string): boolean => value?.includes(substring) ?? false,
    isOlderThan: (threshold: number): boolean => context.user?.age > threshold,
    hasTag: (tags: string[], tag: string): boolean => Array.isArray(tags) && tags.includes(tag),
    // daysSince: (date: Date): number => Math.floor((Date.now() - date.getTime()) / (1000 * 3600 * 24)),
daysSince: (date: Date): number => {
  const now = new Date();
  console.log("Current Date:", now);
  console.log("Input Date:", date);

  const timeDiff = Math.abs(now.getTime() - date.getTime());
  const days = Math.floor(timeDiff / (1000 * 3600 * 24));

  console.log("Difference in Days:", days);
  return days;
},
date: (dateString: string): Date | null => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date: ${dateString}`);
    }
    return date;
  } catch (error) {
    console.error(`Invalid date format: ${dateString}`, error);
    return null; // Returning null when the date is invalid
  }
},


    add: (a: number, b: number): number => a + b,
    multiply: (a: number, b: number): number => a * b,
    length: (str: string): number => str.length,
    uppercase: (str: string): string => str.toUpperCase(),
    all: (tags: string[], requiredTags: string[]) => requiredTags.every(tag => tags.includes(tag)),
    exists: (list: any[], predicate: (item: any) => boolean): boolean => list.some(predicate),
    exists_one: (list: any[], predicate: (item: any) => boolean): boolean => list.filter(predicate).length === 1,
    filter: (list: any[], predicate: (item: any) => boolean): any[] => list.filter(predicate),
    hasIntersection: (list1: any[], list2: any[]): boolean => list1.some(item => list2.includes(item)),
    intersect: (list1: any[], list2: any[]): any[] => list1.filter(item => list2.includes(item)),
    isSubset: (list1: any[], list2: any[]): boolean => list1.every(item => list2.includes(item)),
    map: (list: any[], transform: (item: any) => any): any[] => list.map(transform),
    size: (listOrMap: any[] | { [key: string]: any }): number => Array.isArray(listOrMap) ? listOrMap.length : Object.keys(listOrMap).length,
    base64: {
      encode: (value: string): string => Buffer.from(value, 'utf-8').toString('base64'),
      decode: (value: string): string => Buffer.from(value, 'base64').toString('utf-8'),
    },
    endsWith: (string: string, suffix: string): boolean => string.endsWith(suffix),
    format: (format: string, args: any[]): string => format.replace(/{(\d+)}/g, (match, number) => typeof args[number] != 'undefined' ? args[number] : match),
    indexOf: (string: string, char: string): number => string.indexOf(char),
    lowerAscii: (string: string): string => string.toLowerCase(),
    matches: (string: string, regex: string): boolean => new RegExp(regex).test(string),
    replace: (string: string, oldValue: string, newValue: string, limit?: number): string => limit ? string.replace(new RegExp(oldValue, 'g'), (match, count = 0) => count++ < limit ? newValue : match) : string.replace(new RegExp(oldValue, 'g'), newValue),
    split: (string: string, delimiter: string, limit?: number): string[] => string.split(delimiter, limit),
    startsWith: (string: string, prefix: string): boolean => string.startsWith(prefix),
    substring: (string: string, start: number, end?: number): string => string.substring(start, end),
    trim: (string: string): string => string.trim(),
    upperAscii: (string: string): string => string.toUpperCase(),
    duration: (value: string) => {
      const regex = /(\d+)([hms])/;
      const match = regex.exec(value);
      if (match) {
        const num = parseInt(match[1], 10);
        const suffix = match[2];
        switch (suffix) {
          case 'h': return { hours: num, minutes: 0, seconds: 0, milliseconds: 0 };
          case 'm': return { hours: 0, minutes: num, seconds: 0, milliseconds: 0 };
          case 's': return { hours: 0, minutes: 0, seconds: num, milliseconds: 0 };
          default: throw new Error('Invalid duration format');
        }
      }
      throw new Error('Invalid duration format');
    },
    timestamp: (value: string) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        console.error(`Invalid timestamp format: ${value}`);
        return null;
      }
      return date;
    },
    getFullYear: (timestamp: Date): number => timestamp?.getFullYear() ?? 0,
    getMonth: (timestamp: Date): number => timestamp?.getMonth() ?? 0,
    getDate: (timestamp: Date): number => timestamp?.getDate() ?? 0,
    now: (): Date => new Date(),
    timeSince: (timestamp: Date): any => {
      const now = new Date();
      const diff = now.getTime() - timestamp.getTime();
      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        milliseconds: diff % 1000,
      };
    },
  }),
};

