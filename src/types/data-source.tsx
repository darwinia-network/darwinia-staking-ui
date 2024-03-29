import { Key } from "react";
import { Deposit, UnbondingInfo } from "./staking";

export interface StakingRecordsDataSource {
  key: Key;
  collator: string;
  commission: string;
  stakedPower: bigint;
  bondedTokens: {
    stakedRing: bigint;
    stakedKton: bigint;
    stakedDeposit: bigint;
    unbondingRing: Omit<UnbondingInfo, "depositId">[];
    unbondingKton: Omit<UnbondingInfo, "depositId">[];
    unbondingDeposits: UnbondingInfo[];
  };
  isActive: boolean;
  action: true;
}

export type DepositRecordsDataSource = Deposit & { key: Key };
