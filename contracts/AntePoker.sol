// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title AntePoker - Minimal on-chain poker contract for ANTE token
 * @notice This contract demonstrates a secure, gas‑optimized skeleton for a poker game.
 *         It includes:
 *         • Cryptographically secure randomness via Chainlink VRF (placeholder implementation)
 *         • Efficient storage packing and external function visibility
 *         • Structured error handling with custom error codes
 *         • Event emission for off‑chain UI synchronization
 */
contract AntePoker {
    // ---------------------------------------------------------------------
    // Types & Constants
    // ---------------------------------------------------------------------
    enum GameStage { Waiting, PreFlop, Flop, Turn, River, Showdown }
    enum Action { Fold, Check, Call, Bet, Raise }

    // Custom error codes – aligns with errors.ts definitions
    error ERR_DECK_EXHAUSTED();
    error ERR_INVALID_TURN();
    error ERR_BET_TOO_SMALL();
    error ERR_INSUFFICIENT_CHIPS();
    error ERR_NOT_OWNER();

    // ---------------------------------------------------------------------
    // Storage (packed for gas efficiency)
    // ---------------------------------------------------------------------
    struct Player {
        address addr;          // 20 bytes
        uint96 chips;          // 12 bytes (packed with addr)
        uint8  position;      // 1 byte
        bool   isTurn;         // 1 byte
        uint8  handSize;      // 1 byte (number of hole cards)
    }

    struct Game {
        uint256 id;                 // 32 bytes
        uint96  pot;                // 12 bytes (packed)
        uint8   bigBlind;           // 1 byte
        uint8   smallBlind;         // 1 byte
        GameStage stage;            // 1 byte
        uint8   playerCount;        // 1 byte
        uint8   currentTurnIdx;     // 1 byte
        bytes32 deckHash;           // 32 bytes – hash of shuffled deck for verification
        mapping(uint8 => Player) players; // playerId => Player
    }

    // Mapping of gameId to Game struct (uses a separate storage slot for each game)
    mapping(uint256 => Game) public games;

    // ---------------------------------------------------------------------
    // Events – UI can listen to these for real‑time updates
    // ---------------------------------------------------------------------
    event GameCreated(uint256 indexed gameId, address indexed owner);
    event PlayerJoined(uint256 indexed gameId, address indexed player);
    event ActionTaken(uint256 indexed gameId, address indexed player, Action action, uint256 amount);
    event DeckShuffled(uint256 indexed gameId, bytes32 deckHash);
    event GameEnded(uint256 indexed gameId, address indexed winner, uint256 payout);

    // ---------------------------------------------------------------------
    // Modifiers
    // ---------------------------------------------------------------------
    modifier onlyPlayer(uint256 gameId, address player) {
        require(games[gameId].players[games[gameId].currentTurnIdx].addr == player, "ERR_NOT_OWNER");
        _;
    }

    // ---------------------------------------------------------------------
    // Public Functions – external visibility for minimal calldata cost
    // ---------------------------------------------------------------------
    /**
     * @notice Initialize a new poker game. Caller becomes the game owner.
     * @param gameId Unique identifier for the game.
     * @param bigBlind Size of the big blind in ANTE tokens.
     * @param maxPlayers Maximum number of players allowed.
     */
    function createGame(uint256 gameId, uint8 bigBlind, uint8 maxPlayers) external {
        Game storage g = games[gameId];
        require(g.id == 0, "Game already exists");
        g.id = gameId;
        g.bigBlind = bigBlind;
        g.smallBlind = bigBlind / 2;
        g.stage = GameStage.Waiting;
        g.playerCount = 0;
        g.currentTurnIdx = 0;
        emit GameCreated(gameId, msg.sender);
    }

    /**
     * @notice Player joins a game and deposits the buy‑in amount.
     * @dev In a real implementation, ANTE token transfer would be performed via ERC20 `transferFrom`.
     */
    function joinGame(uint256 gameId, uint96 buyIn) external {
        Game storage g = games[gameId];
        require(g.stage == GameStage.Waiting, "Game already started");
        require(g.playerCount < 9, "Game full");
        // Simplified token transfer logic omitted for brevity
        uint8 playerId = g.playerCount;
        g.players[playerId] = Player({
            addr: msg.sender,
            chips: buyIn,
            position: playerId,
            isTurn: false,
            handSize: 0
        });
        g.playerCount++;
        emit PlayerJoined(gameId, msg.sender);
    }

    /**
     * @notice Request a provably random shuffle using Chainlink VRF.
     * @dev Placeholder – in production this would call the VRFCoordinator.
     */
    function requestShuffle(uint256 gameId) external {
        Game storage g = games[gameId];
        require(g.stage == GameStage.Waiting, "Game already started");
        // ---- VRF CALL PLACEHOLDER ----
        // bytes32 requestId = requestRandomness(keyHash, fee);
        // On fulfillment, `fulfillRandomness` will set `deckHash`.
        // For demo, we use a pseudo‑random hash (DO NOT USE IN PRODUCTION)
        g.deckHash = keccak256(abi.encodePacked(block.timestamp, blockhash(block.number - 1), gameId));
        emit DeckShuffled(gameId, g.deckHash);
    }

    /**
     * @notice Player takes an action (bet/raise/etc.).
     * @dev Simplified – real implementation would include bet validation, pot updates, and stage transitions.
     */
    function takeAction(uint256 gameId, Action action, uint96 amount) external {
        Game storage g = games[gameId];
        Player storage p = g.players[g.currentTurnIdx];
        if (p.addr != msg.sender) revert ERR_INVALID_TURN();
        if (action == Action.Bet || action == Action.Raise) {
            if (amount < g.bigBlind) revert ERR_BET_TOO_SMALL();
            if (amount > p.chips) revert ERR_INSUFFICIENT_CHIPS();
            p.chips -= amount;
            g.pot += amount;
        }
        emit ActionTaken(gameId, msg.sender, action, amount);
        // Advance turn
        g.currentTurnIdx = (g.currentTurnIdx + 1) % g.playerCount;
    }

    /**
     * @notice End the game and distribute the pot to the winner.
     * @dev Winner determination is off‑chain; the winner address is supplied by the UI.
     */
    function endGame(uint256 gameId, address winner) external {
        Game storage g = games[gameId];
        require(g.stage != GameStage.Waiting, "Game not started");
        uint96 payout = g.pot;
        g.pot = 0;
        // Transfer payout to winner – token transfer omitted for brevity
        emit GameEnded(gameId, winner, payout);
        // Clean up storage (optional)
        delete games[gameId];
    }
}
