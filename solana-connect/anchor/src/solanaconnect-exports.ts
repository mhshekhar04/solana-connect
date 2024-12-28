// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import SolanaconnectIDL from '../target/idl/solanaconnect.json'
import type { Solanaconnect } from '../target/types/solanaconnect'

// Re-export the generated IDL and type
export { Solanaconnect, SolanaconnectIDL }

// The programId is imported from the program IDL.
export const SOLANACONNECT_PROGRAM_ID = new PublicKey(SolanaconnectIDL.address)

// This is a helper function to get the Solanaconnect Anchor program.
export function getSolanaconnectProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...SolanaconnectIDL, address: address ? address.toBase58() : SolanaconnectIDL.address } as Solanaconnect, provider)
}

// This is a helper function to get the program ID for the Solanaconnect program depending on the cluster.
export function getSolanaconnectProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Solanaconnect program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return SOLANACONNECT_PROGRAM_ID
  }
}
