import SellTransactionFilter from './filters'

test('should returns true', () => {
    const tx = {
        data: 'ESDTNFTTransfer@414245414b2d643166373263@01@01@000000000000000005004a5d9e7caaa3d601d59c4bea2337019348751181654c@61756374696f6e546f6b656e@0de0b6b3a7640000@0de0b6b3a7640000@b2d05e00@45474c44@@01'
    }

    expect(new SellTransactionFilter().contains(tx.data)).toBeTruthy()
})

test('should returns false', () => {
    const tx = {
        data: 'withdraw@0a'
    }

    expect(new SellTransactionFilter().contains(tx.data)).toBeFalsy()
})