import React from 'react';
import Button from 'components/Abstract/Button/Button';
import ContactCard from 'components/Abstract/ContactCard/ContactCard';
import LpAdvantage from 'components/Abstract/LpAdvantage/LpAdvantage';
import addButton from '../../assets/img/add_button.png';
import penguinComputerImg from '../../assets/img/penguin_computer.png';
import penguinTableauImg from '../../assets/img/penguin_tableau.png';
import penguinWorkerImg from '../../assets/img/penguin_worker.png';
import timeImg from '../../assets/img/time.png';
import style from './index.module.scss';

export default function Launchpad() {
  const typeFormUrl = 'https://r34a1s60ok0.typeform.com/to/xFMCyprO';

  return (
    <div id={style.launchpad}>
      <section className={style['top-page']}>
        <img src="/img/logo/logo-white.png" alt="" className="logo" />
        <div className={style.info}>
          <h1>Participating in the construction <br /> of Elrond is our duty.</h1>
          <Button onClick={() => window.open(typeFormUrl, '_blank')} className={style.button} type='primary'>Submit project</Button>
        </div>
        <p>{/* Bottom of the flex */}</p>
      </section>

      <section className={style['focuses']}>
        <p>OUR LAUNCHPAD PRIMARILY <br /> FOCUSES ON</p>
        <div className={style.info}>
          <div>Play-To-Earns and universes that add real value to the Elrond ecosystem.</div>
          <div>We’ll support serious and ambitious projects in their developmenton the blockchain.</div>
        </div>
      </section>

      <section className={style['advantages']}>
        <p>What you get by entering <br /> the launchpad ?</p>
        <div className={style.info}>
          <LpAdvantage 
            mainText='Time saving to focus on the development of their games/universe, less on the technical implementation (SC, dapps…)'
            subText='Our personalized services will allow you to be assisted during crucial stages of your project.'
            img={timeImg}
            imgStyle={{transformOrigin: 'center 15px', marginTop: '30px', width:'80px', transform: 'scale(3)'}}
           ></LpAdvantage>
          <LpAdvantage 
            mainText='Strategy Consulting'
            subText='Providing of our experience in project management :'
            img={penguinTableauImg}
            imgStyle={{transformOrigin: 'center -10px', width:'80px', transform: 'scale(3)'}}
           >
            <div>
              <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px',
                  margin: '12px 0',
              }}>
                <Button type='primary'>Communication strategy</Button>
                <Button type='primary'>Flexible financial management</Button>
                <Button type='primary'>Partnership strategy</Button>
                <Button type='primary'>And more...</Button>
              </div>
              <p style={{textAlign:'left'}}><img src={addButton} alt="Add button" style={{width:'20px'}} /> access to our network</p>
            </div>
           </LpAdvantage>
          <LpAdvantage 
            mainText='Personalized & preferential place in our marketplace'
            subText='This integration will allow you to fully integrate your universe in an ecosystem of ambitious projects on Elrond.'
            img={penguinComputerImg}
            imgStyle={{transformOrigin: 'center 15px', marginTop: '30px', width:'129px', transform: 'scale(3)'}}
           ></LpAdvantage>
          <LpAdvantage 
            mainText='Technical help for your development needs on the blockchain'
            subText='Sharing of our technical experience on Elrond and our ability to innovate in a young ecosystem. Providing of our tools (Airdrops, snapshots...).'
            img={penguinWorkerImg}
            imgStyle={{transformOrigin: 'center 10px', marginTop: '30px', width:'75px', transform: 'scale(3)'}}
           ></LpAdvantage>
        </div>
      </section>

      <section className={style['submit']}>
        <p>Submit your project now !!</p>
        <Button onClick={() => window.open(typeFormUrl, '_blank')} className={style.button} type='primary-outline'>Submit project</Button>
      </section>

      <section className={style['contact']}>
        <ContactCard />
      </section>

  </div>
  );
}
