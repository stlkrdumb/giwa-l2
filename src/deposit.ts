import {publicClientL1, publicClientL2, account, walletClientL1} from './config';
import {formatEther, parseEther} from "viem";
import {getL2TransactionHashes} from "viem/op-stack";

async function main() {
  // Before bridging to GIWA, check your ETH balance on your Layer 1 wallet.
  const l1Balance = await publicClientL1.getBalance({ address: account.address });
  console.log(`L1 Balance: ${formatEther(l1Balance)} ETH`);

  // Build the params to send a deposit transaction on Layer 1.
  const depositArgs = await publicClientL2.buildDepositTransaction({
    mint: parseEther("0.0025"),
    to: account.address,
  });

  // Send the deposit transaction on Layer 1.
  // In this step, your ETH is sent to the OptimismPortal contract.
  const depositHash = await walletClientL1.depositTransaction(depositArgs);
  console.log(`Deposit transaction hash on L1: ${depositHash}`);

  // Wait until the Layer 1 transaction above is fully processed.
  const depositReceipt = await publicClientL1.waitForTransactionReceipt({ hash: depositHash });
  console.log('L1 transaction confirmed:', depositReceipt);

  // From the Layer 1 receipt, pre-compute the hash of the corresponding Layer 2 deposit transaction.
  const [l2Hash] = getL2TransactionHashes(depositReceipt);
  console.log(`Corresponding L2 transaction hash: ${l2Hash}`);

  // Wait until the computed Layer 2 deposit transaction is processed.
  // This usually takes about 1–3 minutes.
  const l2Receipt = await publicClientL2.waitForTransactionReceipt({
    hash: l2Hash,
  });
  console.log('L2 transaction confirmed:', l2Receipt);
  console.log('Deposit completed successfully!');
}

main().then();
