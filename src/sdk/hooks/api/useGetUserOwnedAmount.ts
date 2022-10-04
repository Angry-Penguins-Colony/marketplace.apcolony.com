
interface Output {
    penguins: Record<string, number>;
    items: Record<string, number>;
}

function useGetUserOwnedAmount(): Output | undefined {
    throw new Error('Not implemented');
}

export default useGetUserOwnedAmount;