//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

// 1. Create a Twitter Contract
// 2. Create a mapping between user adnd tweet
// 3. Add function to create a tweet and save it in mapping
// 4. Create a fucntion to get TWeet

interface IProfile {
    struct UserProfile {
        string displayName;
        string bio;
    }

    function getProfile(
        address _user
    ) external view returns (UserProfile memory);
}

contract Twitter is Ownable {
    // Define the events here
    event TweetCreated(
        uint256 id,
        address author,
        string content,
        uint256 timestamp
    );
    event TweetLiked(
        address liker,
        address tweetAuthor,
        uint256 tweetId,
        uint256 newLikeCount
    );
    event TweetUnliked(
        address unliker,
        address author,
        uint256 tweetId,
        uint256 newLikeCount
    );
    uint16 public MAX_TWEET_LENGTH = 280;
    // 2^(n) - 1

    // define our structs
    struct Tweet {
        uint256 id;
        address author;
        string content;
        uint256 timestamp;
        uint256 likes;
    }

    // add our code
    mapping(address => Tweet[]) public tweets;

    modifier onlyRegistered() {
        IProfile.UserProfile memory userProfileTemp = profileContract
            .getProfile(msg.sender);
        require(
            bytes(userProfileTemp.displayName).length > 0,
            "USER NOT REGISTERED"
        );
        _;
    }

    IProfile profileContract;

    constructor(address _profileContract) {
        profileContract = IProfile(_profileContract);
    }

    function changeTweetlength(uint16 newTweetLength) public {
        MAX_TWEET_LENGTH = newTweetLength;
    }

    function getTotalLikes(address _author) external view returns (uint256) {
        uint256 totalLikes;

        for (uint256 i = 0; i < tweets[_author].length; i++) {
            totalLikes += tweets[_author][i].likes;
        }
        return totalLikes;
    }

    function createTweet(string memory _tweet) public onlyRegistered {
        require(bytes(_tweet).length <= 280, "Tweet is too long bro!");

        Tweet memory newTweet = Tweet({
            id: tweets[msg.sender].length,
            author: msg.sender,
            content: _tweet,
            timestamp: block.timestamp,
            likes: 0
        });
        tweets[msg.sender].push(newTweet);

        emit TweetCreated(
            newTweet.id,
            newTweet.author,
            newTweet.content,
            newTweet.timestamp
        );
    }

    function likeTweet(uint256 id, address author) external onlyRegistered {
        require(tweets[author][id].id == id, "TWEET DOES NOT EXISTS");

        tweets[author][id].likes++;

        emit TweetLiked(msg.sender, author, id, tweets[author][id].likes);
    }

    function unlikeTweet(uint256 id, address author) external onlyRegistered {
        require(tweets[author][id].id == id, "TWEET DOES NOT EXISTS");
        require(tweets[author][id].likes > 0, "TWEET HAS NO LIKES");

        tweets[author][id].likes--;

        emit TweetUnliked(msg.sender, author, id, tweets[author][id].likes);
    }

    function getTweet(uint _i) public view returns (Tweet memory) {
        // memory ==> gas efficiency
        return tweets[msg.sender][_i];
    }

    function getAllTweets(address _owner) public view returns (Tweet[] memory) {
        return tweets[_owner];
    }
}
