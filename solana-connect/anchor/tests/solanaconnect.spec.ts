import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Solanaconnect} from '../target/types/solanaconnect'

describe('solanaconnect', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Solanaconnect as Program<Solanaconnect>

  const solanaconnectKeypair = Keypair.generate()

  it('Initialize Solanaconnect', async () => {
    await program.methods
      .initialize()
      .accounts({
        solanaconnect: solanaconnectKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([solanaconnectKeypair])
      .rpc()

    const currentCount = await program.account.solanaconnect.fetch(solanaconnectKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Solanaconnect', async () => {
    await program.methods.increment().accounts({ solanaconnect: solanaconnectKeypair.publicKey }).rpc()

    const currentCount = await program.account.solanaconnect.fetch(solanaconnectKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Solanaconnect Again', async () => {
    await program.methods.increment().accounts({ solanaconnect: solanaconnectKeypair.publicKey }).rpc()

    const currentCount = await program.account.solanaconnect.fetch(solanaconnectKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Solanaconnect', async () => {
    await program.methods.decrement().accounts({ solanaconnect: solanaconnectKeypair.publicKey }).rpc()

    const currentCount = await program.account.solanaconnect.fetch(solanaconnectKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set solanaconnect value', async () => {
    await program.methods.set(42).accounts({ solanaconnect: solanaconnectKeypair.publicKey }).rpc()

    const currentCount = await program.account.solanaconnect.fetch(solanaconnectKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the solanaconnect account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        solanaconnect: solanaconnectKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.solanaconnect.fetchNullable(solanaconnectKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
