import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  const [currentAccount, setCurrentAccount] = useState();
  const [currentChainID, setCurrentChainID] = useState();
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        return;
      } else {
        //  console.log('We have the ethereum object', ethereum);

        let chainId = await ethereum.request({ method: 'eth_chainId' });
        // console.log("Connected to chain " + chainId);
        setCurrentChainID(chainId);
        /*
         * Check if we're authorized to access the user's wallet
         */
        const accounts = await ethereum.request({ method: 'eth_accounts' });

        /*
         * User can have multiple authorized accounts, we grab the first one if its there!
         */
        if (accounts.length !== 0) {
          const account = accounts[0];

          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Make sure you have MetaMask!');
        return;
      }

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      // console.log("Connected to chain " + chainId);
      setCurrentChainID(chainId);
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccountsChanged = (accounts) => {
    setCurrentAccount(accounts[0]);
  };
  const handlechainChanged = (chainId) => {
    setCurrentChainID(chainId);
  };

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      checkIfWalletIsConnected();
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handlechainChanged);
      return () => {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handlechainChanged);
      };
    }
  }, []);

  return (
    <div className="App">
      {currentAccount ? (
        <div>
          <div>
            <h4>Wallet Address:</h4>
            <p>{currentAccount}</p>
          </div>
          <div>
            <h4>Chain ID:</h4>
            <p>{currentChainID}</p>
          </div>
        </div>
      ) : (
        <button
          onClick={connectWalletAction}
          style={{ fontSize: '24px', padding: '10px' }}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default App;
