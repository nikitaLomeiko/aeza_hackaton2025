import { useUnit } from 'effector-react'
import {
  $userCursors,
  $isCursorsConnected,
  updateLocalCursor,
} from 'store/websockets/cursors.store'

export const useCursors = () => {
  const userCursors = useUnit($userCursors)
  const isConnected = useUnit($isCursorsConnected)
  const updateLocalCursorFn = useUnit(updateLocalCursor)

  return {
    userCursors,
    isConnected,
    updateLocalCursor: updateLocalCursorFn,
  }
}
