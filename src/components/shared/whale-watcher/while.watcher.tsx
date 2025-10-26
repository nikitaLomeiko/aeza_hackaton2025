import React, { useState, useEffect } from 'react'

export const WhaleWatcher: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isWhaleVisible, setIsWhaleVisible] = useState(false)
  const [whalePosition, setWhalePosition] = useState<
    'bottom' | 'top' | 'left' | 'right'
  >('bottom')

  const showWhale = () => {
    const positions: Array<'bottom' | 'top' | 'left' | 'right'> = [
      'bottom',
      'top',
      'left',
      'right',
    ]
    const randomPosition =
      positions[Math.floor(Math.random() * positions.length)]

    setWhalePosition(randomPosition)
    setIsWhaleVisible(true)

    // Случайное время показа кита (2-4 секунды)
    const showDuration = 2000 + Math.random() * 2000
    setTimeout(() => {
      setIsWhaleVisible(false)
    }, showDuration)
  }

  useEffect(() => {
    const scheduleNextWhale = () => {
      // Случайный интервал между появлениями кита (15-45 секунд)
      const nextAppearance = 15000 + Math.random() * 30000
      setTimeout(() => {
        showWhale()
        scheduleNextWhale()
      }, nextAppearance)
    }

    // Первое появление через 10-20 секунд после загрузки
    const firstAppearance = 10000 + Math.random() * 10000
    const timer = setTimeout(() => {
      showWhale()
      scheduleNextWhale()
    }, firstAppearance)

    return () => clearTimeout(timer)
  }, [])

  const getWhaleStyle = () => {
    const baseStyle = {
      transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
    }

    switch (whalePosition) {
      case 'bottom':
        return {
          ...baseStyle,
          bottom: isWhaleVisible ? '20px' : '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
        }
      case 'top':
        return {
          ...baseStyle,
          top: isWhaleVisible ? '20px' : '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
        }
      case 'left':
        return {
          ...baseStyle,
          left: isWhaleVisible ? '20px' : '-100px',
          top: '50%',
          transform: 'translateY(-50%)',
        }
      case 'right':
        return {
          ...baseStyle,
          right: isWhaleVisible ? '20px' : '-100px',
          top: '50%',
          transform: 'translateY(-50%)',
        }
      default:
        return baseStyle
    }
  }

  const getWhaleRotation = () => {
    switch (whalePosition) {
      case 'bottom':
        return 'rotate-0'
      case 'top':
        return 'rotate-180'
      case 'left':
        return 'rotate-90'
      case 'right':
        return '-rotate-90'
      default:
        return 'rotate-0'
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {children}

      {/* Кит */}
      <div
        className={`fixed z-50 ${getWhaleRotation()} transition-transform duration-800`}
        style={getWhaleStyle()}
      >
        <div className="relative">
          {/* Вода/пузыри */}
          {isWhaleVisible && (
            <>
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-200 rounded-full opacity-70 animate-bubble">
                <div className="absolute inset-0 bg-blue-300 rounded-full animate-ping" />
              </div>
              <div className="absolute -top-4 -right-1 w-3 h-3 bg-blue-200 rounded-full opacity-60 animate-bubble delay-300">
                <div className="absolute inset-0 bg-blue-300 rounded-full animate-ping" />
              </div>
              <div className="absolute -bottom-1 left-2 w-2 h-2 bg-blue-200 rounded-full opacity-50 animate-bubble delay-500">
                <div className="absolute inset-0 bg-blue-300 rounded-full animate-ping" />
              </div>
            </>
          )}

          {/* Тело кита */}
          <div
            className={`relative transition-all duration-500 ${
              isWhaleVisible ? 'scale-100' : 'scale-90'
            }`}
          >
            <svg
              width="80"
              height="40"
              viewBox="0 0 80 40"
              fill="none"
              className="drop-shadow-lg filter"
            >
              {/* Основное тело */}
              <path
                d="M10 20C10 12 20 5 40 5C60 5 70 12 70 20C70 28 60 35 40 35C20 35 10 28 10 20Z"
                fill="#4F46E5"
                className="transition-all duration-300 hover:fill-#6366F1"
              />

              {/* Хвост */}
              <path d="M5 15C8 18 8 22 5 25L0 20L5 15Z" fill="#3730A3" />

              {/* Плавник */}
              <path d="M50 8C55 5 60 8 58 13L55 10L50 8Z" fill="#3730A3" />

              {/* Глаз */}
              <circle cx="60" cy="18" r="2" fill="white" />
              <circle cx="60" cy="18" r="1" fill="black" />

              {/* Улыбка */}
              <path
                d="M55 25Q58 27 60 26"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Водяные брызги */}
              {isWhaleVisible && (
                <>
                  <path
                    d="M75 12Q78 8 80 10"
                    stroke="#93C5FD"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="animate-splash"
                  />
                  <path
                    d="M72 8Q75 5 77 7"
                    stroke="#93C5FD"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="animate-splash delay-100"
                  />
                </>
              )}
            </svg>
          </div>
        </div>
      </div>

      {/* Эффект волн на краях экрана когда кит появляется */}
      {isWhaleVisible && (
        <>
          <div
            className={`fixed z-40 bg-blue-200 opacity-20 rounded-full ${
              whalePosition === 'bottom'
                ? 'animate-ripple-bottom'
                : whalePosition === 'top'
                ? 'animate-ripple-top'
                : whalePosition === 'left'
                ? 'animate-ripple-left'
                : 'animate-ripple-right'
            }`}
            style={{
              [whalePosition]: '-50px',
              width: '100px',
              height: '100px',
            }}
          />
          <div
            className={`fixed z-40 bg-blue-300 opacity-15 rounded-full ${
              whalePosition === 'bottom'
                ? 'animate-ripple-bottom delay-300'
                : whalePosition === 'top'
                ? 'animate-ripple-top delay-300'
                : whalePosition === 'left'
                ? 'animate-ripple-left delay-300'
                : 'animate-ripple-right delay-300'
            }`}
            style={{
              [whalePosition]: '-50px',
              width: '100px',
              height: '100px',
            }}
          />
        </>
      )}
    </div>
  )
}
