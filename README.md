# FSCC Contract

## Install and Setup

```
$ git clone https://github.com/fisco-ltd/fscc-contract.git
$ cd fscc-contract
$ npm install
```

## Prepare INFURA Key

The Ethereum node used for this project has INFURA (https://infura.io/).

If you want to deploy as it is, register it in INFURA and set the "PROJECT ID" of the created project in the environment variable "INFURA_KEY".

```
$ export INFURA_KEY="YOUR INFURA_KEY"
```

## Prepare .secret file

Save the private key in a .secret file.

```
$ echo "YOUR SECRET KEY" >> .secret
```

## Deploy Mainnet

```
$ npx truffle migrate --network mainnet
```
