import { useState, useCallback, ChangeEvent, useRef, useEffect } from 'react'
import { RootStore } from 'store'
import { useSelector } from 'react-redux'
import queryString from 'query-string'

export function useStore<T>(store: keyof RootStore) {
  return useSelector<RootStore>((state) => state[store]) as T
}

export function useObject<T>(
  initialObject: T
): [
  T,
  (obj: Partial<T>, callback?: (state: T) => void) => void,
  (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
] {
  const [state, setState] = useState<T>(initialObject)
  const callbackRef = useRef<(state: T) => void>()
  const isFirstCallbackCall = useRef<boolean>(true)
  const onChange = useCallback(
    (obj: Partial<T>, callback?: (state: T) => void) => {
      callbackRef.current = callback
      setState((prevState) => ({ ...prevState, ...obj }))
    },
    [state]
  )
  const onEventChange = useCallback(
    ({
      target: { name, value }
    }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void =>
      setState((prevState) => ({ ...prevState, [name]: value })),
    [state]
  )
  useEffect(() => {
    if (isFirstCallbackCall.current) {
      isFirstCallbackCall.current = false
      return
    }
    callbackRef.current?.(state)
  }, [state])
  return [state, onChange, onEventChange]
}

export function useQuery<T = {}>(): Partial<T> {
  const query = (queryString.parse(
    window.location.search
  ) as unknown) as Partial<T>
  return query
}
