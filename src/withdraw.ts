import {publicClientL1, publicClientL2, account, walletClientL1, walletClientL2} from './config';
import {formatEther, parseEther} from "viem";

async function main() {
  // Before bridging back to Ethereum, check your ETH balance on your Layer 2 wallet.
  const l2Balance = await publicClientL2.getBalance({ address: account.address });
  console.log(`L2 Balance: ${formatEther(l2Balance)} ETH`);

  // Build the params to initiate a withdrawal on Layer 2.
  const withdrawalArgs = await publicClientL1.buildInitiateWithdrawal({
    to: account.address,
    value: parseEther("0.00005"),
  });

  // Initiate the withdrawal on Layer 2.
  // In this step, your ETH is sent to the L2ToL1MessagePasser contract.
  const withdrawalHash = await walletClientL2.initiateWithdrawal(withdrawalArgs);
  console.log(`Withdrawal transaction hash on L2: ${withdrawalHash}`);

  // Wait until the Layer 2 transaction above is fully processed.
  const withdrawalReceipt = await publicClientL2.waitForTransactionReceipt({ hash: withdrawalHash });
  console.log('L2 transaction confirmed:', withdrawalReceipt);

  // Wait until the L2 withdrawal transaction can be proven on L1.
  // This can take up to 2 hours.
  const { output, withdrawal } = await publicClientL1.waitToProve({
    receipt: withdrawalReceipt,
    targetChain: walletClientL2.chain
  });

  // Build the params to prove the withdrawal on Layer 1.
  const proveArgs = await publicClientL2.buildProveWithdrawal({
    output,
    withdrawal,
  });

  // Prove the withdrawal on Layer 1.
  const proveHash = await walletClientL1.proveWithdrawal(proveArgs);
  console.log(`Prove transaction hash on L1: ${proveHash}`);

  // Wait until the Layer 1 transaction above is fully processed.
  const proveReceipt = await publicClientL1.waitForTransactionReceipt({ hash: proveHash });
  console.log('Prove transaction confirmed:', proveReceipt);

  // Wait until the withdrawal can be finalized.
  // This period is called the challenge period and takes about 7 days.
  await publicClientL1.waitToFinalize({
    targetChain: walletClientL2.chain,
    withdrawalHash: withdrawal.withdrawalHash,
  });

  // Finalize the withdrawal on Layer 1.
  const finalizeHash = await walletClientL1.finalizeWithdrawal({
    targetChain: walletClientL2.chain,
    withdrawal,
  });
  console.log(`Finalize transaction hash on L1: ${finalizeHash}`);

  // Wait until the Layer 1 transaction above is fully processed.
  const finalizeReceipt = await publicClientL1.waitForTransactionReceipt({
    hash: finalizeHash
  });
  console.log('Finalize transaction confirmed:', finalizeReceipt);

  // Read the withdrawal status on Layer 1.
  // Because withdrawals take a long time to complete, you can query status with this if needed.
  const status = await publicClientL1.getWithdrawalStatus({
    receipt: withdrawalReceipt,
    targetChain: walletClientL2.chain,
  });
  console.log('Withdrawal completed successfully!');
}

main().then();
