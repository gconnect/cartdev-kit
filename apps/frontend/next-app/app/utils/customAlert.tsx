import toast from "react-hot-toast";


export const successAlert = (message: string | undefined) => {
    toast.success(message, {
      position: 'bottom-right',
      style: {
        height: '100%'
      }}
    )
  }

export const errorAlert = (errorMessage: any) => {
    toast.error(errorMessage.message, {
      position: 'bottom-right',
      style: {
        paddingRight: '40px',
        height: '100%'
      },
    })
}
