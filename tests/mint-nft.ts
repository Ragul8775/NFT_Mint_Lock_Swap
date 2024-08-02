import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MintNft } from "../target/types/mint_nft";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import {
  createAssociatedTokenAccount,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import {
  findMasterEditionPda,
  findMetadataPda,
  mplTokenMetadata,
  MPL_TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey } from "@metaplex-foundation/umi";

import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

describe("mint-nft", async () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.MintNft as Program<MintNft>;

  const signer = provider.wallet;
  const umi = createUmi("https://api.devnet.solana.com")
    .use(walletAdapterIdentity(signer))
    .use(mplTokenMetadata());

  const mint = anchor.web3.Keypair.generate();
  console.log(`mint: ${mint.publicKey.toBase58()}`);
  const vault = anchor.web3.Keypair.generate();
  console.log(`vault: ${vault.publicKey.toBase58()}`);
  const ata = await getAssociatedTokenAddress(mint.publicKey, signer.publicKey);

  let metadataAccount = findMetadataPda(umi, {
    mint: publicKey(mint.publicKey),
  })[0];

  let masterEditionAccount = findMasterEditionPda(umi, {
    mint: publicKey(mint.publicKey),
  })[0];

  const metadata = {
    name: "Kobeni",
    symbol: "kBN",
    uri: "https://raw.githubusercontent.com/687c/solana-nft-native-client/main/metadata.json",
  };

  const vaultTokenAccount = await getAssociatedTokenAddress(
    mint.publicKey,
    vault.publicKey
  );

  it("mints nft!", async () => {
    try {
      const tx = await program.methods
        .initNft(metadata.name, metadata.symbol, metadata.uri)
        .accounts({
          signer: signer.publicKey,
          mint: mint.publicKey,
          ata,
          metadataAccount,
          masterEditionAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([mint])
        .rpc();
      console.log(`mint nft tx: Transaction signature: ${tx}`);
    } catch (error) {
      console.error("Failed to mint NFT:", error);
    }
  });

  it("creates vault!", async () => {
    try {
      if (!(await provider.connection.getAccountInfo(vault.publicKey))) {
        const tx = await program.methods
          .createVault(mint.publicKey)
          .accounts({
            vault: vault.publicKey,
            owner: signer.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([vault])
          .rpc();
        console.log(`create vault tx: Transaction signature: ${tx}`);
      } else {
        console.log("Vault already initialized, skipping creation.");
      }
    } catch (error) {
      console.error("Failed to create or skip vault creation:", error);
    }
  });

  it("locks nft in vault!", async () => {
    try {
      const tx = await program.methods
        .lockNft()
        .accounts({
          vault: vault.publicKey,
          owner: signer.publicKey,
          nftTokenAccount: ata,
          vaultTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
      console.log(`lock nft tx: Transaction signature: ${tx}`);
    } catch (error) {
      console.error("Failed to lock NFT in vault:", error);
    }
  });

  it("executes swap!", async () => {
    try {
      const swap = anchor.web3.Keypair.generate();
      const price = 100000000; // Price in lamports (1 SOL)
      const tx = await program.methods
        .executeSwap()
        .accounts({
          swap: swap.publicKey,
          buyer: signer.publicKey,
          seller: vaultTokenAccount,
          nftTokenAccount: ata,
          buyerTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([signer]) // Adding the buyer as a signer
        .rpc();
      console.log(`execute swap tx: Transaction signature: ${tx}`);
    } catch (error) {
      console.error("Failed to execute swap:", error);
    }
  });
});
