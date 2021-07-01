import React, { memo } from 'react'
import { LayoutChangeEvent } from 'react-native'
import Box from '../../../components/Box'
import BalanceCard from './BalanceCard/BalanceCard'
import WalletAddress from './WalletAddress'
import WalletHeader from './WalletHeader'

type Props = {
  handleHeaderLayout: (event: LayoutChangeEvent) => void
  onReceivePress: () => void
  onSendPress: () => void
  handleScanPressed: () => void
}
const WalletBackground = ({
  handleHeaderLayout,
  onReceivePress,
  onSendPress,
  handleScanPressed,
}: Props) => {
  return (
    <Box flex={1}>
      <Box onLayout={handleHeaderLayout} backgroundColor="primaryBackground">
        <WalletHeader handleScanPressed={handleScanPressed} />
        <BalanceCard
          onReceivePress={onReceivePress}
          onSendPress={onSendPress}
        />
      </Box>
      <WalletAddress flex={1} alignItems="center" justifyContent="center" />
    </Box>
  )
}

export default memo(WalletBackground)
