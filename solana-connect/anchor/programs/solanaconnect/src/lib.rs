#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod solanaconnect {
    use super::*;

  pub fn close(_ctx: Context<CloseSolanaconnect>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.solanaconnect.count = ctx.accounts.solanaconnect.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.solanaconnect.count = ctx.accounts.solanaconnect.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeSolanaconnect>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.solanaconnect.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeSolanaconnect<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Solanaconnect::INIT_SPACE,
  payer = payer
  )]
  pub solanaconnect: Account<'info, Solanaconnect>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseSolanaconnect<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub solanaconnect: Account<'info, Solanaconnect>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub solanaconnect: Account<'info, Solanaconnect>,
}

#[account]
#[derive(InitSpace)]
pub struct Solanaconnect {
  count: u8,
}
