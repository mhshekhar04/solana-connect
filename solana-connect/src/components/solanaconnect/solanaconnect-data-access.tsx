import { getSolanaconnectProgram, getSolanaconnectProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'

import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useSolanaconnectProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getSolanaconnectProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getSolanaconnectProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['solanaconnect', 'all', { cluster }],
    queryFn: () => program.account.solanaconnect.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['solanaconnect', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ solanaconnect: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useSolanaconnectProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useSolanaconnectProgram()

  const accountQuery = useQuery({
    queryKey: ['solanaconnect', 'fetch', { cluster, account }],
    queryFn: () => program.account.solanaconnect.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['solanaconnect', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ solanaconnect: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['solanaconnect', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ solanaconnect: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['solanaconnect', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ solanaconnect: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['solanaconnect', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ solanaconnect: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
