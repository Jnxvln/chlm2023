import { ProgressSpinner } from 'primereact/progressspinner'

function Spinner() {
    return (
        <ProgressSpinner
            style={{ width: '50px', height: '50px' }}
            strokeWidth="8"
            fill="transparent"
            animationDuration=".5s"
        />
    )
}

export default Spinner
