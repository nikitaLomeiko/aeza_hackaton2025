export const Container: React.FC<{children: React.ReactNode}> = ({children}) => {
    return(
        <div className="w-full max-w-container-max-width my-0 mx-auto p-container-padding">
            {children}
        </div>
    )
}