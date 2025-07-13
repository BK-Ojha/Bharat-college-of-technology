import { createContext, useContext, useEffect, useState } from 'react'

const NotificationContext = createContext()
export const NotificationProvider = ({ children }) => {
  const [count, setCount] = useState(() => {
    const initial = parseInt(
      localStorage.getItem('newstudentRegistered') || '0',
    )
    return isNaN(initial) ? 0 : initial
  })
  const updateCount = (newCount) => {
    setCount(newCount)
    localStorage.setItem('newstudentRegistered', newCount)
  }

  useEffect(() => {
    const handleCountUpdate = (e) => {
      const newCount = e.detail?.count
      if (typeof newCount === 'number') {
        console.log('[NotificationProvider] Event count:', newCount)
        setCount(newCount)
      }
    }
    const syncCountFromLocal = () => {
      const storedCount = parseInt(
        localStorage.getItem('newstudentRegistered') || '0',
      )
      if (!isNaN(storedCount)) {
        console.log(
          '[NotificationProvider] Syncing from localStorage:',
          storedCount,
        )
        setCount(storedCount)
      }
    }

    window.addEventListener('notificationCountUpdate', handleCountUpdate)
    window.addEventListener('storage', syncCountFromLocal)

    syncCountFromLocal()
    return () => {
      window.removeEventListener('notificationCountUpdate', handleCountUpdate)
      window.removeEventListener('storage', syncCountFromLocal)
    }
  }, [])
  return (
    <NotificationContext.Provider value={{ count, updateCount }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)
