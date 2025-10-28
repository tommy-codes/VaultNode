import { useState, useMemo } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { Contract, formatUnits, parseUnits } from 'ethers';

import { Header } from './Header';
import { CONTRACT_ADDRESS, CONTRACT_ABI, TOKEN_DECIMALS } from '../config/contracts';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { useZamaInstance } from '../hooks/useZamaInstance';
import '../styles/TokenApp.css';
import type { Abi } from 'viem';

const ZERO_HANDLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
const MAX_EUINT64 = (1n << 64n) - 1n;
const ABI = CONTRACT_ABI as unknown as Abi;

export function TokenApp() {
  const { address, isConnected } = useAccount();
  const signerPromise = useEthersSigner();
  const { instance, isLoading: zamaLoading, error: zamaError } = useZamaInstance();

  const [amountInput, setAmountInput] = useState('');
  const [durationInput, setDurationInput] = useState('3600');
  const [claiming, setClaiming] = useState(false);
  const [staking, setStaking] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [decrypting, setDecrypting] = useState(false);
  const [balanceDisplay, setBalanceDisplay] = useState<string>('***');
  const [stakeDisplay, setStakeDisplay] = useState<string>('***');

  const balanceQuery = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'confidentialBalanceOf',
    args: address ? [address] as const : undefined,
    query: {
      enabled: Boolean(address),
      refetchOnWindowFocus: false,
    },
  });

  const stakeQuery = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'stakeInfo',
    args: address ? [address] as const : undefined,
    query: {
      enabled: Boolean(address),
      refetchOnWindowFocus: false,
    },
  });

  const claimedQuery = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'testTokensClaimed',
    args: address ? [address] as const : undefined,
    query: {
      enabled: Boolean(address),
      refetchOnWindowFocus: false,
    },
  });

  const canWithdrawQuery = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'canWithdraw',
    args: address ? [address] as const : undefined,
    query: {
      enabled: Boolean(address),
      refetchOnWindowFocus: false,
    },
  });

  const faucetAmountQuery = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'TEST_FAUCET_AMOUNT',
    query: {
      enabled: true,
      refetchOnWindowFocus: false,
    },
  });

  const faucetAmountFormatted = useMemo(() => {
    if (!faucetAmountQuery.data) {
      return '0';
    }
    return formatUnits(faucetAmountQuery.data as bigint, TOKEN_DECIMALS);
  }, [faucetAmountQuery.data]);

  const stakeData = stakeQuery.data as readonly [string, bigint, boolean] | undefined;
  const balanceHandle = balanceQuery.data as string | undefined;
  const stakeHandle = stakeData ? stakeData[0] : undefined;
  const unlockTimestamp = stakeData ? Number(stakeData[1]) : 0;
  const stakeActive = stakeData ? stakeData[2] : false;
  const canWithdraw = Boolean(canWithdrawQuery.data);
  const alreadyClaimed = Boolean(claimedQuery.data);

  const unlockDate = useMemo(() => {
    if (!stakeActive || unlockTimestamp === 0) {
      return '';
    }
    return new Date(unlockTimestamp * 1000).toLocaleString();
  }, [stakeActive, unlockTimestamp]);

  const handleClaim = async () => {
    if (!isConnected || !address) {
      alert('Connect your wallet first');
      return;
    }
    if (!signerPromise) {
      alert('Wallet signer unavailable');
      return;
    }
    try {
      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Signer not ready');
      }

      setClaiming(true);
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.claimTestTokens();
      await tx.wait();

      await Promise.all([balanceQuery.refetch(), claimedQuery.refetch()]);
      setBalanceDisplay('***');
    } catch (error) {
      console.error('Claim failed', error);
      alert(error instanceof Error ? error.message : 'Claim failed');
    } finally {
      setClaiming(false);
    }
  };

  const handleStake = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isConnected || !address) {
      alert('Connect your wallet first');
      return;
    }
    if (!instance) {
      alert('Encryption service is not ready yet');
      return;
    }
    if (!signerPromise) {
      alert('Wallet signer unavailable');
      return;
    }

    try {
      const amount = amountInput.trim();
      const durationSeconds = Number(durationInput);

      if (!amount || Number(amount) <= 0) {
        throw new Error('Enter a valid amount greater than zero');
      }
      if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
        throw new Error('Lock duration must be a positive number of seconds');
      }
      if (!Number.isInteger(durationSeconds)) {
        throw new Error('Lock duration must be a whole number of seconds');
      }
      if (durationSeconds > Number.MAX_SAFE_INTEGER) {
        throw new Error('Lock duration exceeds the supported range');
      }

      const parsedAmount = parseUnits(amount, TOKEN_DECIMALS);
      if (parsedAmount <= 0n) {
        throw new Error('Stake amount must be greater than zero');
      }
      if (parsedAmount > MAX_EUINT64) {
        throw new Error('Amount exceeds the maximum supported encrypted value');
      }

      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Signer not ready');
      }

      setStaking(true);

      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const currentTimestamp = BigInt(Math.floor(Date.now() / 1000));
      const lockDuration = BigInt(durationSeconds);
      const operatorBuffer = 3600n;
      const maxOperatorUntil = (1n << 48n) - 1n;
      const operatorUntil = currentTimestamp + lockDuration + operatorBuffer;

      if (operatorUntil > maxOperatorUntil) {
        throw new Error('Operator authorization duration exceeds the protocol limit');
      }

      const operatorTx = await contract.setOperator(CONTRACT_ADDRESS, operatorUntil);
      await operatorTx.wait();

      const encryptedBuffer = await instance
        .createEncryptedInput(CONTRACT_ADDRESS, address)
        .add64(parsedAmount)
        .encrypt();

      const tx = await contract.stake(
        encryptedBuffer.handles[0],
        encryptedBuffer.inputProof,
        durationSeconds,
      );

      await tx.wait();

      await Promise.all([balanceQuery.refetch(), stakeQuery.refetch(), canWithdrawQuery.refetch()]);
      setBalanceDisplay('***');
      setStakeDisplay('***');
      setAmountInput('');
    } catch (error) {
      console.error('Stake failed', error);
      alert(error instanceof Error ? error.message : 'Stake failed');
    } finally {
      setStaking(false);
    }
  };

  const handleWithdraw = async () => {
    if (!isConnected || !address) {
      alert('Connect your wallet first');
      return;
    }
    if (!signerPromise) {
      alert('Wallet signer unavailable');
      return;
    }
    try {
      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Signer not ready');
      }

      setWithdrawing(true);
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.withdraw();
      await tx.wait();

      await Promise.all([
        balanceQuery.refetch(),
        stakeQuery.refetch(),
        canWithdrawQuery.refetch(),
      ]);
      setBalanceDisplay('***');
      setStakeDisplay('***');
    } catch (error) {
      console.error('Withdraw failed', error);
      alert(error instanceof Error ? error.message : 'Withdraw failed');
    } finally {
      setWithdrawing(false);
    }
  };

  const handleDecrypt = async () => {
    if (!instance) {
      alert('Encryption service is not ready yet');
      return;
    }
    if (!isConnected || !address) {
      alert('Connect your wallet to decrypt values');
      return;
    }
    if (!signerPromise) {
      alert('Wallet signer unavailable');
      return;
    }

    const handles: Array<{ handle: string; contractAddress: string }> = [];
    if (balanceHandle && balanceHandle !== ZERO_HANDLE) {
      handles.push({ handle: balanceHandle, contractAddress: CONTRACT_ADDRESS });
    }
    if (stakeHandle && stakeHandle !== ZERO_HANDLE) {
      handles.push({ handle: stakeHandle, contractAddress: CONTRACT_ADDRESS });
    }

    if (handles.length === 0) {
      setBalanceDisplay('0');
      setStakeDisplay('0');
      return;
    }

    try {
      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Signer not ready');
      }

      setDecrypting(true);

      const keypair = instance.generateKeypair();
      const startTimestamp = Math.floor(Date.now() / 1000).toString();
      const durationDays = '7';
      const contractAddresses = [CONTRACT_ADDRESS];

      const eip712 = instance.createEIP712(
        keypair.publicKey,
        contractAddresses,
        startTimestamp,
        durationDays,
      );

      const signature = await signer.signTypedData(
        eip712.domain,
        { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification },
        eip712.message,
      );

      const decrypted = await instance.userDecrypt(
        handles,
        keypair.privateKey,
        keypair.publicKey,
        signature.replace('0x', ''),
        contractAddresses,
        address,
        startTimestamp,
        durationDays,
      );

      if (balanceHandle && decrypted[balanceHandle]) {
        const value = BigInt(decrypted[balanceHandle]);
        setBalanceDisplay(formatUnits(value, TOKEN_DECIMALS));
      } else {
        setBalanceDisplay('0');
      }

      if (stakeHandle && decrypted[stakeHandle]) {
        const value = BigInt(decrypted[stakeHandle]);
        setStakeDisplay(formatUnits(value, TOKEN_DECIMALS));
      } else {
        setStakeDisplay(stakeActive ? '0' : '***');
      }
    } catch (error) {
      console.error('Decryption failed', error);
      alert(error instanceof Error ? error.message : 'Decryption failed');
    } finally {
      setDecrypting(false);
    }
  };

  return (
    <div className="token-app">
      <Header />
      <main className="token-main">
        <section className="token-card">
          <h2 className="card-title">Confidential Balance</h2>
          <p className="card-value">{balanceDisplay}</p>
          <div className="card-actions">
            <button
              onClick={handleDecrypt}
              disabled={decrypting || zamaLoading || !isConnected}
              className="primary-button"
            >
              {decrypting ? 'Decrypting...' : 'Decrypt Latest Balance'}
            </button>
            <button
              onClick={() => balanceQuery.refetch()}
              className="secondary-button"
              disabled={!isConnected}
            >
              Refresh Handle
            </button>
          </div>
          {zamaError && <p className="card-hint">Encryption service error: {zamaError}</p>}
          {!isConnected && <p className="card-hint">Connect your wallet to view balances.</p>}
        </section>

        <section className="token-card">
          <h2 className="card-title">Claim Test Tokens</h2>
          <p className="card-description">
            Claim once to receive {faucetAmountFormatted} cUSDT into your confidential balance.
          </p>
          <button
            onClick={handleClaim}
            disabled={claiming || !isConnected || alreadyClaimed}
            className="primary-button"
          >
            {alreadyClaimed ? 'Already Claimed' : claiming ? 'Claiming...' : 'Claim Tokens'}
          </button>
        </section>

        <section className="token-card">
          <h2 className="card-title">Stake Tokens</h2>
          <form className="stake-form" onSubmit={handleStake}>
            <label className="form-field">
              <span>Amount (cUSDT)</span>
              <input
                type="number"
                min="0"
                step="0.000001"
                value={amountInput}
                onChange={(event) => setAmountInput(event.target.value)}
                placeholder="Enter amount"
              />
            </label>
            <label className="form-field">
              <span>Lock duration (seconds)</span>
              <input
                type="number"
                min="1"
                step="1"
                value={durationInput}
                onChange={(event) => setDurationInput(event.target.value)}
                placeholder="3600"
              />
            </label>
            <button
              type="submit"
              className="primary-button"
              disabled={staking || !isConnected}
            >
              {staking ? 'Staking...' : 'Stake Tokens'}
            </button>
          </form>

          <div className="stake-status">
            <h3 className="stake-title">Current Position</h3>
            <p className="stake-line">
              <span>Active:</span>
              <strong>{stakeActive ? 'Yes' : 'No'}</strong>
            </p>
            <p className="stake-line">
              <span>Amount:</span>
              <strong>{stakeDisplay}</strong>
            </p>
            <p className="stake-line">
              <span>Unlock time:</span>
              <strong>{unlockDate || '--'}</strong>
            </p>
            <button
              onClick={handleWithdraw}
              className="secondary-button"
              disabled={!stakeActive || !canWithdraw || withdrawing}
            >
              {withdrawing ? 'Withdrawing...' : 'Withdraw' }
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
