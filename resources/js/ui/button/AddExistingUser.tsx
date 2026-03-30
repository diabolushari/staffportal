import { router } from '@inertiajs/react'
import ButtonBorderIcon from './ButtonBorderIcon'

interface Props {
  link?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => unknown
  buttonText?: string
}

export default function AddExistingUser({ link, onClick, buttonText }: Props) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (link != null) {
      router.get(link)
      return
    }
    if (onClick != null) {
      onClick(event)
    }
  }

  return (
    <ButtonBorderIcon onClick={handleClick}>
      <div className='body-1stop flex flex-col items-center'>
        <div>
          <i className='las la-address-book'></i>
        </div>
        {buttonText}
      </div>
    </ButtonBorderIcon>
  )
}
