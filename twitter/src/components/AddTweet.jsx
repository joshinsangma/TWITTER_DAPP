import {useState} from "react"
// import {PropTypes} from "prop-types"

const AddTweet = ({contract, account, getTweets}) => {
    const [newTweet, setNewTweet] = useState("")
    const [loading, setLoading] = useState(false)

    const createTweet = async(tweet) => {
        if (!contract || !account) {
            console.error(
                "Web3 or contract not initialized or account not connected."
            )
            return
        }

        try {
            setLoading(true)
            await contract.methods.createTweet(tweet).send({from: account})
            getTweets()
        } catch(error) {
            console.error("User rejected request:", error)
        } finally {
            setLoading(false)
        }

        console.log(newTweet)
    }

    return (
        <form
            id="tweetForm"
            onSubmit={(e) => {
                e.preventDefault()
                createTweet(newTweet)
            }}
        >
            <textarea
                id="tweetContent"
                rows="4"
                placeholder="What's happening"
                value={newTweet}
                onChange={(e) => setNewTweet(e.target.value)}
            />
            <br/>
            <button id="tweetSubmitBtn" disabled={loading} type="submit">
                {loading ? <div className="spinner"></div> : <>Tweet</>}
            </button>
        </form>
    )
}

// contract.propTypes = {
//     contract: PropTypes.func.isRequired,
// };

export default AddTweet
