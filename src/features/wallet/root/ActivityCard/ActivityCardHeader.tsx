import React, { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../../../components/Box'
import { FilterKeys, FilterType } from '../walletTypes'
import { useAppDispatch } from '../../../../store/store'
import activitySlice from '../../../../store/activity/activitySlice'
import accountSlice from '../../../../store/account/accountSlice'
import HeliumSelect from '../../../../components/HeliumSelect'
import { HeliumSelectItemType } from '../../../../components/HeliumSelectItem'
import { useSpacing } from '../../../../theme/themeHooks'

type Props = { filter: FilterType }
const ActivityCardHeader = ({ filter }: Props) => {
  const { t } = useTranslation()
  const spacing = useSpacing()
  const filters = useMemo(
    () =>
      t('transactions.filter', { returnObjects: true }) as Record<
        string,
        string
      >,
    [t],
  )
  const dispatch = useAppDispatch()
  const data = useMemo(
    () =>
      FilterKeys.map((value) => ({
        label: filters[value],
        value,
        Icon: undefined,
        color: 'purpleMain',
      })) as HeliumSelectItemType[],
    [filters],
  )

  const onFilterChanged = useCallback(
    (_itemValue, itemIndex) => {
      const nextFilter = FilterKeys[itemIndex]
      if (nextFilter !== filter) {
        dispatch(accountSlice.actions.resetActivityChart())
        dispatch(activitySlice.actions.setFilter(nextFilter))
      }
    },
    [filter, dispatch],
  )

  const contentContainerStyle = useMemo(() => ({ paddingLeft: spacing.m }), [
    spacing.m,
  ])

  return (
    <Box paddingHorizontal="xs" height={72} paddingVertical="lm">
      <HeliumSelect
        contentContainerStyle={contentContainerStyle}
        showGradient={false}
        data={data}
        selectedValue={filter}
        onValueChanged={onFilterChanged}
      />
    </Box>
  )
}

export default memo(ActivityCardHeader)
