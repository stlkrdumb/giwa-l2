# Giwa (L2) Bridge CLI tool

First of all you need to install `pnpm` package to use this tool.

## Prerequirements
- Sepolia ETH in your wallet
- Linux (Ubuntu, Debian, and etc) or Using WSL on Windows
- PNPM ([Read here for installation](https://pnpm.io/installation))

## Installation
```
git clone https://github.com/stlkrdumb/giwa-l2 && cd giwa-l2
```
- Install dependencies
```
pnpm install
```
- Create file called `.env` and fill with example below, change `<yourprivatekey>` with your wallet privatekey, and then save it.
```
TEST_PRIVATE_KEY=<yourprivatekey>
```

## Deposit and Withdraw ETH
- Run the script for deposit ETH
```
node --import=tsx src/deposit.ts
```
- or if you want to withdraw
```
node --import=tsx src/withdraw.ts
```

If you're running into problem when running above script, be sure to check again your private key already imported or not by doing `echo $TEST_PRIVATE_KEY` if the result blank you need to set it again.

NOTE! makse sure your ETH Sepolia balance is enough, each time you run the script it will deposit 0.0025 Sepolia ETH to Giwa L2 Testnet.

if you have any problem please visit [my telegram channel](https://t.me/airdropStalkerChannel)
