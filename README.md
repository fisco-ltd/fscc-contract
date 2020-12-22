# FSCC Contract

## Install and Setup

```
$ git clone https://github.com/fisco-ltd/fscc-contract.git
$ cd fscc-contract
$ npm install
```

### prepare INFURA Key

The Ethereum node used for this project has INFURA (https://infura.io/).
If you want to deploy as it is, register it in INFURA and set the "PROJECT ID" of the created project in the environment variable "INFURA_KEY".

```
$ export INFURA_KEY="YOUR INFURA_KEY"
```

### prepare .secret file

Save the private key in a .secret file

```
$ echo "YOUR SECRET KEY" >> .secret
```

## deploy mainnet

```
$ npx truffle migrate --network mainnet
```
