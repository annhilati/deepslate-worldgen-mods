export function parseInput(obj: any): any {
    return obj?.input ?? obj?.argument;
}

export function parseLeft(obj: any): any {
    return obj?.left ?? obj?.argument1 ?? obj?.argument ?? obj?.dividend ?? obj?.numerator;
}

export function parseRight(obj: any): any {
    return obj?.right ?? obj?.argument2 ?? obj?.divisor ?? obj?.denominator;
}
