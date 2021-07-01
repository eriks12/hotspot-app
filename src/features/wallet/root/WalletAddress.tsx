/* eslint-disable react/jsx-props-no-spreading */
import React, { memo } from 'react'
import QRCode from 'react-qr-code'
import { useAsync } from 'react-async-hook'
import { BoxProps } from '@shopify/restyle'
import Box from '../../../components/Box'
import { getSecureItem } from '../../../utils/secureAccount'
import Address from '../../../components/Address'
import ShareButton from './BalanceCard/ShareButton'
import { Theme } from '../../../theme/theme'
import { useSpacing } from '../../../theme/themeHooks'

type Props = BoxProps<Theme>

const QR_CONTAINER_SIZE = 146

const WalletAddress = ({ ...boxProps }: Props) => {
  const { result: address, loading } = useAsync(getSecureItem, ['address'])
  const spacing = useSpacing()

  return (
    <Box alignItems="center" {...boxProps}>
      <Box
        height={QR_CONTAINER_SIZE}
        width={QR_CONTAINER_SIZE}
        backgroundColor="white"
        padding="s"
        borderRadius="m"
      >
        {!loading && (
          <QRCode
            size={QR_CONTAINER_SIZE - 2 * spacing.s}
            value={address || ''}
          />
        )}
      </Box>
      <Box height={46} flexDirection="row" alignItems="center">
        <Address
          address={address || ''}
          maxWidth={200}
          color="white"
          variant="body1Mono"
          padding="s"
          clickToCopy
        />
        <ShareButton address={address || ''} />
      </Box>
    </Box>
  )
}

export default memo(WalletAddress)
