# Giwa (L2) Bridge CLI tool

First of all you need to install `pnpm` package to use this tool.

## Prerequirements
- Sepolia ETH in your wallet
- Linux (Ubuntu, Debian, and etc) or Using WSL on Windows
- PNPM ([Read here for installation](https://pnpm.io/installation))

## Installation
```
git clone https://github.com/stlkrdumb/giwa-l2 && cd giwas-l2
```
Install dependencies
```
pnpm install
```

Set environment variable called `TEST_PRIVATE_KEY` replace `<privatekey>` with your wallet private key.
```
export TEST_PRIVATE_KEY=<your privatekey>
```

Run the script
```
node --import=tsx src/deposit.ts
```

NOTE! makse sure your ETH Sepolia balance is enough, each time you run the script it will deposit 0.0025 Sepolia ETH to Giwa L2 Testnet.

if you have any problem please visit [my telegram channel](https://t.me/airdropStalkerChannel)