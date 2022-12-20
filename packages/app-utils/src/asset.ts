import BigNumber from "bignumber.js";

/*I don't know what this POWER_CAP is, I just took it from apps.darwinia.network in Darwinia 1.0*/
const POWER_CAP = 1000000000;
export const convertAssetToPower = (
  ringAmount: BigNumber,
  ktonAmount: BigNumber,
  poolRingAmount: BigNumber,
  poolKtonAmount: BigNumber
): BigNumber => {
  if (poolRingAmount.isEqualTo(0)) {
    return BigNumber(0);
  }

  let divider = BigNumber(0);
  /*Power calculation formula is
   *  (ringAmount + (ktonAmount * (poolRingAmount / poolKtonAmount))) / (poolRingAmount * 2) * 1000000000
   *  */
  if (!poolKtonAmount.isEqualTo(0)) {
    divider = poolRingAmount.div(poolKtonAmount);
  }

  const power = ringAmount.plus(ktonAmount.times(divider)).div(poolRingAmount.times(2)).times(POWER_CAP).toFixed(0);

  return BigNumber(power);
};

/*The original formula for calculating KTON comes from
https://github.com/darwinia-network/darwinia-common/blob/main/frame/staking/src/inflation.rs#L129 */
export const calculateKtonFromRingDeposit = (
  ringAmount: BigNumber,
  depositMonths: number,
  decimalPrecision = 9,
  round = BigNumber.ROUND_DOWN
) => {
  if (depositMonths === 0) {
    return BigNumber(0);
  }

  const n = BigNumber(67).pow(depositMonths);
  const d = BigNumber(66).pow(depositMonths);
  const quot = n.dividedToIntegerBy(d);
  const remainder = n.mod(d);
  const precision = BigNumber(1000);
  const someMagicNumber = BigNumber(1970000); // I don't even know what this number is
  /* Mixing dividedToIntegerBy with div brings exactly the same result as how it used to be
   * on apps.darwinia.network in Darwinia 1.0 */
  return precision
    .times(quot.minus(1))
    .plus(precision.times(remainder).dividedToIntegerBy(d))
    .times(ringAmount)
    .div(someMagicNumber)
    .toFormat(decimalPrecision, round);
};
