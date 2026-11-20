export function parseInput(obj) {
    return obj?.input ?? obj?.argument;
}
export function parseLeft(obj) {
    return obj?.left ?? obj?.argument1 ?? obj?.argument ?? obj?.dividend ?? obj?.numerator;
}
export function parseRight(obj) {
    return obj?.right ?? obj?.argument2 ?? obj?.divisor ?? obj?.denominator;
}
//# sourceMappingURL=helpers.js.map