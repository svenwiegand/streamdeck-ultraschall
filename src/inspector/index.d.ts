import * as React from "react"
import "react-streamdeck"

declare module "react-streamdeck" {
  export type TextInputProps = {
    /**
     * The initial text value
     */
    value: string;
    /**
     * The label. This sits on the outside left margin within the Property Inspector.
     */
    label: string;
    /**
     * The change event. It passes the event directly.
     */
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
  export function SDTextInput(props: TextInputProps): JSX.Element;
}
