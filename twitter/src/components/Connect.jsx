import Web3 from "web3";
import contractABI from "../ABI/main.json"
import profileContractABI from "../ABI/user.json"

const contractAddress = "0x7f399EddBda244093B179a4601A586bF58a91eFe"
const profileContractAddress = "0x23358d40C96AF72AB0AEE39A0D04F9b82Ac1f1d9"

const Connect = ({
      web3,
      account,
      setWeb3, 
      shortAddress,
      setContract,
      setAccount,
      setProfileContract
  }) => {
  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // Chain ID for Sepolai in hexadecimal
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          // If Sepolia is not added to use's metaMask, add it
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xaa36a7",
                chainName: "Sepolia",
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["https://rpc.sepolia.org"],
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add Sepolia network to MetaMask", addError);
        }
      } else {
        console.error("Failed to switch to Sepolia network", switchError);
      }
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {

        await window.ethereum.request({ method: 'eth_requestAccounts' });
    

        //await window.ethereum.enable()
        const networkId = await window.ethereum.request({
          method: "net_version",
        });

        if (networkId != "100") {
          // Network ID for sepolia
          await switchToSepolia();
        }

        // user enables the app to connect to MetaMask
        const tempWeb3 = new Web3(window.ethereum)
        setWeb3(tempWeb3)
        const contractInstance = new tempWeb3.eth.Contract(
            contractABI,
            contractAddress
        )

        const profileContractInstance = new tempWeb3.eth.Contract(
          profileContractABI,
          profileContractAddress
        )
        setProfileContract(profileContractInstance)
        console.log('HIIIIII')

        const accounts = await tempWeb3.eth.getAccounts()
        console.log("ACCOUNTS", accounts)
        if (accounts.length > 0) {
          setContract(contractInstance)
          setAccount(accounts[0])
        }
        console.log("NAHHHHH")
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("No web3 provider detected");
    }
    
  };

  return (
    <>
      <div className="connect">
        {!account ? (
          <button id="connectWalletBtn" onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <div id="userAddress">Connected: {shortAddress(account)}</div>
        )}
      </div>
      <div id="connectMessage">
        {!account ? "Please connect your wallet to tweet." : ""}
      </div>
    </>
  );
};

export default Connect;
