# Mint NFT Vault Swap

This project is a Solana program using Anchor that enables users to mint NFTs, lock them in a vault, and swap them for SOL.

## Features

1. **Mint NFTs**: Create new NFTs with metadata.
2. **Vault System**: Lock NFTs in a vault.
3. **Swap NFTs**: Swap NFTs for SOL.

## Architecture Diagram

![Architecture Diagram](/image.png)

## Instructions

### Mint NFT

Mint a new NFT with the provided metadata.

````rust
pub fn init_nft(
    ctx: Context<InitNFT>,
    name: String,
    symbol: String,
    uri: String,
) -> Result<()> {
    // Implementation
}


### Create Vault

Create a new vault to store NFTs.

```rust
pub fn create_vault(ctx: Context<CreateVault>, nft_mint: Pubkey) -> Result<()> {
    // Implementation
}
````

### Lock NFT

Lock an NFT into the vault.

```rust
pub fn lock_nft(ctx: Context<LockNft>) -> Result<()> {
    // Implementation
}
```

### Create Swap

Create a new swap offer for an NFT.

```rust
pub fn create_swap(ctx: Context<CreateSwap>, nft_mint: Pubkey, price: u64) -> Result<()> {
    // Implementation
}
```

### Execute Swap

Execute the swap, transferring SOL and the NFT between users.

```rust
pub fn execute_swap(ctx: Context<ExecuteSwap>) -> Result<()> {
    // Implementation
}
```

## Accounts

### InitNFT

- `signer`: The account of the user initializing the NFT.
- `mint`: The mint account for the NFT.
- `ata`: The associated token account for the NFT.
- `metadata_account`: The metadata account for the NFT.
- `master_edition_account`: The master edition account for the NFT.
- `token_program`: The token program.
- `associated_token_program`: The associated token program.
- `token_metadata_program`: The token metadata program.
- `system_program`: The system program.
- `rent`: The rent sysvar.

### CreateVault

- `vault`: The vault account.
- `owner`: The owner of the vault.
- `system_program`: The system program.

### LockNft

- `vault`: The vault account.
- `owner`: The owner of the NFT.
- `nft_token_account`: The token account holding the NFT.
- `vault_token_account`: The token account for the vault.
- `token_program`: The token program.

### CreateSwap

- `swap`: The swap account.
- `seller`: The seller of the NFT.
- `system_program`: The system program.

### ExecuteSwap

- `swap`: The swap account.
- `buyer`: The buyer of the NFT.
- `seller`: The seller of the NFT.
- `nft_token_account`: The token account holding the NFT.
- `buyer_token_account`: The token account for the buyer.
- `token_program`: The token program.

## Error Codes

- `Unauthorized`: The user is not authorized to perform this action.
- `AlreadyLocked`: The NFT is already locked.
- `InsufficientFunds`: The buyer does not have enough funds to execute the swap.

## Setup

1. Install Solana CLI and Anchor.
2. Build the program:

   ```sh
   anchor build
   ```

3. Deploy the program:

   ```sh
   solana config set --url https://api.devnet.solana.com
   anchor deploy
   ```

4. Run the tests:

   ```sh
   yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts
   ```

   `
