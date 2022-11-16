//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Timelock {

    IERC20 _token;
    uint256 public intialSupply;
    uint256 private totalSuppply;
    address public wallet;
    address public owner;
    mapping(address => uint256) public balances;
    uint256 public constant SECONDS_IN_A_MINUTE = 60;
    uint256 public constant SECONDS_IN_A_DAY = 86400;
    uint256 public lastUpdated;
    uint256 public immutable initialTimestamp;

    mapping (address => uint256) public depositDay;
    
    // @param: token is my token's contract address
    constructor(address token) {
        _token = IERC20(token);
        owner = msg.sender;
        depositTokens(1000);
        // Minted and locked 1000 tokens
        balances[wallet] = 1000;
        // balances[address(this)] = intialSuply; // Maybe you also want to initialize this contract with most tokens?
        lastUpdated = block.timestamp;
        initialTimestamp = block.timestamp;
    }

    modifier onlyOwner(){
        require(owner==msg.sender);
        _;
    }

    //Modifier to check for token allowance
    modifier checkAllowance(uint256 amount){
        require(_token.allowance(msg.sender, address(this)) >= amount, "Error");
        _;
    }

    function unlock5Percent() public onlyOwner {

        // If a year has passed, then release all the locked funds in `balances[wallet]`
        // and add them to the `balances[address(this)]`.
        if(block.timestamp - depositDay[msg.sender] >= SECONDS_IN_A_DAY) {
            uint256 lockedFunds = balances[wallet];
            balances[wallet] = 0;
            balances[address(this)] = lockedFunds;
            totalSuppply += lockedFunds;
        }

        // If a Minute has passed after we last updated the locked tokens, by calculating that the difference, the time passed
        // between the last update, has been a Minute or more
        // then we can extract 5 percent more
        else if(block.timestamp - lastUpdated >= SECONDS_IN_A_MINUTE) {
            
            uint256 fivePercentage = balances[wallet] / 20;

            // Remove 5 percent of the tokens from the wallet
            balances[wallet] -= fivePercentage;

            // add it to this contract's token supply
            balances[address(this)] += fivePercentage;

            // Are we considering `totalSupply` to be the amount of tokens in circulation or are we
            // counting the 'locked' tokens also as part of the `totalSupply`?
            totalSuppply += fivePercentage;

            // update the lastUpdated variable so we only allow to extract 5 percent more after another interval
            lastUpdated = block.timestamp;
        }
        
    }

    // Function to Deposit to contract address
    function depositTokens(uint256 _amount) public{ 
        uint256 depositTime = block.timestamp;
        depositDay[msg.sender] = depositTime;
        // _token.approve(msg.sender, _amount); 
        _token.transfer(address(this), _amount);        
    }

    // Fucntion for only the owner is able to spend the tokens of this contract
    function transferTokens(uint256 amount) public onlyOwner{
        require(msg.sender == owner, "Only owner can withdraw funds"); 
        require(balances[address(this)] >= amount, "Not enough balance");
        balances[address(this)] -= amount;
        balances[msg.sender] += amount;
        _token.transfer(msg.sender, (10**18)*amount);
    }
    
    receive() external payable {}
    fallback() external payable{}
}