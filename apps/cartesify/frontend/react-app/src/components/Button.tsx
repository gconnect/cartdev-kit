import { useState } from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {

}

export function Button(props: ButtonProps) {
    const [disabled, setDisabled] = useState(false)
    async function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        try {
            setDisabled(true)
            if (props.onClick) {
                await props.onClick(e)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setDisabled(false)
        }
    }

    return <button {...props} onClick={(e) => onClick(e)} disabled={disabled}>{props.children}</button>
}