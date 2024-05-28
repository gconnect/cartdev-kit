import toast, { Renderable, Toast, ValueOrFunction } from "react-hot-toast";

type Message = ValueOrFunction<Renderable, Toast>;

export const successAlert = (message: string | undefined | Message | any) => {
    toast.success(message, {
      position: 'bottom-right',
      style: {
        height: '100%'
      }}
    )
  }

export const errorAlert = (errorMessage: Message | any) => {
    toast.error(errorMessage, {
      position: 'bottom-right',
      style: {
        paddingRight: '40px',
        height: '100%'
      },
    })
}
