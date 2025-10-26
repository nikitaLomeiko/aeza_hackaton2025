import React, { useState, useEffect } from 'react'

export const LoadingScreen: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [isVisible, setIsVisible] = useState(true)
  const [opacity, setOpacity] = useState(1)

  const fullText = 'Docker'
  const typingSpeed = 150
  const cursorBlinkSpeed = 500
  const fadeDuration = 2000

  useEffect(() => {
    // Эффект печатания текста
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typingInterval)

        // После завершения печати начинаем исчезновение
        setTimeout(() => {
          setOpacity(0)
          setTimeout(() => {
            setIsVisible(false)
          }, fadeDuration)
        }, 1000)
      }
    }, typingSpeed)

    // Эффект мигающего курсора
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, cursorBlinkSpeed)

    return () => {
      clearInterval(typingInterval)
      clearInterval(cursorInterval)
    }
  }, [])

  if (!isVisible) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      {/* Основной контент (пока скрыт) */}
      <div
        className={`transition-opacity duration-1000 ${
          opacity === 1 ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {children}
      </div>

      {/* Экран загрузки */}
      <div
        className="fixed inset-0 bg-black z-50 flex items-center justify-center transition-opacity duration-2000"
        style={{ opacity }}
      >
        <div className="text-center">
          <div className="relative">
            <h1 className="text-7xl md:text-9xl font-bold text-white font-mono tracking-tighter">
              {displayText}
              <span
                className={`ml-1 ${
                  showCursor ? 'opacity-100' : 'opacity-0'
                } transition-opacity duration-200`}
              >
                _
              </span>
            </h1>
          </div>

          {/* Субтитры появляются после полного написания слова */}
          {displayText === fullText && (
            <div className="mt-8 opacity-0 animate-fade-in-up delay-1000">
              <p className="text-xl text-gray-300 font-light tracking-wide">
                Compose Constructor
              </p>
            </div>
          )}

          {/* Прогресс бар */}
          <div className="mt-12 w-64 mx-auto">
            <div
              className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-3000 ease-out"
              style={{
                width:
                  displayText === fullText
                    ? '100%'
                    : `${(displayText.length / fullText.length) * 100}%`,
                opacity: displayText === fullText ? 1 : 0.7,
              }}
            />
          </div>
        </div>

        {/* Декоративные элементы */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Анимированные частицы */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-ping" />
          <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-purple-400 rounded-full opacity-40 animate-pulse" />
          <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-50 animate-bounce" />

          {/* Градиентные круги */}
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-500 rounded-full mix-blend-screen opacity-10 blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-purple-500 rounded-full mix-blend-screen opacity-10 blur-3xl animate-pulse delay-1000" />
        </div>
      </div>
    </div>
  )
}
