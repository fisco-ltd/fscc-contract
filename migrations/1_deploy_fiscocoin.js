const FiscoCoin = artifacts.require("./FiscoCoin.sol");

module.exports = function(deployer, network, accounts) {
  const name = "FiscoCoin";
  const symbol = "FSCC";
  const decimals = 8;
  const amount = 50000000;
  const initSupply = web3.utils.toBN(amount*(10**decimals));

  return deployer.then(()=>{
    return deployer.deploy(
      FiscoCoin,
      name,
      symbol,
      decimals,
      initSupply
    );
  });
}
