import React from 'react'
import DiscordIcon from 'components/Icons/DiscordIcon';
import penguinContact from '../../../assets/img/penguin_contact.jpg'
import Button from '../Button/Button'
import style from './ContactCard.module.scss';

export default function ContactCard() {
  return (
    <div className={style.contact}>
        <img src={penguinContact} alt="Penguin asking question" />
        <p>If you have any questions, you can reach us at</p>
        <Button className="button" type='normal'>contact@apcolony.com</Button>
        <p className={style.or}>OR</p>
        <Button className="button" type='normal'>Discord</Button>
    </div>
  )
}
