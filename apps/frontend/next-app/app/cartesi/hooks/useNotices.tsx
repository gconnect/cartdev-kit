"use client"
import { useQuery } from '@apollo/client'
import { ethers } from 'ethers'
import { useState } from 'react'
import { NoticesByInputDocument, NoticesDocument } from '../generated/graphql'
import { useNoticesQuery } from "../generated/graphql";

export type Notice = {
  id: string
  index: number
  input: any //{index: number; epoch: {index: number; }
  payload: string
}

export const useNotices = () => {
  const [cursor] = useState(null)
  const { loading, error, data, refetch } = useQuery(NoticesDocument, {
    variables: { cursor },
    pollInterval: 0,
  })

  const notices: Notice[] = data?.notices.edges
    .map((node: any) => {
      const n = node.node
      let inputPayload = n?.input.payload
      if (inputPayload) {
        try {
          inputPayload = ethers.toUtf8String(inputPayload)
        } catch (e) {
          inputPayload = inputPayload + ' (hex)'
        }
      } else {
        inputPayload = '(empty)'
      }
      let payload = n?.payload
      if (payload) {
        try {
          payload = ethers.toUtf8String(payload)
        } catch (e) {
          payload = payload + ' (hex)'
        }
      } else {
        payload = '(empty)'
      }
      return {
        id: `${n?.id}`,
        index: parseInt(n?.index),
        payload: `${payload}`,
        input: n ? { index: n.input.index, payload: inputPayload } : {},
      }
    })
    .sort((b: any, a: any) => {
      if (a.input.index === b.input.index) {
        return b.index - a.index
      } else {
        return b.input.index - a.input.index
      }
    })

  return { loading, error, data, notices, refetch }
}
