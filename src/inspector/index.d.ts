import * as React from "react"
import "react-streamdeck"

declare module "react-streamdeck" {
  declare type ButtonProps = {
    text: string
    onClick: (event: React.MouseEvent<HTMLElement>) => void
  }
  export function SDButton(props: ButtonProps): JSX.Element

  declare type TextInputProps = {
    value: string
    label: string
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  }
  export function SDTextInput(props: TextInputProps): JSX.Element
}
