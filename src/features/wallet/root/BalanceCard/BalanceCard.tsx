import React, { memo, useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { isEqual } from 'lodash'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { RootState } from '../../../../store/rootReducer'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'
import CurrencyBadge from './CurrencyBadge'
import WalletButton from './WalletButton'
import { hp, wp } from '../../../../utils/layout'
import useCurrency from '../../../../utils/useCurrency'

type Props = {
  onReceivePress: () => void
  onSendPress: () => void
}

const BalanceCard = ({ onReceivePress, onSendPress }: Props) => {
  const [balanceInfo, setBalanceInfo] = useState<{
    hasBalance: boolean
    integerPart: string
    decimalPart: string
  }>({ hasBalance: false, integerPart: '0', decimalPart: '00000000' })
  const { hntBalanceToDisplayVal, toggleConvertHntToCurrency } = useCurrency()
  const account = useSelector(
    (state: RootState) => state.account.account,
    isEqual,
  )
  const fetchAccountState = useSelector(
    (state: RootState) => state.account.fetchDataStatus,
    isEqual,
  )

  const updateBalanceInfo = useCallback(async () => {
    const hasBalance = account?.balance?.integerBalance !== 0
    if (account?.balance && hasBalance) {
      const balInfo = await hntBalanceToDisplayVal(account.balance, true)
      setBalanceInfo({
        hasBalance,
        ...balInfo,
      })
    }
  }, [account?.balance, hntBalanceToDisplayVal])

  useEffect(() => {
    updateBalanceInfo()
  }, [updateBalanceInfo])

  return (
    <Box justifyContent="center" paddingVertical="xs" paddingHorizontal="l">
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        {fetchAccountState === 'idle' || fetchAccountState === 'rejected' ? (
          <SkeletonPlaceholder
            backgroundColor="#343964"
            highlightColor="#292E56"
          >
            <SkeletonPlaceholder.Item
              width={80}
              height={40}
              marginTop={8}
              borderRadius={8}
            />
            <SkeletonPlaceholder.Item
              width={150}
              height={16}
              marginTop={8}
              borderRadius={8}
            />
          </SkeletonPlaceholder>
        ) : (
          <Box onTouchStart={toggleConvertHntToCurrency}>
            <Text
              adjustsFontSizeToFit
              maxFontSizeMultiplier={1.2}
              color="white"
              fontSize={hp(4.5)}
              fontWeight="300"
            >
              {balanceInfo.integerPart}
            </Text>
            <Text
              color="white"
              fontSize={hp(1.8)}
              fontWeight="300"
              opacity={0.4}
              lineHeight={25}
            >
              {balanceInfo.decimalPart}
            </Text>
          </Box>
        )}

        <Box flexDirection="row" justifyContent="space-between" width={wp(30)}>
          <WalletButton variant="receive" onPress={onReceivePress} />
          <WalletButton
            variant="send"
            onPress={onSendPress}
            disabled={!balanceInfo.hasBalance}
          />
        </Box>
      </Box>

      <Box flexDirection="row" paddingTop="m">
        <CurrencyBadge
          variant="dc"
          amount={account?.dcBalance?.integerBalance || 0}
        />
        <CurrencyBadge
          variant="hst"
          amount={account?.secBalance?.floatBalance || 0}
        />
      </Box>
    </Box>
  )
}

export default memo(BalanceCard)
