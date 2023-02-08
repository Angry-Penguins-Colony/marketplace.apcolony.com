export interface ITool {
    name: string;
    route: string;
    component: JSX.Element;
}
const CreateNewSale = () => {
    return <>Create new sale</>
}

export const tools: ITool[] = [
    {
        name: 'Create new sale',
        route: 'tx-new-sale',
        component: <CreateNewSale />
    }
]
