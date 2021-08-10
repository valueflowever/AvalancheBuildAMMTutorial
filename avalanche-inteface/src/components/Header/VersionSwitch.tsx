import React from 'react'
import styled from 'styled-components'
import useToggledVersion, { Version } from '../../hooks/useToggledVersion'

const VersionLabel = styled.span<{ enabled: boolean }>`
  padding: 0.35rem 0.6rem;
  border-radius: 12px;
  background: ${({ theme, enabled }) => (enabled ? theme.primary1 : 'none')};
  color: ${({ theme, enabled }) => (enabled ? theme.white : theme.text1)};
  font-size: 1rem;
  font-weight: ${({ enabled }) => (enabled ? '500' : '400')};
  :hover {
    user-select: ${({ enabled }) => (enabled ? 'none' : 'initial')};
    background: ${({ theme, enabled }) => (enabled ? theme.primary1 : 'none')};
    color: ${({ theme, enabled }) => (enabled ? theme.white : theme.text1)};
  }
`

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const VersionToggle = styled.div<{ enabled: boolean }>`
  border-radius: 12px;
  opacity: ${({ enabled }) => (enabled ? 1 : 0.5)};
  cursor: ${({ enabled }) => (enabled ? 'pointer' : 'default')};
  background: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.primary1};
  display: flex;
  width: fit-content;
  margin-left: 0.5rem;
  text-decoration: none;
  :hover {
    text-decoration: none;
  }
`

export default function VersionSwitch() {
  const version = useToggledVersion()
  return (
    <VersionToggle enabled>
      <VersionLabel enabled={version === Version.v2}>V1</VersionLabel>
    </VersionToggle>
  )
}
