// Anchor program for ANTE Poker
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("YOUR_PROGRAM_ID_HERE"); // Replace with actual program ID after deployment

#[program]
pub mod ante_poker {
    use super::*;

    /// Initialize a new poker game with escrow token account
    pub fn initialize_game(ctx: Context<InitializeGame>, big_blind: u64, max_players: u8) -> Result<()> {
        let game = &mut ctx.accounts.game;
        game.authority = ctx.accounts.authority.key();
        game.big_blind = big_blind;
        game.small_blind = big_blind / 2;
        game.max_players = max_players;
        game.current_players = 0;
        game.stage = GameStage::Waiting;
        game.pot = 0;
        game.bump = *ctx.bumps.get("game").unwrap();
        Ok(())
    }

    /// Player joins the game by depositing the buy‑in amount into the escrow token account
    pub fn join_game(ctx: Context<JoinGame>, buy_in_amount: u64) -> Result<()> {
        // Ensure game is not full
        require!(ctx.accounts.game.current_players < ctx.accounts.game.max_players, ErrorCode::GameFull);

        // Transfer tokens from player to game escrow
        let cpi_accounts = Transfer {
            from: ctx.accounts.player_token_account.to_account_info(),
            to: ctx.accounts.game_token_account.to_account_info(),
            authority: ctx.accounts.player.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
        token::transfer(cpi_ctx, buy_in_amount)?;

        // Update game state
        let game = &mut ctx.accounts.game;
        game.current_players += 1;
        game.pot = game.pot.checked_add(buy_in_amount).ok_or(ErrorCode::Overflow)?;
        Ok(())
    }

    /// Request a verifiable random shuffle (placeholder – integrate Switchboard VRF later)
    pub fn request_shuffle(_ctx: Context<RequestShuffle>) -> Result<()> {
        // In a real implementation this would call Switchboard VRF and store the result
        msg!("Requesting verifiable random shuffle");
        Ok(())
    }

    /// Distribute the pot to the winner(s)
    pub fn distribute_pot(ctx: Context<DistributePot>, winner_indices: Vec<u8>) -> Result<()> {
        let game = &mut ctx.accounts.game;
        let share = game.pot / winner_indices.len() as u64;
        for idx in winner_indices {
            // In a full implementation we would look up the player by index and transfer
            // Here we just emit an event for demonstration
            msg!("Distributing {} tokens to winner index {}", share, idx);
        }
        game.pot = 0;
        Ok(())
    }
}

// ---------------------------------------------------------------------
// Account structs
// ---------------------------------------------------------------------
#[derive(Accounts)]
pub struct InitializeGame<'info> {
    #[account(init, payer = authority, space = 8 + GameAccount::INIT_SPACE, seeds = [b"game", authority.key().as_ref()], bump)]
    pub game: Account<'info, GameAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct JoinGame<'info> {
    #[account(mut, seeds = [b"game", game.authority.as_ref()], bump = game.bump)]
    pub game: Account<'info, GameAccount>,
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(mut)]
    pub player_token_account: Account<'info, TokenAccount>,
    #[account(mut, seeds = [b"escrow", game.key().as_ref()], bump)]
    pub game_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct RequestShuffle<'info> {
    // Placeholder – would include VRF accounts
    #[account(mut)]
    pub game: Account<'info, GameAccount>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct DistributePot<'info> {
    #[account(mut, seeds = [b"game", game.authority.as_ref()], bump = game.bump)]
    pub game: Account<'info, GameAccount>,
    pub authority: Signer<'info>,
    #[account(mut)]
    pub game_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

// ---------------------------------------------------------------------
// State structs
// ---------------------------------------------------------------------
#[account]
pub struct GameAccount {
    pub authority: Pubkey,
    pub big_blind: u64,
    pub small_blind: u64,
    pub max_players: u8,
    pub current_players: u8,
    pub stage: GameStage,
    pub pot: u64,
    pub bump: u8,
}

impl GameAccount {
    pub const INIT_SPACE: usize = 32 + 8 + 8 + 1 + 1 + 1 + 8 + 1; // matches field sizes
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum GameStage {
    Waiting,
    PreFlop,
    Flop,
    Turn,
    River,
    Showdown,
}

#[error_code]
pub enum ErrorCode {
    #[msg("The game is already full.")]
    GameFull,
    #[msg("Arithmetic overflow.")]
    Overflow,
}
