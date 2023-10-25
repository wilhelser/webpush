import React, { useCallback, useState } from "react"
import va from "@vercel/analytics"

import useDeviceInfo from "@/hooks/useDeviceInfo"
import magicBell from "@/services/magicBell"
import subscriptionManager from "@/services/subscriptionManager"

export type Topic = {
  id: string
  name: string
}

export default function TopicSubscriber(
  props: Topic & { idle: boolean; onAfterInteract?: () => void }
) {
  const info = useDeviceInfo()
  const [subscribing, setSubscribing] = useState(false)
  const [unsubscribing, setUnsubscribing] = useState(false)
  const isSubscribed = info?.topics.includes(props.id)

  const handleUnsubscribe = useCallback(async () => {
    setUnsubscribing(true)
    await magicBell.unsubscribeFromTopic(props.id)
    setUnsubscribing(false)
    subscriptionManager.triggerListeners()
    va.track("unsubscribe", {
      topic: props.id,
    })
  }, [props])

  const handleSubscribe = useCallback(async () => {
    setSubscribing(true)
    await magicBell.subscribeToTopic(props.id, true)
    setSubscribing(false)
    subscriptionManager.triggerListeners()
    if (props.onAfterInteract) props.onAfterInteract()
    va.track("subscribe", {
      topic: props.id,
    })
  }, [props])

  return (
    <section></section>
  )
}
