import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  Ref,
  memo,
  useMemo,
} from 'react'
import BottomSheet from '@gorhom/bottom-sheet'
import Animated from 'react-native-reanimated'
import { AnyTransaction, PendingTransaction } from '@helium/http'
import ActivityCardHeader from './ActivityCardHeader'
import { FilterType } from '../walletTypes'
import ActivityCardListView from './ActivityCardListView'
import ActivityListSkeletonView from './ActivityListSkeletonView'

type Props = {
  animatedIndex?: Animated.SharedValue<number>
  onChange?: (index: number) => void
  txns: AnyTransaction[]
  pendingTxns: PendingTransaction[]
  filter: FilterType
  hasNoResults: boolean
  showSkeleton: boolean
  snapPoints: (string | number)[]
}

const ActivityCard = forwardRef((props: Props, ref: Ref<BottomSheet>) => {
  const {
    animatedIndex,
    onChange,
    txns,
    pendingTxns,
    filter,
    hasNoResults,
    showSkeleton,
    snapPoints,
  } = props
  const sheet = useRef<BottomSheet>(null)

  // TODO is there an easier way to copy/forward these methods?
  useImperativeHandle(ref, () => ({
    snapTo(index: number): void {
      sheet.current?.snapTo(index)
    },
    expand() {
      sheet.current?.expand()
    },
    collapse() {
      sheet.current?.collapse()
    },
    close() {
      sheet.current?.close()
    },
  }))

  const getData = useMemo(() => {
    let data: (AnyTransaction | PendingTransaction)[] = txns
    if (filter === 'pending') {
      data = pendingTxns
    }

    if (filter === 'all') {
      data = [...pendingTxns, ...txns]
    }

    return data
  }, [filter, pendingTxns, txns])

  return (
    <BottomSheet
      handleComponent={null}
      snapPoints={snapPoints}
      index={1}
      animateOnMount={false}
      ref={sheet}
      onChange={onChange}
      animatedIndex={animatedIndex}
    >
      <>
        <ActivityCardHeader filter={filter} />
        {showSkeleton ? (
          <ActivityListSkeletonView />
        ) : (
          <ActivityCardListView data={getData} hasNoResults={hasNoResults} />
        )}
      </>
    </BottomSheet>
  )
})

export default memo(ActivityCard, (prev, next) => {
  return (
    prev.filter === next.filter &&
    prev.onChange === next.onChange &&
    prev.txns === next.txns &&
    prev.pendingTxns === next.pendingTxns &&
    prev.hasNoResults === next.hasNoResults &&
    prev.showSkeleton === next.showSkeleton
  )
})
