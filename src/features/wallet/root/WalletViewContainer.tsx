import React, { memo, useCallback, useMemo, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import BottomSheet from '@gorhom/bottom-sheet'
import { AnyTransaction, PendingTransaction } from '@helium/http'
import Box from '../../../components/Box'
import BalanceCard from './BalanceCard/BalanceCard'
import {
  WalletAnimationPoints,
  WalletLayout,
  withWalletLayout,
} from './walletLayout'
import useHaptic from '../../../utils/useHaptic'
import WalletIntroCarousel from './WalletIntroCarousel'
import { Loading } from '../../../store/activity/activitySlice'
import { ActivityViewState, FilterType } from './walletTypes'
import WalletView from './WalletView'
import { RootNavigationProp } from '../../../navigation/main/tabTypes'

type Props = {
  layout: WalletLayout
  animationPoints: WalletAnimationPoints
  sendSnapPoints: number[]
  txns: AnyTransaction[]
  pendingTxns: PendingTransaction[]
  filter: FilterType
  txnTypeStatus: Loading
  showSkeleton: boolean
  activityViewState: ActivityViewState
}

const WalletViewContainer = ({
  layout,
  animationPoints,
  sendSnapPoints,
  txns,
  pendingTxns,
  filter,
  txnTypeStatus,
  showSkeleton,
  activityViewState,
}: Props) => {
  const navigation = useNavigation<RootNavigationProp>()
  const { triggerNavHaptic } = useHaptic()

  const activityCardRef = useRef<BottomSheet>(null)
  const balanceSheetRef = useRef<BottomSheet>(null)

  const [activityCardIndex, setActivityCardIndex] = useState(1)
  const [balanceSheetIndex, setBalanceSheetIndex] = useState(0)

  const navScan = useCallback(() => {
    triggerNavHaptic()
    navigation.navigate('ScanStack')
  }, [navigation, triggerNavHaptic])

  const handleSendPress = useCallback(() => {
    triggerNavHaptic()
    navigation.navigate('SendStack')
  }, [navigation, triggerNavHaptic])

  const toggleShowReceive = useCallback(() => {
    if (activityViewState === 'no_activity') {
      const snapToIndex = balanceSheetIndex >= 1 ? 0 : 1
      balanceSheetRef.current?.snapTo(snapToIndex)
    } else {
      const snapToIndex = activityCardIndex >= 1 ? 0 : 1
      activityCardRef.current?.snapTo(snapToIndex)
    }
    triggerNavHaptic()
  }, [
    activityCardIndex,
    activityViewState,
    balanceSheetIndex,
    triggerNavHaptic,
  ])

  const containerStyle = useMemo(() => ({ paddingTop: layout.notchHeight }), [
    layout.notchHeight,
  ])

  return (
    <Box flex={1} style={containerStyle}>
      {(activityViewState === 'activity' ||
        activityViewState === 'undetermined') && (
        <WalletView
          layout={layout}
          animationPoints={animationPoints}
          activityViewState={activityViewState}
          showSkeleton={showSkeleton}
          txns={txns}
          pendingTxns={pendingTxns}
          filter={filter}
          txnTypeStatus={txnTypeStatus}
          setActivityCardIndex={setActivityCardIndex}
          onReceivePress={toggleShowReceive}
          onSendPress={handleSendPress}
          activityCardRef={activityCardRef}
          handleScanPressed={navScan}
        />
      )}
      {activityViewState === 'no_activity' && (
        <>
          <WalletIntroCarousel />
          <BottomSheet
            index={balanceSheetIndex}
            onChange={setBalanceSheetIndex}
            handleComponent={null}
            backgroundComponent={null}
            snapPoints={sendSnapPoints}
            animateOnMount={false}
            ref={balanceSheetRef}
          >
            <BalanceCard
              onReceivePress={toggleShowReceive}
              onSendPress={handleSendPress}
            />
          </BottomSheet>
        </>
      )}
    </Box>
  )
}

export default memo(withWalletLayout(WalletViewContainer))
