import toast, { Renderable, Toast, ValueOrFunction } from "react-hot-toast";

type Message = ValueOrFunction<Renderable, Toast>;

export const successAlert = (message: string | undefined | Message | any) => {
  if(typeof message !== "string"){
    toast.success(message.toString(), {
      position: 'bottom-right',
      style: {
        paddingRight: '40px',
        height: '100%'
      },
    })
  }
   else{
    toast.success(message, {
      position: 'bottom-right',
      style: {
        height: '100%'
      },
      
    }
    )
   } 
  }

  export const errorAlert = (errorMessage: Message | Error | string | any) => {
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
