/* eslint-disable react/jsx-props-no-spreading */
import { BoxProps } from '@shopify/restyle'
import React, { memo } from 'react'
import { LayoutChangeEvent } from 'react-native'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { Theme } from '../../../theme/theme'

type Props = BoxProps<Theme> & {
  onLayout: (event: LayoutChangeEvent) => void
}
const WalletHeaderCondensed = ({ ...boxProps }: Props) => {
  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      paddingHorizontal="l"
      backgroundColor="primaryBackground"
      zIndex={1}
      height={46}
      {...boxProps}
    >
      <Text
        variant="h1"
        color="white"
        fontSize={22}
        maxFontSizeMultiplier={1.2}
      >
        23,455 HNT
      </Text>
    </Box>
  )
}

export default memo(WalletHeaderCondensed)
