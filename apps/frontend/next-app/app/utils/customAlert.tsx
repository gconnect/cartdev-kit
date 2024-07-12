import toast, { Renderable, Toast, ValueOrFunction } from "react-hot-toast";

type Message = ValueOrFunction<Renderable, Toast>;

export const successAlert = (message: string | undefined | Message | any) => {
    toast.success(message, {
      position: 'bottom-right',
      style: {
        height: '100%'
      },
      
    }
    )
  }

  export const errorAlert = (errorMessage: Message | string | any) => {
    if(typeof errorMessage === "string"){
      toast.error(errorMessage, {
        position: 'bottom-right',
        style: {
          paddingRight: '40px',
          height: '100%'
        },
      })
    }else {
      toast.error(errorMessage.message, {
        position: 'bottom-right',
        style: {
          paddingRight: '40px',
          height: '100%'
        },
      })
    }
  }
