import React, { memo, useState, useEffect, useCallback, useMemo } from 'react'
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { AnyTransaction, PendingTransaction } from '@helium/http'
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LayoutChangeEvent } from 'react-native'
import ActivityCard from './ActivityCard/ActivityCard'

import { withWalletLayout, WalletLayout } from './walletLayout'
import { ActivityViewState, FilterType } from './walletTypes'
import WalletBackground from './WalletBackground'

import { wh } from '../../../utils/layout'
import WalletHeaderCondensed from './WalletHeaderCondensed'

type Props = {
  layout: WalletLayout
  showSkeleton: boolean
  activityViewState: ActivityViewState
  txns: AnyTransaction[]
  pendingTxns: PendingTransaction[]
  filter: FilterType
  setActivityCardIndex: (index: number) => void
  handleScanPressed: () => void
  onReceivePress: () => void
  onSendPress: () => void
  activityCardRef: React.RefObject<BottomSheetMethods>
}

const WalletView = ({
  layout,
  showSkeleton,
  activityViewState,
  txns,
  pendingTxns,
  filter,
  setActivityCardIndex,
  handleScanPressed,
  onReceivePress,
  onSendPress,
  activityCardRef,
}: Props) => {
  const animatedCardIndex = useSharedValue<number>(1)
  const [hasNoResults, setHasNoResults] = useState(false)
  const [viewHeights, setViewHeights] = useState({
    header: 242,
    condensedHeader: 242,
  })
  const tabBarHeight = useBottomTabBarHeight()
  const insets = useSafeAreaInsets()

  useEffect(() => {
    const noResults =
      activityViewState === 'activity' &&
      !showSkeleton &&
      pendingTxns.length === 0 &&
      txns.length === 0
    setHasNoResults(noResults)
  }, [activityViewState, pendingTxns.length, showSkeleton, txns.length])

  const balanceCardStyles = useAnimatedStyle(
    () => ({
      position: 'absolute',
      left: 0,
      right: 0,
      opacity: animatedCardIndex.value - 1,
      top: 0,
      zIndex: 9999,
      transform: [
        {
          translateY: interpolate(
            animatedCardIndex.value,
            [1, 2],
            [0, insets.top],
            Extrapolate.CLAMP,
          ),
        },
      ],
    }),
    [animatedCardIndex, layout.chartHeight],
  )

  const handleLayout = useCallback(
    (key: 'condensedHeader' | 'header') => (event: LayoutChangeEvent) => {
      setViewHeights({
        ...viewHeights,
        [key]: event?.nativeEvent.layout.height,
      })
    },
    [viewHeights],
  )

  const snapPoints = useMemo(() => {
    const collapsedHeight = 24
    const midHeight = wh - viewHeights.header - tabBarHeight - insets.top
    const expandedHeight = wh - 46 - tabBarHeight - insets.top

    return [collapsedHeight, midHeight, expandedHeight]
  }, [insets.top, tabBarHeight, viewHeights.header])

  if (activityViewState === 'no_activity') return null
  return (
    <>
      <Animated.View style={balanceCardStyles}>
        <WalletHeaderCondensed onLayout={handleLayout('condensedHeader')} />
      </Animated.View>
      <WalletBackground
        handleScanPressed={handleScanPressed}
        handleHeaderLayout={handleLayout('header')}
        onReceivePress={onReceivePress}
        onSendPress={onSendPress}
      />

      <ActivityCard
        showSkeleton={showSkeleton}
        filter={filter}
        txns={txns}
        pendingTxns={pendingTxns}
        hasNoResults={hasNoResults}
        ref={activityCardRef}
        snapPoints={snapPoints}
        animatedIndex={animatedCardIndex}
        onChange={setActivityCardIndex}
      />
    </>
  )
}

export default memo(withWalletLayout(WalletView))
