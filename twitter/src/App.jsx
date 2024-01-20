import {useEffect, useState} from "react"
import './App.css'
import "./components/styles.css"
import Connect from "./components/Connect"
import ProfileCreation from "./components/ProfileCreation"
import AddTweet from "./components/AddTweet"
import Tweets from "./components/Tweets"

function App() {
  const [account, setAccount] = useState(null) 
  const [web3, setWeb3] = useState(null)
  const [profileExists, setProfileExists] = useState(null)
  const [profileContract, setProfileContract] = useState(null)
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [contract, setContract] = useState(null)

  function shortAddress(address, startLength = 6, endLength = 4) {
    if (address === account && profileExists) {
      return profileExists
    } else if (address) {
      return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
    }
  }

  const getTweets = async() => {
    if (!web3 || !contract) {
      console.error("Web3 or contract not initialized.")
      return
    }

    const tempTweets = await contract.methods.getAllTweets(account).call()
    // we do this so we can sort the tweets by timestamp
    const tweets = [...tempTweets]
    tweets.sort((a, b) => b.timestamp - a.timestamp)
    setTweets(tweets)
    setLoading(false)
  }

  const checkProfile = async() => {
    const userProfile = await getProfile(account)

    setProfileExists(userProfile)
  }

  const getProfile = async() => {
    if (!web3 || !profileContract || !account) {
      console.error(
        "web3 or profileContract not initialized or account not connected."
      )
      return
    }

    const profile = await profileContract.methods.getProfile(account).call()
    setLoading(false)
    return profile.displayName
  }

  useEffect(() => {
    if (contract && account) {
      if (profileExists) {
        getTweets()
      } else {
        checkProfile()
      }
    }
  }, [contract, account, profileExists])
 
 return(
  <div className="container">
    <h1>Twitter DAPP</h1>
    <Connect 
      web3={web3}
      setWeb3={setWeb3}
      account={account}
      setAccount={setAccount}
      shortAddress={shortAddress}
      setContract={setContract}
      setProfileContract={setProfileContract}
    />
     {!loading && account && profileExists ? (
        <>
          <AddTweet
            contract={contract}
            account={account}
            getTweets={getTweets}
          />
          <Tweets tweets={tweets} shortAddress={shortAddress} />
        </>
      ) : (
        account &&
        !loading && (
          <ProfileCreation
            account={account}
            profileContract={profileContract}
            checkProfile={checkProfile}
          />
        )
      )}
    </div>
  
 )
}

export default App
