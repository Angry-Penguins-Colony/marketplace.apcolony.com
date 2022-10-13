import React from 'react'
import DiscordIcon from 'components/Icons/DiscordIcon';
import penguinContact from '../../../assets/img/penguin_contact.jpg'
import Button from '../Button/Button'
import style from './ContactCard.module.scss';

export default function ContactCard() {
  const mail = 'contact@apcolony.com'
  function sendEmail() 
  {
    window.open('mailto:'+mail)

  }
  return (
    <div className={style.contact}>
        <img src={penguinContact} alt="Penguin asking question" />
        <p>If you have any questions, you can reach us at</p>
        <Button onClick={()=> sendEmail()} className="button" type='normal'>{mail}</Button>
        <p className={style.or}>OR</p>
        <Button onClick={() => window.open('https://discord.gg/hfK6CvgF8M', '_blank')} className="button" type='normal'>Discord</Button>
    </div>
  )
}
