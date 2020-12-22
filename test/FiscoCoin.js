const FiscoCoin = artifacts.require('./FiscoCoin.sol');
const truffleAssert = require('truffle-assertions');
const { toBN, toWei } = web3.utils;

contract('FiscoCoin', (accounts) => {
  let instance;
  const deploy = async () => {
    instance = await FiscoCoin.deployed();
  };

  describe('デプロイ確認', () => {
    beforeEach(deploy);

    it('トークンが、デプロイを行ったアカウントに5000万枚発行されている', async () => {
      let balance = await instance.balanceOf(accounts[0]);
      const decimals = await instance.decimals()
      let amount = 50000000*(10**decimals)
      amount = toBN(amount.toString())
      assert(balance.eq(amount), 'デプロイしたアカウントに5000万FSCCがありません');
    });

    it('発行総数が5000万枚である', async () => {
      const total = await instance.totalSupply();
      const decimals = await instance.decimals()
      let amount = 50000000*(10**decimals)
      amount = toBN(amount.toString())
      assert(total.eq(amount), '発行したFSCCの合計が5000万枚ではありません');
    });
  });

  describe('transferの機能確認', () => {
    beforeEach(deploy);

    it('送金後、送り主の残高が送った量500FSCC減っている', async () => {
      const beforeBalance = await instance.balanceOf(accounts[0]);
      await instance.transfer(accounts[1], 500);
      const afterBalance = await instance.balanceOf(accounts[0]);

      assert(beforeBalance.sub(afterBalance).eq(toBN('500')), '送った額、送り主の残高が減っていません');
    });

    it('送金後、送り主の残高が送った量500FSCC増えている', async () => {
      const beforeBalance = await instance.balanceOf(accounts[1]);
      await instance.transfer(accounts[1], 500);
      const afterBalance = await instance.balanceOf(accounts[1]);

      assert(afterBalance.sub(beforeBalance).eq(toBN('500')), '送られた額、受け取り先の残高が増えていません');
    });

    it('保有している額よりも多くのトークンを送ることはできない', async () => {
      const balance = await instance.balanceOf(accounts[0]);
      const transfer_amount = balance.add(toBN(toWei('100')));

      await truffleAssert.reverts(
        instance.transfer(accounts[0], transfer_amount),
        'ERC20: transfer amount exceeds balance'
      );
    });
  });

  describe('approveの機能確認', () => {
    beforeEach(deploy);

    it('approveを行った後に、指定した量だけaccounts[1]から移動可能なFSCCが増えている', async () => {
      const beforeBalance = await instance.allowance(accounts[0], accounts[1]);
      await instance.approve(accounts[1], 500);
      const afterBalance = await instance.allowance(accounts[0], accounts[1]);

      assert(afterBalance.sub(beforeBalance).eq(toBN('500')), 'accounts[1]から移動可能な額が、指定した額と一致しません');
    });

    it('increaseAllowanceにより、accounts[1]から移動可能なFSCCが増える', async () => {
      const beforeBalance = await instance.allowance(accounts[0], accounts[1]);
      await instance.increaseAllowance(accounts[1], 500);
      const afterBalance = await instance.allowance(accounts[0], accounts[1]);

      assert(afterBalance.sub(beforeBalance).eq(toBN('500')), 'accounts[1]から移動可能な額が、指定した額分増えていません');
    });

    it('decreaseAllowanceにより、accounts[1]から移動可能なFSCCが減る', async () => {
      const beforeBalance = await instance.allowance(accounts[0], accounts[1]);
      await instance.decreaseAllowance(accounts[1], 500);
      const afterBalance = await instance.allowance(accounts[0], accounts[1]);

      assert(beforeBalance.sub(afterBalance).eq(toBN('500')), 'accounts[1]から移動可能な額が、指定した額分減っていません');
    });
  });

  describe('transferFromの機能確認', () => {
    beforeEach(deploy);

    it('approveを行った後、accounts[1]が許可された量のFSCCをaccounts[2]に移動することができる', async () => {
      await instance.approve(accounts[1], 500);
      const beforeBalance = await instance.allowance(accounts[0], accounts[1]);
      await instance.transferFrom(accounts[0], accounts[2], 500, { from: accounts[1] });
      const afterBalance = await instance.allowance(accounts[0], accounts[1]);

      assert(beforeBalance.sub(afterBalance).eq(toBN('500'), 'transferFromを用いて移動した額だけ、accounts[1]から移動可能な額が減っていません'));
    });

    it('approveからtransferFromを行った後、accounts[2]のFSCC残高が移動された分だけ増えている', async () => {
      await instance.approve(accounts[1], 500);
      const beforeBalance = await instance.balanceOf(accounts[2]);
      await instance.transferFrom(accounts[0], accounts[2], 500, { from: accounts[1] });
      const afterBalance = await instance.balanceOf(accounts[2]);

      assert(afterBalance.sub(beforeBalance).eq(toBN('500')), 'transferFromを用いて移動した額だけ、送り先の残高が増えていません');
    });

    it('approveにて許可された量以上のトークンを移動させることはできない', async() => {
      await instance.approve(accounts[1], 500);

      await truffleAssert.reverts(
        instance.transferFrom(accounts[0], accounts[2], 1000, {from: accounts[1]}),
        'ERC20: transfer amount exceeds allowance'
      );
    });

    it('approveにて許可された以外のアカウントがトークンを移動させることはできない', async() => {
      await instance.approve(accounts[1], 500);

      await truffleAssert.reverts(
        instance.transferFrom(accounts[0], accounts[2], 500, {from: accounts[2]}),
        'ERC20: transfer amount exceeds allowance'
      );
    });
  });
});
