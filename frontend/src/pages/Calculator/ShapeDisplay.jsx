import styles from './Calculator.module.scss'

export default function ShapeDisplay({ shape }) {
    switch (shape) {
        case 'rectangle':
            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        alignItems: 'center',
                    }}
                >
                    <svg width={200} height={200}>
                        <rect
                            width={200}
                            height={200}
                            style={{
                                fill: 'green',
                                fillOpacity: 1,
                            }}
                        />
                    </svg>
                    <div style={{ fontSize: '1.2rem' }}>
                        <strong>Rectangle</strong>
                    </div>
                </div>
            )

        case 'rectangleBorder':
            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        alignItems: 'center',
                    }}
                >
                    <svg
                        width={200}
                        height={200}
                        style={{ marginRight: '0.4em' }}
                    >
                        <rect
                            width={200}
                            height={200}
                            style={{ fill: 'green' }}
                        />
                        <rect
                            width={120}
                            height={120}
                            x={40}
                            y={40}
                            style={{
                                fill: '#F3F3F3',
                                fillOpacity: 1,
                            }}
                        />
                    </svg>
                    <div style={{ fontSize: '1.2rem' }}>
                        <strong>Rectangle Border</strong>
                    </div>
                </div>
            )

        case 'circle':
            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        alignItems: 'center',
                    }}
                >
                    <svg
                        width={200}
                        height={200}
                        style={{ marginRight: '0.4em' }}
                    >
                        <ellipse
                            cx={100}
                            cy={100}
                            rx={100}
                            ry={100}
                            style={{
                                fill: 'green',
                                fillOpacity: 1,
                            }}
                        />
                    </svg>
                    <div style={{ fontSize: '1.2rem' }}>
                        <strong>Circle</strong>
                    </div>
                </div>
            )

        case 'circleBorder':
            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        alignItems: 'center',
                    }}
                >
                    <svg
                        width={200}
                        height={200}
                        style={{ marginRight: '0.4em' }}
                    >
                        <ellipse
                            cx={100}
                            cy={100}
                            rx={100}
                            ry={100}
                            style={{
                                fill: 'green',
                                fillOpacity: 1,
                            }}
                        />

                        <ellipse
                            cx={100}
                            cy={100}
                            rx={50}
                            ry={50}
                            style={{
                                fill: '#F3F3F3',
                                fillOpacity: 1,
                            }}
                        />
                    </svg>
                    <div style={{ fontSize: '1.2rem' }}>
                        <strong>Circle Border</strong>
                    </div>
                </div>
            )

        case 'annulus':
            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        alignItems: 'center',
                    }}
                >
                    <svg
                        width={200}
                        height={200}
                        style={{ marginRight: '0.4em' }}
                    >
                        <ellipse
                            cx={100}
                            cy={100}
                            rx={100}
                            ry={100}
                            style={{
                                fill: 'green',
                                fillOpacity: 1,
                            }}
                        />

                        <ellipse
                            cx={100}
                            cy={100}
                            rx={50}
                            ry={50}
                            style={{
                                fill: '#F3F3F3',
                                fillOpacity: 1,
                            }}
                        />
                    </svg>
                    <div style={{ fontSize: '1.2rem' }}>
                        <strong>Annulus</strong>
                    </div>
                </div>
            )

        case 'triangle':
            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        alignItems: 'center',
                    }}
                >
                    <svg
                        width={200}
                        height={200}
                        style={{ marginRight: '0.4em' }}
                    >
                        <polygon
                            points="100,0 200,190 0,190"
                            style={{
                                fill: 'green',
                                strokeWidth: 1,
                            }}
                        />
                    </svg>
                    <div style={{ fontSize: '1.2rem' }}>
                        <strong>Triangle</strong>
                    </div>
                </div>
            )

        case 'trapezoid':
            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        alignItems: 'center',
                    }}
                >
                    <svg
                        width={200}
                        height={200}
                        style={{ marginRight: '0.4em' }}
                    >
                        <polygon
                            points="0,200 40,40 160,40 200,200"
                            style={{
                                fill: 'green',
                                strokeWidth: 1,
                            }}
                        />
                    </svg>
                    <div style={{ fontSize: '1.2rem' }}>
                        <strong>Trapezoid</strong>
                    </div>
                </div>
            )

        default:
            return <>Choose a shape above</>
    }
}
