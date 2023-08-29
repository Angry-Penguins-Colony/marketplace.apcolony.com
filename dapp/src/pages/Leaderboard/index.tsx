import React from 'react'
import { faCopy, faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'
import wallets from '../../leaderboard.json'
import styles from './styles.module.scss'

const Leaderboard = () => {
    const navigate = useNavigate();

    const copy = (address: string) => {
        navigator.clipboard.writeText(address);
    }

  return (
    <div className={styles['leaderboard-page']}>
        <div className={styles['content']}>
            <h2 className='mb-3'>Leaderboard</h2>
            <table>
                <tr>
                    <th></th>
                    <th>#</th>
                    <th>Address</th>
                    <th>Ice Power</th>
                </tr>
                {
                    wallets.map((item, index) => (
                        <tr key={index}>
                            <td></td>
                            <td>{index + 1}</td>
                            <td className='d-block d-lg-none'>
                                {
                                    item.address.slice(0,7) + '...' + item.address.slice(-7)
                                }
                                <FontAwesomeIcon
                                    icon={faCopy}
                                    className='ml-2'
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => copy(item.address)}
                                />
                                <FontAwesomeIcon
                                    icon={faLink}
                                    className='ml-2'
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/inventory/${item.address}`)}
                                />
                            </td>
                            <td className='d-none d-lg-block'>
                                {
                                    item.address
                                }
                                <FontAwesomeIcon
                                    icon={faCopy}
                                    className='ml-2'
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => copy(item.address)}
                                />
                                <FontAwesomeIcon
                                    icon={faLink}
                                    className='ml-2'
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/inventory/${item.address}`)}
                                />
                            </td>
                            <td>{item.ice_power}</td>
                        </tr>
                    ))
                }
            </table>
        </div>
    </div>
  )
}

export default Leaderboard