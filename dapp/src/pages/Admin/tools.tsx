export interface ITool {
    name: string;
    route: string;
    component: JSX.Element;
}
const CreateNewSale = () => {
    return <>
        On va sûrement utiliser un autre outil au lieu que je fasse tout à la mano
    </>
}

export const tools: ITool[] = [
    {
        name: 'Create new sale',
        route: 'tx-new-sale',
        component: <CreateNewSale />
    }
]
